/**
 * LocalStorage Helper für Galerie-Verwaltung
 *
 * Dieser Helper stellt CRUD-Operationen (Create, Read, Update, Delete)
 * für die Verwaltung gespeicherter Kunstwerke im Browser's LocalStorage bereit.
 *
 * FR008: Erstellen – Zur Galerie hinzufügen
 * FR009: Lesen – Galerie anzeigen
 * FR010: Aktualisieren – Notizen pro Kunstwerk
 * FR011: Löschen – Aus Galerie entfernen
 */

import { SavedArtworkSchema } from "../schemas/noteSchema";
import type { SavedArtwork } from "../schemas/noteSchema";
import type { Artwork } from "../schemas/artworkSchema";

/**
 * Schlüssel für den LocalStorage
 */
const GALLERY_STORAGE_KEY = "aic_gallery";

/**
 * Lädt alle gespeicherten Kunstwerke aus dem LocalStorage
 *
 * FR009: Lesen – Galerie anzeigen
 *
 * @returns Array von SavedArtwork-Objekten
 *
 * Diese Funktion:
 * - Liest die Daten aus dem LocalStorage
 * - Validiert jedes Kunstwerk mit dem SavedArtworkSchema
 * - Filtert ungültige Einträge heraus
 * - Gibt ein leeres Array zurück, wenn keine Daten vorhanden sind
 */
export function loadGallery(): SavedArtwork[] {
  try {
    // Lade die Daten aus dem LocalStorage
    const storedData = localStorage.getItem(GALLERY_STORAGE_KEY);

    // Wenn keine Daten vorhanden sind, gib ein leeres Array zurück
    if (!storedData) {
      return [];
    }

    // Parse das JSON
    const parsedData = JSON.parse(storedData);

    // Validiere, dass es sich um ein Array handelt
    if (!Array.isArray(parsedData)) {
      console.error("Gespeicherte Galerie-Daten sind kein Array");
      return [];
    }

    // Validiere jedes Element mit dem SavedArtworkSchema
    // und filtere ungültige Einträge heraus
    const validatedArtworks = parsedData
      .map((item) => {
        try {
          return SavedArtworkSchema.parse(item);
        } catch (error) {
          console.error("Ungültiges Artwork in Galerie:", error);
          return null;
        }
      })
      .filter((item): item is SavedArtwork => item !== null);

    return validatedArtworks;
  } catch (error) {
    console.error("Fehler beim Laden der Galerie:", error);
    return [];
  }
}

/**
 * Speichert die Galerie im LocalStorage
 *
 * @param gallery - Array von SavedArtwork-Objekten
 *
 * Diese Funktion ist eine interne Helper-Funktion,
 * die von den anderen CRUD-Funktionen verwendet wird.
 */
function saveGallery(gallery: SavedArtwork[]): void {
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(gallery));
  } catch (error) {
    console.error("Fehler beim Speichern der Galerie:", error);
    throw new Error("Galerie konnte nicht gespeichert werden");
  }
}

/**
 * Fügt ein Kunstwerk zur Galerie hinzu
 *
 * FR008: Erstellen – Zur Galerie hinzufügen
 *
 * @param artwork - Das hinzuzufügende Artwork-Objekt
 * @returns true wenn erfolgreich, false wenn das Artwork bereits existiert
 *
 * Diese Funktion:
 * - Lädt die aktuelle Galerie
 * - Prüft, ob das Kunstwerk bereits existiert
 * - Fügt das Kunstwerk mit einer leeren Notiz hinzu
 * - Speichert die aktualisierte Galerie
 */
export function addToGallery(artwork: Artwork): boolean {
  try {
    // Lade die aktuelle Galerie
    const gallery = loadGallery();

    // Prüfe, ob das Kunstwerk bereits in der Galerie ist
    const exists = gallery.some((item) => item.id === artwork.id);

    if (exists) {
      console.warn("Kunstwerk ist bereits in der Galerie");
      return false;
    }

    // Erstelle ein SavedArtwork-Objekt mit leerer Notiz
    const savedArtwork: SavedArtwork = {
      id: artwork.id,
      title: artwork.title,
      artist_title: artwork.artist_title,
      image_id: artwork.image_id,
      date_display: artwork.date_display,
      medium_display: artwork.medium_display,
      place_of_origin: artwork.place_of_origin,
      dimensions: artwork.dimensions,
      note: "", // Standardmäßig leere Notiz
    };

    // Validiere das SavedArtwork
    const validated = SavedArtworkSchema.parse(savedArtwork);

    // Füge das Kunstwerk hinzu
    gallery.push(validated);

    // Speichere die aktualisierte Galerie
    saveGallery(gallery);

    return true;
  } catch (error) {
    console.error("Fehler beim Hinzufügen zur Galerie:", error);
    throw new Error("Kunstwerk konnte nicht zur Galerie hinzugefügt werden");
  }
}

