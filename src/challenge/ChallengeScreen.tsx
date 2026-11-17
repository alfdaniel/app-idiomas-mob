import React, { useEffect, useRef, useState } from 'react'
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Alien, Ship } from '../art/Art'
import { Btn } from '../components/ui'
import { MODES, type ChallengeResult, type GameData, type Mode } from '../lib/challenge'
import { shuffle } from '../lib/exercises'
import { lookWith, partById, RARITY_COLOR, RARITY_LABEL } from '../lib/parts'
import { useApp, type BonusResult } from '../store'
import { brand, useTheme } from '../theme'
import { BossGame } from './BossGame'
import { ChatGame } from './ChatGame'
import { FlyGame } from './FlyGame'
import { MemoryGame } from './MemoryGame'
import { MeteorGame } from './MeteorGame'
import { ScrambleGame } from './ScrambleGame'
import { TrueFalseGame } from './TrueFalseGame'

interface Props {
  data: GameData
  speed: 'easy' | 'normal'
  onDone: () => void
  onSkip: () => void
  onRun?: (r: ChallengeResult) => Promise<BonusResult | null>
  autoMode?: Mode
  initialCalm?: boolean
  /** Desafio automático no fim da lição: mostra o selo "Desafio final" e um link discreto para pular. */
  finale?: boolean
}

