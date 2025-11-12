# 🐛 SF-1 ULTIMATE - BUG TRACKER
**Stand:** 01.11.2025 | **Status:** Testing in Progress

---

## 🔴 CRITICAL BUGS (App nicht nutzbar)

### BUG-001: [Titel]
**Status:** 🔴 Open / 🟡 In Progress / ✅ Fixed
**Gefunden:** [Datum]
**Page/Component:** [URL oder Component-Name]
**Priorität:** Critical

**Beschreibung:**
[Was ist das Problem?]

**Steps to Reproduce:**
1. [Schritt 1]
2. [Schritt 2]
3. [Schritt 3]

**Expected Behavior:**
[Was sollte passieren?]

**Actual Behavior:**
[Was passiert tatsächlich?]

**Error Message/Screenshot:**
```
[Error-Log oder Screenshot-Link]
```

**Fix:**
[Was wurde gemacht um zu fixen?]

**Files Changed:**
- `src/...`

**Re-Test:**
- [ ] Bug behoben
- [ ] Keine neuen Bugs

---

## 🟡 MAJOR BUGS (Feature nicht nutzbar)

### BUG-101: [Titel]
**Status:** 🔴 Open
**Gefunden:** [Datum]
**Page/Component:** [...]
**Priorität:** Major

[Wie oben...]

---

## 🟢 MINOR BUGS (Kosmetisch/UX)

### BUG-201: [Titel]
**Status:** 🔴 Open
**Gefunden:** [Datum]
**Page/Component:** [...]
**Priorität:** Minor

[Wie oben...]

---

## ✅ FIXED BUGS

### BUG-XXX: [Titel]
**Status:** ✅ Fixed
**Fixed:** [Datum]
**Fix-Details:** [...]

---

## 📊 STATISTIK

**Total Bugs:** 0
**Critical:** 0
**Major:** 0
**Minor:** 0
**Fixed:** 0
**Open:** 0

---

## 🔧 HÄUFIGE PROBLEME & LÖSUNGEN

### Problem: "Module not found" Error
**Lösung:**
```powershell
npm install
npm install [missing-package]
```

### Problem: "Hydration Error"
**Lösung:**
```tsx
// Server/Client Mismatch
// Use 'use client' directive oder
// Dynamic Import mit ssr: false
```

### Problem: "API Call Failed"
**Lösung:**
```tsx
// .env.local prüfen:
NEXT_PUBLIC_API_URL=http://localhost

// CORS im Backend prüfen
```

### Problem: "Type Error in TypeScript"
**Lösung:**
```powershell
npm run type-check
# Einzelne Errors fixen
```

---

**Template für neuen Bug:**
```markdown
### BUG-XXX: [Kurzer Titel]
**Status:** 🔴 Open
**Gefunden:** [Datum]
**Page/Component:** [URL/Component]
**Priorität:** Critical/Major/Minor

**Beschreibung:**
[Problem beschreiben]

**Steps to Reproduce:**
1. [...]
2. [...]

**Expected:** [...]
**Actual:** [...]

**Error:**
```[paste error]```

**Fix:** [TBD]
```
