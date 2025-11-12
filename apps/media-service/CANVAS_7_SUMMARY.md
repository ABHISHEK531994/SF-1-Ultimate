# 🎉 CANVAS #7 - MEDIA SERVICE - ZUSAMMENFASSUNG

## ✅ KOMPLETT IMPLEMENTIERT

### 📂 25+ Dateien erstellt in `apps/media-service/`

---

## 📊 ÜBERSICHT

**Zentrale Upload-Pipeline für:**
- Journal-Fotos (Grow-Diary)
- Community-Attachments (Forum)
- User-Avatars
- Strain-Bilder

---

## 🗄️ MODELS (2)

### 1. File.model.ts
- Original-File + 4 Thumbnail-Größen
- Storage-Keys (S3)
- URLs (CDN-ready)
- Metadata (Width, Height, Duration)
- Processing-Status
- File-Type Classification
- Virus-Scan-Status
- EXIF-Strip-Flag
- Linked-To (Entities)
- Download-Counter
- Soft-Delete

### 2. Quota.model.ts
- Upload-Limit (FREE: 500 MB, PREMIUM: 5 GB)
- File-Count-Limit (FREE: 1000, PREMIUM: 10000)
- Current Usage (MB + Count)
- Monthly Reset
- Virtuals: remainingMB, usagePercent, isQuotaExceeded
- Statics: getOrCreate, increment, decrement, resetMonthly

---

## 🔧 SERVICES (6)

### 1. StorageService
```typescript
✅ upload()           - S3-Upload mit S3 SDK
✅ uploadBatch()      - Parallel-Upload
✅ delete()           - S3-Delete
✅ deleteBatch()      - Parallel-Delete
✅ getSignedUrl()     - Temporäre URLs
✅ getPublicUrl()     - CDN/Direct URL
✅ generateKey()      - Storage-Key-Pattern
```

**Unterstützt:**
- AWS S3
- MinIO (Self-Hosted)
- CDN-URLs (CloudFront/Cloudflare)

### 2. ProcessingService
```typescript
✅ processImage()           - EXIF-Strip + Multi-Size
✅ generateThumbnail()      - Einzelne Größe
✅ processVideoThumbnail()  - Video-Thumbnail (Placeholder)
✅ processBatch()           - Parallel-Processing
✅ extractExif()            - EXIF vor Strip
✅ convertFormat()          - Format-Konvertierung
✅ optimize()               - Bild-Optimierung
```

**Thumbnail-Größen:**
- 150x150 (Cover)
- 300x300 (Cover)
- 800x800 (Inside)
- 1200x1200 (Inside)
- Original: Max 2048px (Inside)

### 3. UploadService
```typescript
✅ upload()              - Single-Upload (Orchestrator)
✅ uploadBatch()         - Multi-Upload
✅ validateFile()        - Typ + Größe-Check
✅ delete()              - File + S3-Cleanup
✅ getFile()             - Details
✅ getUserFiles()        - User-Gallery
✅ linkToEntity()        - Verknüpfung
✅ unlinkFromEntity()    - Verknüpfung entfernen
```

**Pipeline:**
1. Quota-Check
2. Validation
3. Processing (je nach Typ)
4. S3-Upload (parallel)
5. DB-Entry
6. Quota-Update
7. Virus-Scan (async)

### 4. QuotaService
```typescript
✅ getOrCreate()        - Quota initialisieren
✅ checkQuota()         - Pre-Upload-Check
✅ incrementUsage()     - Nach Upload
✅ decrementUsage()     - Nach Delete
✅ upgradeToPremium()   - 5 GB Limit
✅ downgradeToFree()    - 500 MB Limit
✅ resetAllQuotas()     - Monatlicher Reset
✅ getStats()           - Dashboard-Daten
```

### 5. VirusScanService
```typescript
✅ init()            - ClamAV-Connection
✅ scanBuffer()      - Sync-Scan
✅ queueScan()       - Async via Redis-Queue
✅ processQueue()    - Worker
✅ scanFile()        - DB-File scannen
✅ getStatus()       - ClamAV-Verfügbarkeit
```

**Optional:** Läuft auch ohne ClamAV

### 6. Utils
- **mime-types.ts** - MIME-Type-Helpers
- **errors.ts** - AppError + ErrorHandler
- **logger.ts** - Logging-Utility

---

## 📡 API ROUTES (3)

### 1. Upload Routes (/api/media)
```
POST /upload           → Single-Upload
POST /upload/multi     → Multi-Upload (max 20)
POST /upload/avatar    → Avatar-Shortcut
```

**Request:**
```typescript
FormData {
  file: File,
  category: 'avatar' | 'journal' | 'community' | 'strain',
  generateThumbnails: boolean,
  linkToType: string,
  linkToId: string
}
```

**Response:**
```typescript
{
  file: {
    id: string,
    filename: string,
    url: string,
    thumbnailUrl: string,
    smallUrl: string,
    mediumUrl: string,
    largeUrl: string,
    width: number,
    height: number,
    size: number,
    ...
  }
}
```

### 2. Files Routes (/api/media/files)
```
GET    /              → Eigene Files
GET    /:id           → Details
DELETE /:id           → Löschen
POST   /:id/link      → Verknüpfen
DELETE /:id/link      → Verknüpfung lösen
```

### 3. Quota Routes (/api/media/quota)
```
GET  /              → Stats
POST /upgrade       → Premium
POST /downgrade     → Free
```

---

## 🔑 KEY FEATURES

### 1. Multi-Format-Support
- ✅ **Images:** JPEG, PNG, WebP, GIF
- ✅ **Videos:** MP4, WebM
- ✅ **Documents:** PDF

