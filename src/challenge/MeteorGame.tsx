import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native'
import { Planet } from '../art/Art'
import { shuffle } from '../lib/exercises'
import type { Pair } from '../lib/challenge'
import { Hud, TimeBar, useCountdown, useScore, type GameProps } from './common'

interface Rock {
  id: number
  pair: Pair
  x: number
  dur: number
  variant: number
  born: number
}

interface Boom {
  id: number
  x: number
  y: number
  ok: boolean
}

const START_Y = -90
const ROCK_W = 110
const rockY = (r: Rock, h: number, now: number) => START_Y + Math.min(1, (now - r.born) / r.dur) * (h - 40 - START_Y)

function Meteor({ rock, h, label, onLand }: { rock: Rock; h: number; label: string; onLand: (r: Rock) => void }) {
  const y = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const a = Animated.timing(y, { toValue: 1, duration: rock.dur, easing: Easing.linear, useNativeDriver: true })
    a.start(({ finished }) => finished && onLand(rock))
    return () => a.stop()
  }, [])
  const ty = y.interpolate({ inputRange: [0, 1], outputRange: [START_Y, h - 40] })
  return (
    <Animated.View pointerEvents="none" style={[s.rock, { left: rock.x, transform: [{ translateY: ty }] }]}>
      <View style={s.tail} />
      <Planet size={50} variant={rock.variant} />
      <View style={s.tag}>
        <Text style={s.tagText} numberOfLines={2}>{label}</Text>
      </View>
    </Animated.View>
  )
}

const SPARKS = [0, 1, 2, 3, 4, 5, 6, 7].map(i => (i / 8) * Math.PI * 2)

function Explosion({ boom, onDone }: { boom: Boom; onDone: (id: number) => void }) {
  const p = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(p, { toValue: 1, duration: 520, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(() => onDone(boom.id))
  }, [])
  const scale = p.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1.8] })
  const fade = p.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 0.9, 0] })
  const rise = p.interpolate({ inputRange: [0, 1], outputRange: [0, -46] })
  const color = boom.ok ? '#ffd400' : '#ff5a6e'
  return (
    <View pointerEvents="none" style={[s.boom, { left: boom.x - 40, top: boom.y - 40 }]}>
      <Animated.View style={[s.ring, { borderColor: color, opacity: fade, transform: [{ scale }] }]} />
      {SPARKS.map((a, i) => {
        const dx = p.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(a) * 58] })
        const dy = p.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(a) * 58] })
        return (
          <Animated.View
            key={i}
            style={[s.spark, { backgroundColor: i % 2 ? color : '#ff8a00', opacity: fade, transform: [{ translateX: dx }, { translateY: dy }] }]}
          />
        )
      })}
      <Animated.Text style={[s.boomEmoji, { opacity: fade, transform: [{ scale }] }]}>{boom.ok ? '💥' : '❌'}</Animated.Text>
      <Animated.Text style={[s.plus, { color, opacity: fade, transform: [{ translateY: rise }] }]}>{boom.ok ? '+1' : 'Ops!'}</Animated.Text>
    </View>
  )
}

