import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, BackHandler, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native'
import { Alien, ParallelBackdrop, Planet, SpaceBackdrop, Stars } from '../art/Art'
import { FlyingShip } from '../art/FlyingShip'
import { Warp } from '../art/Warp'
import { getUnits, type Unit } from '../lib/exercises'
import { useApp } from '../store'

const offsets = [0, 52, 84, 52, 0, -52, -84, -52]
const GALAXIES = [
  { name: 'Via Láctea', distance: 'Nossa casa' },
  { name: 'Grande Nuvem de Magalhães', distance: 'a 160 mil anos-luz da Terra' },
  { name: 'Pequena Nuvem de Magalhães', distance: 'a 200 mil anos-luz da Terra' },
  { name: 'Andrômeda', distance: 'a 2,5 milhões de anos-luz da Terra' },
  { name: 'Triângulo', distance: 'a 2,7 milhões de anos-luz da Terra' },
  { name: 'Galáxia de Bode', distance: 'a 12 milhões de anos-luz da Terra' },
  { name: 'Cata-vento', distance: 'a 21 milhões de anos-luz da Terra' },
  { name: 'Redemoinho', distance: 'a 23 milhões de anos-luz da Terra' },
  { name: 'Sombreiro', distance: 'a 29 milhões de anos-luz da Terra' },
]
const accents = ['#7ee081', '#9fe3ff', '#ffd24a', '#ff8fa3', '#b58cff']
const neonAccents = ['#ff2bd6', '#00f0ff', '#fff200', '#39ff88']
let lastParallel = false
let lastTheme: number | null = null

