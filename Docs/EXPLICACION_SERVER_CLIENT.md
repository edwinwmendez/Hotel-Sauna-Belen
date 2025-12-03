# Explicación: Server-Side vs Client-Side en Next.js

## 🔴 El Problema

Estamos recibiendo este error:
```
You're importing a component that needs "next/headers". That only works in a Server Component
```

## 📚 ¿Qué significa esto?

En Next.js 13+ con App Router, hay dos tipos de componentes:

### 1. **Server Components** (Por defecto)
- ✅ Se ejecutan en el **servidor** (Node.js)
- ✅ Pueden usar funciones que necesitan acceso al servidor
- ✅ Pueden usar `next/headers` (cookies, headers)
- ✅ Pueden usar `createClient()` del servidor que necesita cookies
- ❌ NO pueden usar hooks de React como `useState`, `useEffect`
- ❌ NO pueden usar eventos del navegador

### 2. **Client Components** (`'use client'`)
- ✅ Se ejecutan en el **navegador** (JavaScript del cliente)
- ✅ Pueden usar hooks de React (`useState`, `useEffect`, etc.)
- ✅ Pueden manejar eventos (`onClick`, `onChange`, etc.)
- ✅ Pueden usar interactividad
- ❌ NO pueden usar `next/headers` directamente
- ❌ NO pueden llamar directamente funciones que usan `createClient()` del servidor

## 🎯 El Error Específico

El error ocurre porque:

1. **`guest-search.tsx`** es un **Client Component** (tiene `'use client'`)
2. Está intentando importar `searchGuestByDocument` de `lib/queries/guests.ts`
3. Esa función usa `createClient()` de `lib/supabase/server.ts`
4. Ese `createClient()` usa `cookies()` de `next/headers`
5. **¡No se puede usar código del servidor en componentes cliente!**

```typescript
// ❌ ESTO NO FUNCIONA:
'use client'
import { searchGuestByDocument } from '@/lib/queries/guests' // ← Esta usa código del servidor

function MyComponent() {
  // ...
}
```

## ✅ La Solución: Server Actions

Next.js tiene una característica llamada **Server Actions**. Estas son funciones marcadas con `'use server'` que:

- ✅ Se ejecutan en el servidor
- ✅ Pueden usar `createClient()` del servidor
- ✅ Pueden ser llamadas desde componentes cliente
- ✅ Funcionan como una API pero más simple

### Ejemplo:

```typescript
// ✅ lib/actions/guests.ts
'use server'

import { searchGuestByDocument } from '@/lib/queries/guests'

export async function searchGuestByDocumentAction(
  documentType: 'DNI' | 'CE' | 'PASAPORTE',
  documentNumber: string
) {
  // Esta función se ejecuta en el servidor
  const guest = await searchGuestByDocument(documentType, documentNumber)
  return { guest }
}
```

```typescript
// ✅ components/reception/guest-search.tsx
'use client'

import { searchGuestByDocumentAction } from '@/lib/actions/guests'

function GuestSearch() {
  const handleSearch = async () => {
    // Esto llama al servidor desde el cliente
    const result = await searchGuestByDocumentAction('DNI', '12345678')
    // ...
  }
}
```

## 🤔 ¿Requiere Conexión a Supabase?

**NO.** Este error **NO es por falta de conexión a Supabase**. Es un problema de arquitectura:

1. El sistema ya maneja la falta de Supabase con mocks (retorna `null` si no está configurado)
2. El error es porque Next.js detecta que estás intentando usar código del servidor en el cliente
3. Esto se soluciona creando Server Actions, no conectando Supabase

## 📋 ¿Cómo funciona con mocks?

El sistema ya tiene soporte para mocks:

```typescript
// lib/supabase/server.ts
export async function createClient() {
  if (!hasSupabaseConfig) {
    return null // ← Retorna null si no hay Supabase
  }
  // ... crear cliente real
}
```

Y las queries manejan el caso de `null`:

```typescript
// lib/queries/guests.ts
export async function searchGuestByDocument(...) {
  const supabase = await createClient()
  
  if (!supabase) {
    // Retornar mock o null
    return null
  }
  
  // Usar Supabase real
}
```

## ✅ Resumen

1. **El error NO es por falta de Supabase** → Es un problema de arquitectura
2. **La solución es usar Server Actions** → Funciones marcadas con `'use server'`
3. **Los componentes cliente pueden llamar Server Actions** → Next.js se encarga de la comunicación
4. **El sistema ya soporta mocks** → Funciona sin Supabase configurado

## 🛠️ Lo que hice para solucionarlo:

1. ✅ Creé `lib/actions/guests.ts` con Server Actions
2. ✅ Actualicé `guest-search.tsx` para usar las Server Actions
3. ✅ El sistema sigue funcionando con o sin Supabase

