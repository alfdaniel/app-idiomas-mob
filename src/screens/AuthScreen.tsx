import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Btn } from '../components/ui'
import { useApp } from '../store'
import { brand, useTheme } from '../theme'

export function AuthScreen() {
  const t = useTheme()
  const { login, register } = useApp()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    setError('')
    setBusy(true)
    try {
      if (mode === 'login') await login(email.trim(), password)
      else await register(name.trim(), email.trim(), password)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const input = [s.input, { borderColor: t.border, color: t.text, backgroundColor: t.surface }]
  const valid = email.trim() && password && (mode === 'login' || name.trim())

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.wrap}>
      <Text style={s.logo}>falaê</Text>
      <Text style={[s.sub, { color: t.muted }]}>Aprenda inglês um pouquinho por dia</Text>

      <View style={s.form}>
        {mode === 'register' && (
          <TextInput placeholder="Nome" placeholderTextColor={t.muted} value={name} onChangeText={setName} style={input} />
        )}
        <TextInput
          placeholder="E-mail"
          placeholderTextColor={t.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={input}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor={t.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={input}
        />
        {error ? <Text style={s.error}>{error}</Text> : null}
        <Btn label={mode === 'login' ? 'Entrar' : 'Criar conta'} disabled={busy || !valid} onPress={submit} />
        <Pressable onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
          <Text style={[s.switch, { color: brand.accent }]}>
            {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 52, fontWeight: '800', color: brand.primary, textAlign: 'center' },
  sub: { textAlign: 'center', fontWeight: '700', fontSize: 16, marginBottom: 32 },
  form: { gap: 14 },
  input: { borderWidth: 2, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 16, fontSize: 17, fontWeight: '600' },
  error: { color: brand.red, fontWeight: '800', textAlign: 'center' },
  switch: { textAlign: 'center', fontWeight: '800', marginTop: 8 },
})
