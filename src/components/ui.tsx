import React from 'react'
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native'
import { brand, softShadow, useTheme } from '../theme'

type Tone = 'green' | 'blue' | 'red' | 'ghost'

export function Btn({ label, onPress, disabled, tone = 'green', style }: {
  label: string
  onPress: () => void
  disabled?: boolean
  tone?: Tone
  style?: StyleProp<ViewStyle>
}) {
  const t = useTheme()
  const colors: Record<Tone, [string, string]> = {
    green: [brand.primary, '#fff'],
    blue: [brand.accent, '#fff'],
    red: [brand.red, '#fff'],
    ghost: [t.surface, brand.primary],
  }
  const [bg, fg] = disabled ? [t.locked, t.muted] : colors[tone]
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: bg, borderColor: tone === 'ghost' ? t.border : 'transparent' },
        !disabled && tone !== 'ghost' && softShadow(bg, 0.35),
        pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      <Text style={[s.btnText, { color: fg }]}>{label}</Text>
    </Pressable>
  )
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme()
  return <View style={[s.card, { backgroundColor: t.surface }, softShadow(t.shadow, 0.08), style]}>{children}</View>
}

function Chip({ icon, value, color }: { icon: string; value: number; color: string }) {
  const t = useTheme()
  return (
    <View style={[s.chip, { backgroundColor: t.surface, borderColor: t.border }]}>
      <Text style={{ fontSize: 14 }}>{icon}</Text>
      <Text style={[s.chipText, { color }]}>{value}</Text>
    </View>
  )
}

export function StatsBar({ streak, gems, hearts, xp }: { streak: number; gems: number; hearts: number; xp: number }) {
  return (
    <View style={s.stats}>
      <Text style={s.logo}>falaê</Text>
      <View style={s.chips}>
        <Chip icon="🔥" value={streak} color={brand.orange} />
        <Chip icon="💎" value={gems} color={brand.accent} />
        <Chip icon="❤️" value={hearts} color={brand.red} />
        <Chip icon="⚡" value={xp} color={brand.goldDark} />
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  btn: { borderWidth: 1.5, borderRadius: 999, paddingVertical: 15, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontWeight: '800', fontSize: 16, letterSpacing: 0.2 },
  card: { borderRadius: 22, padding: 16 },
  stats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 16 },
  logo: { fontSize: 22, fontWeight: '800', color: brand.primary, letterSpacing: -0.5 },
  chips: { flexDirection: 'row', gap: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 9 },
  chipText: { fontWeight: '800', fontSize: 14 },
})
