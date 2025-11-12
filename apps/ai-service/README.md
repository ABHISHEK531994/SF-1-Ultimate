# 🤖 AI Service - SF-1 Ultimate

OpenAI-powered Plant Diagnosis & Growing Advisor.

## 🎯 Features

- **Plant Diagnosis** - GPT-4 Vision analysiert Pflanzenprobleme anhand von Fotos
- **Grow Advisor** - Personalisierte Empfehlungen für Strain, Setup, Harvest
- **AI Chat** - Interaktiver Cannabis-Growing-Assistent
- **Multi-Modal** - Text + Vision (Fotos)

## 🚀 API Endpoints

### Diagnosis
```bash
# Mit Bildern
POST /api/ai/diagnose
Content-Type: multipart/form-data
- images: [file1, file2, ...]
- symptoms: "Gelbe Blätter, braune Spitzen"
- growSetup: {"medium": "Coco", "ph": 6.2}

# Quick (ohne Bilder)
POST /api/ai/diagnose/quick
{"symptoms": "Gelbe untere Blätter", "setup": {...}}

# Häufige Probleme
GET /api/ai/diagnose/common
```

### Advisor
```bash
# Allgemeine Beratung
POST /api/ai/advice
{"question": "Wann sollte ich in die Blüte wechseln?", "userContext": {...}}

# Strain-Empfehlung
POST /api/ai/advice/strain
{"experienceLevel": "beginner", "growType": "indoor", "goals": ["high-yield"]}

# Setup-Optimierung
POST /api/ai/advice/setup
{"space": "80x80x160cm", "lights": "LED 240W", ...}

# Harvest-Timing
POST /api/ai/advice/harvest
Content-Type: multipart/form-data
- images: [trichome-photo.jpg]
- strain: "Gorilla Glue"
- weekInFlower: 8
```

### Chat
```bash
# Neue Message
POST /api/ai/chat
{"message": "Was ist VPD?", "sessionId": "optional"}

# Sessions abrufen
GET /api/ai/chat/sessions

# Session löschen
DELETE /api/ai/chat/sessions/:id
```

## 🔧 Setup

### ENV-Variablen
```bash
PORT=3010
OPENAI_API_KEY=sk-...
REDIS_URL=redis://localhost:6379
```

### Development
```bash
npm install
npm run dev
```

## 💰 Cost Management

**Token-Kosten (Stand 2024):**
- GPT-4 Turbo: $0.01/1k input, $0.03/1k output
- GPT-4 Vision: $0.01/1k input, $0.03/1k output
- GPT-3.5 Turbo: $0.0005/1k input, $0.0015/1k output

**Geschätzte Kosten pro Request:**
- Diagnosis (mit Bild): ~$0.05-0.10
- Quick Diagnosis: ~$0.01-0.02
- Advice: ~$0.03-0.05
- Chat: ~$0.005-0.01

**Optimierungen:**
- GPT-3.5 für Chat (günstiger)
- GPT-4 Vision nur wenn nötig
- Token-Limits gesetzt
- Response-Caching (Redis)

## 🎨 Example Requests

### Diagnose mit Foto
```bash
curl -X POST http://localhost:3010/api/ai/diagnose \
  -H "x-user-id: user123" \
  -F "images=@plant.jpg" \
  -F "symptoms=Gelbe Blätter" \
  -F 'growSetup={"medium":"Coco","ph":6.2}'
```

Response:
```json
{
  "diagnosis": "Stickstoffmangel",
  "cause": "Zu niedriger N-Gehalt in Nährlösung",
  "solution": [
    "Erhöhe Grow-Dünger auf 2ml/L",
    "Prüfe pH-Wert (optimal: 5.8-6.2)",
    "Spüle Substrat mit pH-neutralem Wasser"
  ],
  "prevention": [
    "Regelmäßig füttern (alle 2-3 Tage)",
    "EC-Wert messen (sollte 1.2-1.6 sein)"
  ],
  "confidence": "high"
}
```

### Strain-Empfehlung
```bash
curl -X POST http://localhost:3010/api/ai/advice/strain \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{
    "experienceLevel": "beginner",
    "growType": "indoor",
    "goals": ["high-yield", "easy-grow"],
    "budget": "medium"
  }'
```

Response:
```json
{
  "strains": [
    {
      "name": "Northern Lights",
      "reason": "Sehr anfängerfreundlich, robust, verzeiht Fehler",
      "pros": ["Hoher Ertrag", "Schnelle Blüte (7-8 Wochen)", "Resistent"],
      "cons": ["Mittlere Potenz (~18% THC)"]
    },
    {
      "name": "Critical Kush",
      "reason": "Extrem ertragreich, einfach zu growen",
      "pros": ["Massiver Yield (600g/m²)", "Kurze Blüte", "Günstige Seeds"],
      "cons": ["Braucht gute Luftzirkulation"]
    }
  ]
}
```

## 🏗️ Architektur

```
┌──────────┐
│  Client  │
└─────┬────┘
      │
      ▼
┌────────────┐
│ AI Service │
│  (Express) │
└──┬──────┬──┘
   │      │
   ▼      ▼
┌─────┐ ┌──────┐
│OpenAI│ │Redis │
│ API  │ │(Cache)│
└─────┘ └──────┘
```

## 🔐 Security

- **Auth-Middleware** - Nur für eingeloggte User
- **Rate-Limiting** - Max 10 Requests/Min (TODO)
- **Input-Validation** - Multer File-Filter
- **API-Key-Schutz** - OpenAI Key nur in K8s Secrets

## 📊 Monitoring

- Token-Usage-Tracking (TODO)
- Cost-Tracking (TODO)
- Response-Time-Metrics
- Error-Rate-Monitoring

## 🎯 Roadmap

- [ ] Fine-tuned Model für Cannabis
- [ ] Image-Generation (DALL-E 3) für Visualisierungen
- [ ] Voice-Input Support
- [ ] Multi-Language (DE/EN/ES/FR)
- [ ] Cost-Alerts (wenn > $X/Tag)
- [ ] Response-Caching für häufige Fragen
