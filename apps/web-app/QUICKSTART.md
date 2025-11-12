# ⚡ SF-1 ULTIMATE - QUICK START GUIDE

**Frontend in 5 Minuten starten!**

---

## 🚀 SCHNELLSTART

### 1. Installation (PowerShell)
```powershell
cd C:\--Projekte--\sf1-ultimate\apps\web-app
.\install.ps1
```

### 2. Dev-Server starten
```powershell
npm run dev
```

### 3. Im Browser öffnen
```
http://localhost:3000
```

**Fertig!** 🎉

---

## 📋 ROUTES

- **Landing Page:** http://localhost:3000/landing
- **Login:** http://localhost:3000/auth/login
- **Register:** http://localhost:3000/auth/register

---

## 🔧 WENN ES NICHT FUNKTIONIERT

### Node.js fehlt?
```powershell
# Installiere Node.js 20+
# Download: https://nodejs.org/
```

### Dependencies fehlen?
```powershell
npm install
```

### .env.local fehlt?
```powershell
Copy-Item .env.local.example .env.local
```

### Backend nicht erreichbar?
```powershell
# Prüfe ob Backend-Services laufen
# API Gateway muss auf Port 80 erreichbar sein
```

---

## 📝 TEST-USER ERSTELLEN

1. Gehe zu: http://localhost:3000/auth/register
2. Fülle das Formular aus:
   - Email: test@example.com
   - Username: testuser
   - Password: Test1234
3. Klicke auf "Konto erstellen"
4. Du wirst automatisch eingeloggt und zum Dashboard weitergeleitet

---

## 🎯 WAS IST FERTIG?

- ✅ Landing Page (Marketing)
- ✅ Login Page (Email + OAuth)
- ✅ Register Page (Full Validation)
- ✅ Authentication (JWT + Auto-Refresh)
- ✅ Dark Mode Toggle
- ✅ Responsive Design

---

## 📂 PROJEKTSTRUKTUR

```
web-app/
├── src/
│   ├── app/              # Pages (Next.js App Router)
│   ├── components/       # React Components
│   ├── lib/             # Utils & API Client
│   └── types/           # TypeScript Types
├── package.json
└── README.md            # Vollständige Dokumentation
```

---

## 🔑 WICHTIGE BEFEHLE

```powershell
# Installation
npm install

# Dev-Server starten
npm run dev

# Production Build
npm run build
npm start

# Type Check
npm run type-check

# Linting
npm run lint
```

---

## 📞 HILFE

**Vollständige Docs:** `README.md` im web-app Ordner

**Status:** `FRONTEND_STATUS.md`

**Handover:** `FRONTEND_HANDOVER.md`

---

**Stand:** 28.10.2025  
**Version:** 1.0  
**Status:** ✅ Ready to use!
