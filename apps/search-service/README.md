# 🔍 Search Service - SF-1 Ultimate

Meilisearch-basierter Search Service mit Real-time Indexing.

## 🎯 Features

- **Universal Search** - Alle Indexes gleichzeitig durchsuchen
- **Faceted Search** - Filter & Sortierung
- **Autocomplete** - Suggestions während Eingabe
- **Search History** - Recent & Popular Searches
- **Real-time Indexing** - Automatisches Sync via Queue
- **Multi-Index** - Strains, Threads, Grows, Users

## 📊 Indexes

1. **Strains** - Cannabis-Sorten (Name, Breeder, Genetics, Effects)
2. **Threads** - Community-Threads (Title, Content, Tags)
3. **Grows** - Grow-Tagebücher (Strain, Notes, Tags)
4. **Users** - User-Profile (Username, Bio)

## 🚀 API Endpoints

### Search
```bash
# Universal Search (alle Indexes)
GET /api/search?q=gorilla&limit=5

# Spezifischer Index
GET /api/search/strains?q=kush&filter=type=feminized&sort=thc:desc

# Autocomplete
GET /api/search/strains/suggest?q=gor&limit=5
```

### History
```bash
# Recent Searches
GET /api/search/history/recent?limit=10

# Popular Searches
GET /api/search/popular?limit=10

# Clear History
DELETE /api/search/history/recent
```

### Admin
```bash
# Reindex
POST /api/search/reindex/strains
POST /api/search/reindex/all

# Stats
GET /api/search/stats/STRAINS
```

## 🔧 Setup

### ENV-Variablen
```bash
PORT=3007
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_KEY=your-master-key
MONGODB_URL=mongodb://localhost:27017/sf1
REDIS_URL=redis://localhost:6379
```

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📦 Dependencies

- **meilisearch** - Search Engine
- **ioredis** - Caching & Queue
- **mongoose** - MongoDB für Reindexing
- **bull** - Job Queue für Sync

## 🏗️ Architektur

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Search Service │
│  (Express API)  │
└────┬───────┬────┘
     │       │
     ▼       ▼
┌─────────┐ ┌──────┐
│Meilisearch│ │Redis │
│ (Indexes)│ │(Cache)│
└─────────┘ └──────┘
     ▲
     │ Sync
     │
┌────────────┐
│ Sync Worker│
│  (Bull)    │
└────────────┘
```

## 🎨 Search Query Examples

### Basic Search
```javascript
// Strains suchen
GET /api/search/strains?q=gorilla

// Mit Filter
GET /api/search/strains?q=kush&filter=type=feminized AND thc>20

// Mit Sortierung
GET /api/search/strains?q=og&sort=thc:desc,name:asc
```

### Faceted Search
```javascript
// Mit Facets
GET /api/search/strains?q=haze&facets=type,breeder

// Response enthält:
{
  "hits": [...],
  "facets": {
    "type": { "feminized": 45, "autoflower": 12 },
    "breeder": { "Sensi Seeds": 15, "Barney's Farm": 10 }
  }
}
```

### Autocomplete
```javascript
GET /api/search/strains/suggest?q=gor
// → ["Gorilla Glue #4", "Gorilla Zkittlez", "Gorilla Cookies"]
```

## 🔄 Indexing

### Automatisches Sync
Events von anderen Services triggern automatisches Indexing:

```javascript
// Neuer Thread erstellt → Auto-Index
redis.lpush('queue:search-sync', {
  type: 'index',
  index: 'THREADS',
  document: { id: 'xxx', title: '...', ... }
});
```

### Manuelles Reindexing
```bash
# Einzelner Index
POST /api/search/reindex/strains

# Alle Indexes
POST /api/search/reindex/all
```

## 📈 Performance

- **Search**: < 10ms (gecacht), < 50ms (uncached)
- **Indexing**: ~1000 docs/sec
- **Cache-Hit-Rate**: > 80%
- **Index-Size**: ~100MB pro 10k Dokumente

## 🔐 Security

- API-Key für Meilisearch (Master Key)
- Auth-Middleware für Admin-Endpoints
- Rate-Limiting via Redis
- CORS-Protection

## 📝 TODO

- [ ] User-Index aus PostgreSQL
- [ ] Image-Search (AI-basiert)
- [ ] Multi-Language Support
- [ ] Geo-Search (Location-based)
- [ ] Synonym-Support
