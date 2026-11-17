import React, { useEffect, useState } from 'react'
import { ActivityIndicator, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { StatsBar } from './src/components/ui'
import { Btn } from './src/components/ui'
import { ChallengeTester } from './src/challenge/ChallengeTester'
import { HangarScreen } from './src/screens/HangarScreen'
import { LessonScreen } from './src/screens/LessonScreen'
import { PathScreen } from './src/screens/PathScreen'
import { ProfileScreen, RankingScreen, ShopScreen } from './src/screens/OtherScreens'
import { AppProvider, useApp } from './src/store'
import { brand, SPACE_BG, softShadow, useTheme } from './src/theme'

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <SafeAreaView style={{ flex: 1, padding: 24, justifyContent: 'center', gap: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: brand.red }}>Ops, algo quebrou</Text>
        <Text selectable style={{ fontWeight: '600' }}>{this.state.error.message}</Text>
        <Btn label="Tentar de novo" onPress={() => this.setState({ error: null })} />
      </SafeAreaView>
    )
  }
}

type Tab = 'path' | 'shop' | 'ranking' | 'profile'

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: 'path', icon: '🏠', label: 'Aprender' },
  { id: 'shop', icon: '🛒', label: 'Loja' },
  { id: 'ranking', icon: '🏆', label: 'Ranking' },
  { id: 'profile', icon: '👤', label: 'Perfil' },
]

function Root() {
  const t = useTheme()
  const app = useApp()
  const [tab, setTab] = useState<Tab>('path')
  const [lesson, setLesson] = useState<{ unit: number; lessonId: string } | null>(null)
  const [tester, setTester] = useState(false)
  const [hangar, setHangar] = useState(false)

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (lesson || tester || hangar) return false
      if (tab !== 'path') {
        setTab('path')
        return true
      }
      return false
    })
    return () => sub.remove()
  }, [lesson, tester, hangar, tab])

  if (!app.ready) {
    return <View style={[s.fill, { backgroundColor: t.bg, justifyContent: 'center' }]}><ActivityIndicator color={brand.primary} size="large" /></View>
  }

  return (
    <SafeAreaView style={[s.fill, { backgroundColor: lesson || tester || hangar ? SPACE_BG : t.bg }]}>
      {!app.loggedIn ? (
        <View style={[s.fill, { justifyContent: 'center', padding: 24, gap: 14 }]}>
          <Text style={{ fontSize: 48, fontWeight: '800', color: brand.primary, textAlign: 'center' }}>falaê</Text>
          <Text style={{ color: t.muted, fontWeight: '700', textAlign: 'center' }}>Sem conexão com o servidor</Text>
          <Btn label="Tentar de novo" onPress={() => { app.retry().catch(() => {}) }} />
        </View>
      ) : hangar ? (
        <HangarScreen onExit={() => setHangar(false)} />
      ) : tester ? (
        <ChallengeTester onExit={() => setTester(false)} />
      ) : lesson ? (
        <LessonScreen
          unit={lesson.unit}
          lessonId={lesson.lessonId}
          onExit={() => { setLesson(null); app.refresh() }}
        />
      ) : (
        <>
          <StatsBar streak={app.stats.streak} gems={app.duo.gems} hearts={app.duo.hearts} xp={app.stats.xp} />
          <View style={s.fill}>
            {tab === 'path' &&<PathScreen onStart={(unit, lessonId) => setLesson({ unit, lessonId })} />}
            {tab === 'shop' && <ShopScreen />}
            {tab === 'ranking' && <RankingScreen />}
            {tab === 'profile' && <ProfileScreen onOpenTester={() => setTester(true)} onOpenHangar={() => setHangar(true)} />}
          </View>
          <View style={[s.tabs, { backgroundColor: t.surface }, softShadow(t.shadow, 0.18)]}>
            {tabs.map(x => (
              <Pressable
                key={x.id}
                accessibilityLabel={x.label}
                onPress={() => setTab(x.id)}
                style={[s.tab, tab === x.id && { backgroundColor: t.selBg }]}
              >
                <Text style={{ fontSize: 22 }}>{x.icon}</Text>
                <Text style={[s.tabLabel, { color: tab === x.id ? brand.primary : t.muted }]}>{x.label}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
      <StatusBar style={lesson || tester || hangar ? 'light' : 'auto'} />
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ErrorBoundary>
          <Root />
        </ErrorBoundary>
      </AppProvider>
    </SafeAreaProvider>
  )
}

const s = StyleSheet.create({
  fill: { flex: 1 },
  tabs: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 16, marginBottom: 10, padding: 6, borderRadius: 28 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 22, gap: 2 },
  tabLabel: { fontSize: 11, fontWeight: '800' },
})
