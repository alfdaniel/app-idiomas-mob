import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ConfirmModal } from '../components/ConfirmModal'
import { BlankExercise, BuildExercise, ChoiceExercise, ListenExercise, MatchExercise } from '../components/exercises'
import { Alien } from '../art/Art'
import { Btn } from '../components/ui'
import { TheoryView } from '../components/TheoryView'
import { buildLessonExercises, findLesson, getHint, getTheorySlides, skillId, type CheckResult, type Exercise } from '../lib/exercises'
import { ChallengeScreen } from '../challenge/ChallengeScreen'
import { buildGame, suggestMode, type ChallengeResult } from '../lib/challenge'
import { useApp, type BonusResult, type LessonResult } from '../store'
import { brand, SPACE_BG, SpaceProvider, useTheme } from '../theme'
import { Planet, Ship, Stars } from '../art/Art'

const praises = ['Muito bem!', 'Excelente!', 'Isso aí!', 'Perfeito!', 'Mandou bem!']

export function LessonScreen(props: { unit: number; lessonId: string; onExit: () => void }) {
  const [size, setSize] = useState({ w: 400, h: 900 })
  return (
    <SpaceProvider>
      <View
        style={{ flex: 1, backgroundColor: SPACE_BG }}
        onLayout={e => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      >
        <Stars width={size.w} height={size.h} count={46} />
        <LessonInner {...props} />
      </View>
    </SpaceProvider>
  )
}

function LessonInner({ unit, lessonId, onExit }: { unit: number; lessonId: string; onExit: () => void }) {
  const t = useTheme()
  const app = useApp()
  const beginner = unit >= 100
  const lesson = useMemo(() => findLesson(unit, lessonId), [unit, lessonId])
  const initial = useMemo(() => (lesson ? buildLessonExercises(lesson, beginner ? 6 : 10) : []), [lesson])

  const [queue, setQueue] = useState<Exercise[]>(initial)
  const [step, setStep] = useState(0)
  const [ready, setReady] = useState(false)
  const [feedback, setFeedback] = useState<CheckResult | null>(null)
  const theory = useMemo(() => (lesson ? getTheorySlides(lesson) : []), [lesson])
  const [phase, setPhase] = useState<'learn' | 'play' | 'challenge' | 'done' | 'failed'>(theory.length ? 'learn' : 'play')
  const [result, setResult] = useState<LessonResult | null>(null)
  const [bonus, setBonus] = useState<BonusResult | null>(null)
  const game = useMemo(() => (lesson ? buildGame(lesson) : null), [lesson])
  const finaleMode = useMemo(() => (game ? suggestMode(game) : undefined), [game])
  const [answeredRight, setAnsweredRight] = useState(0)
  const [gaveUp, setGaveUp] = useState(0)
  const [hintOpen, setHintOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const mistakes = useRef(new Map<Exercise, number>())
  const [refillError, setRefillError] = useState('')
  const firstTry = useRef(0)
  const retried = useRef(new Set<Exercise>())
  const checkRef = useRef<(() => CheckResult) | null>(null)

  const current = queue[step]
  const progress = initial.length ? ((answeredRight + gaveUp) / initial.length) * 100 : 0
  const hint = current ? getHint(current) : null
  const locked = !!feedback

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (phase === 'play') leave()
      else if (phase === 'challenge') setPhase('done')
      else onExit()
      return true
    })
    return () => sub.remove()
  }, [phase])

  async function verify() {
    if (!checkRef.current || !current) return
    const res = checkRef.current()
    setFeedback(res)
    if (res.correct) {
      setAnsweredRight(n => n + 1)
      if (!retried.current.has(current)) firstTry.current++
    } else {
      retried.current.add(current)
      const n = (mistakes.current.get(current) ?? 0) + 1
      mistakes.current.set(current, n)
      if (n < 2) setQueue(q => [...q, current])
      else setGaveUp(g => g + 1)
      if (!beginner) await app.loseHeart()
    }
  }

  async function next() {
    if (!beginner && feedback && !feedback.correct && app.duo.hearts === 0) {
      setPhase('failed')
      return
    }
    setFeedback(null)
    setReady(false)
    setHintOpen(false)
    if (step + 1 >= queue.length) {
      try {
        setResult(await app.completeLesson(skillId(unit, lessonId), firstTry.current, initial.length))
      } catch {
        setResult({ xpEarned: 0, gemsEarned: 0, accuracy: Math.round((firstTry.current / initial.length) * 100), perfect: false })
      }
      setPhase(game && game.modes.length ? 'challenge' : 'done')
      return
    }
    setStep(step + 1)
  }

  async function claim(r: ChallengeResult): Promise<BonusResult | null> {
    try {
      const b = await app.claimBonus(skillId(unit, lessonId), r.correct, r.total, r.bestCombo, r.calm)
      setBonus(prev => ({
        xp: (prev?.xp ?? 0) + b.xp,
        gems: (prev?.gems ?? 0) + b.gems,
        capped: b.capped && !(prev && prev.xp > 0),
        drop: b.drop ?? prev?.drop ?? null,
      }))
      return b
    } catch {
      return null
    }
  }

  function leave() {
    setLeaveOpen(true)
  }

  async function refill() {
    setRefillError('')
    try {
      await app.refill()
    } catch (e: any) {
      setRefillError(e.message)
    }
  }

  if (!lesson) {
    return (
      <Center>
        <Text style={[s.h1, { color: t.text }]}>Lição não encontrada</Text>
        <Btn label="Voltar" onPress={onExit} style={s.wide} />
      </Center>
    )
  }

  if (phase === 'learn') {
    return <TheoryView slides={theory} onDone={() => setPhase('play')} />
  }

  if (phase === 'challenge') {
    return (
      <ChallengeScreen
        data={game!}
        speed={beginner ? 'easy' : 'normal'}
        autoMode={finaleMode}
        finale
        onRun={claim}
        onDone={() => setPhase('done')}
        onSkip={() => setPhase('done')}
      />
    )
  }

  if (phase === 'done') {
    return (
      <Center>
        <Alien size={120} mood="wow" />
        <Text style={[s.h1, { color: t.text }]}>Lição concluída!</Text>
        <View style={s.results}>
          <Result label="XP" value={`⚡ ${result?.xpEarned ?? 0}`} color={brand.gold} />
          <Result label="Gemas" value={`💎 ${result?.gemsEarned ?? 0}`} color={brand.accent} />
          <Result label="Precisão" value={`🎯 ${result?.accuracy ?? 0}%`} color={brand.primary} />
        </View>
        {bonus ? (
          <Text style={[s.muted, { color: bonus.capped ? t.muted : '#7ee081' }]}>
            {bonus.capped ? 'Bônus do desafio já usado hoje nesta lição' : `Bônus do desafio: ⚡ +${bonus.xp}  💎 +${bonus.gems}`}
          </Text>
        ) : null}
        <Btn label="Continuar" onPress={onExit} style={s.wide} />
      </Center>
    )
  }

  if (phase === 'failed' || (!beginner && app.duo.hearts === 0)) {
    return (
      <Center>
        <Text style={{ fontSize: 84 }}>💔</Text>
        <Text style={[s.h1, { color: t.text }]}>Você ficou sem vidas</Text>
        <Text style={[s.muted, { color: t.muted }]}>Uma vida volta a cada 4 horas. Ou recarregue agora com gemas.</Text>
        {refillError ? <Text style={s.err}>{refillError}</Text> : null}
        <Btn label={`Recarregar por 💎 ${app.duo.heartGemCost}`} disabled={app.duo.gems < app.duo.heartGemCost} onPress={refill} style={s.wide} />
        <Btn label="Voltar à trilha" tone="ghost" onPress={onExit} style={s.wide} />
      </Center>
    )
  }

  const props = { locked, onReady: setReady, checkRef }
  const ok = feedback?.correct

  return (
    <View style={{ flex: 1 }}>
      <ConfirmModal
        visible={leaveOpen}
        title="Sair da lição?"
        message="Seu progresso nesta lição será perdido."
        cancelLabel="Continuar na lição"
        confirmLabel="Sair mesmo assim"
        onCancel={() => setLeaveOpen(false)}
        onConfirm={() => {
          setLeaveOpen(false)
          onExit()
        }}
      />
      <View style={s.top}>
        <Text onPress={leave} style={[s.close, { color: t.muted }]}>✕</Text>
        <View style={s.trackWrap}>
          <View style={[s.bar, { backgroundColor: t.border }]}>
            <View style={[s.fill, { width: `${progress}%` }]} />
          </View>
          <View pointerEvents="none" style={[s.shipPos, { left: `${Math.min(progress, 92)}%` }]}>
            <Ship size={30} flame={false} />
          </View>
          <View pointerEvents="none" style={s.goalPlanet}>
            <Planet size={30} variant={3} state="active" />
          </View>
        </View>
        {beginner ? <View style={{ width: 24 }} /> : <Text style={s.hearts}>❤️ {app.duo.hearts}</Text>}
      </View>

      <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
        {current?.kind === 'choice' && <ChoiceExercise key={step} ex={current} {...props} />}
        {current?.kind === 'blank' && <BlankExercise key={step} ex={current} {...props} />}
        {current?.kind === 'match' && <MatchExercise key={step} ex={current} {...props} />}
        {current?.kind === 'build' && <BuildExercise key={step} ex={current} {...props} />}
        {current?.kind === 'listen' && <ListenExercise key={step} ex={current} {...props} />}
        {!feedback && hint ? (
          <Text onPress={() => setHintOpen(v => !v)} style={[s.hintLink, { color: brand.primary }]}>
            {hintOpen ? `💡 ${hint}` : '💡 Preciso de uma dica'}
          </Text>
        ) : null}
      </ScrollView>

      <View style={[s.foot, { borderTopColor: t.border }, feedback && { backgroundColor: ok ? t.okBg : t.badBg, borderTopColor: ok ? t.okBg : t.badBg }]}>
        {feedback ? (
          <View style={s.fbRow}>
            <Alien size={52} mood={ok ? 'happy' : 'sad'} />
            <View style={{ flex: 1 }}>
              <Text style={[s.fbTitle, { color: ok ? t.okText : t.badText }]}>
                {ok ? praises[step % praises.length] : 'Resposta correta:'}
              </Text>
              {!ok && feedback.answer ? <Text style={[s.fbText, { color: t.badText }]}>{feedback.answer}</Text> : null}
              {feedback.explanation ? <Text style={[s.fbExp, { color: ok ? t.okText : t.badText }]}>{feedback.explanation}</Text> : null}
            </View>
          </View>
        ) : null}
        {feedback ? (
          <Btn label="Continuar" tone={ok ? 'green' : 'red'} onPress={next} />
        ) : (
          <Btn label="Verificar" disabled={!ready} onPress={verify} />
        )}
      </View>
    </View>
  )
}

