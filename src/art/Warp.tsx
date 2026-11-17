import React, { useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Svg, { Line } from 'react-native-svg'
import { Ship } from './Art'

const DURATION = 3000
const COUNT = 46

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n))

export function Warp({ dir, width, height, onPeak, onDone }: { dir: 'in' | 'out'; width: number; height: number; onPeak: () => void; onDone: () => void }) {
  const [t, setT] = useState(0)
  const peaked = useRef(false)
  const peakRef = useRef(onPeak)
  const doneRef = useRef(onDone)
  peakRef.current = onPeak
  doneRef.current = onDone

  const stars = useMemo(() => {
    let seed = dir === 'in' ? 11 : 29
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    const palette = dir === 'in' ? ['#ffffff', '#7df9ff', '#ff2bd6', '#ffffff'] : ['#ffffff', '#ffd400', '#7ee081', '#ffffff']
    return Array.from({ length: COUNT }, () => ({
      a: rnd() * Math.PI * 2,
      o: rnd(),
      v: 0.6 + rnd() * 1.2,
      w: 1 + rnd() * 2.2,
      c: palette[Math.floor(rnd() * palette.length)],
    }))
  }, [dir])

  useEffect(() => {
    const start = Date.now()
    let raf = 0
    const tick = () => {
      const p = clamp((Date.now() - start) / DURATION)
      setT(p)
      if (p > 0.7 && !peaked.current) {
        peaked.current = true
        peakRef.current()
      }
      if (p < 1) raf = requestAnimationFrame(tick)
      else doneRef.current()
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const cx = width / 2
  const cy = height / 2
  const maxR = Math.hypot(cx, cy)
  const stretch = t < 0.2 ? (t / 0.2) * 0.4 : 0.4 + clamp((t - 0.2) / 0.5) * 3.6
  const flow = t * t * 7 + t * 1.2
  const overlay = t < 0.1 ? t / 0.1 : t > 0.88 ? (1 - t) / 0.12 : 1
  const flash = clamp(1 - Math.abs(t - 0.77) / 0.1)
  const rise = t < 0.22 ? 1 - t / 0.22 : 0
  const jitter = t > 0.2 && t < 0.72 ? Math.sin(t * 160) * 3.5 : 0
  const shrink = t > 0.68 ? 1 - clamp((t - 0.68) / 0.22) * 0.88 : 1
  const hue = dir === 'in' ? '#ff2bd6' : '#ffd400'
  const caption = dir === 'in' ? 'Ativando o hiperespaço…' : 'Voltando para a trilha…'

  return (
    <View pointerEvents="auto" style={[s.root, { opacity: overlay }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#05031a' }]} />
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        {stars.map((st, i) => {
          const rho = (st.o + flow * st.v * 0.18) % 1
          const r0 = rho * rho * maxR
          const len = (3 + stretch * 70) * (0.15 + rho)
          const r1 = r0 + len
          const cos = Math.cos(st.a)
          const sin = Math.sin(st.a)
          return (
            <Line
              key={i}
              x1={cx + cos * r0}
              y1={cy + sin * r0}
              x2={cx + cos * r1}
              y2={cy + sin * r1}
              stroke={st.c}
              strokeWidth={st.w * (0.6 + rho)}
              strokeLinecap="round"
              opacity={clamp(0.25 + t * 1.1) * (0.4 + rho * 0.6)}
            />
          )
        })}
      </Svg>

      <View
        pointerEvents="none"
        style={[
          s.glow,
          { backgroundColor: hue, opacity: clamp((t - 0.2) / 0.5) * 0.18, width: width * 1.4, height: width * 1.4, left: cx - width * 0.7, top: cy - width * 0.7 },
        ]}
      />

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: cx - 55 + jitter,
          top: cy - 55 + rise * height * 0.4 - (t > 0.68 ? (t - 0.68) * 90 : 0),
          transform: [{ scale: shrink }],
        }}
      >
        <Ship size={110} />
      </View>

      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#ffffff', opacity: flash * 0.95 }]} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: hue, opacity: flash * 0.35 }]} />

      <Text style={[s.caption, { color: hue, opacity: clamp(t / 0.15) * (1 - clamp((t - 0.7) / 0.1)) }]}>{caption}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  root: { ...StyleSheet.absoluteFill, zIndex: 50, elevation: 50 },
  glow: { position: 'absolute', borderRadius: 999 },
  caption: { position: 'absolute', bottom: 90, left: 0, right: 0, textAlign: 'center', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
})
