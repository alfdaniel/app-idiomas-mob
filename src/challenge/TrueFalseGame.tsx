import React, { useMemo, useRef, useState } from 'react'
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native'
import type { Statement } from '../lib/challenge'
import { Hud, TimeBar, useCountdown, useScore, type GameProps } from './common'

export function TrueFalseGame({ data, speed, calm, onEnd }: GameProps<Statement[]>) {
  const [idx, setIdx] = useState(0)
  const [result, setResult] = useState<null | boolean>(null)
  const x = useRef(new Animated.Value(0)).current
  const busy = useRef(false)
  const { st, hit, miss, end, later } = useScore(calm, onEnd)
  const card = data[idx]

  const ms = calm ? null : speed === 'easy' ? 9000 : 6500
  const left = useCountdown(result === null ? ms : null, idx, () => answer(null))

  function answer(v: boolean | null) {
    if (busy.current) return
    busy.current = true
    const good = v !== null && v === card.truth
    if (good) hit()
    else miss()
    setResult(good)
    Animated.timing(x, { toValue: v === null ? 0 : v ? 500 : -500, duration: 260, useNativeDriver: false }).start()
    later(
      () => {
        if (st.shields <= 0 || idx + 1 >= data.length) return end()
        x.setValue(0)
        setResult(null)
        busy.current = false
        setIdx(idx + 1)
      },
      good ? 500 : 1500,
    )
  }

  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8,
        onPanResponderMove: (_, g) => !busy.current && x.setValue(g.dx),
        onPanResponderRelease: (_, g) => {
          if (busy.current) return
          if (g.dx > 90) answer(true)
          else if (g.dx < -90) answer(false)
          else Animated.spring(x, { toValue: 0, useNativeDriver: false }).start()
        },
      }),
    [idx],
  )

  const rotate = x.interpolate({ inputRange: [-200, 0, 200], outputRange: ['-14deg', '0deg', '14deg'] })
  const border = x.interpolate({ inputRange: [-120, 0, 120], outputRange: ['#ff5a6e', '#3a3478', '#7ee081'] })

  return (
    <View style={{ flex: 1 }}>
      <Hud shields={st.shields} label={`${idx + 1}/${data.length}`} combo={st.combo} />
      {ms ? <TimeBar value={result === null ? left : 0} /> : null}
      <Text style={s.hint}>⬅ Deslize para FALSO · VERDADEIRO ➡</Text>

      <View style={s.center}>
        <Animated.View {...pan.panHandlers} style={[s.card, { borderColor: border, transform: [{ translateX: x }, { rotate }] }]}>
          <Text style={s.cardText}>{card.text}</Text>
        </Animated.View>
        {result !== null ? (
          <View style={s.feedback}>
            <Text style={[s.fbTitle, { color: result ? '#7ee081' : '#ff8fa3' }]}>{result ? 'Isso!' : card.truth ? 'Era verdadeiro' : 'Era falso'}</Text>
            {!result ? <Text style={s.fbText}>{card.fix}</Text> : null}
          </View>
        ) : null}
      </View>

      <View style={s.buttons}>
        <Pressable onPress={() => answer(false)} style={[s.btn, { backgroundColor: '#b01c3a' }]}>
          <Text style={s.btnText}>✖ Falso</Text>
        </Pressable>
        <Pressable onPress={() => answer(true)} style={[s.btn, { backgroundColor: '#12803f' }]}>
          <Text style={s.btnText}>✔ Verdadeiro</Text>
        </Pressable>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  hint: { color: '#c9b8ff', fontWeight: '700', fontSize: 13, textAlign: 'center', marginTop: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  card: { width: '100%', minHeight: 180, borderRadius: 28, borderWidth: 4, backgroundColor: 'rgba(14,11,46,0.95)', alignItems: 'center', justifyContent: 'center', padding: 22 },
  cardText: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center', lineHeight: 30 },
  feedback: { marginTop: 18, alignItems: 'center' },
  fbTitle: { fontSize: 22, fontWeight: '800' },
  fbText: { color: '#fff', fontWeight: '700', marginTop: 4, textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: 12, padding: 18 },
  btn: { flex: 1, borderRadius: 999, paddingVertical: 16, alignItems: 'center', borderWidth: 3, borderColor: '#111' },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
})
