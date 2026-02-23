/**
 * App Komponente - Hauptkomponente der Anwendung
 *
 * Diese Komponente orchestriert die gesamte Anwendung und stellt:
 * - Navigation zwischen Suche und Galerie bereit
 * - Layout und Struktur der Anwendung
 *
 * FR001: React + Vite (TypeScript) einrichten
 * FR012: Typsicherer Status
 */

import { useState } from "react";
import { SearchInterface } from "./components/SearchInterface";
import { Gallery } from "./components/Gallery";
import "./App.css";

/**
 * Ansichts-Typ für die Navigation
 */
type View = "search" | "gallery";

/**
 * App Komponente
 *
 * Hauptkomponente der Art Institute Explorer Anwendung.
 */
function App() {
  /**
   * State für die aktuelle Ansicht
   * Standard: 'search' (Suchansicht)
   */
  const [currentView, setCurrentView] = useState<View>("search");

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header mit Navigation */}
      <header className="bg-base-100 shadow-lg sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          {/* Logo und Titel */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-7xl font-bold text-[#ac8d5a] header-title">
                Art Institute Explorer
              </h1>
              <p className="text-2xl text-base-content/70 text-[#fceee0] header-subtitle">
                Kunstwerke aus dem Art Institute of Chicago
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div role="tablist" className="tabs tabs-boxed bg-base-200">
            {/* Such-Tab */}
            <button
              role="tab"
              className={`tab ${currentView === "search" ? "tab-active" : ""}`}
              onClick={() => setCurrentView("search")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Suche
            </button>

            {/* Galerie-Tab */}
            <button
              role="tab"
              className={`tab ${currentView === "gallery" ? "tab-active" : ""}`}
              onClick={() => setCurrentView("gallery")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Meine Galerie
            </button>
          </div>
        </div>
      </header>

      {/* Hauptinhalt */}
      <main className="container mx-auto px-4 py-8">
        {/* Bedingte Darstellung der Ansichten */}
        {currentView === "search" && <SearchInterface />}
        {currentView === "gallery" && <Gallery />}
      </main>

      {/* Footer */}
      <footer className="bg-base-100 mt-12 py-6 border-t border-base-300">
        <div className="container mx-auto px-4 text-center text-base-content/60">
          <p>
            Ein Miniprojekt der{" "}
            <a
              href="https://www.wbscodingschool.com/de/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary"
            >
              WBS Coding School
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
