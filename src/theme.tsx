import React, { createContext, useContext } from 'react'
import { useColorScheme } from 'react-native'

const light = {
  bg: '#FBF7F2',
  surface: '#FFFFFF',
  border: '#EAE3D9',
  text: '#1E1B2E',
  muted: '#7A7589',
  locked: '#EFE9E0',
  lockedDark: '#E3DACD',
  okBg: '#DDF5EC',
  okText: '#0B7A5A',
  badBg: '#FFE5E1',
  badText: '#C23B2B',
  selBg: 'rgba(91,75,255,0.09)',
  shadow: '#2A2250',
}

const dark: typeof light = {
  bg: '#14121F',
  surface: '#1E1B2E',
  border: '#322E47',
  text: '#F3F0FA',
  muted: '#9892AD',
  locked: '#2A2640',
  lockedDark: '#352F52',
  okBg: '#12342B',
  okText: '#4ADE9F',
  badBg: '#3A1D1D',
  badText: '#FF8F82',
  selBg: 'rgba(124,111,255,0.18)',
  shadow: '#000000',
}

export const brand = {
  primary: '#5B4BFF',
  primaryDark: '#4337D6',
  accent: '#12B3C4',
  accentDark: '#0E93A1',
  red: '#FF6B5B',
  redDark: '#E5503F',
  gold: '#FFB629',
  goldDark: '#C98A00',
  orange: '#FF8A3D',
}

export type Theme = typeof light

const space: Theme = {
  bg: '#0e0b2e',
  surface: '#1b1747',
  border: '#3a3478',
  text: '#ffffff',
  muted: '#a9a6d6',
  locked: '#2b2660',
  lockedDark: '#3a3478',
  okBg: '#103a2e',
  okText: '#7ee081',
  badBg: '#3d1b2e',
  badText: '#ff8fa3',
  selBg: 'rgba(159,227,255,0.16)',
  shadow: '#000000',
}

export const SPACE_BG = space.bg
const SpaceContext = createContext(false)

export function SpaceProvider({ children }: { children: React.ReactNode }) {
  return <SpaceContext.Provider value>{children}</SpaceContext.Provider>
}

export function useTheme(): Theme {
  const inSpace = useContext(SpaceContext)
  const scheme = useColorScheme()
  if (inSpace) return space
  return scheme === 'dark' ? dark : light
}

export const softShadow = (color: string, strength = 0.12) => ({
  shadowColor: color,
  shadowOpacity: strength,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
})
