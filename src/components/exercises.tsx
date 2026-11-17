import React, { useEffect, useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import * as Speech from 'expo-speech'
import { brand, useTheme } from '../theme'
import { normalize, shuffle, type CheckResult, type Exercise } from '../lib/exercises'

export interface ExerciseProps<K extends Exercise['kind']> {
  ex: Extract<Exercise, { kind: K }>
  locked: boolean
  onReady: (ready: boolean) => void
  checkRef: React.MutableRefObject<(() => CheckResult) | null>
}

function pictureSize(p: string, max = 72) {
  if (!/^[ -~]+$/.test(p)) return undefined
  const n = p.length
  const size = n <= 2 ? 72 : n === 3 ? 54 : n <= 5 ? 44 : n <= 8 ? 34 : n <= 12 ? 26 : 20
  return { fontSize: Math.min(size, max), fontWeight: '800' as const }
}

function Title({ children }: { children: string }) {
  const t = useTheme()
  return <Text style={[s.title, { color: t.text }]}>{children}</Text>
}

function Option({ label, selected, disabled, onPress, bad }: {
  label: string
  selected?: boolean
  disabled?: boolean
  bad?: boolean
  onPress: () => void
}) {
  const t = useTheme()
  const color = bad ? brand.red : selected ? brand.accent : t.text
  const border = bad ? brand.red : selected ? brand.accent : t.border
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[s.option, { borderColor: border, backgroundColor: selected ? t.selBg : t.surface }]}
    >
      <Text style={[s.optionText, { color }]}>{label}</Text>
    </Pressable>
  )
}

