import React from 'react'
import Svg, { ClipPath, Circle, Defs, Ellipse, G, Line, Path, Rect } from 'react-native-svg'

import { useShipLook } from '../lib/shipLook'
import type { ShipLook } from '../lib/parts'

const INK = '#1b1b3a'

export type Mood = 'happy' | 'sad' | 'wow' | 'cool'

export function Alien({ size = 64, mood = 'happy', color = '#7ee081' }: { size?: number; mood?: Mood; color?: string }) {
  const mouth =
    mood === 'sad' ? 'M26 49 Q32 44 38 49' : mood === 'wow' ? 'M29 47 Q32 54 35 47 Z' : 'M26 46 Q32 53 38 46'
  const cool = mood === 'cool'
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Line x1="22" y1="14" x2="16" y2="5" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <Line x1="42" y1="14" x2="48" y2="5" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <Circle cx="15" cy="5" r="3.5" fill={cool ? '#ff2bd6' : '#ffd400'} stroke={INK} strokeWidth="2" />
      <Circle cx="49" cy="5" r="3.5" fill={cool ? '#00f0ff' : '#ffd400'} stroke={INK} strokeWidth="2" />
      <Ellipse cx="32" cy="32" rx="22" ry="20" fill={color} stroke={INK} strokeWidth="3" />
      {cool ? (
        <G>
          <Rect x="10" y="22" width="20" height="13" rx="5" fill={INK} />
          <Rect x="34" y="22" width="20" height="13" rx="5" fill={INK} />
          <Line x1="30" y1="26" x2="34" y2="26" stroke={INK} strokeWidth="3" />
          <Line x1="13" y1="25" x2="19" y2="25" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
          <Line x1="37" y1="25" x2="43" y2="25" stroke="#ff2bd6" strokeWidth="2" strokeLinecap="round" />
        </G>
      ) : (
        <G>
          <Ellipse cx="22" cy="30" rx="6" ry="8" fill={INK} transform="rotate(-12 22 30)" />
          <Ellipse cx="42" cy="30" rx="6" ry="8" fill={INK} transform="rotate(12 42 30)" />
          <Circle cx="24" cy="27" r="2" fill="#fff" />
          <Circle cx="44" cy="27" r="2" fill="#fff" />
        </G>
      )}
      <Path d={mouth} stroke={INK} strokeWidth="2.5" fill={mood === 'wow' ? INK : 'none'} strokeLinecap="round" />
      <Circle cx="14" cy="40" r="2.5" fill="#ff8fa3" />
      <Circle cx="50" cy="40" r="2.5" fill="#ff8fa3" />
    </Svg>
  )
}

