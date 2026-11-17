import React, { useEffect, useRef, useState } from 'react'
import { Animated, BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Alien, Ship, Stars } from '../art/Art'
import { Btn } from '../components/ui'
import { shuffle } from '../lib/exercises'
import { DEFAULT_PARTS, lookWith, PARTS, partById, PRICE, RARITY_COLOR, RARITY_LABEL, resolveLook, SLOTS, type Slot } from '../lib/parts'
import { useApp } from '../store'
import { SPACE_BG, SpaceProvider, useTheme } from '../theme'

export function HangarScreen({ onExit }: { onExit: () => void }) {
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
  const { duo, equip, buyPart } = useApp()
  const [slot, setSlot] = useState<Slot>('hull')
  const [preview, setPreview] = useState<Partial<Record<Slot, string>>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const float = useRef(new Animated.Value(0)).current
  const pop = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -8, duration: 1000, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
    )
    loop.start()
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onExit()
      return true
    })
    return () => {
      loop.stop()
      sub.remove()
    }
  }, [])

  const owned = new Set([...DEFAULT_PARTS, ...duo.parts])
  const list = PARTS.filter(p => p.slot === slot)
  const shown = { ...duo.equipped, ...preview }
  const hasPreview = Object.entries(preview).some(([k, v]) => duo.equipped[k] !== v)
  const sel = selected ? partById(selected) : undefined

  const bump = () => {
    pop.setValue(0.85)
    Animated.spring(pop, { toValue: 1, friction: 4, useNativeDriver: true }).start()
  }

  async function tap(id: string) {
    const p = partById(id)!
    setSelected(id)
    setMsg('')
    setPreview(prev => ({ ...prev, [p.slot]: id }))
    bump()
    if (owned.has(id) && duo.equipped[p.slot] !== id) {
      try {
        await equip(id)
        setPreview(prev => {
          const n = { ...prev }
          delete n[p.slot]
          return n
        })
      } catch (e: any) {
        setMsg(e.message)
      }
    }
  }

  async function buy() {
    if (!sel) return
    setBusy(true)
    setMsg('')
    try {
      await buyPart(sel.id)
      setPreview(prev => {
        const n = { ...prev }
        delete n[sel.slot]
        return n
      })
      setMsg(`🎉 ${sel.name} é sua!`)
      bump()
    } catch (e: any) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  function randomize() {
    const combo: Partial<Record<Slot, string>> = {}
    SLOTS.forEach(sl => {
      const pool = PARTS.filter(p => p.slot === sl.id && !p.id.endsWith('-none'))
      combo[sl.id] = shuffle(pool)[0]?.id
    })
    setPreview(combo)
    setSelected(null)
    setMsg('🎲 Nave sorteada! Toque nas peças para equipar ou comprar.')
    bump()
  }

  const total = PARTS.length
  const have = PARTS.filter(p => owned.has(p.id)).length
  const selOwned = sel ? owned.has(sel.id) : false
  const price = sel ? PRICE[sel.rarity] : 0

  return (
    <View style={{ flex: 1 }}>
      <View style={s.top}>
        <Text style={[s.title, { color: t.text }]}>🛠️ Hangar</Text>
        <Text style={s.gems}>💎 {duo.gems}</Text>
        <Text onPress={onExit} style={[s.close, { color: t.muted }]}>✕</Text>
      </View>

      <View style={s.preview}>
        <Animated.View style={{ transform: [{ translateY: float }, { scale: pop }] }}>
          <Ship size={180} look={resolveLook(shown)} />
          <View style={s.pilot}><Alien size={60} mood={hasPreview ? 'wow' : 'happy'} /></View>
        </Animated.View>
        <Text style={[s.count, { color: t.muted }]}>Peças {have}/{total} {hasPreview ? '· prévia' : ''}</Text>
      </View>

      <View style={s.actions}>
        <Pressable onPress={randomize} style={[s.small, { borderColor: '#ff2bd6' }]}>
          <Text style={s.smallText}>🎲 Sortear nave</Text>
        </Pressable>
        {hasPreview ? (
          <Pressable onPress={() => { setPreview({}); setSelected(null); setMsg('') }} style={[s.small, { borderColor: '#9fe3ff' }]}>
            <Text style={s.smallText}>↺ Voltar à minha</Text>
          </Pressable>
        ) : null}
      </View>

      {sel ? (
        <View style={[s.panel, { borderColor: RARITY_COLOR[sel.rarity] }]}>
          <View style={{ flex: 1 }}>
            <Text style={s.panelName}>{sel.name}</Text>
            <Text style={[s.panelRarity, { color: RARITY_COLOR[sel.rarity] }]}>{RARITY_LABEL[sel.rarity]}</Text>
          </View>
          {selOwned ? (
            <Text style={s.equipped}>{duo.equipped[sel.slot] === sel.id ? '✓ Equipada' : 'Equipando…'}</Text>
          ) : (
            <Btn label={`Comprar 💎 ${price}`} disabled={busy || duo.gems < price} onPress={buy} style={{ paddingVertical: 10, paddingHorizontal: 16 }} />
          )}
        </View>
      ) : null}
      {msg ? <Text style={s.msg}>{msg}</Text> : null}

      <View style={s.tabs}>
        {SLOTS.map(sl => (
          <Pressable key={sl.id} onPress={() => setSlot(sl.id)} style={[s.tab, slot === sl.id && s.tabOn]}>
            <Text style={{ fontSize: 17 }}>{sl.icon}</Text>
            <Text style={[s.tabText, slot === sl.id && { color: '#fff' }]}>{sl.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.grid}>
        {list.map(p => {
          const has = owned.has(p.id)
          const on = duo.equipped[p.slot] === p.id
          const viewing = shown[p.slot] === p.id
          return (
            <Pressable
              key={p.id}
              onPress={() => tap(p.id)}
              style={({ pressed }) => [
                s.tile,
                { borderColor: viewing ? '#ffffff' : RARITY_COLOR[p.rarity], backgroundColor: t.surface },
                viewing && { borderWidth: 4 },
                pressed && { transform: [{ scale: 0.96 }] },
              ]}
            >
              <View style={!has && { opacity: 0.55 }}>
                <Ship size={64} look={lookWith(duo.equipped, p.id)} />
              </View>
              <Text style={[s.name, { color: t.text }]} numberOfLines={2}>{p.name}</Text>
              <Text style={[s.rarity, { color: RARITY_COLOR[p.rarity] }]}>{RARITY_LABEL[p.rarity]}</Text>
              {on ? <Text style={s.on}>✓ Equipada</Text> : has ? <Text style={s.use}>Usar</Text> : <Text style={s.price}>🔒 💎 {PRICE[p.rarity]}</Text>}
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 14 },
  title: { fontSize: 22, fontWeight: '800', flex: 1 },
  gems: { color: '#9fe3ff', fontWeight: '800', fontSize: 17 },
  close: { fontSize: 24, fontWeight: '800' },
  preview: { alignItems: 'center', paddingTop: 4 },
  pilot: { position: 'absolute', top: 10, left: 60 },
  count: { fontWeight: '700', fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 8 },
  small: { borderWidth: 2, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14, backgroundColor: 'rgba(14,11,46,0.9)' },
  smallText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  panel: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 14, marginTop: 10, borderWidth: 3, borderRadius: 18, padding: 10, backgroundColor: 'rgba(14,11,46,0.95)' },
  panelName: { color: '#fff', fontWeight: '800', fontSize: 16 },
  panelRarity: { fontWeight: '800', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 },
  equipped: { color: '#7ee081', fontWeight: '800', fontSize: 14 },
  msg: { color: '#ffd400', fontWeight: '800', textAlign: 'center', marginTop: 6, paddingHorizontal: 16 },
  tabs: { flexDirection: 'row', gap: 5, paddingHorizontal: 10, marginTop: 10 },
  tab: { flex: 1, alignItems: 'center', borderRadius: 14, paddingVertical: 6, borderWidth: 2, borderColor: '#3a3478' },
  tabOn: { backgroundColor: '#5b4bff', borderColor: '#9fe3ff' },
  tabText: { color: '#a9a6d6', fontWeight: '800', fontSize: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 14, justifyContent: 'center' },
  tile: { width: '30%', borderWidth: 3, borderRadius: 18, padding: 8, alignItems: 'center' },
  name: { fontWeight: '800', fontSize: 12, textAlign: 'center', marginTop: 2 },
  rarity: { fontWeight: '800', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6 },
  on: { color: '#7ee081', fontWeight: '800', fontSize: 11, marginTop: 2 },
  use: { color: '#9fe3ff', fontWeight: '800', fontSize: 11, marginTop: 2 },
  price: { color: '#ffd400', fontWeight: '800', fontSize: 11, marginTop: 2 },
})
