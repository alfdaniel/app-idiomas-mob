import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native'
import { Alien, Ship } from '../art/Art'
import { shuffle } from '../lib/exercises'
import type { ShipLook } from '../lib/parts'
import type { Round } from '../lib/challenge'
import { Hud, say, useCountdown, useScore, type GameProps } from './common'

const EVIL: ShipLook = {
  hull: '#3c3c4a',
  hull2: '#1b1b3a',
  stripe: '#ff2bd6',
  dome: '#ff2bd6',
  wings: 'wide',
  antenna: 'star',
  flame: ['#6a2bd6', '#ff2bd6', '#ffe6ff'],
  lights: '#ff5a6e',
}
const MAX_HP = 10
const BURSTS = [
  { x: 0, y: 0, d: 0 },
  { x: -46, y: -18, d: 140 },
  { x: 44, y: 10, d: 260 },
  { x: -20, y: 30, d: 380 },
  { x: 30, y: -34, d: 500 },
  { x: 0, y: 6, d: 650 },
]

function remix(r: Round): Round {
  const right = r.options[r.correct]
  const options = shuffle(r.options)
  return { ...r, options, correct: options.indexOf(right) }
}

function Burst({ x, y, delay }: { x: number; y: number; delay: number }) {
  const p = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(p, { toValue: 1, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start()
  }, [])
  const scale = p.interpolate({ inputRange: [0, 1], outputRange: [0.2, 2.2] })
  const opacity = p.interpolate({ inputRange: [0, 0.15, 0.7, 1], outputRange: [0, 1, 0.9, 0] })
  return (
    <Animated.View pointerEvents="none" style={[s.burst, { transform: [{ translateX: x }, { translateY: y }, { scale }], opacity }]}>
      <Text style={{ fontSize: 46 }}>💥</Text>
    </Animated.View>
  )
}

