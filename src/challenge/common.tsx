import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, Vibration, View } from 'react-native'
import * as Speech from 'expo-speech'
import type { ChallengeResult } from '../lib/challenge'

export interface GameProps<T> {
  data: T
  speed: 'easy' | 'normal'
  calm: boolean
  onEnd: (r: ChallengeResult) => void
}

export function say(text: string) {
  const clean = text.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{20E3}“”]/gu, '').trim()
  if (!clean) return
  Speech.stop()
  Speech.speak(clean, { language: 'en-US', rate: 0.9 })
}

export function useScore(calm: boolean, onEnd: (r: ChallengeResult) => void) {
  const st = useRef({ shields: 3, combo: 0, best: 0, correct: 0, total: 0, ended: false })
  const [, force] = useState(0)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      Speech.stop()
    }
  }, [])

  const hit = () => {
    const s = st.current
    s.correct++
    s.total++
    s.combo++
    s.best = Math.max(s.best, s.combo)
    force(n => n + 1)
  }
  const miss = (costs = true) => {
    const s = st.current
    s.total++
    s.combo = 0
    if (costs && !calm) s.shields--
    Vibration.vibrate(60)
    force(n => n + 1)
  }
  const end = () => {
    const s = st.current
    if (s.ended || !alive.current) return
    s.ended = true
    onEnd({ correct: s.correct, total: Math.max(1, s.total), bestCombo: s.best, shields: Math.max(0, s.shields), calm })
  }
  const later = (fn: () => void, ms: number) => {
    setTimeout(() => {
      if (alive.current && !st.current.ended) fn()
    }, ms)
  }
  return { st: st.current, hit, miss, end, later, alive }
}

export function Hud({ shields, label, combo, icon = '🛡️' }: { shields: number; label: string; combo: number; icon?: string }) {
  const n = Math.max(0, shields)
  return (
    <View style={s.hud}>
      <Text style={s.shields}>
        {icon.repeat(n)}
        <Text style={{ opacity: 0.25 }}>{icon.repeat(Math.max(0, 3 - n))}</Text>
      </Text>
      <Text style={s.label}>{label}</Text>
      <Text style={s.combo}>{combo >= 2 ? `🔥 x${combo}` : ' '}</Text>
    </View>
  )
}

export function TimeBar({ value }: { value: number }) {
  const color = value > 0.4 ? '#9fe3ff' : value > 0.2 ? '#ffd400' : '#ff5a6e'
  return (
    <View style={s.track}>
      <View style={[s.fill, { width: `${Math.max(0, Math.min(1, value)) * 100}%`, backgroundColor: color }]} />
    </View>
  )
}

export function useCountdown(ms: number | null, key: unknown, onDone: () => void) {
  const [left, setLeft] = useState(1)
  const done = useRef(onDone)
  done.current = onDone
  useEffect(() => {
    setLeft(1)
    if (!ms) return
    const start = Date.now()
    const id = setInterval(() => {
      const v = 1 - (Date.now() - start) / ms
      setLeft(v)
      if (v <= 0) {
        clearInterval(id)
        done.current()
      }
    }, 100)
    return () => clearInterval(id)
  }, [key, ms])
  return left
}

const s = StyleSheet.create({
  hud: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 12 },
  shields: { fontSize: 20 },
  label: { color: '#fff', fontWeight: '800', fontSize: 15 },
  combo: { color: '#ffd400', fontWeight: '800', fontSize: 18, minWidth: 70, textAlign: 'right' },
  track: { height: 6, marginHorizontal: 18, marginTop: 8, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.18)', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
})