const sparkle = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r} L${cx + r * 0.3} ${cy - r * 0.3} L${cx + r} ${cy} L${cx + r * 0.3} ${cy + r * 0.3} L${cx} ${cy + r} L${cx - r * 0.3} ${cy + r * 0.3} L${cx - r} ${cy} L${cx - r * 0.3} ${cy - r * 0.3} Z`

export function Ship({ size = 64, flame = true, look }: { size?: number; flame?: boolean; look?: ShipLook }) {
  const ctx = useShipLook()
  const l = look ?? ctx
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {l.aura && (
        <G>
          <Circle cx="32" cy="33" r="31" fill={l.aura} opacity={0.16} />
          <Circle cx="32" cy="33" r="28.5" fill="none" stroke={l.aura} strokeWidth="2" opacity={0.6} />
          <Path d={sparkle(6, 14, 3)} fill={l.aura} />
          <Path d={sparkle(58, 18, 2.5)} fill={l.aura} />
          <Path d={sparkle(54, 56, 2.5)} fill={l.aura} />
        </G>
      )}
      {flame && <Path d="M26 46 L32 60 L38 46 Z" fill={l.flame[1]} stroke={INK} strokeWidth="2" strokeLinejoin="round" />}
      {l.wings === 'jet' && (
        <G>
          <Path d="M14 35 L0 28 L2 50 L26 44 Z" fill={l.hull2} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <Path d="M50 35 L64 28 L62 50 L38 44 Z" fill={l.hull2} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <Line x1="4" y1="34" x2="18" y2="41" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
          <Line x1="60" y1="34" x2="46" y2="41" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
          <Path d="M1 50 L3 58 L6 50 Z" fill={l.flame[1]} />
          <Path d="M63 50 L61 58 L58 50 Z" fill={l.flame[1]} />
        </G>
      )}
      {l.wings === 'fins' && (
        <G>
          <Path d="M8 37 L2 52 L19 42 Z" fill={l.hull2} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <Path d="M56 37 L62 52 L45 42 Z" fill={l.hull2} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </G>
      )}
      {l.wings === 'wide' && (
        <G>
          <Path d="M10 34 L0 56 L28 43 Z" fill={l.hull2} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <Path d="M54 34 L64 56 L36 43 Z" fill={l.hull2} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </G>
      )}
      {l.wings === 'star' && (
        <G>
          <Path d={sparkle(7, 47, 8)} fill="#ffd400" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <Path d={sparkle(57, 47, 8)} fill="#ffd400" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        </G>
      )}
      {l.antenna !== 'none' && l.antenna !== 'crown' && <Line x1="32" y1="19" x2="32" y2="8" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />}
      {l.antenna === 'ball' && <Circle cx="32" cy="6" r="3.5" fill="#e8272b" stroke={INK} strokeWidth="2" />}
      {l.antenna === 'heart' && (
        <Path d="M32 9 L27 4.5 C25 2.5 27 0 29.5 0.8 C31 1.3 32 2.6 32 2.6 C32 2.6 33 1.3 34.5 0.8 C37 0 39 2.5 37 4.5 Z" fill="#ff6bb5" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      )}
      {l.antenna === 'star' && <Path d={sparkle(32, 5, 5.5)} fill="#ffd400" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />}
      <Path d="M20 30 Q32 6 44 30 Z" fill={l.dome} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {l.domeShine && (
        <G>
          <Path d={sparkle(27, 23, 3.8)} fill="#ffffff" />
          <Path d={sparkle(36, 20, 2.2)} fill="#b58cff" />
          <Line x1="23" y1="27" x2="28" y2="19" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity={0.8} />
        </G>
      )}
      {l.antenna === 'crown' && (
        <G>
          <Path d="M24 19 L23 8 L28 12.5 L32 5 L36 12.5 L41 8 L40 19 Z" fill="#ffd400" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <Circle cx="32" cy="14" r="1.8" fill="#e8272b" />
          <Circle cx="27" cy="15.5" r="1.3" fill="#2b5be8" />
          <Circle cx="37" cy="15.5" r="1.3" fill="#2e9e44" />
        </G>
      )}
      <Ellipse cx="32" cy="36" rx="28" ry="10" fill={l.hull} stroke={INK} strokeWidth="3" />
      {l.stripe && <Path d="M8 35 Q32 45 56 35" fill="none" stroke={l.stripe} strokeWidth="2.5" strokeLinecap="round" />}
      <Circle cx="14" cy="37" r="2.5" fill={l.lights} />
      <Circle cx="32" cy="40" r="2.5" fill={l.lights} />
      <Circle cx="50" cy="37" r="2.5" fill={l.lights} />
    </Svg>
  )
}

const PLANETS = [
  { body: '#4aa3ff', mark: '#2b6fd6', ring: false },
  { body: '#ff8a5c', mark: '#d9532b', ring: true },
  { body: '#b58cff', mark: '#7d4fe0', ring: false },
  { body: '#ffd24a', mark: '#d9a21b', ring: true },
  { body: '#5fd68a', mark: '#2f9c5a', ring: false },
  { body: '#ff6b9d', mark: '#d93a6f', ring: true },
]

const NEON_PLANETS = [
  { body: '#ff2bd6', mark: '#a3109a', ring: true },
  { body: '#00f0ff', mark: '#0097a3', ring: false },
  { body: '#fff200', mark: '#b8ad00', ring: true },
  { body: '#9d4dff', mark: '#5f1fc2', ring: false },
  { body: '#39ff88', mark: '#14a853', ring: true },
  { body: '#ff6a00', mark: '#b34a00', ring: false },
]

export type PlanetState = 'done' | 'active' | 'locked'

export function Planet({
  size = 76,
  variant = 0,
  state = 'active',
  neon = false,
}: {
  size?: number
  variant?: number
  state?: PlanetState
  neon?: boolean
}) {
  const list = neon ? NEON_PLANETS : PLANETS
  const p = list[variant % list.length]
  const locked = state === 'locked'
  const body = locked ? '#6b6b8f' : p.body
  const mark = locked ? '#55557a' : p.mark
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {neon && !locked && <Circle cx="40" cy="40" r="33" fill={p.body} opacity={0.22} />}
      {neon && !locked && <Circle cx="40" cy="40" r="30" fill="none" stroke={p.body} strokeWidth="2" opacity={0.6} />}
      {p.ring && <Ellipse cx="40" cy="42" rx="38" ry="9" fill="none" stroke={INK} strokeWidth="7" transform="rotate(-18 40 42)" />}
      {p.ring && <Ellipse cx="40" cy="42" rx="38" ry="9" fill="none" stroke={locked ? '#8a8aae' : neon ? '#ffffff' : '#fff3c4'} strokeWidth="3.5" transform="rotate(-18 40 42)" />}
      <Circle cx="40" cy="40" r="26" fill={body} stroke={INK} strokeWidth="3" />
      <Circle cx="30" cy="32" r="5" fill={mark} />
      <Circle cx="50" cy="48" r="7" fill={mark} />
      <Circle cx="44" cy="28" r="3" fill={mark} />
      {state === 'done' && (
        <G>
          <Circle cx="62" cy="18" r="12" fill="#ffd400" stroke={INK} strokeWidth="3" />
          <Path d="M56 18 L61 23 L69 13" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </G>
      )}
      {locked && (
        <G>
          <Rect x="31" y="38" width="18" height="14" rx="2" fill="#d9d9ee" stroke={INK} strokeWidth="2.5" />
          <Path d="M35 38 V33 Q40 26 45 33 V38" fill="none" stroke={INK} strokeWidth="2.5" />
        </G>
      )}
    </Svg>
  )
}

export function Stars({ width, height, count = 40, neon = false }: { width: number; height: number; count?: number; neon?: boolean }) {
  const dots = React.useMemo(() => {
    let seed = 7
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    return Array.from({ length: count }, () => ({
      x: rnd() * width,
      y: rnd() * height,
      r: rnd() > 0.85 ? 2.2 : 1.2,
      c: neon ? (rnd() > 0.5 ? '#ff2bd6' : '#00f0ff') : rnd() > 0.7 ? '#ffd400' : '#ffffff',
    }))
  }, [width, height, count, neon])
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      {dots.map((d, i) => (
        <Circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity={0.85} />
      ))}
    </Svg>
  )
}

export function ParallelBackdrop({ width, height }: { width: number; height: number }) {
  const horizon = height * 0.5
  const sunR = Math.min(width * 0.3, 120)
  const vx = width / 2
  const rows = 9
  const cols = 14
  const stripes = [0.55, 0.7, 0.82, 0.92]
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      <Rect x="0" y="0" width={width} height={horizon * 0.5} fill="#12002b" />
      <Rect x="0" y={horizon * 0.5} width={width} height={horizon * 0.3} fill="#240a4d" />
      <Rect x="0" y={horizon * 0.8} width={width} height={horizon * 0.2} fill="#4a1470" />

      <Circle cx={vx} cy={horizon - sunR * 0.15} r={sunR} fill="#ff3d81" />
      <Circle cx={vx} cy={horizon - sunR * 0.15 - sunR * 0.35} r={sunR * 0.62} fill="#ffb347" opacity={0.55} />
      {stripes.map((f, i) => (
        <Rect
          key={i}
          x={vx - sunR}
          y={horizon - sunR * 0.15 + sunR * f - 2 - i}
          width={sunR * 2}
          height={3 + i * 1.5}
          fill="#4a1470"
        />
      ))}

      <Rect x="0" y={horizon} width={width} height={height - horizon} fill="#12002b" />
      <Line x1="0" y1={horizon} x2={width} y2={horizon} stroke="#00f0ff" strokeWidth="2.5" />
      {Array.from({ length: rows }, (_, i) => {
        const f = ((i + 1) / rows) ** 2
        const y = horizon + (height - horizon) * f
        return <Line key={`h${i}`} x1="0" y1={y} x2={width} y2={y} stroke="#ff2bd6" strokeWidth="1.5" opacity={0.55} />
      })}
      {Array.from({ length: cols + 1 }, (_, i) => {
        const x = (i / cols) * width * 3 - width
        return <Line key={`v${i}`} x1={vx} y1={horizon} x2={x} y2={height} stroke="#ff2bd6" strokeWidth="1.5" opacity={0.55} />
      })}
    </Svg>
  )
}

export function SpaceBackdrop({ width, height }: { width: number; height: number }) {
  const h = height + 220
  const pr = Math.max(width * 0.62, 190)
  const pcx = width * 0.92
  const pcy = h - pr * 0.28
  const bands = [
    { y: -0.55, t: 0.16, c: '#5a46c8' },
    { y: -0.25, t: 0.1, c: '#2a1f6e' },
    { y: 0.0, t: 0.2, c: '#6d58e0' },
    { y: 0.35, t: 0.12, c: '#2a1f6e' },
    { y: 0.6, t: 0.14, c: '#5a46c8' },
  ]
  const sun = (cx: number, cy: number, r: number, core: string, glow: string) => (
    <G>
      <Circle cx={cx} cy={cy} r={r * 3.4} fill={glow} opacity={0.05} />
      <Circle cx={cx} cy={cy} r={r * 2.4} fill={glow} opacity={0.08} />
      <Circle cx={cx} cy={cy} r={r * 1.6} fill={glow} opacity={0.16} />
      <Circle cx={cx} cy={cy} r={r} fill={core} />
      <Circle cx={cx - r * 0.25} cy={cy - r * 0.25} r={r * 0.45} fill="#ffffff" opacity={0.55} />
    </G>
  )
  return (
    <Svg width={width} height={h} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      <Defs>
        <ClipPath id="planetClip">
          <Circle cx={pcx} cy={pcy} r={pr} />
        </ClipPath>
      </Defs>

      {sun(width * 0.1, 330, 17, '#fff3a8', '#ffd400')}
      {sun(width * 0.9, 250, 10, '#ffb27a', '#ff6a3d')}

      <Ellipse cx={pcx} cy={pcy} rx={pr * 1.75} ry={pr * 0.3} fill="none" stroke="#6d58e0" strokeWidth="14" opacity={0.35} transform={`rotate(-16 ${pcx} ${pcy})`} />
      <Circle cx={pcx} cy={pcy} r={pr} fill="#3b2d8f" />
      <G clipPath="url(#planetClip)">
        {bands.map((b, i) => (
          <Rect key={i} x={pcx - pr} y={pcy + b.y * pr - (b.t * pr) / 2} width={pr * 2} height={b.t * pr} fill={b.c} />
        ))}
        <Circle cx={pcx - pr * 0.45} cy={pcy - pr * 0.4} r={pr * 0.12} fill="#ff8fa3" opacity={0.7} />
        <Circle cx={pcx - pr * 0.9} cy={pcy} r={pr * 0.7} fill="#0e0b2e" opacity={0.22} />
      </G>
      <Circle cx={pcx} cy={pcy} r={pr} fill="none" stroke="#9fe3ff" strokeWidth="3" opacity={0.35} />
      <Path
        d={`M ${pcx - pr * 1.7} ${pcy + pr * 0.18} Q ${pcx - pr * 0.4} ${pcy + pr * 0.42} ${pcx + pr * 1.5} ${pcy - pr * 0.28}`}
        fill="none"
        stroke="#9fb4ff"
        strokeWidth="9"
        opacity={0.45}
        strokeLinecap="round"
      />
    </Svg>
  )
}