/**
 * Aktualisiert die Notiz eines gespeicherten Kunstwerks
 *
 * FR010: Aktualisieren – Notizen pro Kunstwerk
 *
 * @param artworkId - Die ID des Kunstwerks
 * @param note - Die neue Notiz (maximal 500 Zeichen)
 * @returns true wenn erfolgreich, false wenn das Kunstwerk nicht gefunden wurde
 *
 * Diese Funktion:
 * - Lädt die aktuelle Galerie
 * - Findet das Kunstwerk anhand der ID
 * - Aktualisiert die Notiz (mit Validierung)
 * - Speichert die aktualisierte Galerie
 */
export function updateNote(artworkId: number, note: string): boolean {
  try {
    // Validiere die Notizlänge
    if (note.length > 500) {
      throw new Error("Notiz darf maximal 500 Zeichen lang sein");
    }

    // Lade die aktuelle Galerie
    const gallery = loadGallery();

    // Finde das Kunstwerk
    const artworkIndex = gallery.findIndex((item) => item.id === artworkId);

    if (artworkIndex === -1) {
      console.warn("Kunstwerk nicht in der Galerie gefunden");
      return false;
    }

    // Aktualisiere die Notiz
    gallery[artworkIndex].note = note;

    // Validiere das aktualisierte Kunstwerk
    gallery[artworkIndex] = SavedArtworkSchema.parse(gallery[artworkIndex]);

    // Speichere die aktualisierte Galerie
    saveGallery(gallery);

    return true;
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Notiz:", error);
    throw new Error("Notiz konnte nicht aktualisiert werden");
  }
}

/**
 * Entfernt ein Kunstwerk (und seine Notiz) aus der Galerie
 *
 * FR011: Löschen – Aus Galerie entfernen
 *
 * @param artworkId - Die ID des zu entfernenden Kunstwerks
 * @returns true wenn erfolgreich, false wenn das Kunstwerk nicht gefunden wurde
 *
 * Diese Funktion:
 * - Lädt die aktuelle Galerie
 * - Filtert das Kunstwerk heraus
 * - Speichert die aktualisierte Galerie
 */
export function removeFromGallery(artworkId: number): boolean {
  try {
    // Lade die aktuelle Galerie
    const gallery = loadGallery();

    // Prüfe, ob das Kunstwerk existiert
    const exists = gallery.some((item) => item.id === artworkId);

    if (!exists) {
      console.warn("Kunstwerk nicht in der Galerie gefunden");
      return false;
    }

    // Filtere das Kunstwerk heraus
    const updatedGallery = gallery.filter((item) => item.id !== artworkId);

    // Speichere die aktualisierte Galerie
    saveGallery(updatedGallery);

    return true;
  } catch (error) {
    console.error("Fehler beim Entfernen aus der Galerie:", error);
    throw new Error("Kunstwerk konnte nicht aus der Galerie entfernt werden");
  }
}

/**
 * Prüft, ob ein Kunstwerk bereits in der Galerie ist
 *
 * @param artworkId - Die ID des Kunstwerks
 * @returns true wenn das Kunstwerk in der Galerie ist, sonst false
 *
 * Diese Funktion wird verwendet, um den Zustand der "Zur Galerie hinzufügen"-Schaltfläche
 * zu bestimmen (z.B. um sie zu deaktivieren, wenn das Kunstwerk bereits gespeichert ist).
 */
export function isInGallery(artworkId: number): boolean {
  const gallery = loadGallery();
  return gallery.some((item) => item.id === artworkId);
}

/**
 * Löscht die gesamte Galerie
 *
 * @returns void
 *
 * Diese Funktion kann für Debug-Zwecke oder eine "Galerie zurücksetzen"-Funktion
 * verwendet werden.
 */
export function clearGallery(): void {
  try {
    localStorage.removeItem(GALLERY_STORAGE_KEY);
  } catch (error) {
    console.error("Fehler beim Löschen der Galerie:", error);
    throw new Error("Galerie konnte nicht gelöscht werden");
  }
}
