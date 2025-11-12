# Gamification Service — SF-1 Ultimate

XP-System, Achievements, Badges & Leaderboards mit Event-Processing.

## ✨ Features

- **XP-System** mit 100 Levels (Formel: 100 * level^1.5)
- **30+ Achievements** (Grow, Social, Community, Milestones)
- **Badges** (Achievement-basiert, Special, Event, Premium)
- **Leaderboards** (Global: XP, Reputation, Level)
- **User-Reputation** (Karma-Score)
- **Streaks** (Daily Activity-Tracking)
- **Event-Queue-Processing** (Redis)

## 📦 Models

1. **UserProfile** - XP, Level, Badges, Achievements, Stats
2. **Achievement** - Unlockable Achievements
3. **Badge** - Visual Badges
4. **Event** - Event-Log (mit TTL: 90 Tage)

## 📡 API Endpoints

### Profile
```
GET /api/gamification/profile/:userId         → Full Profile
GET /api/gamification/profile/:userId/summary → Compact
GET /api/gamification/leaderboard             → Top Users
```

## 🎯 XP-Rewards

| Event | XP |
|-------|---|
| grow:created | +10 |
| grow:harvested | +50 |
| entry:created | +5 |
| photo:uploaded | +2 |
| thread:created | +10 |
| reply:created | +5 |
| best_answer:received | +50 |
| upvote:received | +2 |
| comment:added | +3 |

## 🏆 Achievement-Kategorien

- **Grow** - Grows, Harvests, Yield, Efficiency
- **Social** - Posts, Replies, Helpful Answers
- **Community** - Threads, Upvotes, Reputation
- **Milestone** - Level, XP, Badges
- **Special** - Streaks, Events

## 🔄 Event-Processing

Services senden Events an Redis-Queue:

```typescript
await redis.lpush('queue:gamification', JSON.stringify({
  type: 'grow:harvested',
  data: { userId, growId, yieldDry, efficiency },
  timestamp: Date.now()
}));
```

Worker verarbeitet:
1. XP vergeben
2. Stats aktualisieren
3. Achievement-Check
4. Badge vergeben (bei Achievement)
5. Level-Up-Notification

## 🚀 Development

```bash
npm install
npm run dev
```

---

**Status:** ✅ Canvas #8 komplett
**Port:** 3009
