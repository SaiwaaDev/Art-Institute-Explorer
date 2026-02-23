/**
 * Zod Schema für die Validierung von Artwork-Daten aus der Art Institute of Chicago API
 *
 * Dieses Schema definiert die Struktur und Validierungsregeln für Kunstwerke,
 * die von der AIC API abgerufen werden. Es stellt sicher, dass alle erforderlichen
 * Felder vorhanden sind und bietet sinnvolle Standardwerte für optionale Felder.
 *
 * FR003: Artwork Zod Schema
 */

import { z } from "zod";

/**
 * Schema für ein einzelnes Kunstwerk
 *
 * Felder:
 * - id: Eindeutige Kennung des Kunstwerks (Nummer)
 * - title: Titel des Kunstwerks (mit Standardwert "Unbekannter Titel")
 * - artist_title: Name des Künstlers (mit Standardwert "Unbekannter Künstler")
 * - image_id: ID für das Bild des Kunstwerks (optional, null wenn nicht vorhanden)
 * - date_display: Anzeige-Datum des Kunstwerks (optional)
 * - medium_display: Material/Medium des Kunstwerks (optional)
 * - place_of_origin: Herkunftsort des Kunstwerks (optional)
 * - dimensions: Abmessungen des Kunstwerks (optional)
 */
export const ArtworkSchema = z.object({
  // Pflichtfeld: Eindeutige ID des Kunstwerks
  id: z.number(),

  // Titel mit Standardwert, falls nicht vorhanden
  title: z.string().default("Unbekannter Titel"),

  // Künstlername mit Standardwert, falls nicht vorhanden
  artist_title: z.string().nullable().default("Unbekannter Künstler"),

  // Bild-ID kann null sein, wenn kein Bild verfügbar ist
  image_id: z.string().nullable().default(null),

  // Optionale zusätzliche Informationen
  date_display: z.string().nullable().optional(),
  medium_display: z.string().nullable().optional(),
  place_of_origin: z.string().nullable().optional(),
  dimensions: z.string().nullable().optional(),
});

/**
 * Schema für die Antwort der AIC API
 *
 * Die API gibt ein Objekt mit einem `data` Array zurück,
 * das die Kunstwerke enthält.
 */
export const ArtworkAPIResponseSchema = z.object({
  data: z.array(ArtworkSchema),
  pagination: z
    .object({
      total: z.number(),
      limit: z.number(),
      offset: z.number(),
      total_pages: z.number(),
      current_page: z.number(),
    })
    .optional(),
});

/**
 * TypeScript-Typ, der aus dem Zod Schema abgeleitet wird
 * Dieser Typ wird in der gesamten Anwendung verwendet
 *
 * FR012: Typsicherer Status
 */
export type Artwork = z.infer<typeof ArtworkSchema>;

/**
 * TypeScript-Typ für die API-Antwort
 */
export type ArtworkAPIResponse = z.infer<typeof ArtworkAPIResponseSchema>;
