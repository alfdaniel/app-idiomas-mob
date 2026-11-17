import * as SecureStore from 'expo-secure-store'

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000'
const TOKEN_KEY = 'user-token'

let token: string | null = null

export async function loadToken() {
  token = await SecureStore.getItemAsync(TOKEN_KEY)
  return token
}

export async function setToken(value: string | null) {
  token = value
  if (value) await SecureStore.setItemAsync(TOKEN_KEY, value)
  else await SecureStore.deleteItemAsync(TOKEN_KEY)
}

export async function api<T>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: opts.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    })
  } catch {
    throw new Error('Sem conexão com o servidor')
  }
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.success === false) {
    throw new Error(json?.error?.message ?? json?.message ?? 'Algo deu errado')
  }
  return json
}

export interface AuthResult {
  token: string
  user: { id: string; name: string; email: string }
}

export async function authRequest(kind: 'login' | 'register', body: Record<string, string>): Promise<AuthResult> {
  const res = await api<{ data: AuthResult }>(`/api/auth/${kind}`, { method: 'POST', body })
  return res.data
}
