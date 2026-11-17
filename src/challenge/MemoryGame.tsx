import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { shuffle } from '../lib/exercises'
import type { Pair } from '../lib/challenge'
import { Hud, TimeBar, say, useCountdown, useScore, type GameProps } from './common'

interface Card {
  id: number
  pair: number
  side: 'en' | 'pt'
  text: string
}

function Tile({ card, up, done, onPress }: { card: Card; up: boolean; done: boolean; onPress: () => void }) {
  const flip = useRef(new Animated.Value(1)).current
  const [shown, setShown] = useState(up)
  useEffect(() => {
    if (shown === up) return
    Animated.timing(flip, { toValue: 0, duration: 110, useNativeDriver: true }).start(() => {
      setShown(up)
      Animated.timing(flip, { toValue: 1, duration: 110, useNativeDriver: true }).start()
    })
  }, [up])
  const en = card.side === 'en'
  return (
    <Animated.View style={[s.tileWrap, { transform: [{ scaleX: flip }] }]}>
      <Pressable
        onPress={onPress}
        disabled={up || done}
        style={[s.tile, shown ? (en ? s.faceEn : s.facePt) : s.back, done && s.done]}
      >
        {shown ? (
          <Text style={[s.text, !en && s.textPt]} numberOfLines={3} adjustsFontSizeToFit>{card.text}</Text>
        ) : (
          <Text style={s.star}>⭐</Text>
        )}
      </Pressable>
    </Animated.View>
  )
}

export function MemoryGame({ data, speed, calm, onEnd }: GameProps<Pair[]>) {
  const cards = useMemo(() => {
    const chosen = shuffle(data).slice(0, Math.min(6, data.length))
    return shuffle(
      chosen.flatMap((p, i) => [
        { id: i * 2, pair: i, side: 'en' as const, text: p.en },
        { id: i * 2 + 1, pair: i, side: 'pt' as const, text: p.pt },
      ]),
    )
  }, [data])
  const pairs = cards.length / 2
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [mistakes, setMistakes] = useState(0)
  const { st, hit, miss, end, later } = useScore(true, onEnd)
  const lock = useRef(false)

  const ms = calm ? null : speed === 'easy' ? 110000 : 85000
  const left = useCountdown(ms, 'memory', end)

  function tap(c: Card) {
    if (lock.current || open.includes(c.id)) return
    if (c.side === 'en') say(c.text)
    const next = [...open, c.id]
    setOpen(next)
    if (next.length < 2) return
    lock.current = true
    const [a, b] = next.map(id => cards.find(x => x.id === id)!)
    if (a.pair === b.pair && a.side !== b.side) {
      hit()
      later(() => {
        const m = [...matched, a.pair]
        setMatched(m)
        setOpen([])
        lock.current = false
        if (m.length >= pairs) end()
      }, 350)
    } else {
      miss(false)
      setMistakes(n => n + 1)
      later(() => {
        setOpen([])
        lock.current = false
      }, 850)
    }
  }

  const shields = Math.max(0, 3 - Math.floor(mistakes / 3))
  st.shields = calm ? 3 : shields
  useEffect(() => {
    if (!calm && shields <= 0) end()
  }, [shields])

  return (
    <View style={{ flex: 1 }}>
      <Hud shields={st.shields} label={`Pares ${matched.length}/${pairs}`} combo={st.combo} />
      {ms ? <TimeBar value={left} /> : null}
      <Text style={s.hint}>Ache o par: inglês 🔵 com português 🩷</Text>
      <View style={s.grid}>
        {cards.map(c => (
          <Tile key={c.id} card={c} up={open.includes(c.id) || matched.includes(c.pair)} done={matched.includes(c.pair)} onPress={() => tap(c)} />
        ))}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  hint: { color: '#c9b8ff', fontWeight: '700', fontSize: 13, textAlign: 'center', marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, padding: 14 },
  tileWrap: { width: '30%' },
  tile: { height: 92, borderRadius: 16, borderWidth: 3, alignItems: 'center', justifyContent: 'center', padding: 6 },
  back: { backgroundColor: '#3a2a8f', borderColor: '#6c4bff' },
  faceEn: { backgroundColor: '#0f3a63', borderColor: '#00c2ff' },
  facePt: { backgroundColor: '#5a1446', borderColor: '#ff6bb5' },
  done: { opacity: 0.45 },
  text: { color: '#fff', fontWeight: '800', fontSize: 15, textAlign: 'center' },
  textPt: { fontStyle: 'italic' },
  star: { fontSize: 28 },
})
