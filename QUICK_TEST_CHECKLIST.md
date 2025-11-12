# ✅ SF-1 ULTIMATE - QUICK TEST CHECKLISTE
**Stand:** 01.11.2025 | **Für:** Schnelle Basis-Tests

---

## 🚀 QUICK START (5 Minuten)

### 1. Installation
```powershell
cd C:\--Projekte--\sf1-ultimate\apps\web-app
npm install
```
- [ ] ✅ Keine Errors
- [ ] ✅ `node_modules` erstellt

### 2. Server starten
```powershell
npm run dev
```
- [ ] ✅ Startet auf Port 3000
- [ ] ✅ Keine Compilation-Errors
- [ ] ✅ Browser öffnet automatisch

### 3. Basis-Check
- [ ] ✅ Landing Page lädt (http://localhost:3000)
- [ ] ✅ Keine Console-Errors
- [ ] ✅ Design sieht gut aus (3D-Effekte sichtbar)

---

## 📱 CORE PAGES (10 Minuten)

### Landing
- [ ] http://localhost:3000
- [ ] Hero-Section angezeigt
- [ ] Navigation funktioniert
- [ ] Links klickbar

### Auth
- [ ] http://localhost:3000/auth/login
- [ ] http://localhost:3000/auth/register
- [ ] Forms sichtbar
- [ ] Inputs funktionieren

### Dashboard
- [ ] http://localhost:3000/dashboard
- [ ] Nach Login erreichbar
- [ ] Sidebar angezeigt
- [ ] Kein Crash

### Journal
- [ ] http://localhost:3000/journal
- [ ] Liste lädt (oder Empty-State)
- [ ] "New Journal" Button sichtbar

### Community
- [ ] http://localhost:3000/community
- [ ] Forum lädt
- [ ] Threads angezeigt (oder Empty-State)

### Search
- [ ] http://localhost:3000/search
- [ ] Search-Input funktioniert
- [ ] Kein Crash beim Tippen

### AI Chat
- [ ] http://localhost:3000/ai/chat
- [ ] Chat-Interface lädt
- [ ] Input-Field sichtbar
- [ ] "Send" Button vorhanden

### Tools
- [ ] http://localhost:3000/tools
- [ ] 6 Calculator-Cards angezeigt
- [ ] Icons sichtbar
- [ ] Links funktionieren

### VPD Calculator
- [ ] http://localhost:3000/tools/vpd
- [ ] Form lädt
- [ ] Inputs funktionieren
- [ ] "Berechnen" Button vorhanden

### Prices
- [ ] http://localhost:3000/prices
- [ ] Search-Input sichtbar
- [ ] Kein Crash

---

## 🎨 DESIGN CHECK (5 Minuten)

### Auf jeder Page prüfen:
- [ ] 3D-Effekte sichtbar (neo-deep Cards)
- [ ] Grüne Farbpalette (kein Gold!)
- [ ] Handwritten Fonts (Überschriften)
- [ ] Smooth Hover-Effekte
- [ ] Custom Scrollbars (wenn scrollbar)

### Header Check:
- [ ] Search Bar im Header
- [ ] Theme-Toggle (Sun/Moon)
- [ ] Notifications-Icon
- [ ] User-Menu

---

## 🔧 FUNKTIONS-CHECK (10 Minuten)

### Search Bar (im Header):
1. Tippe "test"
2. [ ] Dropdown öffnet
3. [ ] Suggestions erscheinen (oder "Keine Ergebnisse")
4. [ ] Enter → Search Page

### Calculator (VPD als Beispiel):
1. Öffne /tools/vpd
2. Setze Temp: 24, Humidity: 60
3. Click "Berechnen"
4. [ ] Ergebnis angezeigt
5. [ ] Status-Text angezeigt (z.B. "Vegetativ optimal")
6. [ ] Info-Section sichtbar

### Navigation:
1. Click auf verschiedene Menu-Items
2. [ ] Pages wechseln ohne Reload
3. [ ] Active-State richtig
4. [ ] Kein Crash

---

## ⚠️ FEHLER CHECKEN

### In Browser Console (F12):
- [ ] Keine roten Errors
- [ ] Keine "Failed to fetch" Warnings (außer Backend nicht läuft)
- [ ] Keine Hydration-Errors
- [ ] Keine Missing-Module Errors

### Häufige Errors & Fixes:

**"Module not found: react-markdown"**
```powershell
npm install react-markdown@^9.0.1
```

**"date-fns Error"**
```powershell
npm install date-fns@^3.6.0
```

**"API Call failed"**
→ Backend läuft nicht (ist OK für Frontend-Tests)
→ Oder .env.local fehlt

**"Hydration Error"**
→ Server/Client Mismatch
→ Meist bei date-fns oder dynamic content
→ Fix: 'use client' directive

---

## 📋 QUICK REPORT

Nach Tests ausfüllen:

**Datum:** [DD.MM.YYYY]
**Dauer:** [Minuten]

### Ergebnis:
- [ ] ✅ Alle Tests passed
- [ ] 🟡 Teilweise passed (Details unten)
- [ ] ❌ Major Issues (Details unten)

### Gefundene Probleme:
1. [Problem 1]
2. [Problem 2]
3. [...]

### Nächste Schritte:
- [ ] Bugs in BUG_TRACKER.md eintragen
- [ ] Fixes implementieren
- [ ] Re-Test durchführen

---

## 🎯 ERFOLGS-KRITERIEN

**Minimum für "PASS":**
- ✅ Installation funktioniert
- ✅ Dev-Server startet
- ✅ Mind. 5 Pages laden ohne Crash
- ✅ Design sieht gut aus (3D-Effekte)
- ✅ Keine Critical Console-Errors

**Das wäre toll:**
- ✅ Alle Pages laden
- ✅ Search funktioniert
- ✅ Calculator funktioniert
- ✅ Alle Komponenten sichtbar

---

## 📞 WENN PROBLEME

1. **Errors beim npm install:**
   ```powershell
   npm install --legacy-peer-deps
   ```

2. **Server startet nicht:**
   ```powershell
   # Port 3000 belegt?
   npm run dev -- -p 3001
   ```

3. **Viele Errors:**
   → Siehe TEST_AND_FIX_PLAN.md (detailliert)
   → Siehe BUG_TRACKER.md (Dokumentation)

4. **Frage stellen:**
   → Beschreibe Problem genau
   → Copy-Paste Error-Message
   → Welche Page/Action?

---

**Erstellt:** 01.11.2025
**Version:** 1.0
**Status:** Ready to Use! ✅
