import React from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'
import { Alien } from '../art/Art'
import { SpaceProvider, softShadow, useTheme } from '../theme'
import { Btn } from './ui'

interface Props {
  visible: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}

function Card({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel }: Omit<Props, 'visible'>) {
  const t = useTheme()
  return (
    <View style={s.overlay}>
      <View style={[s.card, { backgroundColor: t.surface, borderColor: t.border }, softShadow('#000000', 0.5)]}>
        <Alien size={76} mood="sad" />
        <Text style={[s.title, { color: t.text }]}>{title}</Text>
        <Text style={[s.message, { color: t.muted }]}>{message}</Text>
        <View style={s.actions}>
          <Btn label={cancelLabel} onPress={onCancel} />
          <Btn label={confirmLabel} tone="ghost" onPress={onConfirm} />
        </View>
      </View>
    </View>
  )
}

export function ConfirmModal({ visible, ...rest }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={rest.onCancel}>
      <SpaceProvider>
        <Card {...rest} />
      </SpaceProvider>
    </Modal>
  )
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(5,3,25,0.78)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 360, borderRadius: 28, borderWidth: 2, padding: 24, alignItems: 'center', gap: 10 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginTop: 4 },
  message: { fontSize: 15, fontWeight: '600', textAlign: 'center', lineHeight: 21, marginBottom: 8 },
  actions: { alignSelf: 'stretch', gap: 10, marginTop: 6 },
})
