import { useMemo } from 'react'
import { useApp } from '../store'
import { resolveLook, type ShipLook } from './parts'

export function useShipLook(): ShipLook {
  const { duo } = useApp()
  return useMemo(() => resolveLook(duo.equipped), [duo.equipped])
}
