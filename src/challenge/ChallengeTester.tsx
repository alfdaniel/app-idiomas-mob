import React, { useEffect, useMemo, useState } from 'react'
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Stars } from '../art/Art'
import { buildGame, MODES, type GameData, type Mode } from '../lib/challenge'
import { findLesson, getUnits, shuffle } from '../lib/exercises'
import { brand, SPACE_BG, SpaceProvider, useTheme } from '../theme'
import { ChallengeScreen } from './ChallengeScreen'

interface Entry {
  id: string
  unit: number
  lessonId: string
  title: string
  emoji: string
  modes: Mode[]
}

interface Running {
  key: number
  data: GameData
  auto?: Mode
  easy: boolean
  calm: boolean
}

export function ChallengeTester({ onExit }: { onExit: () => void }) {
  const [size, setSize] = useState({ w: 400, h: 900 })
  return (
    <SpaceProvider>
      <View style={{ flex: 1, backgroundColor: SPACE_BG }} onLayout={e => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
        <Stars width={size.w} height={size.h} count={46} />
        <Inner onExit={onExit} />
      </View>
    </SpaceProvider>
  )
}

function Inner({ onExit }: { onExit: () => void }) {
  const t = useTheme()
  const [calm, setCalm] = useState(false)
  const [easy, setEasy] = useState(false)
  const [running, setRunning] = useState<Running | null>(null)

  const groups = useMemo(
    () =>
      getUnits().map(u => ({
        title: u.title,
        optional: u.optional,
        items: u.skills.map<Entry>(k => {
          const lesson = findLesson(u.level, k.lessonId)
          return { id: k.id, unit: u.level, lessonId: k.lessonId, title: k.title, emoji: k.emoji, modes: lesson ? buildGame(lesson).modes : [] }
        }),
      })),
    [],
  )
  const all = useMemo(() => groups.flatMap(g => g.items), [groups])

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (running) setRunning(null)
      else onExit()
      return true
    })
    return () => sub.remove()
  }, [running])

  function launch(e: Entry, auto?: Mode) {
    const lesson = findLesson(e.unit, e.lessonId)
    if (!lesson) return
    setRunning({ key: Date.now(), data: buildGame(lesson), auto, easy, calm })
  }

  function random(mode: Mode) {
    const pick = shuffle(all.filter(e => e.modes.includes(mode)))[0]
    if (pick) launch(pick, mode)
  }

  if (running) {
    return (
      <ChallengeScreen
        key={running.key}
        data={running.data}
        speed={running.easy ? 'easy' : 'normal'}
        autoMode={running.auto}
        initialCalm={running.calm}
        onDone={() => setRunning(null)}
        onSkip={() => setRunning(null)}
      />
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={s.top}>
        <Text style={[s.title, { color: t.text }]}>Testar desafios</Text>
        <Text onPress={onExit} style={[s.close, { color: t.muted }]}>✕</Text>
      </View>

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <Text style={[s.sub, { color: t.muted }]}>Jogue qualquer desafio sem fazer a trilha. Não ganha nem perde nada.</Text>

        <Text style={[s.group, { color: '#ffd400' }]}>Jogo aleatório</Text>
        <View style={s.modes}>
          {(Object.keys(MODES) as Mode[]).map(m => (
            <Pressable key={m} onPress={() => random(m)} style={({ pressed }) => [s.mode, { backgroundColor: t.surface, borderColor: t.border }, pressed && { transform: [{ scale: 0.97 }] }]}>
              <Text style={{ fontSize: 26 }}>{MODES[m].icon}</Text>
              <Text style={[s.modeText, { color: t.text }]}>{MODES[m].title}</Text>
            </Pressable>
          ))}
        </View>

        <View style={s.toggles}>
          <Toggle label="Modo calmo" on={calm} onPress={() => setCalm(v => !v)} />
          <Toggle label="Dificuldade fácil" on={easy} onPress={() => setEasy(v => !v)} />
        </View>

        {groups.map(g => (
          <View key={g.title} style={{ marginTop: 18 }}>
            <Text style={[s.group, { color: g.optional ? '#ff7bf0' : '#9fe3ff' }]}>{g.optional ? '🌀 ' : ''}{g.title}</Text>
            {g.items.map(e => (
              <Pressable
                key={e.id}
                disabled={!e.modes.length}
                onPress={() => launch(e)}
                style={({ pressed }) => [s.item, { backgroundColor: t.surface, borderColor: t.border }, !e.modes.length && { opacity: 0.4 }, pressed && { transform: [{ scale: 0.98 }] }]}
              >
                <Text style={{ fontSize: 22 }}>{e.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.itemTitle, { color: t.text }]} numberOfLines={1}>{e.title}</Text>
                  <Text style={[s.itemSub, { color: t.muted }]}>{e.modes.map(m => MODES[m].icon).join(' ')}</Text>
                </View>
                <Text style={s.play}>Jogar ▶</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

function Toggle({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  const t = useTheme()
  return (
    <Pressable onPress={onPress} style={s.toggle}>
      <View style={[s.check, on && { backgroundColor: brand.accent, borderColor: brand.accent }]}>{on ? <Text style={s.checkMark}>✓</Text> : null}</View>
      <Text style={[s.toggleText, { color: t.text }]}>{label}</Text>
    </Pressable>
  )
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontSize: 22, fontWeight: '800' },
  close: { fontSize: 24, fontWeight: '800' },
  body: { paddingHorizontal: 16, paddingBottom: 40 },
  sub: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  modes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mode: { width: '23%', borderWidth: 2, borderRadius: 14, paddingVertical: 8, alignItems: 'center' },
  modeText: { fontWeight: '800', fontSize: 9, textAlign: 'center', marginTop: 2 },
  toggles: { flexDirection: 'row', gap: 18, marginTop: 14 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  check: { width: 22, height: 22, borderRadius: 7, borderWidth: 2, borderColor: '#6b6b8f', alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: '#fff', fontWeight: '800', fontSize: 14 },
  toggleText: { fontWeight: '700', fontSize: 14 },
  group: { fontSize: 13, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, borderRadius: 16, padding: 12, marginBottom: 8 },
  itemTitle: { fontWeight: '800', fontSize: 15 },
  itemSub: { fontWeight: '600', fontSize: 13, marginTop: 2 },
  play: { color: '#7ee081', fontWeight: '800', fontSize: 13 },
})
