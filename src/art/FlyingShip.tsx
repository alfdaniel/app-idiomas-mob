import React, { useEffect, useRef } from 'react'
import { Animated, Easing, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { Alien, Ship } from './Art'
import { useShipLook } from '../lib/shipLook'

function loop(value: Animated.Value, to: number, duration: number, delay = 0) {
  value.setValue(0)
  const anim = Animated.loop(
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(value, { toValue: to, duration, easing: Easing.linear, useNativeDriver: true }),
    ]),
  )
  anim.start()
  return anim
}

export function FlyingShip({ size = 66, boost }: { size?: number; boost: Animated.Value }) {
  const look = useShipLook()
  const jx = useRef(new Animated.Value(0)).current
  const jy = useRef(new Animated.Value(0)).current
  const flick = useRef(new Animated.Value(0)).current
  const sparks = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current

  useEffect(() => {
    const shakeX = Animated.loop(
      Animated.sequence([
        Animated.timing(jx, { toValue: 1, duration: 45, useNativeDriver: true }),
        Animated.timing(jx, { toValue: -1, duration: 45, useNativeDriver: true }),
        Animated.timing(jx, { toValue: 0.6, duration: 40, useNativeDriver: true }),
        Animated.timing(jx, { toValue: -0.8, duration: 50, useNativeDriver: true }),
      ]),
    )
    const shakeY = Animated.loop(
      Animated.sequence([
        Animated.timing(jy, { toValue: -1, duration: 60, useNativeDriver: true }),
        Animated.timing(jy, { toValue: 1, duration: 55, useNativeDriver: true }),
        Animated.timing(jy, { toValue: -0.5, duration: 50, useNativeDriver: true }),
      ]),
    )
    const flame = Animated.loop(
      Animated.sequence([
        Animated.timing(flick, { toValue: 1, duration: 110, useNativeDriver: true }),
        Animated.timing(flick, { toValue: 0, duration: 130, useNativeDriver: true }),
      ]),
    )
    shakeX.start()
    shakeY.start()
    flame.start()
    const sp = sparks.map((v, i) => loop(v, 1, 380 + i * 90, i * 110))
    return () => {
      shakeX.stop()
      shakeY.stop()
      flame.stop()
      sp.forEach(a => a.stop())
    }
  }, [])

  const amp = Animated.multiply(boost, 3.2)
  const tx = Animated.multiply(jx, amp)
  const ty = Animated.multiply(jy, Animated.multiply(boost, 2.4))
  const baseFlame = flick.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1.1] })
  const flameScale = Animated.multiply(baseFlame, Animated.add(1, Animated.multiply(boost, 1.5)))
  const sparkAlpha = Animated.add(0.3, Animated.multiply(boost, 0.7))

  const fw = size * 0.34
  const fh = size * 0.78

  return (
    <Animated.View style={{ width: size, height: size, transform: [{ translateX: tx }, { translateY: ty }] }}>
      <Animated.View
        style={{
          position: 'absolute',
          left: size * 0.5 - fw / 2,
          top: size * 0.62,
          width: fw,
          height: fh,
          transform: [{ scaleY: flameScale }, { scaleX: baseFlame }],
          transformOrigin: 'center top',
        }}
      >
        <Svg width={fw} height={fh} viewBox="0 0 24 56">
          <Path d="M12 56 C2 38 2 22 12 0 C22 22 22 38 12 56 Z" fill={look.flame[0]} />
          <Path d="M12 46 C5 34 5 22 12 6 C19 22 19 34 12 46 Z" fill={look.flame[1]} />
          <Path d="M12 34 C8 27 8 20 12 10 C16 20 16 27 12 34 Z" fill={look.flame[2]} />
        </Svg>
      </Animated.View>

      {sparks.map((v, i) => (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: size * 0.5 - 2 + (i % 2 ? 6 : -6) * (i < 2 ? 1 : 1.6),
            top: size * 0.72,
            width: i % 2 ? 4 : 5,
            height: i % 2 ? 4 : 5,
            borderRadius: 3,
            backgroundColor: i % 2 ? look.flame[2] : look.flame[1],
            opacity: Animated.multiply(v.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), sparkAlpha),
            transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, size * 0.95] }) }],
          }}
        />
      ))}

      <Ship size={size} flame={false} />
      <View style={{ position: 'absolute', top: 2, left: size * 0.5 - 13 }}>
        <Alien size={26} />
      </View>
    </Animated.View>
  )
}