export function PathScreen({ onStart }: { onStart: (unit: number, lessonId: string) => void }) {
  const { duo } = useApp()
  const units = useMemo(getUnits, [])
  const core = useMemo(() => units.filter(u => !u.optional), [units])
  const themes = useMemo(() => units.filter(u => u.optional), [units])
  const order = useMemo(() => core.flatMap(u => u.skills.map(k => k.id)), [core])

  const [size, setSize] = useState({ w: 360, h: 1200 })
  const [area, setArea] = useState({ w: 360, h: 640 })
  const [topH, setTopH] = useState(52)
  const [parallel, setParallel] = useState(lastParallel)
  const [theme, setTheme] = useState<number | null>(lastTheme)
  const [warp, setWarp] = useState<null | 'in' | 'out'>(null)
  const [activeY, setActiveY] = useState<number | null>(null)

  const float = useRef(new Animated.Value(0)).current
  const boost = useRef(new Animated.Value(0)).current
  const scrollY = useRef(new Animated.Value(0)).current
  const boosting = useRef(false)
  const calm = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lay = useRef({ unit: {} as Record<number, number>, nodes: {} as Record<number, number>, node: {} as Record<string, number> }).current

  const allCore = useMemo(() => core.flatMap(u => u.skills), [core])
  const activeSkill = allCore.find(k => !duo.completed[k.id]) ?? allCore[allCore.length - 1]
  const activeOff = activeSkill ? offsets[activeSkill.index % offsets.length] : 0

  function recalc() {
    if (!activeSkill) return
    const a = lay.unit[activeSkill.unit]
    const b = lay.nodes[activeSkill.unit]
    const c = lay.node[activeSkill.id]
    if (a !== undefined && b !== undefined && c !== undefined) setActiveY(a + b + c)
  }

  useEffect(() => {
    lastParallel = parallel
    lastTheme = theme
  }, [parallel, theme])

  useEffect(() => {
    recalc()
  }, [activeSkill?.id, parallel])

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (warp) return true
      if (parallel && theme !== null) {
        setTheme(null)
        return true
      }
      if (parallel) {
        setWarp('out')
        return true
      }
      return false
    })
    return () => sub.remove()
  }, [parallel, theme, warp])

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -7, duration: 900, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [])

  function state(id: string): 'done' | 'active' | 'locked' {
    if (duo.completed[id]) return 'done'
    const i = order.indexOf(id)
    if (i === -1) return 'active'
    if (i === 0) return 'active'
    return duo.completed[order[i - 1]] ? 'active' : 'locked'
  }

  const onScrollEvent = () => {
    if (!boosting.current) {
      boosting.current = true
      Animated.timing(boost, { toValue: 1, duration: 140, useNativeDriver: true }).start()
    }
    if (calm.current) clearTimeout(calm.current)
    calm.current = setTimeout(() => {
      boosting.current = false
      Animated.timing(boost, { toValue: 0, duration: 500, useNativeDriver: true }).start()
    }, 180)
  }
  const parallaxY = scrollY.interpolate({ inputRange: [0, 2400], outputRange: [0, -180], extrapolate: 'clamp' })

  const onLayout = (e: LayoutChangeEvent) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })
  const togglePortal = () => {
    if (!warp) setWarp(parallel ? 'out' : 'in')
  }

  const themeUnit = themes.find(u => u.level === theme) ?? null
  const extrasDone = themes.reduce((n, u) => n + u.skills.filter(k => duo.completed[k.id]).length, 0)
  const extrasTotal = themes.reduce((n, u) => n + u.skills.length, 0)

  let planetIndex = 0

  const minY = topH + 4
  const maxY = area.h - 78
  const restY = (activeY ?? 0) + topH + 6
  const shipY = scrollY.interpolate({
    inputRange: [restY - maxY, restY - minY],
    outputRange: [maxY, minY],
    extrapolate: 'clamp',
  })
  const shipLeft = activeOff >= 0 ? area.w / 2 + activeOff - 163 : area.w / 2 + activeOff + 97

  function unitBlock(u: Unit, ui: number, accent: string, gal: { name: string; distance: string } | undefined) {
    const done = u.skills.filter(k => duo.completed[k.id]).length
    return (
      <View
        key={u.level}
        style={{ marginBottom: 30 }}
        onLayout={e => {
          lay.unit[u.level] = e.nativeEvent.layout.y
          recalc()
        }}
      >
        <View style={[s.banner, { borderColor: accent }, parallel && s.bannerNeon]}>
          <View style={{ flex: 1 }}>
            <Text style={[s.bannerLabel, { color: accent }]}>{gal?.name ?? `Galáxia ${u.label}`}</Text>
            <Text style={s.bannerDist}>{gal?.distance ?? ''}</Text>
            <Text style={s.bannerTitle}>{u.title}</Text>
          </View>
          <Text style={[s.bannerCount, parallel && { color: accent }]}>{done}/{u.skills.length}</Text>
        </View>

        <View
          style={s.nodes}
          onLayout={e => {
            lay.nodes[u.level] = e.nativeEvent.layout.y
            recalc()
          }}
        >
          {u.skills.map(k => {
            const st = state(k.id)
            const off = offsets[k.index % offsets.length]
            const variant = planetIndex++ + (parallel ? ui : 0)
            const info = duo.completed[k.id]
            return (
              <View
                key={k.id}
                style={[s.node, { transform: [{ translateX: off }] }]}
                onLayout={e => {
                  lay.node[k.id] = e.nativeEvent.layout.y
                  recalc()
                }}
              >
                <Pressable
                  disabled={st === 'locked'}
                  onPress={() => onStart(k.unit, k.lessonId)}
                  style={({ pressed }) => [{ opacity: st === 'locked' ? 0.7 : 1 }, pressed && { transform: [{ scale: 0.94 }] }]}
                  accessibilityLabel={k.title}
                >
                  <Planet size={84} variant={variant} state={st} neon={parallel} />
                </Pressable>
                <Text style={[s.name, parallel && s.neonName, st === 'locked' && { opacity: 0.55 }]} numberOfLines={2}>{k.title}</Text>
                {st === 'active' && !u.optional && <Text style={s.go}>Toque para viajar</Text>}
                {info ? <Text style={s.best}>★ {info.best}%</Text> : null}
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  const scrollKey = `${parallel}-${theme}`

  return (
    <View style={[s.root, parallel && { backgroundColor: '#12002b' }]} onLayout={onLayout}>
      {parallel && <ParallelBackdrop width={area.w} height={area.h} />}
      {!parallel && (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { transform: [{ translateY: parallaxY }] }]}>
          <SpaceBackdrop width={area.w} height={area.h} />
        </Animated.View>
      )}

      <View style={s.topRow} onLayout={e => setTopH(e.nativeEvent.layout.height)}>
        <View style={s.titleWrap}>
          {parallel && <Alien size={34} mood="cool" />}
          <Text style={[s.topTitle, parallel && s.neonTitle]} numberOfLines={1}>
            {parallel ? (themeUnit ? themeUnit.title : 'Universo paralelo') : 'Minha jornada'}
          </Text>
        </View>
        <Pressable
          onPress={togglePortal}
          disabled={!!warp}
          accessibilityLabel={parallel ? 'Voltar à trilha' : 'Abrir universo paralelo'}
          style={({ pressed }) => [s.portal, parallel && s.portalBack, pressed && { opacity: 0.85 }]}
        >
          <Text style={s.portalIcon}>{parallel ? '🚀' : '🌀'}</Text>
          <Text style={s.portalText}>{parallel ? 'Voltar à trilha' : 'Universo paralelo'}</Text>
          {!parallel && <Text style={s.portalCount}>{extrasDone}/{extrasTotal}</Text>}
        </Pressable>
      </View>

      {parallel && themeUnit && (
        <Pressable onPress={() => setTheme(null)} style={s.backTheme}>
          <Text style={s.backThemeText}>‹ Todos os temas</Text>
        </Pressable>
      )}

      <Animated.ScrollView
        key={scrollKey}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true, listener: onScrollEvent })}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={(w, h) => setSize({ w, h })}
      >
        {!parallel && <Stars width={size.w} height={size.h} count={Math.round(size.h / 22)} />}
        {parallel && <Stars width={size.w} height={size.h} count={Math.round(size.h / 40)} neon />}

        {!parallel && core.map((u, ui) => unitBlock(u, ui, accents[ui % accents.length], GALAXIES[ui]))}

        {parallel && !themeUnit && (
          <View>
            <Text style={s.hubIntro}>Escolha um tema e estude a fundo, na ordem que quiser.</Text>
            {themes.map((u, i) => {
              const accent = neonAccents[i % neonAccents.length]
              const done = u.skills.filter(k => duo.completed[k.id]).length
              return (
                <Pressable
                  key={u.level}
                  onPress={() => setTheme(u.level)}
                  style={({ pressed }) => [s.hubCard, { borderColor: accent }, pressed && { transform: [{ scale: 0.98 }] }]}
                >
                  <View style={s.cluster}>
                    <Planet size={58} variant={i} neon />
                    <View style={s.clusterSmall}><Planet size={34} variant={i + 2} neon /></View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.hubLabel, { color: accent }]}>Sistema {u.emoji}</Text>
                    <Text style={s.hubTitle}>{u.title}</Text>
                    <Text style={s.hubDesc}>{u.description}</Text>
                    <View style={s.hubBar}>
                      <View style={[s.hubFill, { backgroundColor: accent, width: `${(done / u.skills.length) * 100}%` }]} />
                    </View>
                    <Text style={[s.hubCount, { color: accent }]}>{done}/{u.skills.length} planetas</Text>
                  </View>
                </Pressable>
              )
            })}
          </View>
        )}

        {parallel && themeUnit && unitBlock(themeUnit, themes.indexOf(themeUnit), neonAccents[themes.indexOf(themeUnit) % neonAccents.length], {
          name: 'Sistema paralelo',
          distance: themeUnit.description,
        })}

        <Text style={[s.end, parallel && { color: '#ff9bec' }]}>
          {parallel ? 'Estude o que quiser, na ordem que quiser 🌀' : 'Mais galáxias em breve 🌌'}
        </Text>
      </Animated.ScrollView>

      {!parallel && !warp && activeY !== null && (
        <Animated.View
          pointerEvents="none"
          style={[s.shipOverlay, { left: shipLeft, transform: [{ translateY: shipY }] }]}
        >
          <Animated.View style={{ transform: [{ translateY: float }] }}>
            <FlyingShip size={66} boost={boost} />
          </Animated.View>
        </Animated.View>
      )}

      {warp && (
        <Warp
          key={warp}
          dir={warp}
          width={area.w}
          height={area.h}
          onPeak={() => {
            setParallel(warp === 'in')
            if (warp === 'out') setTheme(null)
          }}
          onDone={() => setWarp(null)}
        />
      )}
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0e0b2e', overflow: 'hidden' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  topTitle: { color: '#fff', fontSize: 18, fontWeight: '800', textShadowColor: '#05031a', textShadowRadius: 6, flexShrink: 1 },
  neonTitle: { color: '#ff7bf0', textShadowColor: '#ff2bd6', textShadowRadius: 10 },
  portal: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#6c4bff', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 2, borderColor: '#b58cff' },
  portalBack: { backgroundColor: '#e8272b', borderColor: '#ff8fa3' },
  portalIcon: { fontSize: 16 },
  portalText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  portalCount: { color: '#ffd400', fontWeight: '800', fontSize: 12 },
  backTheme: { alignSelf: 'flex-start', marginLeft: 16, marginTop: 4, backgroundColor: 'rgba(18,0,43,0.85)', borderRadius: 999, borderWidth: 2, borderColor: '#00f0ff', paddingVertical: 5, paddingHorizontal: 12 },
  backThemeText: { color: '#00f0ff', fontWeight: '800', fontSize: 13 },
  scroll: { padding: 16, paddingBottom: 110 },
  hubIntro: { color: '#ffe9ff', fontWeight: '700', fontSize: 14, marginBottom: 16, textShadowColor: '#05031a', textShadowRadius: 6 },
  hubCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 3, borderRadius: 24, padding: 14, marginBottom: 16, backgroundColor: 'rgba(18,0,43,0.88)' },
  cluster: { width: 76, height: 76 },
  clusterSmall: { position: 'absolute', right: -6, bottom: -4 },
  hubLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  hubTitle: { color: '#fff', fontSize: 19, fontWeight: '800' },
  hubDesc: { color: '#c9b8ff', fontSize: 12, fontWeight: '600', marginTop: 2 },
  hubBar: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.15)', marginTop: 8, overflow: 'hidden' },
  hubFill: { height: '100%', borderRadius: 3 },
  hubCount: { fontSize: 12, fontWeight: '800', marginTop: 4 },
  banner: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderRadius: 18, padding: 14, marginBottom: 22, backgroundColor: 'rgba(14,11,46,0.88)' },
  bannerNeon: { backgroundColor: 'rgba(18,0,43,0.85)', borderWidth: 3 },
  bannerLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1, textShadowColor: '#05031a', textShadowRadius: 6, textTransform: 'uppercase' },
  bannerDist: { color: '#a9a6d6', fontSize: 12, fontWeight: '700', marginBottom: 2, textShadowColor: '#05031a', textShadowRadius: 6 },
  bannerTitle: { color: '#fff', fontSize: 19, fontWeight: '800', textShadowColor: '#05031a', textShadowRadius: 6 },
  bannerCount: { color: '#fff', fontSize: 16, fontWeight: '800', opacity: 0.8 },
  nodes: { alignItems: 'center', gap: 22 },
  node: { alignItems: 'center', width: 150 },
  shipOverlay: { position: 'absolute', top: 0, width: 66, height: 66 },
  name: { color: '#fff', fontSize: 14, fontWeight: '800', textAlign: 'center', marginTop: 4, textShadowColor: '#05031a', textShadowRadius: 8 },
  neonName: { color: '#ffe9ff', textShadowColor: '#ff2bd6', textShadowRadius: 8 },
  go: { color: '#ffd400', fontSize: 12, fontWeight: '800', marginTop: 2 },
  best: { color: '#9fe3ff', fontSize: 12, fontWeight: '800', marginTop: 2 },
  end: { color: '#9a9ac4', textAlign: 'center', fontWeight: '700', paddingVertical: 12 },
})