export function BossGame({ data, speed, calm, onEnd }: GameProps<Round[]>) {
  const queue = useMemo(() => {
    const out: Round[] = []
    while (out.length < 40) out.push(...shuffle(data).map(remix))
    return out
  }, [data])
  const [idx, setIdx] = useState(0)
  const [hp, setHp] = useState(MAX_HP)
  const [picked, setPicked] = useState<number | null>(null)
  const [resolved, setResolved] = useState(false)
  const [dead, setDead] = useState(false)
  const shot = useRef(new Animated.Value(0)).current
  const enemyShot = useRef(new Animated.Value(0)).current
  const bossShake = useRef(new Animated.Value(0)).current
  const hover = useRef(new Animated.Value(0)).current
  const death = useRef(new Animated.Value(0)).current
  const flash = useRef(new Animated.Value(0)).current
  const { st, hit, miss, end, later } = useScore(calm, onEnd)
  const round = queue[idx]

  const ms = calm ? null : Math.max(speed === 'easy' ? 8000 : 5500, (speed === 'easy' ? 12000 : 9000) - idx * 250)
  const left = useCountdown(resolved || dead ? null : ms, idx, () => choose(null))

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(hover, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.timing(hover, { toValue: 0, duration: 1100, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [])

  useEffect(() => {
    if (round.speak && !dead) later(() => say(round.speak!), 300)
  }, [idx])

  function shake(power: number) {
    Animated.sequence([
      Animated.timing(bossShake, { toValue: power, duration: 45, useNativeDriver: true }),
      Animated.timing(bossShake, { toValue: -power, duration: 45, useNativeDriver: true }),
      Animated.timing(bossShake, { toValue: power / 2, duration: 45, useNativeDriver: true }),
      Animated.timing(bossShake, { toValue: 0, duration: 45, useNativeDriver: true }),
    ]).start()
  }

  function explode() {
    setDead(true)
    Animated.parallel([
      Animated.timing(death, { toValue: 1, duration: 1100, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(600),
        Animated.timing(flash, { toValue: 1, duration: 140, useNativeDriver: true }),
        Animated.timing(flash, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start()
    later(end, 2000)
  }

  function choose(i: number | null) {
    if (resolved || dead) return
    setResolved(true)
    setPicked(i)
    const good = i !== null && i === round.correct
    const fire = good ? shot : enemyShot
    fire.setValue(0)
    Animated.timing(fire, { toValue: 1, duration: 260, useNativeDriver: true }).start(() => fire.setValue(0))
    if (good) {
      hit()
      const next = hp - 1
      setHp(next)
      shake(1 + (MAX_HP - next) / 4)
      if (next <= 0) return later(explode, 350)
    } else {
      miss()
      if (st.shields <= 0) return later(end, 1400)
    }
    later(
      () => {
        if (idx + 1 >= queue.length) return end()
        setPicked(null)
        setResolved(false)
        setIdx(idx + 1)
      },
      good ? 650 : 1400,
    )
  }

  const ratio = hp / MAX_HP
  const hpColor = ratio > 0.6 ? '#39ff88' : ratio > 0.3 ? '#ffd400' : '#ff5a6e'
  const bob = hover.interpolate({ inputRange: [0, 1], outputRange: [-6, 6] })
  const sx = bossShake.interpolate({ inputRange: [-4, 4], outputRange: [-18, 18] })
  const bossScale = death.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 1.15, 1.6] })
  const bossFade = death.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 1, 0] })
  const secs = ms ? Math.max(0, Math.ceil((left * ms) / 1000)) : null

  return (
    <View style={{ flex: 1 }}>
      <Hud shields={st.shields} label={dead ? '🏆 Vitória!' : '👾 Chefe da galáxia'} combo={st.combo} icon="❤️" />

      <View style={s.hpRow}>
        <View style={s.hpTrack}>
          <View style={[s.hpFill, { width: `${ratio * 100}%`, backgroundColor: hpColor }]} />
          {Array.from({ length: MAX_HP - 1 }, (_, i) => (
            <View key={i} style={[s.hpTick, { left: `${((i + 1) / MAX_HP) * 100}%` }]} />
          ))}
        </View>
        <Text style={[s.hpText, { color: hpColor }]}>{hp}/{MAX_HP}</Text>
      </View>

      <View style={s.arena}>
        <Animated.View style={{ alignItems: 'center', opacity: bossFade, transform: [{ translateY: bob }, { translateX: sx }, { scale: bossScale }] }}>
          <View style={{ transform: [{ rotate: '180deg' }] }}>
            <Ship size={140} look={EVIL} />
          </View>
          <View style={s.bossPilot}>
            <Alien size={46} mood={dead ? 'wow' : ratio < 0.4 ? 'sad' : 'cool'} color="#b58cff" />
          </View>
          {ratio <= 0.66 && !dead ? <Text style={[s.smoke, { left: 18 }]}>💨</Text> : null}
          {ratio <= 0.33 && !dead ? <Text style={[s.smoke, { right: 14, top: 4 }]}>🔥</Text> : null}
          {ratio <= 0.33 && !dead ? <Text style={[s.smoke, { right: 46, top: 34 }]}>💨</Text> : null}
        </Animated.View>

        {dead ? BURSTS.map((b, i) => <Burst key={i} x={b.x} y={b.y + 50} delay={b.d} />) : null}

        <Animated.View pointerEvents="none" style={[s.laser, s.laserUp, { opacity: shot, transform: [{ scaleY: shot }] }]} />
        <Animated.View pointerEvents="none" style={[s.laser, s.laserDown, { opacity: enemyShot, transform: [{ scaleY: enemyShot }] }]} />

        <View style={s.me}>
          <Ship size={64} />
        </View>
      </View>

      {dead ? (
        <View style={s.win}>
          <Text style={s.winTitle}>Chefe destruído!</Text>
          <Text style={s.winText}>{st.correct} acertos · combo {st.best}</Text>
        </View>
      ) : (
        <>
          <View style={s.question}>
            {round.picture ? <Text adjustsFontSizeToFit numberOfLines={1} style={s.picture}>{round.picture}</Text> : null}
            <Text style={s.qText}>{round.prompt}</Text>
            {secs !== null && !resolved ? <Text style={[s.secs, { color: secs <= 2 ? '#ff5a6e' : '#9fe3ff' }]}>⏱ {secs}s</Text> : null}
          </View>
          <View style={s.options}>
            {round.options.map((o, i) => {
              const right = resolved && i === round.correct
              const wrong = resolved && picked === i && i !== round.correct
              return (
                <Pressable
                  key={`${idx}-${i}`}
                  disabled={resolved}
                  onPress={() => choose(i)}
                  style={[s.opt, right && s.optOk, wrong && s.optBad, resolved && !right && !wrong && { opacity: 0.35 }]}
                >
                  <Text style={s.optText}>🔫 {o}</Text>
                </Pressable>
              )
            })}
          </View>
        </>
      )}

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#ffffff', opacity: flash }]} />
    </View>
  )
}

const s = StyleSheet.create({
  hpRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 18, marginTop: 12 },
  hpTrack: { flex: 1, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden', borderWidth: 2, borderColor: '#ff2bd6' },
  hpFill: { height: '100%', borderRadius: 7 },
  hpTick: { position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: 'rgba(14,11,46,0.7)' },
  hpText: { fontWeight: '800', fontSize: 15, minWidth: 44, textAlign: 'right' },
  arena: { height: 270, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  bossPilot: { position: 'absolute', top: 62 },
  smoke: { position: 'absolute', top: 10, fontSize: 26 },
  burst: { position: 'absolute', top: 40 },
  laser: { position: 'absolute', left: '50%', width: 8, marginLeft: -4, height: 150, borderRadius: 4 },
  laserUp: { top: 80, backgroundColor: '#39ff88', transformOrigin: 'center bottom' },
  laserDown: { top: 80, backgroundColor: '#ff5a6e', transformOrigin: 'center top' },
  me: { alignItems: 'center' },
  question: { marginHorizontal: 18, marginTop: 4, padding: 12, borderRadius: 18, backgroundColor: 'rgba(14,11,46,0.92)', borderWidth: 2, borderColor: '#3a3478', alignItems: 'center' },
  picture: { color: '#fff', fontSize: 34, fontWeight: '800' },
  qText: { color: '#fff', fontWeight: '800', fontSize: 17, textAlign: 'center' },
  secs: { fontWeight: '800', fontSize: 13, marginTop: 4 },
  options: { gap: 8, paddingHorizontal: 18, marginTop: 10 },
  opt: { backgroundColor: '#2b5be8', borderRadius: 16, borderWidth: 3, borderColor: '#111', paddingVertical: 12, paddingHorizontal: 14 },
  optOk: { backgroundColor: '#12803f' },
  optBad: { backgroundColor: '#b01c3a' },
  optText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  win: { alignItems: 'center', marginTop: 12 },
  winTitle: { color: '#ffd400', fontWeight: '800', fontSize: 28, textShadowColor: '#05031a', textShadowRadius: 8 },
  winText: { color: '#fff', fontWeight: '700', fontSize: 15, marginTop: 4 },
})
