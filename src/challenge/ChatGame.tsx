import React, { useEffect, useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { Alien } from '../art/Art'
import type { ChatRound } from '../lib/challenge'
import { Hud, say, useScore, type GameProps } from './common'

interface Msg {
  who: 'npc' | 'me' | 'sys'
  text: string
  ok?: boolean
}

const R = 22
const C = 2 * Math.PI * R
const REACT_OK = ['Nice!', 'Great!', 'Yes! 😄', 'Cool!', 'Perfect!']

export function ChatGame({ data, speed, calm, onEnd }: GameProps<ChatRound[]>) {
  const [idx, setIdx] = useState(0)
  const [log, setLog] = useState<Msg[]>([])
  const [typing, setTyping] = useState(true)
  const [resolved, setResolved] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const [p, setP] = useState(0)
  const scroll = useRef<any>(null)
  const { st, hit, miss, end, later } = useScore(calm, onEnd)
  const round = data[idx]
  const duration = calm ? 0 : Math.max(speed === 'easy' ? 7000 : 5000, (speed === 'easy' ? 11000 : 8000) - idx * 350)
  const ok = resolved && picked === round.correct

  useEffect(() => {
    setTyping(true)
    setResolved(false)
    setPicked(null)
    setP(0)
    later(() => {
      setTyping(false)
      setLog(l => [...l, { who: 'npc', text: round.npc }])
      if (round.speak) say(round.speak)
    }, 650)
  }, [idx])

  useEffect(() => {
    if (typing || resolved || !duration) return
    const start = Date.now()
    const id = setInterval(() => {
      const v = Math.min(1, (Date.now() - start) / duration)
      setP(v)
      if (v >= 1) {
        clearInterval(id)
        choose(null)
      }
    }, 100)
    return () => clearInterval(id)
  }, [typing, resolved, idx])

  function choose(i: number | null) {
    if (resolved || typing) return
    setResolved(true)
    setPicked(i)
    const good = i !== null && i === round.correct
    const answer = round.options[round.correct]
    if (good) hit()
    else miss()
    setLog(l => [
      ...l,
      i === null ? { who: 'sys', text: '⏰ O tempo acabou!' } : { who: 'me', text: round.options[i], ok: good },
    ])
    if (good && /^[A-Za-z]/.test(answer)) say(answer)
    later(() => {
      setLog(l => [...l, good ? { who: 'npc', text: REACT_OK[idx % REACT_OK.length] } : { who: 'npc', text: `Hmm... a resposta era: ${answer}` }])
    }, 450)
    later(() => {
      if (st.shields <= 0 || idx + 1 >= data.length) end()
      else setIdx(idx + 1)
    }, good ? 1300 : 2100)
  }

  const ring = p < 0.6 ? '#7ee081' : p < 0.85 ? '#ffd400' : '#ff5a6e'
  const secs = Math.max(0, Math.ceil(((1 - p) * duration) / 1000))

  return (
    <View style={{ flex: 1 }}>
      <Hud shields={st.shields} label={`${idx + 1}/${data.length}`} combo={st.combo} icon="💚" />

      <View style={s.stage}>
        <View style={s.who}>
          <Alien size={74} mood={!resolved ? 'happy' : ok ? 'wow' : 'sad'} color="#8fd6ff" />
          <Text style={s.name}>Zuzu</Text>
        </View>
        <View style={s.ring}>
          <Svg width={56} height={56}>
            <Circle cx={28} cy={28} r={R} stroke="rgba(255,255,255,0.15)" strokeWidth={6} fill="none" />
            <Circle
              cx={28}
              cy={28}
              r={R}
              stroke={ring}
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${C} ${C}`}
              strokeDashoffset={C * p}
              transform="rotate(-90 28 28)"
            />
          </Svg>
          <Text style={[s.secs, { color: ring }]}>{duration ? secs : '∞'}</Text>
        </View>
        <View style={s.who}>
          <Alien size={74} mood={!resolved ? 'happy' : ok ? 'happy' : 'sad'} />
          <Text style={s.name}>Você</Text>
        </View>
      </View>

      <ScrollView
        ref={scroll}
        style={s.chat}
        contentContainerStyle={{ padding: 14, gap: 10 }}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
      >
        {log.map((m, i) =>
          m.who === 'sys' ? (
            <Text key={i} style={s.sys}>{m.text}</Text>
          ) : (
            <Pressable
              key={i}
              onPress={() => /^[A-Za-z]/.test(m.text) && say(m.text)}
              style={[s.bubble, m.who === 'npc' ? s.npc : s.me, m.ok === true && s.meOk, m.ok === false && s.meBad]}
            >
              <Text style={[s.bubbleText, m.who === 'me' && { color: '#fff' }]}>{m.text}{m.ok === true ? '  ✓' : m.ok === false ? '  ✗' : ''}</Text>
            </Pressable>
          ),
        )}
        {typing ? (
          <View style={[s.bubble, s.npc]}>
            <Text style={s.bubbleText}>• • •</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={s.answers}>
        <Text style={s.ask}>{typing ? 'Zuzu está digitando…' : round.ask}</Text>
        {!typing &&
          round.options.map((o, i) => {
            const right = resolved && i === round.correct
            const wrong = resolved && picked === i && i !== round.correct
            return (
              <Pressable
                key={`${idx}-${i}`}
                disabled={resolved}
                onPress={() => choose(i)}
                style={({ pressed }) => [s.opt, right && s.optOk, wrong && s.optBad, resolved && !right && !wrong && { opacity: 0.35 }, pressed && { transform: [{ scale: 0.98 }] }]}
              >
                <Text style={s.optText}>{o}</Text>
              </Pressable>
            )
          })}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  stage: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, marginTop: 10 },
  who: { alignItems: 'center' },
  name: { color: '#fff', fontWeight: '800', fontSize: 12, marginTop: 2 },
  ring: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  secs: { position: 'absolute', fontSize: 18, fontWeight: '800' },
  chat: { flex: 1, marginTop: 6 },
  bubble: { maxWidth: '80%', borderRadius: 18, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 3, borderColor: '#111' },
  npc: { alignSelf: 'flex-start', backgroundColor: '#ffffff', borderBottomLeftRadius: 4 },
  me: { alignSelf: 'flex-end', backgroundColor: '#2b5be8', borderBottomRightRadius: 4 },
  meOk: { backgroundColor: '#12803f' },
  meBad: { backgroundColor: '#b01c3a' },
  bubbleText: { color: '#111', fontWeight: '800', fontSize: 16 },
  sys: { alignSelf: 'center', color: '#ffd400', fontWeight: '800' },
  answers: { padding: 14, gap: 8, backgroundColor: 'rgba(14,11,46,0.95)', borderTopWidth: 2, borderTopColor: '#3a3478', minHeight: 190 },
  ask: { color: '#9fe3ff', fontWeight: '800', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 },
  opt: { backgroundColor: '#1b1747', borderRadius: 16, borderWidth: 2, borderColor: '#9fe3ff', paddingVertical: 11, paddingHorizontal: 14 },
  optOk: { backgroundColor: '#12603f', borderColor: '#7ee081' },
  optBad: { backgroundColor: '#6b1e3a', borderColor: '#ff8fa3' },
  optText: { color: '#fff', fontWeight: '800', fontSize: 15 },
})
