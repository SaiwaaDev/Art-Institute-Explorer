/**
 * Zod Schema für die Validierung von Notizen zu Kunstwerken
 *
 * Dieses Schema definiert die Struktur für benutzerdefinierten Notizen,
 * die zu gespeicherten Kunstwerken hinzugefügt werden können.
 *
 * FR010: Aktualisieren – Notizen pro Kunstwerk
 */

import { z } from "zod";

/**
 * Schema für eine Notiz
 *
 * Felder:
 * - artworkId: ID des zugehörigen Kunstwerks
 * - note: Der Notiztext (maximal 500 Zeichen)
 */
export const NoteSchema = z.object({
  // Die ID des Kunstwerks, zu dem diese Notiz gehört
  artworkId: z.number(),

  // Der Notiztext mit Validierung:
  // - Muss ein String sein
  // - Maximal 500 Zeichen lang
  // - Standardwert ist ein leerer String
  note: z
    .string()
    .max(500, "Notiz darf maximal 500 Zeichen lang sein")
    .default(""),
});

/**
 * TypeScript-Typ, der aus dem Zod Schema abgeleitet wird
 * Dieser Typ wird verwendet, um Typsicherheit zu gewährleisten
 */
export type Note = z.infer<typeof NoteSchema>;

/**
 * Schema für ein gespeichertes Kunstwerk mit Notiz
 *
 * Kombiniert die Artwork-Daten mit der zugehörigen Notiz
 */
export const SavedArtworkSchema = z.object({
  // Artwork-ID
  id: z.number(),

  // Artwork-Daten
  title: z.string(),
  artist_title: z.string().nullable(),
  image_id: z.string().nullable(),
  date_display: z.string().nullable().optional(),
  medium_display: z.string().nullable().optional(),
  place_of_origin: z.string().nullable().optional(),
  dimensions: z.string().nullable().optional(),

  // Benutzernotiz
  note: z.string().default(""),
});

/**
 * TypeScript-Typ für gespeicherte Kunstwerke
 */
export type SavedArtwork = z.infer<typeof SavedArtworkSchema>;
