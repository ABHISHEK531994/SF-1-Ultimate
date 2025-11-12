# 🐛 SF-1 ULTIMATE - BUG TRACKER
**Stand:** 12.11.2025 20:00 Uhr

---

## 🔥 CRITICAL BUGS (Blocker!)

### Bug #1: JWT generateAccessToken fehlt
**Status:** 🔴 Open  
**Severity:** Critical  
**Priority:** P0 (Highest)

**Problem:**
```
TypeError: (0 , import_jwt.generateAccessToken) is not a function
```

**Location:**
- File: `apps/auth-service/src/services/jwt.service.ts`
- Called from: `apps/auth-service/src/controllers/auth.controller.ts:15,30`

**Impact:**
- ❌ User kann sich nicht registrieren
- ❌ User kann sich nicht einloggen
- ❌ Keine Auth möglich
- ❌ Gesamtes Projekt nicht nutzbar

**Reproduction:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!","username":"testuser"}'

# Response: {"message":"Error"}
# Logs: TypeError: generateAccessToken is not a function
```

**Root Cause (Vermutung):**
1. Funktion `generateAccessToken` existiert nicht in jwt.service.ts
2. ODER: Export ist falsch (default vs named)
3. ODER: Import im Controller ist falsch

**Fix (Geschätzt):**
- Option A: Funktion implementieren (30 Min)
- Option B: Export/Import korrigieren (10 Min)

**Estimated Time:** 30-45 Min

**Assignee:** Next Session

**Related Files:**
- `apps/auth-service/src/services/jwt.service.ts`
- `apps/auth-service/src/controllers/auth.controller.ts`

**Tests to Run:**
```bash
# Nach Fix:
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"fixed@test.com","password":"Test1234!","username":"fixeduser"}'

# Erwartetes Ergebnis:
# {"token":"eyJhbG...","user":{...}}
```

---

## ⚠️ HIGH PRIORITY BUGS

### Bug #2: Frontend nicht getestet
**Status:** 🟡 Unknown  
**Severity:** High  
**Priority:** P1

**Problem:**
Frontend wurde noch nicht gestartet, Status unklar.

**Mögliche Probleme:**
- Dependencies fehlen (react-markdown?)
- Type-Errors
- API-Client Fehler
- .env.local falsch konfiguriert

**Location:**
- `apps/web-app/`

**Fix:**
```powershell
cd C:\--Projekte--\sf1-ultimate\apps\web-app
npm install
npm run dev
```

**Estimated Time:** 1-2 Stunden

---

### Bug #3: API Gateway nicht getestet
**Status:** 🟡 Unknown  
**Severity:** High  
**Priority:** P1

**Problem:**
Traefik Gateway läuft, aber Routing wurde nicht getestet.

**Mögliche Probleme:**
- PathPrefix Syntax falsch (wurde mal gefixt?)
- CORS nicht konfiguriert
- Services nicht erreichbar

**Tests:**
```bash
curl http://localhost:8080/api/auth/health
curl http://localhost:8080/api/prices/search?q=test
```

**Estimated Time:** 30 Min

---

## 🔵 MEDIUM PRIORITY BUGS

### Bug #4: Andere Services ungetestet
**Status:** 🟡 Unknown  
**Severity:** Medium  
**Priority:** P2

**Problem:**
10 von 11 Services laufen, aber wurden nicht getestet.

**Services:**
- Price Service (Port 3002)
- Journal Service (Port 3003)
- Tools Service (Port 3004)
- Community Service (Port 3005)
- Notification Service (Port 3006)
- Search Service (Port 3007)
- Media Service (Port 3008)
- Gamification Service (Port 3009)
- AI Service (Port 3010)

**Tests:**
```bash
for port in 3002 3003 3004 3005 3006 3007 3008 3009 3010; do
  echo "Testing port $port:"
  curl http://localhost:$port/health
done
```

**Estimated Time:** 2 Stunden (alle testen)

---

## ✅ FIXED BUGS

### Bug #F1: PostgreSQL Tabellen fehlen
**Status:** ✅ Fixed  
**Fixed On:** 12.11.2025 19:30

**Problem:**
```
The table `public.User` does not exist in the current database.
```

**Solution:**
- Tabellen existierten bereits!
- Error kam vom ersten Start bevor Tabellen erstellt wurden
- Logs zeigten alte Errors

**Fix:**
Service-Neustart hat altes Error-Log gelöscht.

---

### Bug #F2: PostgreSQL User unbekannt
**Status:** ✅ Fixed  
**Fixed On:** 12.11.2025 19:20

**Problem:**
```
FATAL: role "sf1" does not exist
```

**Solution:**
- User heißt `sf1_user` (nicht `sf1`)
- Gefunden via: `docker inspect sf1-postgres | grep POSTGRES_USER`

**Fix:**
Korrekten User verwendet: `psql -U sf1_user`

---

## 📊 BUG STATISTIK

**Total Bugs:** 6  
**Critical:** 1 🔴  
**High:** 2 🟡  
**Medium:** 1 🔵  
**Fixed:** 2 ✅  

**Blocker:** 1 (JWT)  
**Open:** 4  
**In Progress:** 0  

---

## 📋 BUG WORKFLOW

### Status-Codes:
- 🔴 Open (Critical)
- 🟡 Open (High/Medium)
- 🔵 Open (Low)
- 🟢 In Progress
- ✅ Fixed
- ❌ Won't Fix

### Priority:
- P0: Critical (Blocker)
- P1: High (Major Feature broken)
- P2: Medium (Feature partly broken)
- P3: Low (Minor issue)

---

## 🔧 DEBUG COMMANDS

### Auth-Service:
```bash
# Logs
docker logs sf1-auth-service --tail 50

# In Container
docker exec -it sf1-auth-service sh

# JWT Service checken
docker exec sf1-auth-service cat src/services/jwt.service.ts

# Auth Controller checken
docker exec sf1-auth-service cat src/controllers/auth.controller.ts
```

### PostgreSQL:
```bash
# Login
docker exec -it sf1-postgres psql -U sf1_user -d sf1_auth

# Tables zeigen
\dt

# User checken
SELECT * FROM "User";
```

### Service Health-Checks:
```bash
# Alle Services
for port in 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010; do
  echo "Port $port:"
  curl -s http://localhost:$port/health | jq .
done
```

---

**Last Updated:** 12.11.2025 20:00  
**Next Review:** Nach JWT-Fix
