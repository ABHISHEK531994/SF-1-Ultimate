# Notification Service - SF-1 Ultimate

Multi-Channel Notification System (In-App, Email, Push).

## Features

✅ **Multi-Channel** - In-App, Email, Push (FCM)
✅ **User Preferences** - Granulare Einstellungen pro Type
✅ **Email Digest** - Instant/Hourly/Daily
✅ **Quiet Hours** - Zeitgesteuertes Stummschalten
✅ **WebSocket** - Real-time In-App Notifications
✅ **Queue System** - BullMQ für Email/Push

## Notification Types

- `comment` - Kommentar auf Grow/Thread
- `reply` - Antwort auf Kommentar
- `reaction` - Reaction (🔥❄️😍)
- `follow` - Neuer Follower
- `mention` - @Erwähnung
- `price_alert` - Preisalarm
- `milestone` - Grow-Meilenstein
- `badge` - Neues Achievement
- `system` - System-Benachrichtigung

## API

```
GET    /api/notifications              - Liste
GET    /api/notifications/unread-count - Count
PATCH  /api/notifications/:id/read     - Als gelesen
POST   /api/notifications/read-all     - Alle gelesen
GET    /api/preferences                - Einstellungen
PATCH  /api/preferences                - Update
POST   /api/preferences/devices        - Push-Device registrieren
```

## WebSocket

```javascript
const socket = io('wss://api.seedfinderpro.de/ws/notifications');

socket.emit('auth', { userId, token });

socket.on('notification:new', (data) => {
  console.log('New notification:', data);
});
```

## Setup

```bash
npm install
npm run dev
```

## ENV

```bash
MONGODB_URL=...
REDIS_URL=...
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=...
SMTP_PASS=...
FIREBASE_CREDENTIALS={"type":"service_account",...}
```
