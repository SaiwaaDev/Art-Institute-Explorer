/**
 * Gallery Komponente
 *
 * Zeigt die persönliche Galerie der gespeicherten Kunstwerke an.
 * Ermöglicht das Verwalten von Notizen und das Entfernen von Kunstwerken.
 *
 * FR007: Galeriekomponente
 * FR009: Lesen – Galerie anzeigen
 * FR010: Aktualisieren – Notizen pro Kunstwerk
 * FR011: Löschen – Aus Galerie entfernen
 * FR012: Typsicherer Status
 */

import React, { useState, useEffect } from "react";
import type { SavedArtwork } from "../schemas/noteSchema";
import {
  loadGallery,
  removeFromGallery,
  updateNote,
} from "../utils/galleryStorage";
import { ArtworkCard } from "./ArtworkCard";
import { NoteEditor } from "./NoteEditor";

/**
 * Gallery Komponente
 *
 * Verwaltet die Darstellung und Interaktion mit der persönlichen Galerie.
 */
export const Gallery: React.FC = () => {
  /**
   * State für die gespeicherten Kunstwerke
   */
  const [gallery, setGallery] = useState<SavedArtwork[]>([]);

  /**
   * State für das aktuell bearbeitete Kunstwerk (für Notizen)
   */
  const [editingArtwork, setEditingArtwork] = useState<{
    id: number;
    currentNote: string;
  } | null>(null);

  /**
   * State für Fehlermeldungen
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Lädt die Galerie aus dem LocalStorage
   */
  const loadGalleryData = () => {
    try {
      const savedArtworks = loadGallery();
      setGallery(savedArtworks);
      setError(null);
    } catch (err) {
      console.error("Fehler beim Laden der Galerie:", err);
      setError("Galerie konnte nicht geladen werden");
    }
  };

  /**
   * Effect Hook: Lade die Galerie beim ersten Rendern
   */
  useEffect(() => {
    loadGalleryData();
  }, []);

  /**
   * Handler für das Entfernen eines Kunstwerks aus der Galerie
   *
   * FR011: Löschen – Aus Galerie entfernen
   */
  const handleRemoveFromGallery = (artworkId: number) => {
    try {
      const success = removeFromGallery(artworkId);

      if (success) {
        // Aktualisiere die Galerie
        loadGalleryData();

        // Schließe den Notiz-Editor, falls das entfernte Kunstwerk bearbeitet wurde
        if (editingArtwork && editingArtwork.id === artworkId) {
          setEditingArtwork(null);
        }
      }
    } catch (err) {
      console.error("Fehler beim Entfernen aus der Galerie:", err);
      setError("Kunstwerk konnte nicht entfernt werden");
    }
  };

  /**
   * Handler für das Öffnen des Notiz-Editors
   *
   * FR010: Aktualisieren – Notizen pro Kunstwerk
   */
  const handleEditNote = (artworkId: number, currentNote: string) => {
    setEditingArtwork({
      id: artworkId,
      currentNote,
    });
  };

  /**
   * Handler für das Speichern einer Notiz
   *
   * FR010: Aktualisieren – Notizen pro Kunstwerk
   */
  const handleSaveNote = (artworkId: number, note: string) => {
    try {
      const success = updateNote(artworkId, note);

      if (success) {
        // Aktualisiere die Galerie
        loadGalleryData();

        // Schließe den Notiz-Editor
        setEditingArtwork(null);
        setError(null);
      }
    } catch (err) {
      console.error("Fehler beim Speichern der Notiz:", err);
      setError("Notiz konnte nicht gespeichert werden");
    }
  };

  /**
   * Handler für das Abbrechen der Notiz-Bearbeitung
   */
  const handleCancelEdit = () => {
    setEditingArtwork(null);
  };

  return (
    <div className="w-full">
      {/* Galerie-Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meine Galerie</h1>
        <p className="text-base-content/70">
          {gallery.length} Kunstwerk{gallery.length !== 1 ? "e" : ""}{" "}
          gespeichert
        </p>
      </div>

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

      {/* Notiz-Editor Modal */}
      {editingArtwork && (
        <NoteEditor
          artworkId={editingArtwork.id}
          currentNote={editingArtwork.currentNote}
          onSave={handleSaveNote}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Galerie-Grid */}
      {gallery.length > 0 ? (
        <div className="search-results-bg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gallery.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onRemoveFromGallery={handleRemoveFromGallery}
                onEditNote={handleEditNote}
                note={artwork.note}
              />
            ))}
          </div>
        </div>
      ) : (
        // Leerzustand (wenn die Galerie leer ist)
        <div className="search-results-bg">
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xl font-semibold text-gray-300 mt-4 mb-2">
              Ihre Galerie ist leer
            </p>
            <p className="text-gray-300">
              Suchen Sie nach Kunstwerken und fügen Sie Ihre Favoriten hinzu
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
