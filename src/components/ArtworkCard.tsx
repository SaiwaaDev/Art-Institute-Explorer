/**
 * ArtworkCard Komponente
 *
 * Eine wiederverwendbare Komponente zur Anzeige eines einzelnen Kunstwerks.
 * Zeigt das Bild, den Titel, den Künstler und optionale zusätzliche Informationen an.
 *
 * FR006: ArtworkCard-Komponente
 * FR012: Typsicherer Status
 */

import React from "react";
import type { Artwork } from "../schemas/artworkSchema";
import { getImageUrl } from "../utils/artworkApi";

/**
 * Props für die ArtworkCard Komponente
 */
interface ArtworkCardProps {
  /**
   * Das anzuzeigende Kunstwerk
   */
  artwork: Artwork;

  /**
   * Optionale Callback-Funktion, die aufgerufen wird, wenn der Benutzer
   * das Kunstwerk zur Galerie hinzufügen möchte
   */
  onAddToGallery?: (artwork: Artwork) => void;

  /**
   * Optionale Callback-Funktion, die aufgerufen wird, wenn der Benutzer
   * das Kunstwerk aus der Galerie entfernen möchte
   */
  onRemoveFromGallery?: (artworkId: number) => void;

  /**
   * Gibt an, ob das Kunstwerk bereits in der Galerie ist
   */
  isInGallery?: boolean;

  /**
   * Optionale Notiz zum Kunstwerk (nur in der Galerie-Ansicht)
   */
  note?: string;

  /**
   * Optionale Callback-Funktion, die aufgerufen wird, wenn der Benutzer
   * die Notiz bearbeiten möchte
   */
  onEditNote?: (artworkId: number, currentNote: string) => void;

  /**
   * Bestimmt, ob zusätzliche Informationen angezeigt werden sollen
   * (Standard: true)
   */
  showDetails?: boolean;
}

/**
 * Platzhalter-Bild, wenn kein Bild verfügbar ist
 */
const PLACEHOLDER_IMAGE = "/defaultPredator.png";

/**
 * ArtworkCard Komponente
 *
 * Zeigt ein Kunstwerk in einer ansprechenden Card-Darstellung an.
 * Verwendet DaisyUI-Klassen für das Styling.
 */
export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onAddToGallery,
  onRemoveFromGallery,
  isInGallery = false,
  note,
  onEditNote,
  showDetails = true,
}) => {
  /**
   * Erstellt die Bild-URL für das Kunstwerk
   */
  const imageUrl = getImageUrl(artwork.image_id) || PLACEHOLDER_IMAGE;

  /**
   * Handler für den "Zur Galerie hinzufügen"-Button
   */
  const handleAddToGallery = () => {
    if (onAddToGallery) {
      onAddToGallery(artwork);
    }
  };

  /**
   * Handler für den "Aus Galerie entfernen"-Button
   */
  const handleRemoveFromGallery = () => {
    if (onRemoveFromGallery) {
      onRemoveFromGallery(artwork.id);
    }
  };

  /**
   * Handler für den "Notiz bearbeiten"-Button
   */
  const handleEditNote = () => {
    if (onEditNote) {
      onEditNote(artwork.id, note || "");
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {/* Kunstwerk-Bild */}
      <figure className="h-64 overflow-hidden bg-base-200">
        <img
          src={imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback zum Platzhalter-Bild bei Fehler
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
          }}
        />
      </figure>

      {/* Card-Inhalt */}
      <div className="card-body">
        {/* Titel */}
        <h2 className="card-title text-lg line-clamp-2">{artwork.title}</h2>

        {/* Künstler */}
        <p className="text-sm text-base-content/70">
          {artwork.artist_title || "Unbekannter Künstler"}
        </p>

        {/* Zusätzliche Details (optional) */}
        {showDetails && (
          <div className="text-sm space-y-1 mt-2">
            {/* Datum */}
            {artwork.date_display && (
              <p className="text-base-content/60">
                <span className="font-semibold">Datum:</span>{" "}
                {artwork.date_display}
              </p>
            )}

            {/* Medium */}
            {artwork.medium_display && (
              <p className="text-base-content/60 line-clamp-1">
                <span className="font-semibold">Medium:</span>{" "}
                {artwork.medium_display}
              </p>
            )}

            {/* Herkunft */}
            {artwork.place_of_origin && (
              <p className="text-base-content/60">
                <span className="font-semibold">Herkunft:</span>{" "}
                {artwork.place_of_origin}
              </p>
            )}
          </div>
        )}

        {/* Notiz-Anzeige (nur wenn eine Notiz vorhanden ist) */}
        {note && (
          <div className="mt-3 p-3 bg-base-200 rounded-lg">
            <p className="text-sm font-semibold mb-1">Notiz:</p>
            <p className="text-sm text-base-content/80 whitespace-pre-wrap">
              {note}
            </p>
          </div>
        )}

        {/* Card-Aktionen */}
        <div className="card-actions justify-end mt-4">
          {/* Notiz bearbeiten Button (nur in Galerie-Ansicht) */}
          {onEditNote && (
            <button onClick={handleEditNote} className="btn btn-sm btn-outline">
              {note ? "Notiz bearbeiten" : "Notiz hinzufügen"}
            </button>
          )}

          {/* Zur Galerie hinzufügen Button (nur in Such-Ansicht) */}
          {onAddToGallery && (
            <button
              onClick={handleAddToGallery}
              disabled={isInGallery}
              className={`btn btn-sm ${isInGallery ? "btn-disabled" : "btn-primary"}`}
              title={
                isInGallery ? "Bereits in Galerie" : "Zur Galerie hinzufügen"
              }
            >
              {isInGallery ? "In Galerie" : "Zur Galerie"}
            </button>
          )}

          {/* Aus Galerie entfernen Button (nur in Galerie-Ansicht) */}
          {onRemoveFromGallery && (
            <button
              onClick={handleRemoveFromGallery}
              className="btn btn-sm btn-error"
            >
              Entfernen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
