/**
 * API Helper für die Art Institute of Chicago API
 *
 * Dieser Helper stellt Funktionen bereit, um die AIC API abzufragen
 * und die Antworten mit Zod-Schemas zu validieren.
 *
 * FR004: API-Abruf mit Validierung
 */

import { ArtworkAPIResponseSchema } from "../schemas/artworkSchema";
import type { Artwork } from "../schemas/artworkSchema";

/**
 * Basis-URL der Art Institute of Chicago API
 */
const AIC_API_BASE_URL = "https://api.artic.edu/api/v1";

/**
 * Basis-URL für Bilder
 * Format: {BASE_URL}/{image_id}/full/843,/0/default.jpg
 */
const AIC_IMAGE_BASE_URL = "https://www.artic.edu/iiif/2";

/**
 * Rückgabetyp für paginierte Suchergebnisse
 */
export interface SearchResult {
  data: Artwork[];
  total: number;
  offset: number;
  limit: number;
}

/**
 * Sucht nach Kunstwerken in der AIC API mit Pagination-Unterstützung
 *
 * @param query - Suchbegriff (z.B. Künstlername, Titel, etc.)
 * @param limit - Maximale Anzahl der Ergebnisse pro Seite (Standard: 20)
 * @param offset - Anzahl der zu übersprungenen Ergebnisse für Pagination (Standard: 0)
 * @returns Promise mit Objekt containing Artworks-Array und Metadaten
 * @throws Error wenn die API-Anfrage fehlschlägt oder die Validierung nicht erfolgreich ist
 *
 * Beispiel:
 * ```typescript
 * const results = await searchArtworks('monet', 20, 0);
 * console.log(results.data); // Array von Artworks
 * console.log(results.total); // Gesamtanzahl aller Ergebnisse
 * ```
 */
export async function searchArtworks(
  query: string,
  limit: number = 20,
  offset: number = 0,
): Promise<SearchResult> {
  try {
    // Wenn die Suche leer ist, geben wir ein leeres Ergebnis zurück
    if (!query.trim()) {
      return { data: [], total: 0, offset, limit };
    }

    // Konstruiere die Such-URL mit den erforderlichen Feldern
    // Die API ermöglicht die Auswahl spezifischer Felder zur Reduzierung der Antwortgröße
    const fields = [
      "id",
      "title",
      "artist_title",
      "image_id",
      "date_display",
      "medium_display",
      "place_of_origin",
      "dimensions",
    ].join(",");

    const url = new URL(`${AIC_API_BASE_URL}/artworks/search`);
    url.searchParams.append("q", query);
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("offset", offset.toString());
    url.searchParams.append("fields", fields);

    // Führe die HTTP-Anfrage aus
    const response = await fetch(url.toString());

    // Prüfe, ob die Anfrage erfolgreich war
    if (!response.ok) {
      throw new Error(
        `API-Anfrage fehlgeschlagen: ${response.status} ${response.statusText}`,
      );
    }

    // Parse das JSON
    const json = await response.json();

    // Validiere die Antwort mit dem Zod-Schema
    // Das Schema stellt sicher, dass alle erforderlichen Felder vorhanden sind
    // und fügt Standardwerte für fehlende optionale Felder hinzu
    const validatedResponse = ArtworkAPIResponseSchema.parse(json);

    // Gib Daten mit Metadaten zurück
    return {
      data: validatedResponse.data,
      total: json.pagination?.total || 0,
      offset,
      limit,
    };
  } catch (error) {
    // Bei Validierungsfehlern oder Netzwerkfehlern
    if (error instanceof Error) {
      console.error("Fehler beim Abrufen der Kunstwerke:", error.message);
      throw new Error(
        `Kunstwerke konnten nicht geladen werden: ${error.message}`,
      );
    }

    throw new Error("Ein unbekannter Fehler ist aufgetreten");
  }
}

/**
 * Erstellt die vollständige Bild-URL für ein Kunstwerk
 *
 * @param imageId - Die image_id des Kunstwerks
 * @param size - Die gewünschte Breite in Pixeln (Standard: 843)
 * @returns Die vollständige Bild-URL oder null wenn keine image_id vorhanden ist
 *
 * Beispiel:
 * ```typescript
 * const imageUrl = getImageUrl('abc123');
 * // Ergebnis: "https://www.artic.edu/iiif/2/abc123/full/843,/0/default.jpg"
 * ```
 */
export function getImageUrl(
  imageId: string | null,
  size: number = 843,
): string | null {
  if (!imageId) {
    return null;
  }

  return `${AIC_IMAGE_BASE_URL}/${imageId}/full/${size},/0/default.jpg`;
}

/**
 * Ruft Details zu einem spezifischen Kunstwerk ab
 *
 * @param artworkId - Die ID des Kunstwerks
 * @returns Promise mit dem validierten Artwork-Objekt
 * @throws Error wenn die API-Anfrage fehlschlägt oder die Validierung nicht erfolgreich ist
 *
 * Beispiel:
 * ```typescript
 * const artwork = await getArtworkById(123456);
 * ```
 */
export async function getArtworkById(artworkId: number): Promise<Artwork> {
  try {
    const fields = [
      "id",
      "title",
      "artist_title",
      "image_id",
      "date_display",
      "medium_display",
      "place_of_origin",
      "dimensions",
    ].join(",");

    const url = `${AIC_API_BASE_URL}/artworks/${artworkId}?fields=${fields}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `API-Anfrage fehlgeschlagen: ${response.status} ${response.statusText}`,
      );
    }

    const json = await response.json();

    // Validiere das einzelne Artwork
    const validatedArtwork = ArtworkAPIResponseSchema.parse({
      data: [json.data],
    });

    return validatedArtwork.data[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Fehler beim Abrufen des Kunstwerks:", error.message);
      throw new Error(
        `Kunstwerk konnte nicht geladen werden: ${error.message}`,
      );
    }

    throw new Error("Ein unbekannter Fehler ist aufgetreten");
  }
}
