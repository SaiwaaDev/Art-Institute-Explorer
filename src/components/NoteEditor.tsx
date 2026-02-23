/**
 * NoteEditor Komponente
 *
 * Ein Modal-Dialog zum Bearbeiten von Notizen zu Kunstwerken.
 * Validiert die Eingabe mit dem NoteSchema.
 *
 * FR010: Aktualisieren – Notizen pro Kunstwerk
 * FR012: Typsicherer Status
 */

import React, { useState, useEffect } from "react";
import { NoteSchema } from "../schemas/noteSchema";
import { z } from "zod";

/**
 * Props für die NoteEditor Komponente
 */
interface NoteEditorProps {
  /**
   * Die ID des Kunstwerks
   */
  artworkId: number;

  /**
   * Die aktuelle Notiz (kann leer sein)
   */
  currentNote: string;

  /**
   * Callback-Funktion, die aufgerufen wird, wenn die Notiz gespeichert wird
   */
  onSave: (artworkId: number, note: string) => void;

  /**
   * Callback-Funktion, die aufgerufen wird, wenn die Bearbeitung abgebrochen wird
   */
  onCancel: () => void;
}

/**
 * NoteEditor Komponente
 *
 * Zeigt ein Modal mit einem Textfeld zur Bearbeitung von Notizen an.
 */
export const NoteEditor: React.FC<NoteEditorProps> = ({
  artworkId,
  currentNote,
  onSave,
  onCancel,
}) => {
  /**
   * State für die Notiz
   */
  const [note, setNote] = useState<string>(currentNote);

  /**
   * State für Validierungsfehler
   */
  const [validationError, setValidationError] = useState<string | null>(null);

  /**
   * Maximale Länge der Notiz
   */
  const MAX_NOTE_LENGTH = 500;

  /**
   * Effect Hook: Setze die Notiz, wenn sich currentNote ändert
   */
  useEffect(() => {
    setNote(currentNote);
  }, [currentNote]);

  /**
   * Handler für das Ändern der Notiz
   */
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value;
    setNote(newNote);

    // Validiere die Notiz in Echtzeit
    try {
      NoteSchema.parse({
        artworkId,
        note: newNote,
      });
      setValidationError(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.issues[0].message);
      }
    }
  };

  /**
   * Handler für das Speichern der Notiz
   */
  const handleSave = () => {
    // Validiere die Notiz vor dem Speichern
    try {
      NoteSchema.parse({
        artworkId,
        note,
      });

      // Rufe die onSave Callback-Funktion auf
      onSave(artworkId, note);
      setValidationError(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.issues[0].message);
      }
    }
  };

  /**
   * Handler für das Abbrechen
   */
  const handleCancel = () => {
    setNote(currentNote); // Setze die Notiz zurück
    setValidationError(null);
    onCancel();
  };

  /**
   * Handler für Tastenkombinationen
   * - Strg+Enter oder Cmd+Enter: Speichern
   * - Escape: Abbrechen
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  /**
   * Berechne die verbleibenden Zeichen
   */
  const remainingChars = MAX_NOTE_LENGTH - note.length;

  return (
    <>
      {/* Modal-Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleCancel} />

      {/* Modal-Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-base-100 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal-Header */}
          <div className="p-6 border-b border-base-300">
            <h3 className="text-2xl font-bold">Notiz bearbeiten</h3>
            <p className="text-base-content/60 mt-1">
              Fügen Sie Ihre persönlichen Gedanken zu diesem Kunstwerk hinzu
            </p>
          </div>

          {/* Modal-Body */}
          <div className="p-6">
            {/* Textarea für die Notiz */}
            <textarea
              value={note}
              onChange={handleNoteChange}
              onKeyDown={handleKeyDown}
              placeholder="Schreiben Sie hier Ihre Notiz..."
              className={`textarea textarea-bordered w-full h-48 resize-none ${
                validationError ? "textarea-error" : ""
              }`}
              maxLength={MAX_NOTE_LENGTH}
              autoFocus
            />

            {/* Zeichenzähler und Validierungsfehler */}
            <div className="flex justify-between items-center mt-2">
              {/* Validierungsfehler */}
              {validationError ? (
                <span className="text-error text-sm">{validationError}</span>
              ) : (
                <span className="text-base-content/60 text-sm">
                  Tipp: Strg+Enter zum Speichern, Escape zum Abbrechen
                </span>
              )}

              {/* Zeichenzähler */}
              <span
                className={`text-sm ${
                  remainingChars < 50
                    ? "text-warning"
                    : remainingChars < 0
                      ? "text-error"
                      : "text-base-content/60"
                }`}
              >
                {remainingChars} Zeichen verbleibend
              </span>
            </div>
          </div>

          {/* Modal-Footer */}
          <div className="p-6 border-t border-base-300 flex justify-end gap-2">
            {/* Abbrechen Button */}
            <button onClick={handleCancel} className="btn btn-ghost">
              Abbrechen
            </button>

            {/* Speichern Button */}
            <button
              onClick={handleSave}
              disabled={!!validationError || note.length > MAX_NOTE_LENGTH}
              className="btn btn-primary"
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteEditor;