export function MeteorGame({ data, speed, calm, onEnd }: GameProps<Pair[]>) {
  const [area, setArea] = useState({ w: 360, h: 600 })
  const [rocks, setRocks] = useState<Rock[]>([])
  const [target, setTarget] = useState<Pair>(() => shuffle(data)[0])
  const [flash, setFlash] = useState<null | 'ok' | 'bad'>(null)
  const [booms, setBooms] = useState<Boom[]>([])
  const { st, hit, miss, end, alive } = useScore(calm, onEnd)
  const targetRef = useRef(target)
  const rocksRef = useRef<Rock[]>([])
  const onTarget = useRef(0)
  const nextId = useRef(1)
  targetRef.current = target
  rocksRef.current = rocks

  const fallEn = useMemo(() => {
    const avg = (k: 'en' | 'pt') => data.reduce((n, p) => n + p[k].length, 0) / data.length
    return avg('en') <= avg('pt')
  }, [data])
  const fallText = (p: Pair) => (fallEn ? p.en : p.pt)
  const targetText = (p: Pair) => (fallEn ? p.pt : p.en)

  const gameMs = calm ? 70000 : speed === 'easy' ? 50000 : 40000
  const left = useCountdown(gameMs, 'meteor', end)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const spawn = () => {
      if (!alive.current || st.ended) return
      const t = targetRef.current
      const pair = Math.random() < 0.42 ? t : shuffle(data.filter(p => p !== t))[0] ?? t
      const rock: Rock = {
        id: nextId.current++,
        pair,
        x: 8 + Math.random() * Math.max(10, area.w - ROCK_W - 16),
        dur: Math.max(2400, (speed === 'easy' ? 5600 : 4400) - st.correct * 45),
        variant: Math.floor(Math.random() * 6),
        born: Date.now(),
      }
      setRocks(r => [...r.slice(-7), rock])
      timer = setTimeout(spawn, Math.max(520, (speed === 'easy' ? 1200 : 950) - st.correct * 18))
    }
    timer = setTimeout(spawn, 300)
    return () => clearTimeout(timer)
  }, [area.w])

  const blink = (k: 'ok' | 'bad') => {
    setFlash(k)
    setTimeout(() => alive.current && setFlash(null), 220)
  }

  function touch(tx: number, ty: number) {
    if (st.ended) return
    const now = Date.now()
    let best: Rock | null = null
    let bestDist = Infinity
    let bestY = 0
    for (const r of rocksRef.current) {
      const y = rockY(r, area.h, now)
      if (tx < r.x - 14 || tx > r.x + ROCK_W + 14 || ty < y - 22 || ty > y + 108) continue
      const d = Math.hypot(tx - (r.x + ROCK_W / 2), ty - (y + 40))
      if (d < bestDist) {
        bestDist = d
        best = r
        bestY = y
      }
    }
    if (best) onTap(best, best.x + ROCK_W / 2, bestY + 28)
  }

  function onTap(r: Rock, bx: number, by: number) {
    if (st.ended) return
    setRocks(list => list.filter(x => x.id !== r.id))
    const ok = r.pair === targetRef.current
    setBooms(b => [...b.slice(-5), { id: r.id, x: bx, y: by, ok }])
    if (ok) {
      hit()
      blink('ok')
      onTarget.current++
      if (onTarget.current >= 3 && data.length > 1) {
        onTarget.current = 0
        setTarget(shuffle(data.filter(p => p !== targetRef.current))[0])
      }
    } else {
      miss()
      blink('bad')
      if (st.shields <= 0) end()
    }
  }

  function onLand(r: Rock) {
    setRocks(list => list.filter(x => x.id !== r.id))
    if (!st.ended && r.pair === targetRef.current) miss(false)
  }

  const onLayout = (e: LayoutChangeEvent) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })

  return (
    <View style={{ flex: 1 }}>
      <Hud shields={st.shields} label={`⭐ ${st.correct}`} combo={st.combo} />
      <TimeBar value={left} />
      <View style={s.banner}>
        <Text style={s.bannerSmall}>Toque nos meteoros com:</Text>
        <Text style={s.bannerBig}>{target.emoji && !/^[A-Za-z]/.test(target.emoji) ? `${target.emoji}  ` : ''}{targetText(target)}</Text>
      </View>
      <View
        style={s.field}
        onLayout={onLayout}
        onStartShouldSetResponder={() => true}
        onResponderGrant={e => touch(e.nativeEvent.locationX, e.nativeEvent.locationY)}
      >
        {rocks.map(r => (
          <Meteor key={r.id} rock={r} h={area.h} label={fallText(r.pair)} onLand={onLand} />
        ))}
        {booms.map(b => (
          <Explosion key={b.id} boom={b} onDone={id => setBooms(list => list.filter(x => x.id !== id))} />
        ))}
        {flash ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderWidth: 6, borderColor: flash === 'ok' ? '#7ee081' : '#ff5a6e', borderRadius: 20 }]} /> : null}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  banner: { marginHorizontal: 18, marginTop: 12, padding: 12, borderRadius: 20, backgroundColor: 'rgba(14,11,46,0.92)', borderWidth: 2, borderColor: '#ffd400', alignItems: 'center' },
  bannerSmall: { color: '#ffd400', fontWeight: '800', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  bannerBig: { color: '#fff', fontWeight: '800', fontSize: 20, textAlign: 'center', marginTop: 2 },
  field: { flex: 1, overflow: 'hidden', marginTop: 6 },
  rock: { position: 'absolute', top: 0, width: 110, alignItems: 'center' },
  tail: { position: 'absolute', top: -26, width: 10, height: 34, borderRadius: 5, backgroundColor: 'rgba(255,138,0,0.55)' },
  tag: { marginTop: 2, backgroundColor: 'rgba(14,11,46,0.92)', borderRadius: 12, borderWidth: 2, borderColor: '#9fe3ff', paddingHorizontal: 8, paddingVertical: 3, maxWidth: 110 },
  tagText: { color: '#fff', fontWeight: '800', fontSize: 13, textAlign: 'center' },
  boom: { position: 'absolute', width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 5 },
  spark: { position: 'absolute', width: 8, height: 8, borderRadius: 4 },
  boomEmoji: { fontSize: 44 },
  plus: { position: 'absolute', top: -6, fontWeight: '800', fontSize: 22, textShadowColor: '#05031a', textShadowRadius: 6 },
})
