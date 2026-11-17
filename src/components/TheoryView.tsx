import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import * as Speech from 'expo-speech'
import { Btn } from './ui'
import type { TheoryBlock, TheorySlide } from '../data/course/types'
import { brand, useTheme } from '../theme'

function speak(text: string) {
  const clean = text.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{20E3}]/gu, '').trim()
  if (!clean) return
  Speech.stop()
  Speech.speak(clean, { language: 'en-US', rate: 0.9 })
}

function Rich({ text, style }: { text: string; style: object }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <Text style={style}>
      {parts.map((p, i) =>
        p.startsWith('**') ? <Text key={i} style={{ fontWeight: '800' }}>{p.slice(2, -2)}</Text> : p,
      )}
    </Text>
  )
}

function Block({ block }: { block: TheoryBlock }) {
  const t = useTheme()
  const body = { color: t.text, fontSize: 17, fontWeight: '600' as const, lineHeight: 24 }

  if (block.kind === 'text') return <Rich text={block.content} style={body} />

  if (block.kind === 'alert' || block.kind === 'tip') {
    const alert = block.kind === 'alert'
    const color = alert ? brand.orange : brand.accent
    return (
      <View style={[s.note, { borderColor: color, backgroundColor: alert ? 'rgba(255,150,0,0.12)' : t.selBg }]}>
        <Text style={{ fontSize: 22 }}>{alert ? '⚠️' : '💡'}</Text>
        <Rich text={block.content} style={[body, { flex: 1, fontSize: 15 }]} />
      </View>
    )
  }

  if (block.kind === 'table') {
    return (
      <View style={[s.table, { borderColor: t.border }]}>
        <View style={[s.tr, { backgroundColor: t.border }]}>
          {block.headers.map((h, i) => (
            <Text key={i} style={[s.th, { color: t.text }]}>{h}</Text>
          ))}
        </View>
        {block.rows.map((row, r) => (
          <View key={r} style={[s.tr, { borderTopWidth: 1, borderTopColor: t.border }]}>
            {row.map((cell, c) => {
              const hl = c === (block.highlightCol ?? 0)
              return (
                <Pressable key={c} style={{ flex: 1 }} disabled={!hl} onPress={() => speak(cell.replace(/\*\*/g, ''))}>
                  <Text style={[s.td, { color: hl ? brand.accent : t.text, fontWeight: hl ? '900' : '600' }]}>
                    {hl ? '🔊 ' : ''}{cell.replace(/\*\*/g, '')}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        ))}
      </View>
    )
  }

  return (
    <View style={{ gap: 14 }}>
      <Text style={[s.hint, { color: t.muted }]}>Toque numa frase para ouvir</Text>
      {block.groups.map((g, i) => (
        <View key={i} style={{ gap: 8 }}>
          <Text style={[s.group, { color: t.text }]}>{g.emoji} {g.label}</Text>
          {g.items.map((item, j) => (
            <Pressable
              key={j}
              onPress={() => speak(item.replace(/\*\*/g, ''))}
              style={({ pressed }) => [s.example, { borderColor: t.border, backgroundColor: pressed ? t.selBg : t.surface }]}
            >
              <Text style={{ fontSize: 18 }}>🔊</Text>
              <Rich text={item} style={[body, { flex: 1 }]} />
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  )
}

export function TheoryView({ slides, onDone }: { slides: TheorySlide[]; onDone: () => void }) {
  const t = useTheme()
  const [i, setI] = useState(0)
  const slide = slides[i]
  const last = i === slides.length - 1

  return (
    <View style={{ flex: 1 }}>
      <View style={s.top}>
        <View style={s.dots}>
          {slides.map((_, k) => (
            <View key={k} style={[s.dot, { backgroundColor: k <= i ? brand.accent : t.border }]} />
          ))}
        </View>
        <Text onPress={onDone} style={[s.skip, { color: t.muted }]}>Pular</Text>
      </View>

      <ScrollView key={i} contentContainerStyle={s.body}>
        <Text style={{ fontSize: 48, textAlign: 'center' }}>{slide.emoji}</Text>
        <Text style={[s.title, { color: t.text }]}>{slide.title}</Text>
        <View style={{ gap: 16 }}>
          {slide.blocks.map((b, k) => <Block key={k} block={b} />)}
        </View>
      </ScrollView>

      <View style={[s.foot, { borderTopColor: t.border }]}>
        {i > 0 ? <Btn label="Voltar" tone="ghost" onPress={() => setI(i - 1)} style={{ flex: 1 }} /> : null}
        <Btn
          label={last ? 'Começar atividade' : 'Próximo'}
          tone={last ? 'green' : 'blue'}
          onPress={() => (last ? onDone() : setI(i + 1))}
          style={{ flex: 2 }}
        />
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  dots: { flex: 1, flexDirection: 'row', gap: 6 },
  dot: { flex: 1, height: 8, borderRadius: 4 },
  skip: { fontWeight: '800', fontSize: 15 },
  body: { padding: 20, paddingBottom: 32, gap: 16 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  foot: { flexDirection: 'row', gap: 12, borderTopWidth: 2, padding: 16, paddingBottom: 24 },
  note: { flexDirection: 'row', gap: 10, borderWidth: 2, borderRadius: 14, padding: 12, alignItems: 'flex-start' },
  table: { borderWidth: 2, borderRadius: 14, overflow: 'hidden' },
  tr: { flexDirection: 'row' },
  th: { flex: 1, padding: 10, fontWeight: '800', fontSize: 13 },
  td: { padding: 10, fontSize: 15 },
  hint: { fontSize: 13, fontWeight: '700' },
  group: { fontSize: 16, fontWeight: '800' },
  example: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 2, borderRadius: 14, padding: 12 },
})
