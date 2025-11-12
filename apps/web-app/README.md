# 🌿 SF-1 Ultimate - Web Frontend

**Next.js 14 Frontend** für die SF-1 Ultimate Cannabis-Growing-Plattform.

---

## 🚀 Features

- ✅ **Next.js 14** mit App Router
- ✅ **TypeScript** für Type-Safety
- ✅ **Tailwind CSS** für modernes Design
- ✅ **shadcn/ui** Component Library
- ✅ **React Query** für API-State Management
- ✅ **React Hook Form + Zod** für Form-Validierung
- ✅ **JWT Authentication** mit Auto-Refresh
- ✅ **OAuth Support** (Google, Discord)
- ✅ **Dark Mode** Support
- ✅ **Dashboard Layout** mit Sidebar
- ✅ **Grow Journal** CRUD Interface

---

## 📦 Installation

### 1. Dependencies installieren

```powershell
cd C:\--Projekte--\sf1-ultimate\apps\web-app
npm install
```

### 2. Environment Variables

Erstelle eine `.env.local` Datei:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost
NEXT_PUBLIC_WS_URL=ws://localhost

# OAuth Providers
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true
NEXT_PUBLIC_DISCORD_OAUTH_ENABLED=true

# Features
NEXT_PUBLIC_AI_FEATURES_ENABLED=true
NEXT_PUBLIC_SEARCH_ENABLED=true
NEXT_PUBLIC_GAMIFICATION_ENABLED=true
```

### 3. Development Server starten

```powershell
npm run dev
```

**Frontend läuft auf:** http://localhost:3000

---

## 📂 Projekt-Struktur

```
web-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── landing/           ✅ Landing Page
│   │   ├── auth/              ✅ Login, Register
│   │   ├── dashboard/         ✅ User Dashboard
│   │   ├── journal/           ✅ Grow Journal (List, Create, Detail)
│   │   ├── community/         ⏳ Forum (TODO)
│   │   ├── search/            ⏳ Search Interface (TODO)
│   │   └── ai/                ⏳ AI Chat (TODO)
│   │
│   ├── components/
│   │   ├── ui/                ✅ shadcn/ui Components
│   │   ├── providers/         ✅ Context Providers
│   │   └── layout/            ✅ Sidebar, Header, Dashboard Layout
│   │
│   ├── lib/
│   │   ├── api-client.ts      ✅ Axios Instance mit Auth
│   │   └── utils.ts           ✅ Helper Functions
│   │
│   ├── types/                 ✅ TypeScript Types (7 Files)
│   ├── hooks/                 ✅ use-journal.ts (12 Hooks)
│   └── store/                 ⏳ Zustand Stores (TODO)
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## 🎨 Routing

### Öffentliche Routen
- `/` → Redirect zu `/landing`
- `/landing` → Landing Page ✅
- `/auth/login` → Login ✅
- `/auth/register` → Registrierung ✅

### Geschützte Routen (Auth erforderlich)
- `/dashboard` → User Dashboard ✅
- `/journal` → Grow Journal List ✅
- `/journal/new` → Create New Grow ✅
- `/journal/[id]` → Grow Detail + Timeline ✅
- `/community` → Forum ⏳
- `/search` → Suchseite ⏳
- `/ai` → AI Chat Interface ⏳
- `/prices` → Preisvergleich ⏳
- `/profile/[username]` → User Profil ⏳

---

## 🔐 Authentication Flow

1. **Login/Register** → API Request an Backend
2. **Backend Response** → JWT Access Token + Refresh Token
3. **Tokens speichern** → In Cookies
4. **API Requests** → Automatisch mit Bearer Token
5. **Token Refresh** → Automatisch bei 401 Error
6. **Logout** → Tokens löschen + Redirect

---

## 🛠️ API Client

Der API-Client (`lib/api-client.ts`) handled automatisch:

- ✅ Bearer Token Injection
- ✅ Token Refresh bei 401
- ✅ Error Handling
- ✅ Request/Response Interceptors

