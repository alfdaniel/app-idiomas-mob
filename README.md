# Falaê (mobile)

App nativo (Expo / React Native) no formato trilha + lições curtas. Usa a API Nuxt de `../projeto-idiomas-duo`.

## Rodar
1. Backend: `cd ../projeto-idiomas-duo && npx nuxt dev --host 0.0.0.0 --port 3100`
2. Ajuste `EXPO_PUBLIC_API_URL` no `.env` (celular físico: use o IP da máquina, ex.: http://192.168.1.5:3100)
3. App: `npm start` e abra no Expo Go (ou `npm run android`)

## Estrutura
- `src/data/course`: conteúdo das lições (copiado do web)
- `src/lib/exercises.ts`: converte slides em exercícios
- `src/screens`: Auth, Trilha, Lição, Loja, Ranking, Perfil
- `src/store.tsx`: sessão, vidas, gemas, XP