function Center({ children }: { children: React.ReactNode }) {
  return <View style={s.center}>{children}</View>
}

function Result({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[s.res, { borderColor: color }]}>
      <Text style={[s.resLabel, { backgroundColor: color }]}>{label}</Text>
      <Text style={[s.resValue, { color }]}>{value}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  close: { fontSize: 24, fontWeight: '800' },
  trackWrap: { flex: 1, height: 34, justifyContent: 'center', marginRight: 18 },
  bar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#9fe3ff', borderRadius: 4 },
  shipPos: { position: 'absolute', top: 2, marginLeft: -4 },
  goalPlanet: { position: 'absolute', right: -20, top: 2 },
  hearts: { color: brand.red, fontWeight: '800', fontSize: 18 },
  body: { padding: 16, paddingBottom: 32 },
  foot: { borderTopWidth: 2, padding: 16, paddingBottom: 24 },
  fbRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  hintLink: { fontWeight: '800', fontSize: 14, marginTop: 24, textAlign: 'center' },
  fbTitle: { fontWeight: '800', fontSize: 20 },
  fbText: { fontWeight: '700', fontSize: 16, marginTop: 2 },
  fbExp: { fontWeight: '600', fontSize: 14, marginTop: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 },
  h1: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
  muted: { fontWeight: '700', textAlign: 'center' },
  err: { color: brand.red, fontWeight: '800' },
  wide: { alignSelf: 'stretch' },
  results: { flexDirection: 'row', gap: 12, marginVertical: 12 },
  res: { borderWidth: 2, borderRadius: 16, overflow: 'hidden', minWidth: 100 },
  resLabel: { color: '#fff', fontWeight: '800', fontSize: 12, textTransform: 'uppercase', textAlign: 'center', paddingVertical: 4 },
  resValue: { fontWeight: '800', fontSize: 20, textAlign: 'center', paddingVertical: 12, paddingHorizontal: 8 },
})
