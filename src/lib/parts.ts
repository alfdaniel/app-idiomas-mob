export type Slot = 'hull' | 'wings' | 'dome' | 'antenna' | 'engine' | 'aura'
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Part {
  id: string
  slot: Slot
  name: string
  rarity: Rarity
}

export const SLOTS: { id: Slot; label: string; icon: string }[] = [
  { id: 'hull', label: 'Casco', icon: '🛸' },
  { id: 'wings', label: 'Asas', icon: '🪽' },
  { id: 'dome', label: 'Cúpula', icon: '🔮' },
  { id: 'antenna', label: 'Topo', icon: '👑' },
  { id: 'engine', label: 'Motor', icon: '🔥' },
  { id: 'aura', label: 'Aura', icon: '✨' },
]

export const PARTS: Part[] = [
  { id: 'hull-red', slot: 'hull', name: 'Casco vermelho', rarity: 'common' },
  { id: 'hull-blue', slot: 'hull', name: 'Casco azul', rarity: 'common' },
  { id: 'hull-yellow', slot: 'hull', name: 'Casco amarelo', rarity: 'common' },
  { id: 'hull-green', slot: 'hull', name: 'Casco verde', rarity: 'common' },
  { id: 'hull-purple', slot: 'hull', name: 'Casco roxo', rarity: 'rare' },
  { id: 'hull-pink', slot: 'hull', name: 'Casco rosa', rarity: 'rare' },
  { id: 'hull-gold', slot: 'hull', name: 'Casco dourado', rarity: 'epic' },
  { id: 'hull-neon', slot: 'hull', name: 'Casco neon', rarity: 'epic' },
  { id: 'hull-chrome', slot: 'hull', name: 'Casco cromado', rarity: 'legendary' },
  { id: 'hull-diamond', slot: 'hull', name: 'Casco de diamante', rarity: 'legendary' },
  { id: 'wings-none', slot: 'wings', name: 'Sem asas', rarity: 'common' },
  { id: 'wings-fins', slot: 'wings', name: 'Aletas', rarity: 'common' },
  { id: 'wings-wide', slot: 'wings', name: 'Asas largas', rarity: 'rare' },
  { id: 'wings-star', slot: 'wings', name: 'Asas estelares', rarity: 'epic' },
  { id: 'wings-jet', slot: 'wings', name: 'Asas a jato', rarity: 'legendary' },
  { id: 'dome-glass', slot: 'dome', name: 'Cúpula de vidro', rarity: 'common' },
  { id: 'dome-pink', slot: 'dome', name: 'Cúpula rosa', rarity: 'common' },
  { id: 'dome-gold', slot: 'dome', name: 'Cúpula dourada', rarity: 'rare' },
  { id: 'dome-purple', slot: 'dome', name: 'Cúpula roxa', rarity: 'rare' },
  { id: 'dome-crystal', slot: 'dome', name: 'Cúpula de cristal', rarity: 'legendary' },
  { id: 'ant-none', slot: 'antenna', name: 'Nada no topo', rarity: 'common' },
  { id: 'ant-ball', slot: 'antenna', name: 'Antena com bolinha', rarity: 'common' },
  { id: 'ant-heart', slot: 'antenna', name: 'Antena de coração', rarity: 'rare' },
  { id: 'ant-star', slot: 'antenna', name: 'Antena de estrela', rarity: 'epic' },
  { id: 'ant-crown', slot: 'antenna', name: 'Coroa real', rarity: 'legendary' },
  { id: 'eng-fire', slot: 'engine', name: 'Motor de fogo', rarity: 'common' },
  { id: 'eng-blue', slot: 'engine', name: 'Motor azul', rarity: 'common' },
  { id: 'eng-green', slot: 'engine', name: 'Motor verde', rarity: 'common' },
  { id: 'eng-purple', slot: 'engine', name: 'Motor roxo', rarity: 'rare' },
  { id: 'eng-rainbow', slot: 'engine', name: 'Motor arco-íris', rarity: 'epic' },
  { id: 'eng-gold', slot: 'engine', name: 'Motor dourado', rarity: 'legendary' },
  { id: 'eng-galaxy', slot: 'engine', name: 'Motor galáctico', rarity: 'legendary' },
  { id: 'aura-none', slot: 'aura', name: 'Sem aura', rarity: 'common' },
  { id: 'aura-blue', slot: 'aura', name: 'Aura azul', rarity: 'rare' },
  { id: 'aura-pink', slot: 'aura', name: 'Aura neon', rarity: 'epic' },
  { id: 'aura-gold', slot: 'aura', name: 'Aura dourada', rarity: 'legendary' },
]

