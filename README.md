# Art Institute Explorer

> Ein interaktives Tool zum Durchsuchen der Sammlung des Art Institute of Chicago mit persönlicher Galeriefunktion

![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-7.3-purple)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.2-06B6D4)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5.5-5A0EF8)
![Zod](https://img.shields.io/badge/Zod-4.3-3E67B1)

## 📋 Übersicht

Art Institute Explorer ist eine React-TypeScript-Anwendung, die es Benutzern ermöglicht:

- 🔍 **Kunstwerke suchen**: Durchsuchen Sie die umfangreiche Sammlung des Art Institute of Chicago
- ❤️ **Favoriten speichern**: Speichern Sie Ihre Lieblingskunstwerke in einer persönlichen Galerie
- 📝 **Notizen hinzufügen**: Fügen Sie persönliche Notizen zu Ihren gespeicherten Kunstwerken hinzu
- 🔒 **Typsicherheit**: Vollständige TypeScript-Unterstützung mit Zod-Validierung

## 🚀 Technologie-Stack

- **Frontend Framework**: React 19.2 mit TypeScript
- **Build Tool**: Vite 7.3
- **Styling**: Tailwind CSS 4.2 + DaisyUI 5.5
- **Validierung**: Zod 4.3
- **Datenspeicherung**: Browser LocalStorage
- **API**: Art Institute of Chicago Public API

## 📦 Installation

### Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn

### Schritte

1. **Repository klonen oder herunterladen**

```bash
cd art-institution-explorer
```

2. **Abhängigkeiten installieren**

```bash
npm install
```

3. **Entwicklungsserver starten**

```bash
npm run dev
```

Die Anwendung ist nun unter `http://localhost:5173` verfügbar.

## 🏗️ Projektstruktur

```
art-institution-explorer/
├── public/                      # Statische Assets
├── src/
│   ├── components/              # React-Komponenten
│   │   ├── ArtworkCard.tsx     # Wiederverwendbare Komponente für einzelne Kunstwerke
│   │   ├── SearchInterface.tsx # Suchschnittstelle für die API
│   │   ├── Gallery.tsx         # Galerie-Ansicht für gespeicherte Kunstwerke
│   │   └── NoteEditor.tsx      # Modal für Notizbearbeitung
│   ├── schemas/                 # Zod-Validierungsschemas
│   │   ├── artworkSchema.ts    # Schema für Kunstwerk-Daten
│   │   └── noteSchema.ts       # Schema für Notizen
│   ├── utils/                   # Hilfsfunktionen
│   │   ├── artworkApi.ts       # API-Wrapper mit Validierung
│   │   └── galleryStorage.ts   # LocalStorage-CRUD-Operationen
│   ├── App.tsx                  # Hauptkomponente
│   ├── App.css                  # Globale Styles
│   ├── index.css                # CSS-Reset und Tailwind-Imports
│   └── main.tsx                 # Einstiegspunkt
├── index.html                   # HTML-Template
├── package.json                 # Projekt-Abhängigkeiten
├── tsconfig.json                # TypeScript-Konfiguration
├── tailwind.config.js           # Tailwind-CSS-Konfiguration
└── vite.config.ts               # Vite-Konfiguration
```

## 🎯 Funktionen

### 1. Kunstwerk-Suche

- Suche nach Künstlern, Titeln, Stilen und mehr
- Echtzeit-Suche mit der Art Institute of Chicago API
- Validierung aller API-Daten mit Zod-Schemas
- Responsive Grid-Darstellung der Suchergebnisse

### 2. Persönliche Galerie

- Speicherung von Lieblingskunstwerken im Browser
- Persistente Datenhaltung mit LocalStorage
- Übersichtliche Grid-Darstellung aller gespeicherten Werke

### 3. Notizen-Verwaltung (CRUD)

- **Create**: Notizen zu neuen Kunstwerken hinzufügen
- **Read**: Gespeicherte Notizen in der Galerie anzeigen
- **Update**: Notizen bearbeiten und aktualisieren
- **Delete**: Kunstwerke (mit Notizen) aus der Galerie entfernen

### 4. Typsicherheit

- Vollständige TypeScript-Integration
- Zod-Schemas für Runtime-Validierung
- Type-Safe API-Calls und Datenverarbeitung

## 📝 Anforderungskatalog

Die Anwendung erfüllt folgende funktionale Anforderungen:

| ID    | Anforderung                           | Status |
| ----- | ------------------------------------- | ------ |
| FR001 | React + Vite (TypeScript) einrichten  | ✅     |
| FR002 | Kernabhängigkeiten installieren (Zod) | ✅     |
| FR003 | Artwork Zod Schema                    | ✅     |
| FR004 | API-Abruf mit Validierung             | ✅     |
| FR005 | Suchschnittstelle                     | ✅     |
| FR006 | ArtworkCard-Komponente                | ✅     |
| FR007 | Galeriekomponente                     | ✅     |
| FR008 | Erstellen – Zur Galerie hinzufügen    | ✅     |
| FR009 | Lesen – Galerie anzeigen              | ✅     |
| FR010 | Aktualisieren – Notizen pro Kunstwerk | ✅     |
| FR011 | Löschen – Aus Galerie entfernen       | ✅     |
| FR012 | Typsicherer Status                    | ✅     |

## 🔧 Verfügbare Scripts

```bash
# Entwicklungsserver starten
npm run dev

# Produktions-Build erstellen
npm run build

# Produktions-Build lokal testen
npm run preview

# Linting ausführen
npm run lint
```

## 🌐 API-Informationen

Die Anwendung nutzt die öffentliche API des Art Institute of Chicago:

- **API-Dokumentation**: https://api.artic.edu/docs/
- **Basis-URL**: https://api.artic.edu/api/v1
- **Bild-URL**: https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg

### Verwendete Endpunkte

- `GET /artworks/search` - Suche nach Kunstwerken
- `GET /artworks/{id}` - Details zu einem spezifischen Kunstwerk

## 💾 Datenspeicherung

Die Anwendung verwendet den Browser's LocalStorage zur Speicherung:

- **Schlüssel**: `aic_gallery`
- **Format**: JSON-Array von `SavedArtwork`-Objekten
- **Validierung**: Alle gespeicherten Daten werden mit Zod-Schemas validiert

## 🎨 Styling

- **TailwindCSS 4.2**: Utility-First CSS Framework
- **DaisyUI 5.5**: Komponenten-Bibliothek für Tailwind
- **Responsive Design**: Mobile-First Ansatz
- **Dark Mode**: Unterstützt durch DaisyUI

## 🧪 Code-Qualität

- **TypeScript**: Strenge Typsicherheit
- **Zod**: Runtime-Validierung aller externen Daten
- **ESLint**: Code-Linting und Best Practices
- **Ausführliche Kommentare**: Alle Funktionen sind dokumentiert

## 📄 Lizenz

Dieses Projekt wurde im Rahmen eines Bildungsprojekts erstellt.

Die API-Daten werden vom Art Institute of Chicago bereitgestellt und unterliegen deren Nutzungsbedingungen.

## 🤝 Mitwirken

Da dies ein Bildungsprojekt ist, sind Beiträge willkommen! Fühlen Sie sich frei, Issues zu erstellen oder Pull Requests einzureichen.

## 📞 Support

Bei Fragen oder Problemen können Sie:

- Ein Issue im Repository erstellen
- Die Dokumentation der [Art Institute API](https://api.artic.edu/docs/) konsultieren
- Die [React-Dokumentation](https://react.dev/) besuchen

---

**Erstellt mit ❤️ und TypeScript**

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
