import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, authRequest, loadToken, setToken } from './api'
import { DEFAULT_EQUIPPED, DEFAULT_PARTS } from './lib/parts'

export interface DuoState {
  hearts: number
  maxHearts: number
  gems: number
  nextHeartAt: number | null
  heartGemCost: number
  completed: Record<string, { lessonsDone: number; best: number }>
  parts: string[]
  equipped: Record<string, string>
}

export interface Stats {
  xp: number
  streak: number
  weeklyXp: number
}

export interface LessonResult {
  xpEarned: number
  gemsEarned: number
  accuracy: number
  perfect: boolean
}

interface Ctx {
  ready: boolean
  loggedIn: boolean
  duo: DuoState
  stats: Stats
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  retry: () => Promise<void>
  loseHeart: () => Promise<void>
  refill: () => Promise<void>
  completeLesson: (skillId: string, correct: number, total: number) => Promise<LessonResult>
  claimBonus: (skillId: string, correct: number, total: number, bestCombo: number, calm: boolean) => Promise<BonusResult>
  equip: (partId: string) => Promise<void>
  buyPart: (partId: string) => Promise<void>
}

export interface BonusResult {
  xp: number
  gems: number
  capped: boolean
  drop: string | null
}

const emptyDuo: DuoState = {
  hearts: 5,
  maxHearts: 5,
  gems: 0,
  nextHeartAt: null,
  heartGemCost: 50,
  completed: {},
  parts: DEFAULT_PARTS,
  equipped: DEFAULT_EQUIPPED,
}
const emptyStats: Stats = { xp: 0, streak: 0, weeklyXp: 0 }

const AppContext = createContext<Ctx | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp fora do provider')
  return ctx
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [duo, setDuo] = useState<DuoState>(emptyDuo)
  const [stats, setStats] = useState<Stats>(emptyStats)

  const refresh = useCallback(async () => {
    try {
      const [d, s] = await Promise.all([api<DuoState>('/api/duo/state'), api<Stats | null>('/api/stats')])
      setDuo(d)
      if (s) setStats({ xp: s.xp, streak: s.streak, weeklyXp: s.weeklyXp })
    } catch {}
  }, [])

  useEffect(() => {
    ;(async () => {
      const t = await loadToken()
      if (t) {
        setLoggedIn(true)
        await refresh()
      } else {
        try { await createGuest() } catch {}
      }
      setReady(true)
    })()
  }, [refresh])

  const finishAuth = useCallback(async (token: string) => {
    await setToken(token)
    setLoggedIn(true)
    await refresh()
  }, [refresh])

  const createGuest = useCallback(async () => {
    const id = Math.random().toString(36).slice(2, 10)
    const r = await authRequest('register', {
      name: 'Visitante',
      email: `guest-${id}@falae.app`,
      password: Math.random().toString(36).slice(2) + 'Gx9',
    })
    await finishAuth(r.token)
  }, [finishAuth])

  const value = useMemo<Ctx>(() => ({
    ready,
    loggedIn,
    duo,
    stats,
    refresh,
    login: async (email, password) => {
      const r = await authRequest('login', { email, password })
      await finishAuth(r.token)
    },
    register: async (name, email, password) => {
      const r = await authRequest('register', { name, email, password })
      await finishAuth(r.token)
    },
    retry: createGuest,
    logout: async () => {
      await setToken(null)
      setLoggedIn(false)
      setDuo(emptyDuo)
      setStats(emptyStats)
      try { await createGuest() } catch {}
    },
    loseHeart: async () => {
      setDuo(d => ({ ...d, hearts: Math.max(0, d.hearts - 1) }))
      try {
        setDuo(await api<DuoState>('/api/duo/lose-heart', { method: 'POST' }))
      } catch {}
    },
    refill: async () => {
      setDuo(await api<DuoState>('/api/duo/refill', { method: 'POST' }))
    },
    completeLesson: async (skillId, correct, total) => {
      const r = await api<LessonResult & { duo: DuoState; stats: Stats }>('/api/duo/lesson-complete', {
        method: 'POST',
        body: { skillId, correct, total },
      })
      setDuo(r.duo)
      setStats({ xp: r.stats.xp, streak: r.stats.streak, weeklyXp: r.stats.weeklyXp })
      return { xpEarned: r.xpEarned, gemsEarned: r.gemsEarned, accuracy: r.accuracy, perfect: r.perfect }
    },
    claimBonus: async (skillId, correct, total, bestCombo, calm) => {
      const r = await api<BonusResult & { duo: DuoState; stats: Stats }>('/api/duo/challenge-bonus', {
        method: 'POST',
        body: { skillId, correct, total, bestCombo, calm },
      })
      setDuo(r.duo)
      setStats({ xp: r.stats.xp, streak: r.stats.streak, weeklyXp: r.stats.weeklyXp })
      return { xp: r.xp, gems: r.gems, capped: r.capped, drop: r.drop ?? null }
    },
    equip: async partId => {
      setDuo(await api<DuoState>('/api/duo/equip', { method: 'POST', body: { partId } }))
    },
    buyPart: async partId => {
      setDuo(await api<DuoState>('/api/duo/buy-part', { method: 'POST', body: { partId } }))
    },
  }), [ready, loggedIn, duo, stats, refresh, finishAuth, createGuest])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