export const DEFAULT_EQUIPPED: Record<Slot, string> = {
  hull: 'hull-red',
  wings: 'wings-none',
  dome: 'dome-glass',
  antenna: 'ant-none',
  engine: 'eng-fire',
  aura: 'aura-none',
}
export const DEFAULT_PARTS = Object.values(DEFAULT_EQUIPPED)

export const RARITY_COLOR: Record<Rarity, string> = { common: '#9fe3ff', rare: '#b58cff', epic: '#ffd400', legendary: '#ff2bd6' }
export const RARITY_LABEL: Record<Rarity, string> = { common: 'Comum', rare: 'Rara', epic: 'Épica', legendary: 'Lendária' }
export const PRICE: Record<Rarity, number> = { common: 15, rare: 40, epic: 100, legendary: 250 }

export const partById = (id: string) => PARTS.find(p => p.id === id)

export interface ShipLook {
  hull: string
  hull2: string
  stripe?: string
  dome: string
  domeShine?: boolean
  wings: 'none' | 'fins' | 'wide' | 'star' | 'jet'
  antenna: 'none' | 'ball' | 'heart' | 'star' | 'crown'
  flame: [string, string, string]
  lights: string
  aura?: string
}

const HULL: Record<string, { c: string; c2: string; stripe?: string; lights?: string }> = {
  'hull-red': { c: '#e8272b', c2: '#b01c1f' },
  'hull-blue': { c: '#2b5be8', c2: '#1e3fa8' },
  'hull-yellow': { c: '#ffd400', c2: '#c9a400' },
  'hull-green': { c: '#2e9e44', c2: '#1f7a32' },
  'hull-purple': { c: '#8b5cf6', c2: '#5f33c9' },
  'hull-pink': { c: '#ff6bb5', c2: '#d63f8f' },
  'hull-gold': { c: '#f5b800', c2: '#b88600', lights: '#ffffff' },
  'hull-neon': { c: '#1d0a3a', c2: '#12002b', stripe: '#ff2bd6', lights: '#00f0ff' },
  'hull-chrome': { c: '#c9ced8', c2: '#7d8699', stripe: '#ffffff', lights: '#00f0ff' },
  'hull-diamond': { c: '#7df9ff', c2: '#2bb5d6', stripe: '#ffffff', lights: '#ffffff' },
}
const DOME: Record<string, string> = {
  'dome-glass': '#9fe3ff',
  'dome-pink': '#ff8fd6',
  'dome-gold': '#ffd400',
  'dome-purple': '#b58cff',
  'dome-crystal': '#eafcff',
}
const FLAME: Record<string, [string, string, string]> = {
  'eng-fire': ['#e8272b', '#ff8a00', '#ffd400'],
  'eng-blue': ['#2b5be8', '#00c2ff', '#e8fbff'],
  'eng-green': ['#1f9a52', '#39ff88', '#eaffd6'],
  'eng-purple': ['#6a2bd6', '#b58cff', '#ffe6ff'],
  'eng-rainbow': ['#ff2bd6', '#ffd400', '#00f0ff'],
  'eng-gold': ['#b88600', '#ffd400', '#fff7c2'],
  'eng-galaxy': ['#3a0ca3', '#ff2bd6', '#ffffff'],
}
const AURA: Record<string, string | undefined> = { 'aura-none': undefined, 'aura-blue': '#00c2ff', 'aura-pink': '#ff2bd6', 'aura-gold': '#ffd400' }
const WINGS: Record<string, ShipLook['wings']> = { 'wings-fins': 'fins', 'wings-wide': 'wide', 'wings-star': 'star', 'wings-jet': 'jet' }
const ANT: Record<string, ShipLook['antenna']> = { 'ant-ball': 'ball', 'ant-heart': 'heart', 'ant-star': 'star', 'ant-crown': 'crown' }

export function resolveLook(eq: Partial<Record<string, string>> | undefined): ShipLook {
  const e = { ...DEFAULT_EQUIPPED, ...(eq ?? {}) }
  const h = HULL[e.hull] ?? HULL['hull-red']
  return {
    hull: h.c,
    hull2: h.c2,
    stripe: h.stripe,
    dome: DOME[e.dome] ?? DOME['dome-glass'],
    domeShine: e.dome === 'dome-crystal',
    wings: WINGS[e.wings] ?? 'none',
    antenna: ANT[e.antenna] ?? 'none',
    flame: FLAME[e.engine] ?? FLAME['eng-fire'],
    lights: h.lights ?? '#ffd400',
    aura: AURA[e.aura],
  }
}

export function lookWith(base: Partial<Record<string, string>> | undefined, partId: string): ShipLook {
  const part = partById(partId)
  return resolveLook({ ...DEFAULT_EQUIPPED, ...(base ?? {}), ...(part ? { [part.slot]: part.id } : {}) })
}
