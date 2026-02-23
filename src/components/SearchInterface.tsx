/**
 * SearchInterface Komponente
 *
 * Eine Suchschnittstelle, über die Benutzer die Art Institute of Chicago API
 * nach Kunstwerken durchsuchen können.
 *
 * FR005: Suchschnittstelle
 * FR012: Typsicherer Status
 */

import React, { useState } from "react";
import type { Artwork } from "../schemas/artworkSchema";
import { searchArtworks, type SearchResult } from "../utils/artworkApi";
import { ArtworkCard } from "./ArtworkCard";
import { addToGallery, isInGallery } from "../utils/galleryStorage";

/**
 * SearchInterface Komponente
 *
 * Ermöglicht es Benutzern:
 * - Nach Kunstwerken zu suchen
 * - Suchergebnisse anzuzeigen
 * - Kunstwerke zur Galerie hinzuzufügen
 */
export const SearchInterface: React.FC = () => {
  /**
   * State für den Suchbegriff
   */
  const [searchQuery, setSearchQuery] = useState<string>("");

  /**
   * State für die Suchergebnisse
   */
  const [searchResults, setSearchResults] = useState<Artwork[]>([]);

  /**
   * State für die Gesamtanzahl der Suchergebnisse
   */
  const [totalResults, setTotalResults] = useState<number>(0);

  /**
   * State für die aktuelle Seite
   */
  const [currentPage, setCurrentPage] = useState<number>(1);

  /**
   * State für die letzte Suchabfrage (um seiten-übergreifende Suche zu ermöglichen)
   */
  const [lastSearchQuery, setLastSearchQuery] = useState<string>("");

  /**
   * Anzahl der Ergebnisse pro Seite
   */
  const RESULTS_PER_PAGE = 20;

  /**
   * State für den Ladezustand
   */
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * State für Fehlermeldungen
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * State für die Kunstwerke, die in der Galerie sind
   * (wird verwendet, um den Button-Status zu aktualisieren)
   */
  const [galleryIds, setGalleryIds] = useState<Set<number>>(new Set());

  /**
   * Lädt die aktuellen Galerie-IDs
   *
   * Diese Funktion wird aufgerufen, um zu überprüfen, welche Kunstwerke
   * bereits in der Galerie sind, damit die Buttons entsprechend aktualisiert werden können.
   */
  const loadGalleryIds = () => {
    const ids = new Set<number>();
    // Prüfe jedes Suchergebnis
    searchResults.forEach((artwork) => {
      if (isInGallery(artwork.id)) {
        ids.add(artwork.id);
      }
    });
    setGalleryIds(ids);
  };

  /**
   * Führt eine Suche durch mit optionalen Seitennummer
   */
  const performSearch = async (query: string, page: number = 1) => {
    // Validierung: Suchbegriff darf nicht leer sein
    if (!query.trim()) {
      setError("Bitte geben Sie einen Suchbegriff ein");
      return;
    }

    // Setze den Ladezustand
    setIsLoading(true);
    setError(null);
    setLastSearchQuery(query);
    setCurrentPage(page);

    try {
      // Berechne den offset basierend auf der Seitennummer
      const offset = (page - 1) * RESULTS_PER_PAGE;

      // Führe die Suche durch
      const result = await searchArtworks(query, RESULTS_PER_PAGE, offset);

      // Aktualisiere die Suchergebnisse
      setSearchResults(result.data);
      setTotalResults(result.total);

      // Wenn keine Ergebnisse gefunden wurden
      if (result.data.length === 0 && page === 1) {
        setError(
          "Keine Kunstwerke gefunden. Versuchen Sie einen anderen Suchbegriff.",
        );
      }
    } catch (err) {
      // Fehlerbehandlung
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ein unerwarteter Fehler ist aufgetreten");
      }
    } finally {
      // Setze den Ladezustand zurück
      setIsLoading(false);
    }
  };

  /**
   * Handler für das Absenden des Suchformulars
   */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Verhindert das Standard-Formular-Verhalten
    await performSearch(searchQuery, 1);
  };

  /**
   * Handler für das Ändern des Suchbegriffs
   */
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Entferne Fehlermeldung, wenn der Benutzer tippt
    if (error) {
      setError(null);
    }
  };

  /**
   * Handler für das Hinzufügen zur Galerie
   */
  const handleAddToGallery = (artwork: Artwork) => {
    try {
      const success = addToGallery(artwork);

      if (success) {
        // Aktualisiere die Galerie-IDs
        setGalleryIds((prev) => new Set(prev).add(artwork.id));

        // Optional: Zeige eine Erfolgsbenachrichtigung
        // (könnte mit einem Toast-System erweitert werden)
        console.log(`"${artwork.title}" wurde zur Galerie hinzugefügt`);
      }
    } catch (err) {
      console.error("Fehler beim Hinzufügen zur Galerie:", err);
      setError("Kunstwerk konnte nicht zur Galerie hinzugefügt werden");
    }
  };

  /**
   * Berechne die Gesamtanzahl der Seiten
   */
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  /**
   * Effect Hook: Lade die Galerie-IDs, wenn sich die Suchergebnisse ändern
   */
  React.useEffect(() => {
    if (searchResults.length > 0) {
      loadGalleryIds();
    }
  }, [searchResults]);

  return (
    <div className="w-full">
      {/* Suchformular */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          {/* Sucheingabefeld */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="Suche nach Künstler, Titel, Stil..."
            className="input input-bordered flex-1"
            disabled={isLoading}
          />

          {/* Such-Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Suche...
              </>
            ) : (
              "Suchen"
            )}
          </button>
        </div>

        {/* Hilfetext */}
        <p className="text-sm text-base-content/60 mt-2">
          Durchsuchen Sie die Kunstsammlung des Art Institute of Chicago
        </p>
      </form>

      {/* Fehlermeldung */}
      {error && (
        <div className="alert alert-error mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Lade-Indikator */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Suchergebnisse */}
      {!isLoading && searchResults.length > 0 && (
        <div className="search-results-bg">
          {/* Ergebnis-Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">Suchergebnisse</h2>
            <p className="text-gray-200">
              {totalResults.toLocaleString("de-DE")} Kunstwerk
              {totalResults !== 1 ? "e" : ""} gefunden
              {totalPages > 1 && ` (Seite ${currentPage} von ${totalPages})`}
            </p>
          </div>

          {/* Ergebnis-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onAddToGallery={handleAddToGallery}
                isInGallery={galleryIds.has(artwork.id)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              {/* Vorige Seite Button */}
              <button
                onClick={() => performSearch(lastSearchQuery, currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="btn btn-outline"
              >
                ← Zurück
              </button>

              {/* Seiten-Anzeige */}
              <span className="text-sm font-medium text-white">
                Seite {currentPage} von {totalPages}
              </span>

              {/* Nächste Seite Button */}
              <button
                onClick={() => performSearch(lastSearchQuery, currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="btn btn-outline"
              >
                Weiter →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Leerzustand (wenn noch nicht gesucht wurde) */}
      {!isLoading && searchResults.length === 0 && !error && (
        <div className="search-results-bg">
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-24 w-24 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-300 mt-4">
              Starten Sie eine Suche, um Kunstwerke zu entdecken
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;
