import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { api } from '../api'
import { Btn, Card } from '../components/ui'
import { useApp } from '../store'
import { brand, useTheme } from '../theme'

function useNow() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function ShopScreen() {
  const t = useTheme()
  const { duo, refill, refresh } = useApp()
  const now = useNow()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { refresh() }, [refresh])

  let remaining = ''
  if (duo.nextHeartAt && duo.hearts < duo.maxHearts) {
    const ms = Math.max(0, duo.nextHeartAt - now)
    const p = (n: number) => String(n).padStart(2, '0')
    remaining = ` Próxima vida em ${Math.floor(ms / 3_600_000)}h ${p(Math.floor((ms % 3_600_000) / 60_000))}m ${p(Math.floor((ms % 60_000) / 1000))}s.`
  }

  async function buy() {
    setBusy(true)
    setError('')
    try {
      await refill()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <View style={s.page}>
      <Text style={[s.h1, { color: t.text }]}>Loja</Text>
      <Card style={s.item}>
        <Text style={s.emoji}>❤️</Text>
        <View style={{ flex: 1 }}>
          <Text style={[s.name, { color: t.text }]}>Recarregar vidas</Text>
          <Text style={[s.desc, { color: t.muted }]}>Você tem {duo.hearts}/{duo.maxHearts} vidas.{remaining}</Text>
          {error ? <Text style={s.err}>{error}</Text> : null}
        </View>
      </Card>
      <Btn
        label={`Recarregar por 💎 ${duo.heartGemCost}`}
        disabled={busy || duo.hearts >= duo.maxHearts || duo.gems < duo.heartGemCost}
        onPress={buy}
      />
      <Card style={[s.item, { marginTop: 20 }]}>
        <Text style={s.emoji}>💎</Text>
        <View style={{ flex: 1 }}>
          <Text style={[s.name, { color: t.text }]}>Suas gemas: {duo.gems}</Text>
          <Text style={[s.desc, { color: t.muted }]}>Ganhe 5 gemas por lição (8 se acertar tudo de primeira).</Text>
        </View>
      </Card>
    </View>
  )
}

interface Entry { userId: string; name: string; weeklyXp: number; streak: number; isMe: boolean }

export function RankingScreen() {
  const t = useTheme()
  const [rows, setRows] = useState<Entry[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<Entry[]>('/api/leaderboard').then(setRows).catch(e => setError(e.message))
  }, [])

  if (error) return <Text style={[s.err, { padding: 24 }]}>{error}</Text>
  if (!rows) return <ActivityIndicator style={{ marginTop: 40 }} color={brand.primary} />

  return (
    <View style={s.page}>
      <Text style={[s.h1, { color: t.text }]}>Ranking da semana</Text>
      <FlatList
        data={rows}
        keyExtractor={r => r.userId}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item, index }) => (
          <Card style={[s.row, item.isMe && { borderColor: brand.accent }]}>
            <Text style={[s.pos, { color: index < 3 ? brand.goldDark : t.muted }]}>{index + 1}</Text>
            <Text style={[s.name, { color: t.text, flex: 1 }]} numberOfLines={1}>{item.name}</Text>
            <Text style={[s.desc, { color: t.muted }]}>🔥 {item.streak}</Text>
            <Text style={[s.xp, { color: brand.goldDark }]}>⚡ {item.weeklyXp}</Text>
          </Card>
        )}
      />
    </View>
  )
}

export function ProfileScreen({ onOpenTester, onOpenHangar }: { onOpenTester?: () => void; onOpenHangar?: () => void }) {
  const t = useTheme()
  const { stats, duo, logout } = useApp()
  return (
    <View style={s.page}>
      <Text style={[s.h1, { color: t.text }]}>Perfil</Text>
      <Card style={{ gap: 8 }}>
        <Text style={[s.name, { color: t.text }]}>⚡ {stats.xp} XP no total</Text>
        <Text style={[s.name, { color: t.text }]}>🔥 {stats.streak} dias de sequência</Text>
        <Text style={[s.name, { color: t.text }]}>📅 {stats.weeklyXp} XP esta semana</Text>
        <Text style={[s.name, { color: t.text }]}>⭐ {Object.keys(duo.completed).length} lições concluídas</Text>
      </Card>
      {onOpenHangar ? <Btn label="🛠️ Hangar da nave" onPress={onOpenHangar} style={{ marginTop: 24 }} /> : null}
      {onOpenTester ? <Btn label="🎮 Testar desafios" tone="blue" onPress={onOpenTester} style={{ marginTop: 14 }} /> : null}
      <Btn label="Reiniciar progresso" tone="ghost" onPress={logout} style={{ marginTop: 14 }} />
    </View>
  )
}

const s = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  h1: { fontSize: 26, fontWeight: '800', marginBottom: 16 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  emoji: { fontSize: 40 },
  name: { fontSize: 17, fontWeight: '800' },
  desc: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  err: { color: brand.red, fontWeight: '800', marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  pos: { width: 28, fontWeight: '800', fontSize: 18, textAlign: 'center' },
  xp: { fontWeight: '800', fontSize: 16 },
})
