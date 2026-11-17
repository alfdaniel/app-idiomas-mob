import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { shuffle } from '../lib/exercises'
import type { Pair } from '../lib/challenge'
import { Hud, TimeBar, say, useCountdown, useScore, type GameProps } from './common'

interface Letter {
  id: number
  ch: string
}

function scramble(word: string): Letter[] {
  const letters = word.split('').map((ch, id) => ({ id, ch }))
  for (let i = 0; i < 6; i++) {
    const s = shuffle(letters)
    if (s.map(l => l.ch).join('') !== word || word.length < 3) return s
  }
  return letters.reverse()
}

export function ScrambleGame({ data, speed, calm, onEnd, listen = false }: GameProps<Pair[]> & { listen?: boolean }) {
  const words = useMemo(() => shuffle(data).slice(0, 6), [data])
  const [idx, setIdx] = useState(0)
  const [placed, setPlaced] = useState<Letter[]>([])
  const [fails, setFails] = useState(0)
  const [reveal, setReveal] = useState(false)
  const [solved, setSolved] = useState(false)
  const shake = useRef(new Animated.Value(0)).current
  const { st, hit, miss, end, later } = useScore(calm, onEnd)

  const pair = words[idx]
  const word = pair.en.toLowerCase()
  const bank = useMemo(() => scramble(word), [idx])
  const ms = calm ? null : (speed === 'easy' ? 32000 : 24000) + word.length * 1000

  const next = () => {
    if (st.shields <= 0 || idx + 1 >= words.length) end()
    else {
      setIdx(idx + 1)
      setPlaced([])
      setFails(0)
      setReveal(false)
      setSolved(false)
    }
  }

  const timeout = () => {
    if (solved || reveal) return
    miss()
    setReveal(true)
    say(pair.en)
    later(next, 1600)
  }
  const left = useCountdown(ms, idx, timeout)

  useEffect(() => {
    if (listen) later(() => say(pair.en), 350)
  }, [idx])

  function add(l: Letter) {
    if (solved || reveal || placed.some(p => p.id === l.id)) return
    const next2 = [...placed, l]
    setPlaced(next2)
    if (next2.length < word.length) return
    if (next2.map(x => x.ch).join('') === word) {
      hit()
      setSolved(true)
      say(pair.en)
      later(next, 800)
    } else {
      miss()
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start()
      const f = fails + 1
      setFails(f)
      if (f >= 2 || st.shields <= 0) {
        setReveal(true)
        say(pair.en)
        later(next, 1600)
      } else later(() => setPlaced([]), 450)
    }
  }

  const remove = (l: Letter) => {
    if (solved || reveal) return
    setPlaced(p => p.filter(x => x.id !== l.id))
  }

  const tx = shake.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] })
  const pic = pair.emoji && !/^[A-Za-z0-9]/.test(pair.emoji) ? pair.emoji : null

  return (
    <View style={{ flex: 1 }}>
      <Hud shields={st.shields} label={`${idx + 1}/${words.length}`} combo={st.combo} />
      {ms ? <TimeBar value={left} /> : null}

      <View style={s.prompt}>
        {listen ? (
          <Pressable onPress={() => say(pair.en)} style={s.speak}>
            <Text style={{ fontSize: 40 }}>🔊</Text>
            <Text style={s.speakText}>Ouvir de novo</Text>
          </Pressable>
        ) : (
          <>
            {pic ? <Text style={{ fontSize: 56 }}>{pic}</Text> : null}
            <Text style={s.promptSmall}>Escreva em inglês:</Text>
            <Text style={s.promptBig}>{pair.pt}</Text>
          </>
        )}
        {listen ? <Text style={s.promptSmall}>Ouça e monte a palavra</Text> : null}
      </View>

      <Animated.View style={[s.slots, { transform: [{ translateX: tx }] }]}>
        {word.split('').map((_, i) => {
          const l = placed[i]
          return (
            <Pressable key={i} onPress={() => l && remove(l)} style={[s.slot, solved && s.slotOk, reveal && s.slotReveal]}>
              <Text style={s.slotText}>{reveal ? word[i].toUpperCase() : l ? l.ch.toUpperCase() : ''}</Text>
            </Pressable>
          )
        })}
      </Animated.View>
      {reveal ? <Text style={s.revealText}>A palavra era: {pair.en} = {pair.pt}</Text> : null}

      <View style={s.bank}>
        {bank.map(l => {
          const used = placed.some(p => p.id === l.id)
          return (
            <Pressable key={l.id} onPress={() => add(l)} disabled={used} style={[s.key, used && { opacity: 0.2 }]}>
              <Text style={s.keyText}>{l.ch.toUpperCase()}</Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  prompt: { alignItems: 'center', marginHorizontal: 18, marginTop: 16, padding: 14, borderRadius: 22, backgroundColor: 'rgba(14,11,46,0.92)', borderWidth: 2, borderColor: '#3a3478', gap: 4 },
  promptSmall: { color: '#a9a6d6', fontWeight: '800', fontSize: 13 },
  promptBig: { color: '#fff', fontWeight: '800', fontSize: 24, textAlign: 'center' },
  speak: { alignItems: 'center', backgroundColor: '#5b4bff', borderRadius: 24, paddingVertical: 12, paddingHorizontal: 28 },
  speakText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  slots: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 26, paddingHorizontal: 14 },
  slot: { width: 40, height: 50, borderRadius: 12, borderWidth: 3, borderColor: '#9fe3ff', backgroundColor: 'rgba(14,11,46,0.92)', alignItems: 'center', justifyContent: 'center' },
  slotOk: { borderColor: '#7ee081', backgroundColor: '#12603f' },
  slotReveal: { borderColor: '#ffd400' },
  slotText: { color: '#fff', fontWeight: '800', fontSize: 22 },
  revealText: { color: '#ffd400', fontWeight: '800', textAlign: 'center', marginTop: 10 },
  bank: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 30, paddingHorizontal: 14 },
  key: { width: 52, height: 56, borderRadius: 14, backgroundColor: '#2b5be8', borderWidth: 3, borderColor: '#111', alignItems: 'center', justifyContent: 'center' },
  keyText: { color: '#fff', fontWeight: '800', fontSize: 24 },
})