export function ChoiceExercise({ ex, locked, onReady, checkRef }: ExerciseProps<'choice'>) {
  const t = useTheme()
  const [sel, setSel] = useState<number | null>(null)
  checkRef.current = () => {
    const chosen = ex.options[sel ?? -1]
    const right = ex.options.find(o => o.correct)
    return { correct: !!chosen?.correct, answer: right?.text, explanation: (chosen?.correct ? right : chosen)?.explanation }
  }
  return (
    <View>
      {ex.picture ? (
        <View style={[s.picture, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Text style={[s.pictureEmoji, pictureSize(ex.picture)]}>{ex.picture}</Text>
        </View>
      ) : null}
      <Title>{ex.prompt}</Title>
      {ex.context ? <Text style={[s.ctx, { color: t.muted }]}>{ex.context}</Text> : null}
      <View style={s.stack}>
        {ex.options.map((o, i) => (
          <Option key={i} label={o.text} selected={sel === i} disabled={locked} onPress={() => { setSel(i); onReady(true) }} />
        ))}
      </View>
    </View>
  )
}

export function BlankExercise({ ex, locked, onReady, checkRef }: ExerciseProps<'blank'>) {
  const t = useTheme()
  const [value, setValue] = useState('')
  checkRef.current = () => {
    const v = normalize(value)
    return { correct: ex.answers.some(a => normalize(a) === v), answer: ex.answers[0] }
  }
  return (
    <View>
      <Title>Complete a frase</Title>
      {ex.context ? <Text style={[s.ctx, { color: t.muted }]}>{ex.context}</Text> : null}
      <View style={s.sentence}>
        {ex.before ? <Text style={[s.sentenceText, { color: t.text }]}>{ex.before}</Text> : null}
        <TextInput
          value={value}
          editable={!locked}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          onChangeText={v => { setValue(v); onReady(v.trim().length > 0) }}
          style={[s.input, { borderColor: t.border, color: t.text, backgroundColor: t.surface }]}
        />
        {ex.after ? <Text style={[s.sentenceText, { color: t.text }]}>{ex.after}</Text> : null}
      </View>
      {ex.hint ? <Text style={[s.ctx, { color: t.muted, marginTop: 20 }]}>💡 {ex.hint}</Text> : null}
    </View>
  )
}

export function MatchExercise({ ex, locked, onReady, checkRef }: ExerciseProps<'match'>) {
  const t = useTheme()
  const idx = useMemo(() => ex.pairs.map((_, i) => i), [ex])
  const lefts = useMemo(() => shuffle(idx), [idx])
  const rights = useMemo(() => shuffle(idx), [idx])
  const [selL, setSelL] = useState<number | null>(null)
  const [selR, setSelR] = useState<number | null>(null)
  const [matched, setMatched] = useState<number[]>([])
  const [bad, setBad] = useState<number | null>(null)
  const [mistakes, setMistakes] = useState(0)

  useEffect(() => {
    if (selL === null || selR === null) return
    if (selL === selR) {
      const next = [...matched, selL]
      setMatched(next)
      if (next.length === ex.pairs.length) onReady(true)
    } else {
      setMistakes(m => m + 1)
      setBad(selR)
      setTimeout(() => setBad(null), 400)
    }
    setSelL(null)
    setSelR(null)
  }, [selL, selR])

  checkRef.current = () => ({ correct: mistakes === 0, answer: ex.pairs.map(p => `${p.left} = ${p.right}`).join(' · ') })

  return (
    <View>
      <Title>{ex.prompt}</Title>
      <View style={s.cols}>
        <View style={s.col}>
          {lefts.map(p => (
            <View key={p} style={{ opacity: matched.includes(p) ? 0.35 : 1 }}>
              <Option label={ex.pairs[p].left} selected={selL === p} disabled={locked || matched.includes(p)} onPress={() => setSelL(p)} />
            </View>
          ))}
        </View>
        <View style={s.col}>
          {rights.map(p => (
            <View key={p} style={{ opacity: matched.includes(p) ? 0.35 : 1 }}>
              <Option label={ex.pairs[p].right} selected={selR === p} bad={bad === p} disabled={locked || matched.includes(p)} onPress={() => setSelR(p)} />
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export function ListenExercise({ ex, locked, onReady, checkRef }: ExerciseProps<'listen'>) {
  const t = useTheme()
  const [sel, setSel] = useState<number | null>(null)
  const play = () => {
    Speech.stop()
    Speech.speak(ex.text, { language: 'en-US', rate: 0.85 })
  }
  useEffect(() => {
    const id = setTimeout(play, 350)
    return () => {
      clearTimeout(id)
      Speech.stop()
    }
  }, [])

  checkRef.current = () => {
    const right = ex.options.find(o => o.correct)
    return { correct: !!ex.options[sel ?? -1]?.correct, answer: right ? `${right.emoji} ${right.text}` : undefined }
  }

  return (
    <View>
      <Title>Ouça e toque na opção certa</Title>
      <Pressable onPress={play} style={[s.listenBtn, { backgroundColor: brand.primary }]}>
        <Text style={{ fontSize: 40 }}>🔊</Text>
        <Text style={s.listenLabel}>Ouvir de novo</Text>
      </Pressable>
      <View style={s.grid}>
        {ex.options.map((o, i) => (
          <Pressable
            key={i}
            disabled={locked}
            onPress={() => { setSel(i); onReady(true) }}
            style={[s.listenOpt, { borderColor: sel === i ? brand.primary : t.border, backgroundColor: sel === i ? t.selBg : t.surface }]}
          >
            <Text style={[{ fontSize: 44, color: t.text }, pictureSize(o.emoji, 34)]}>{o.emoji}</Text>
            {o.text ? <Text style={[s.listenText, { color: t.text }]}>{o.text}</Text> : null}
          </Pressable>
        ))}
      </View>
    </View>
  )
}

export function BuildExercise({ ex, locked, onReady, checkRef }: ExerciseProps<'build'>) {
  const t = useTheme()
  const bank = useMemo(() => shuffle(ex.words.map((text, id) => ({ id, text }))), [ex])
  const [chosen, setChosen] = useState<{ id: number; text: string }[]>([])

  checkRef.current = () => ({
    correct: normalize(chosen.map(w => w.text).join(' ')) === normalize(ex.answer),
    answer: ex.answer,
  })

  const update = (next: typeof chosen) => {
    setChosen(next)
    onReady(next.length > 0)
  }

  return (
    <View>
      <Title>Escreva em inglês</Title>
      <View style={s.promptRow}>
        <Pressable
          accessibilityLabel="Ouvir"
          onPress={() => Speech.speak(ex.answer, { language: 'en-US', rate: 0.9 })}
          style={[s.speak, { borderColor: t.border, backgroundColor: t.surface }]}
        >
          <Text style={{ fontSize: 22 }}>🔊</Text>
        </Pressable>
        <View style={[s.bubble, { borderColor: t.border }]}>
          <Text style={[s.bubbleText, { color: t.text }]}>{ex.prompt}</Text>
        </View>
      </View>

      <View style={[s.line, { borderColor: t.border }]}>
        {chosen.map(w => (
          <Pressable key={w.id} disabled={locked} onPress={() => update(chosen.filter(c => c.id !== w.id))} style={[s.chip, { borderColor: t.border, backgroundColor: t.surface }]}>
            <Text style={[s.chipText, { color: t.text }]}>{w.text}</Text>
          </Pressable>
        ))}
      </View>

      <View style={s.bank}>
        {bank.map(w => {
          const used = chosen.some(c => c.id === w.id)
          return used ? (
            <View key={w.id} style={[s.chip, { borderColor: t.border, backgroundColor: t.border }]}>
              <Text style={[s.chipText, { color: 'transparent' }]}>{w.text}</Text>
            </View>
          ) : (
            <Pressable key={w.id} disabled={locked} onPress={() => update([...chosen, w])} style={[s.chip, { borderColor: t.border, backgroundColor: t.surface }]}>
              <Text style={[s.chipText, { color: t.text }]}>{w.text}</Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  picture: { alignSelf: 'center', minWidth: 140, minHeight: 120, maxWidth: '100%', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 28, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  pictureEmoji: { fontSize: 80, textAlign: 'center' },
  listenBtn: { alignSelf: 'center', alignItems: 'center', borderRadius: 28, paddingVertical: 16, paddingHorizontal: 32, marginVertical: 14 },
  listenLabel: { color: '#fff', fontWeight: '800', fontSize: 14, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 8 },
  listenOpt: { width: '47%', alignItems: 'center', borderWidth: 2, borderRadius: 20, paddingVertical: 16, gap: 4 },
  listenText: { fontWeight: '800', fontSize: 15 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  ctx: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  stack: { gap: 12, marginTop: 16 },
  option: { borderWidth: 2, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16 },
  optionText: { fontSize: 17, fontWeight: '700' },
  sentence: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 24 },
  sentenceText: { fontSize: 22, fontWeight: '700' },
  input: { minWidth: 130, borderWidth: 2, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  cols: { flexDirection: 'row', gap: 12, marginTop: 12 },
  col: { flex: 1, gap: 12 },
  promptRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  speak: { width: 52, height: 52, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  bubble: { flex: 1, borderWidth: 2, borderRadius: 16, padding: 12 },
  bubbleText: { fontSize: 18, fontWeight: '700' },
  line: { minHeight: 64, borderTopWidth: 2, borderBottomWidth: 2, paddingVertical: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignContent: 'flex-start' },
  bank: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 28 },
  chip: { borderWidth: 2, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 16 },
  chipText: { fontSize: 17, fontWeight: '700' },
})