export function ChallengeScreen({ data, speed, onDone, onSkip, onRun, autoMode, initialCalm, finale }: Props) {
  const t = useTheme()
  const { duo } = useApp()
  const [step, setStep] = useState<'intro' | 'count' | 'play' | 'result'>(autoMode ? 'count' : 'intro')
  const [mode, setMode] = useState<Mode>(autoMode ?? data.modes[0])
  const [calm, setCalm] = useState(!!initialCalm)
  const [count, setCount] = useState(3)
  const [run, setRun] = useState(0)
  const [result, setResult] = useState<ChallengeResult | null>(null)
  const [reward, setReward] = useState<BonusResult | null>(null)
  const [loading, setLoading] = useState(false)
  const pop = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (step !== 'count') return
    setCount(3)
    const ids = [
      setTimeout(() => setCount(2), 650),
      setTimeout(() => setCount(1), 1300),
      setTimeout(() => setCount(0), 1950),
      setTimeout(() => setStep('play'), 2500),
    ]
    return () => ids.forEach(clearTimeout)
  }, [step, run])

  useEffect(() => {
    if (step !== 'result' || !result) return
    setReward(null)
    if (!onRun) return
    setLoading(true)
    onRun(result)
      .then(r => {
        setReward(r)
        if (r?.drop) {
          pop.setValue(0)
          Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: true }).start()
        }
      })
      .finally(() => setLoading(false))
  }, [step, result])

  function start(m: Mode) {
    setMode(m)
    setRun(r => r + 1)
    setStep('count')
  }

  function surprise() {
    const others = data.modes.filter(m => m !== mode)
    start(shuffle(others.length ? others : data.modes)[0])
  }

  if (step === 'intro') {
    return (
      <ScrollView contentContainerStyle={s.introBody}>
        <Alien size={84} mood="wow" />
        <Text style={[s.title, { color: t.text }]}>Desafio relâmpago!</Text>
        <Text style={[s.sub, { color: t.muted }]}>Escolha um jogo ou deixe a sorte decidir. Ganhe XP, gemas e peças para a sua nave.</Text>

        <Pressable onPress={surprise} style={({ pressed }) => [s.surprise, pressed && { transform: [{ scale: 0.98 }] }]}>
          <Text style={s.surpriseText}>🎲 Surpresa!</Text>
        </Pressable>

        <View style={s.grid}>
          {data.modes.map(m => (
            <Pressable
              key={m}
              onPress={() => start(m)}
              style={({ pressed }) => [s.card, { backgroundColor: t.surface, borderColor: t.border }, pressed && { transform: [{ scale: 0.97 }] }]}
            >
              <Text style={{ fontSize: 30 }}>{MODES[m].icon}</Text>
              <Text style={[s.cardTitle, { color: t.text }]}>{MODES[m].title}</Text>
              <Text style={[s.cardDesc, { color: t.muted }]}>{MODES[m].desc}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => setCalm(v => !v)} style={s.calmRow}>
          <View style={[s.check, calm && { backgroundColor: brand.accent, borderColor: brand.accent }]}>
            {calm ? <Text style={s.checkMark}>✓</Text> : null}
          </View>
          <Text style={[s.calmText, { color: t.text }]}>Modo calmo (sem pressa, bônus menor)</Text>
        </Pressable>

        <Btn label="Pular desafio" tone="ghost" onPress={onSkip} style={{ alignSelf: 'stretch' }} />
      </ScrollView>
    )
  }

  if (step === 'count') {
    return (
      <View style={s.center}>
        {finale && run === 0 ? <Text style={s.finale}>⭐ Desafio final!</Text> : null}
        <Text style={{ fontSize: 54 }}>{MODES[mode].icon}</Text>
        <Text style={[s.modeName, { color: t.text }]}>{MODES[mode].title}</Text>
        <Text style={[s.big, { color: count === 0 ? '#7ee081' : '#ffd400' }]}>{count === 0 ? 'Vai!' : count}</Text>
        <Text style={[s.sub, { color: t.muted }]}>{MODES[mode].desc}</Text>
        {finale && run === 0 ? (
          <Text onPress={onSkip} style={[s.skip, { color: t.muted }]}>Pular desafio</Text>
        ) : null}
      </View>
    )
  }

  if (step === 'play') {
    const onEnd = (r: ChallengeResult) => {
      setResult(r)
      setStep('result')
    }
    const k = `${mode}-${run}`
    const common = { speed, calm, onEnd }
    switch (mode) {
      case 'fly':
        return <FlyGame key={k} rounds={data.rounds} {...common} />
      case 'chat':
        return <ChatGame key={k} data={data.chat} {...common} />
      case 'meteor':
        return <MeteorGame key={k} data={data.meteorPairs} {...common} />
      case 'memory':
        return <MemoryGame key={k} data={data.memoryPairs} {...common} />
      case 'scramble':
        return <ScrambleGame key={k} data={data.words} {...common} />
      case 'dictation':
        return <ScrambleGame key={k} data={data.words} listen {...common} />
      case 'tf':
        return <TrueFalseGame key={k} data={data.statements} {...common} />
      case 'boss':
        return <BossGame key={k} data={data.rounds} {...common} />
    }
  }

  const r = result!
  const ratio = r.correct / Math.max(1, r.total)
  const mood = ratio >= 0.7 ? 'wow' : r.correct > 0 ? 'happy' : 'sad'
  const part = reward?.drop ? partById(reward.drop) : undefined

  return (
    <ScrollView contentContainerStyle={s.resultBody}>
      <Alien size={96} mood={mood} />
      <Text style={[s.title, { color: t.text }]}>{r.shields > 0 ? 'Desafio concluído!' : 'Os escudos acabaram!'}</Text>
      <Text style={[s.sub, { color: t.muted }]}>{MODES[mode].icon} {MODES[mode].title}</Text>
      <View style={s.stats}>
        <Stat label="Acertos" value={`${r.correct}/${r.total}`} color={brand.primary} />
        <Stat label="Combo" value={`🔥 ${r.bestCombo}`} color={brand.gold} />
        <Stat label="Escudos" value={`${Math.max(0, r.shields)}/3`} color={brand.accent} />
      </View>

      {onRun ? (
        <Text style={[s.reward, { color: reward?.capped ? t.muted : '#7ee081' }]}>
          {loading ? 'Calculando bônus…' : reward ? (reward.capped ? 'Bônus de XP já usado hoje nesta lição' : `Bônus: ⚡ +${reward.xp}  💎 +${reward.gems}`) : ''}
        </Text>
      ) : (
        <Text style={[s.reward, { color: t.muted }]}>Modo teste: sem recompensas</Text>
      )}

      {part ? (
        <Animated.View style={[s.drop, { borderColor: RARITY_COLOR[part.rarity], transform: [{ scale: pop }] }]}>
          <Text style={s.dropTitle}>📦 Caixa estelar!</Text>
          <Ship size={110} look={lookWith(duo.equipped, part.id)} />
          <Text style={s.dropName}>{part.name}</Text>
          <Text style={[s.dropRarity, { color: RARITY_COLOR[part.rarity] }]}>Peça {RARITY_LABEL[part.rarity]}</Text>
          <Text style={[s.sub, { color: t.muted }]}>Equipe no Hangar (Perfil)</Text>
        </Animated.View>
      ) : null}

      <Btn label="🎲 Jogar outro jogo" tone="blue" onPress={surprise} style={{ alignSelf: 'stretch' }} />
      <Btn label="↻ Jogar este de novo" tone="ghost" onPress={() => start(mode)} style={{ alignSelf: 'stretch' }} />
      <Btn label="Continuar" onPress={onDone} style={{ alignSelf: 'stretch' }} />
    </ScrollView>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[s.stat, { borderColor: color }]}>
      <Text style={[s.statLabel, { backgroundColor: color }]}>{label}</Text>
      <Text style={[s.statValue, { color }]}>{value}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  introBody: { alignItems: 'center', padding: 20, gap: 12 },
  resultBody: { alignItems: 'center', padding: 20, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 22, gap: 10 },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center' },
  sub: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  modeName: { fontSize: 22, fontWeight: '800' },
  finale: { color: '#ffd400', fontSize: 16, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  skip: { fontSize: 14, fontWeight: '800', textDecorationLine: 'underline', marginTop: 24, padding: 8 },
  big: { fontSize: 110, fontWeight: '800', textShadowColor: '#05031a', textShadowRadius: 12 },
  surprise: { alignSelf: 'stretch', backgroundColor: '#ff2bd6', borderRadius: 999, paddingVertical: 15, alignItems: 'center', borderWidth: 3, borderColor: '#111' },
  surpriseText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  card: { width: '47%', borderWidth: 2, borderRadius: 18, padding: 12, alignItems: 'center', gap: 2 },
  cardTitle: { fontSize: 14, fontWeight: '800', textAlign: 'center' },
  cardDesc: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  calmRow: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'stretch', paddingVertical: 4 },
  check: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: '#6b6b8f', alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: '#fff', fontWeight: '800', fontSize: 15 },
  calmText: { fontWeight: '700', fontSize: 14, flex: 1 },
  stats: { flexDirection: 'row', gap: 10, marginVertical: 6 },
  stat: { borderWidth: 2, borderRadius: 16, overflow: 'hidden', minWidth: 92 },
  statLabel: { color: '#fff', fontWeight: '800', fontSize: 11, textTransform: 'uppercase', textAlign: 'center', paddingVertical: 3 },
  statValue: { fontWeight: '800', fontSize: 20, textAlign: 'center', paddingVertical: 12, paddingHorizontal: 6 },
  reward: { fontWeight: '800', fontSize: 15, textAlign: 'center' },
  drop: { alignSelf: 'stretch', alignItems: 'center', borderWidth: 3, borderRadius: 24, padding: 14, backgroundColor: 'rgba(14,11,46,0.95)', gap: 2 },
  dropTitle: { color: '#ffd400', fontWeight: '800', fontSize: 18 },
  dropName: { color: '#fff', fontWeight: '800', fontSize: 18 },
  dropRarity: { fontWeight: '800', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },
})
