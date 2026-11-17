import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, LayoutChangeEvent, Pressable, StyleSheet, Text, Vibration, View } from 'react-native'
import * as Speech from 'expo-speech'
import { Planet, Stars } from '../art/Art'
import { FlyingShip } from '../art/FlyingShip'
import type { ChallengeResult, Round } from '../lib/challenge'

interface Props {
  rounds: Round[]
  speed: 'easy' | 'normal'
  calm: boolean
  onEnd: (r: ChallengeResult) => void
}

const SHIP = 66

export function FlyGame({ rounds, speed, calm, onEnd }: Props) {
  const [area, setArea] = useState({ w: 360, h: 640 })
  const [idx, setIdx] = useState(0)
  const [shields, setShields] = useState(3)
  const [combo, setCombo] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [resolved, setResolved] = useState(false)

  const fall = useRef(new Animated.Value(0)).current
  const shipX = useRef(new Animated.Value(0)).current
  const bg = useRef(new Animated.Value(0)).current
  const boost = useRef(new Animated.Value(1)).current
  const resolvedRef = useRef(false)
  const alive = useRef(true)
  const stats = useRef({ shields: 3, combo: 0, best: 0, correct: 0 })

  const round = rounds[idx]
  const laneX = (i: number) => (area.w * (i * 2 + 1)) / 6
  const endY = area.h - 215

  const base = calm ? 11000 : speed === 'easy' ? 8500 : 6500
  const min = calm ? 11000 : speed === 'easy' ? 5200 : 3800
  const duration = Math.max(min, base - idx * 350)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  useEffect(() => {
    shipX.setValue(laneX(1) - SHIP / 2)
  }, [area.w])

  useEffect(() => {
    const loop = Animated.loop(Animated.timing(bg, { toValue: 1, duration: 1600, easing: Easing.linear, useNativeDriver: true }))
    loop.start()
    return () => loop.stop()
  }, [])

  useEffect(() => {
    resolvedRef.current = false
    setPicked(null)
    setResolved(false)
    fall.setValue(0)
    if (round.speak) {
      Speech.stop()
      Speech.speak(round.speak, { language: 'en-US', rate: 0.9 })
    }
    const anim = Animated.timing(fall, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true })
    anim.start(({ finished }) => {
      if (finished) resolve(null)
    })
    return () => anim.stop()
  }, [idx])

  function resolve(lane: number | null) {
    if (resolvedRef.current || !alive.current) return
    resolvedRef.current = true
    fall.stopAnimation()
    const good = lane !== null && lane === round.correct
    const st = stats.current
    if (good) {
      st.correct++
      st.combo++
      st.best = Math.max(st.best, st.combo)
    } else {
      st.combo = 0
      st.shields--
      Vibration.vibrate(60)
    }
    setPicked(lane)
    setResolved(true)
    setCombo(st.combo)
    setShields(st.shields)
    setTimeout(() => {
      if (!alive.current) return
      if (st.shields <= 0 || idx + 1 >= rounds.length) {
        onEnd({ correct: st.correct, total: idx + 1, bestCombo: st.best, shields: st.shields, calm })
      } else {
        setIdx(idx + 1)
      }
    }, good ? 650 : 1200)
  }

  function choose(lane: number) {
    if (resolvedRef.current) return
    Animated.spring(shipX, { toValue: laneX(lane) - SHIP / 2, friction: 6, useNativeDriver: true }).start()
    resolve(lane)
  }

  const bgA = bg.interpolate({ inputRange: [0, 1], outputRange: [0, area.h] })
  const bgB = bg.interpolate({ inputRange: [0, 1], outputRange: [-area.h, 0] })
  const planetY = fall.interpolate({ inputRange: [0, 1], outputRange: [-150, endY] })
  const timer = fall.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
  const stars = useMemo(() => <Stars width={area.w} height={area.h} count={34} />, [area.w, area.h])

  const onLayout = (e: LayoutChangeEvent) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })
  const ok = resolved && picked === round.correct

  return (
    <View style={s.root} onLayout={onLayout}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { transform: [{ translateY: bgA }] }]}>{stars}</Animated.View>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { transform: [{ translateY: bgB }] }]}>{stars}</Animated.View>

      <View style={s.hud}>
        <Text style={s.shields}>{'🛡️'.repeat(Math.max(0, shields))}<Text style={{ opacity: 0.25 }}>{'🛡️'.repeat(3 - Math.max(0, shields))}</Text></Text>
        <Text style={s.count}>{idx + 1}/{rounds.length}</Text>
        <Text style={s.combo}>{combo >= 2 ? `🔥 x${combo}` : ' '}</Text>
      </View>

      <View style={s.timerTrack}>
        <Animated.View style={[s.timerFill, { transform: [{ scaleX: timer }], transformOrigin: 'left center' }]} />
      </View>

      <View style={s.prompt}>
        {round.picture ? (
          <Text adjustsFontSizeToFit numberOfLines={1} style={s.promptPicture}>{round.picture}</Text>
        ) : null}
        <Text style={s.promptText}>{round.prompt}</Text>
      </View>

      {round.options.map((label, i) => {
        const right = resolved && i === round.correct
        const wrong = resolved && picked === i && i !== round.correct
        return (
          <Animated.View
            key={`${idx}-${i}`}
            pointerEvents="none"
            style={[
              s.planet,
              { left: laneX(i) - area.w / 6 + 4, width: area.w / 3 - 8, transform: [{ translateY: planetY }] },
              resolved && !right && !wrong && { opacity: 0.3 },
            ]}
          >
            <Planet size={72} variant={idx + i} state={right ? 'done' : 'active'} />
            <View style={[s.label, right && s.labelOk, wrong && s.labelBad]}>
              <Text style={s.labelText} numberOfLines={3}>{label}</Text>
            </View>
          </Animated.View>
        )
      })}

      <View style={s.lanes}>
        {[0, 1, 2].map(i => (
          <Pressable key={i} style={s.lane} onPress={() => choose(i)} accessibilityLabel={`Faixa ${i + 1}`} />
        ))}
      </View>

      <Animated.View pointerEvents="none" style={[s.ship, { transform: [{ translateX: shipX }] }]}>
        <FlyingShip size={SHIP} boost={boost} />
      </Animated.View>

      {resolved && (
        <View pointerEvents="none" style={s.toast}>
          <Text style={[s.toastText, { color: ok ? '#7ee081' : '#ff8fa3' }]}>
            {ok ? 'Boa!' : picked === null ? 'Tempo esgotado!' : 'Quase!'}
          </Text>
        </View>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  hud: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 12 },
  shields: { fontSize: 22 },
  count: { color: '#fff', fontWeight: '800', fontSize: 16 },
  combo: { color: '#ffd400', fontWeight: '800', fontSize: 18, minWidth: 70, textAlign: 'right' },
  timerTrack: { height: 6, marginHorizontal: 18, marginTop: 8, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.18)', overflow: 'hidden' },
  timerFill: { height: '100%', backgroundColor: '#9fe3ff', borderRadius: 3 },
  prompt: { alignItems: 'center', marginHorizontal: 18, marginTop: 14, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, backgroundColor: 'rgba(14,11,46,0.9)', borderWidth: 2, borderColor: '#3a3478' },
  promptPicture: { color: '#fff', fontSize: 40, fontWeight: '800', maxWidth: '100%' },
  promptText: { color: '#fff', fontSize: 19, fontWeight: '800', textAlign: 'center' },
  planet: { position: 'absolute', top: 0, alignItems: 'center' },
  label: { marginTop: 4, backgroundColor: 'rgba(14,11,46,0.92)', borderWidth: 2, borderColor: '#9fe3ff', borderRadius: 14, paddingVertical: 4, paddingHorizontal: 8, maxWidth: '100%' },
  labelOk: { backgroundColor: '#12603f', borderColor: '#7ee081' },
  labelBad: { backgroundColor: '#6b1e3a', borderColor: '#ff8fa3' },
  labelText: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
  lanes: { ...StyleSheet.absoluteFill, flexDirection: 'row' },
  lane: { flex: 1 },
  ship: { position: 'absolute', bottom: 22, left: 0 },
  toast: { position: 'absolute', left: 0, right: 0, bottom: 110, alignItems: 'center' },
  toastText: { fontSize: 26, fontWeight: '800', textShadowColor: '#05031a', textShadowRadius: 8 },
})
