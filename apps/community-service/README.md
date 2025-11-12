# Community Service — SF-1 Ultimate

Reddit-ähnliches Forum-System mit Moderation, Reputation & Best Answers.

## ✨ Features

- **Thread-System** mit Kategorien & Tags
- **Nested Replies** (bis 3 Ebenen)
- **Upvote/Downvote** System
- **Best Answer Marking**
- **Moderation-Tools** (Reports, Bans, Pin/Lock)
- **Spam-Filter** & User-Reputation
- **Markdown-Support**
- **@Mentions**
- **Volltext-Suche**

## 📊 Models

1. **Category** - Forum-Kategorien
2. **Thread** - Diskussions-Threads
3. **Reply** - Antworten (nested)
4. **Vote** - Upvotes/Downvotes
5. **Report** - Content-Meldungen
6. **Ban** - User-Sperren

## 🔗 API Endpoints

### Threads
```
POST   /api/community/threads            → Thread erstellen
GET    /api/community/threads            → Feed (sortierbar)
GET    /api/community/threads/:id        → Details
PATCH  /api/community/threads/:id        → Update
DELETE /api/community/threads/:id        → Löschen
POST   /api/community/threads/:id/solve  → Best Answer markieren
GET    /api/community/threads/search     → Volltext-Suche
```

### Replies
```
POST   /api/community/replies                   → Reply erstellen
GET    /api/community/threads/:id/replies       → Alle Replies
PATCH  /api/community/replies/:id               → Update
DELETE /api/community/replies/:id               → Löschen
```

### Votes
```
POST /api/community/vote              → Vote erstellen/ändern
POST /api/community/votes/batch       → User-Votes abrufen
GET  /api/community/votes/top         → Top-Voted Content
```

### Moderation (Mod-Only)
```
POST   /api/community/reports                 → Content melden
GET    /api/community/reports                 → Reports abrufen
PATCH  /api/community/reports/:id/review     → Report bearbeiten
POST   /api/community/bans                    → User bannen
DELETE /api/community/bans/:userId            → Ban aufheben
POST   /api/community/threads/:id/pin        → Thread pinnen
POST   /api/community/threads/:id/lock       → Thread locken
GET    /api/community/moderation/stats       → Dashboard
```

### Categories
```
GET  /api/community/categories       → Alle Kategorien
GET  /api/community/categories/:slug → Details
POST /api/community/categories       → Erstellen (Mod-Only)
```

## 🚀 Development

```bash
npm install
npm run dev     # Watch-Mode
npm run build   # Produktions-Build
npm start       # Produktions-Start
```

## 🔑 ENV Variables

```bash
PORT=3005
NODE_ENV=production
MONGODB_URL=mongodb://...
REDIS_URL=redis://...
```

## 🐳 Docker

```bash
docker build -t community-service .
docker run -p 3005:3005 community-service
```

## 📦 Tech Stack

- **Express** - Web-Framework
- **MongoDB** - Datenbank
- **Redis** - Cache + Queue
- **Zod** - Validation
- **TypeScript** - Typsicherheit

## 🎯 Gamification-Events

Events werden an Redis-Queue gesendet:

- `thread:created` → +10 XP
- `reply:created` → +5 XP
- `best_answer:received` → +50 XP + Badge
- `upvote:received` → +2 XP

## 🛡️ Moderation-Features

1. **Reports** - User können Content melden
2. **Auto-Ban** - Bei X Reports automatisch
3. **Temp/Perm Bans** - Temporär oder dauerhaft
4. **Content-Removal** - Threads/Replies löschen
5. **Pin/Lock** - Threads oben fixieren/sperren

## 📈 Sort-Optionen

- **Latest** - Neueste zuerst (Standard)
- **Trending** - Viele Replies/Views (7 Tage)
- **Top** - Höchste Upvotes
- **Unanswered** - Ohne Antworten

## 🔍 Volltext-Suche

MongoDB Text-Index auf:
- Thread-Titel
- Thread-Content
- Tags

## ⚠️ Rate-Limits

- Thread erstellen: 5/Stunde
- Reply erstellen: 30/Stunde
- Vote: 100/Stunde
- Report: 10/Tag

(Wird im Gateway implementiert)

---

**Status:** ✅ Canvas #6 komplett
**Nächster Schritt:** Canvas #7 (Media Service)