### 2. Auto-Thumbnails
- ✅ 4 Größen parallel generiert
- ✅ Optimierte Qualität (80-90%)
- ✅ Format: JPEG (für Kompatibilität)

### 3. EXIF-Strip
- ✅ Alle Metadaten entfernt (Privacy)
- ✅ Auto-Rotate (basierend auf EXIF)
- ✅ Nur Safe-Metadata gespeichert (Width, Height)

### 4. S3-Storage
- ✅ AWS S3
- ✅ MinIO (Self-Hosted)
- ✅ Path-Style (für MinIO)
- ✅ CDN-Support

### 5. Quota-Management
- ✅ FREE: 500 MB / 1000 Files
- ✅ PREMIUM: 5 GB / 10000 Files
- ✅ Monatlicher Reset
- ✅ Pre-Upload-Check

### 6. Virus-Scan
- ✅ ClamAV-Integration
- ✅ Async-Queue (blockiert Upload nicht)
- ✅ Optional (läuft auch ohne)

### 7. Entity-Linking
- ✅ Files mit Grows, Entries, Threads verknüpfen
- ✅ Cleanup bei Delete
- ✅ Tracking (linkedTo-Array)

---

## 📊 STORAGE-PATTERN

```
s3://sf1-media/
├── journal/
│   └── user123/
│       ├── abc123.jpg
│       ├── abc123_thumbnail.jpg
│       ├── abc123_small.jpg
│       ├── abc123_medium.jpg
│       └── abc123_large.jpg
├── community/
│   └── user456/
│       └── def456.jpg
├── avatar/
│   └── user789/
│       └── ghi789.jpg
└── strain/
    └── admin1/
        └── jkl012.jpg
```

---

## 🔐 SECURITY

### Validation
- ✅ Allowed MIME-Types
- ✅ Max File-Size: 50 MB
- ✅ Max Files per Batch: 20
- ✅ Quota-Check pre-upload

### Privacy
- ✅ EXIF komplett entfernt
- ✅ User-Files isoliert
- ✅ Optional: Signed URLs

### Virus-Scan
- ✅ ClamAV-Integration
- ✅ Async (blockiert nicht)
- ✅ Status in DB

---

## 📈 PERFORMANCE

### Optimierungen
- ✅ **Parallel Processing:** Thumbnails gleichzeitig
- ✅ **Parallel Upload:** S3-Uploads gleichzeitig
- ✅ **Sharp:** Schnellstes Image-Processing (libvips)
- ✅ **Memory-Storage:** Keine Disk-I/O
- ✅ **CDN-Ready:** CloudFront/Cloudflare

### Ressourcen (K8s)
- **CPU Request:** 200m
- **CPU Limit:** 1000m
- **Memory Request:** 512 Mi
- **Memory Limit:** 2 Gi
- **Temp-Storage:** 5 Gi (EmptyDir)

---

## 🔗 INTEGRATION

### Journal-Service (Migration)
**Alt (Duplikation):**
```typescript
// photo.service.ts - Sharp direkt
const processedImage = await sharp(buffer)...
await s3Client.send(...)
```

**Neu (Zentral):**
```typescript
// Delegiere an Media-Service
const formData = new FormData();
formData.append('file', file);

const response = await fetch('http://media-service:3008/api/media/upload', {
  method: 'POST',
  body: formData,
  headers: { 'x-user-id': userId }
});

const { file } = await response.json();
```

### Community-Service
```typescript
// Thread-Attachments
await uploadService.uploadBatch({
  userId,
  files,
  options: {
    category: 'community',
    linkTo: { type: 'thread', id: threadId }
  }
});
```

---

## 🐳 DEPLOYMENT

### Kubernetes
- **Replicas:** 2
- **Service:** ClusterIP (Port 3008)
- **Secrets:** S3-Credentials, MongoDB, Redis
- **Optional:** ClamAV-Sidecar

### Docker
```bash
docker build -t media-service .
docker run -p 3008:3008 \
  -e MONGODB_URL=... \
  -e REDIS_URL=... \
  -e S3_BUCKET=sf1-media \
  media-service
```

---

## 📦 DEPENDENCIES

```json
{
  "@aws-sdk/client-s3": "^3.470.0",
  "@aws-sdk/s3-request-presigner": "^3.470.0",
  "sharp": "^0.33.1",
  "multer": "^1.4.5-lts.1",
  "mongoose": "^8.0.3",
  "redis": "^4.6.11",
  "nanoid": "^5.0.4",
  "express": "^4.18.2"
}
```

---

## 📊 STATISTIKEN

**Canvas #7:**
- ~25 Dateien
- ~2.500 Zeilen TypeScript
- 2 Models
- 6 Services
- 3 Route-Handler
- ~15 API-Endpoints

**Gesamt-Projekt (Canvas #1-7):**
- ~165 Dateien
- ~14.500 Zeichen TypeScript
- 23+ Models
- 31+ Services
- ~125+ Endpoints

---

## 🎯 NÄCHSTER SCHRITT

**Canvas #8: Gamification Service**
- XP-System
- Badges + Achievements
- Leaderboards
- User-Reputation
- Event-Processing (Redis-Queue)

---

## 🔗 DATEIEN

**Alle Dateien in:**
`C:\--Projekte--\sf1-ultimate\apps\media-service\`

**Wichtigste:**
- `src/models/` - 2 MongoDB-Schemas
- `src/services/` - 6 Business-Logic-Services
- `src/routes/` - 3 API-Router
- `src/utils/` - MIME-Types, Errors, Logger
- `k8s/deployment.yml` - Kubernetes-Config
- `README.md` - Vollständige Doku

---

**Status:** ✅ Canvas #7 komplett fertig!
**Port:** 3008
**Token verbleibend:** ~73.000
**Nächste Aktion:** Canvas #8 (Gamification Service) starten