**Verwendung mit React Query:**

```typescript
import { useGrows, useCreateGrow } from '@/hooks/use-journal';

function MyComponent() {
  const { data: grows, isLoading } = useGrows();
  const createGrow = useCreateGrow();

  const handleCreate = async () => {
    await createGrow.mutateAsync({
      title: 'Mein Grow',
      strain: { name: 'Gorilla Glue #4', type: 'HYBRID' },
      growType: 'INDOOR',
      medium: 'SOIL'
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {grows.map(grow => <div key={grow.id}>{grow.title}</div>)}
    </div>
  );
}
```

---

## 🎯 Implementierter Status

### Phase 1: Core Pages ✅ (100%)
- [x] Landing Page
- [x] Login Page
- [x] Register Page
- [x] Auth Provider
- [x] API Client
- [x] TypeScript Types

### Phase 2: Dashboard & Journal ✅ (100%)
- [x] Dashboard Layout (Sidebar + Header)
- [x] Dashboard Page mit Stats
- [x] Grow Journal List (Grid)
- [x] Create Grow Form
- [x] Grow Detail mit Timeline
- [x] Entry Cards mit Measurements
- [x] 12 API Hooks (React Query)

### Phase 3: Community Forum ⏳ (0%)
- [ ] Thread List
- [ ] Thread Details mit Replies
- [ ] Voting System
- [ ] User Karma Display
- [ ] Moderation Interface

### Phase 4: Search & AI ⏳ (0%)
- [ ] Universal Search Bar
- [ ] Search Results Page
- [ ] AI Chat Interface
- [ ] Plant Diagnosis Upload
- [ ] Grow Advisor Form

### Phase 5: Extras ⏳ (0%)
- [ ] Price Comparison UI
- [ ] Calculator Tools UI
- [ ] User Profile Pages
- [ ] Settings Pages
- [ ] Notifications UI

---

## 🧪 Testing

```powershell
# Type Check
npm run type-check

# Lint
npm run lint

# Unit Tests (TODO)
npm run test

# E2E Tests (TODO)
npm run test:e2e
```

---

## 🚢 Production Build

```powershell
# Build für Production
npm run build

# Start Production Server
npm start
```

---

## 📝 Coding Standards

### Component Pattern
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  onSubmit: () => void;
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onSubmit} disabled={isLoading}>
        Submit
      </Button>
    </div>
  );
}
```

### API Hook Pattern
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';

export function useGrows() {
  return useQuery({
    queryKey: ['grows'],
    queryFn: async () => {
      const { data } = await api.get('/api/journal/grows');
      return data;
    }
  });
}

export function useCreateGrow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (growData) => {
      const { data } = await api.post('/api/journal/grows', growData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grows'] });
    }
  });
}
```

---

## 🔧 Tech Stack

**Frontend Framework:**
- Next.js 14.2
- React 18.3
- TypeScript 5.4

**UI & Styling:**
- Tailwind CSS 3.4
- shadcn/ui
- Lucide Icons
- next-themes (Dark Mode)
- Radix UI Primitives

**State Management:**
- TanStack Query 5 (Server State)
- React Context (Auth)
- Zustand (TODO - Client State)

**Forms:**
- React Hook Form 7.5
- Zod 3.22 (Validation)

**HTTP Client:**
- Axios 1.6
- js-cookie 3.0

---

## 📞 Support

**Projekt-Ordner:** `C:\--Projekte--\sf1-ultimate\apps\web-app\`

**Backend API:** http://localhost (Traefik Gateway)

**Dokumentation:**
- `README.md` - Diese Datei
- `FRONTEND_STATUS.md` - Detaillierter Status
- `QUICKSTART.md` - 5-Minuten-Guide

---

**Status:** ✅ Phase 1+2 Complete (Landing, Auth, Dashboard, Journal)  
**Next:** Phase 3 - Community Forum UI  
**Version:** 2.0.0  
**Last Updated:** 28.10.2025  
**Progress:** 40% Frontend / 75% Gesamt
