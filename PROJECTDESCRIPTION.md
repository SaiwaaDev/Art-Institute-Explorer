# React - TypeScript Soloprojekt "Art Institute Explorer"

---

_SaiwaaDev vom 19.02.2026 bis 22.02.2026_

---

### Aufgabe:

Das Ziel ist es, ein Tool zu entwickeln, mit dem man die Sammlung des Art Institute of Chicago durchsuchen, Lieblingskunstwerke in einer persönlichen Galerie speichern und Notizen hinzufügen kann.

### Anforderungskatalog

---

| ID    | Funktionale                           | Beschreibung                                                                                                                                                                             | Erledigt (J/N) |
| :---- | :------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------: |
| FR001 | React + Vite (TypeScript) einrichten  | Ein neues Projekt mit npm create vite@latest my-app -- --template react-ts erstellen.                                                                                                    |       J        |
| FR002 | Kernabhängigkeiten installieren       | Zod über npm install zod hinzufügen.                                                                                                                                                     |       J        |
| FR003 | Artwork Zod Schema                    | Erstellen Sie ein ArtworkSchema, das mindestens id, title, artist_title, image_id abdeckt, mit sinnvollen Standardwerten für fehlende Daten.                                             |       -        |
| FR004 | API-Abruf mit Validierung             | Implementieren Sie einen Helper, der den AIC-Suchendpunkt abfragt, das JSON parst und es mit ArtworkSchema validiert. Lehnen Sie ungültige Daten ab oder behandeln Sie sie entsprechend. |       -        |
| FR005 | Suchschnittstelle                     | Erstellen Sie eine Suchschnittstelle, über die Benutzer die API abfragen können.                                                                                                         |       -        |
| FR006 | ArtworkCard-Komponente                | Erstellen Sie eine wiederverwendbare ArtworkCard-Komponente, um einzelne Kunstwerke aus den Suchergebnissen anzuzeigen. Diese Komponente zeigt das Bild, den Titel und den Künstler an.  |       -        |
| FR007 | Galeriekomponente                     | Entwickeln Sie eine Galeriekomponente, die die Sammlung der vom Benutzer gespeicherten Kunstwerke anzeigt.                                                                               |       -        |
| FR008 | Erstellen – Zur Galerie hinzufügen    | Wenn der Benutzer auf „Zur Galerie hinzufügen” klickt, wird das Kunstwerkobjekt in den lokalen Speicher verschoben.                                                                      |       -        |
| FR009 | Lesen – Galerie anzeigen              | Stellen Sie sicher, dass die Galerie alle gespeicherten Kunstwerke mit ArtworkCard anzeigt.                                                                                              |       -        |
| FR010 | Aktualisieren – Notizen pro Kunstwerk | Ermöglichen Sie Benutzern, eine kurze Textnotiz zu jedem gespeicherten Kunstwerk hinzuzufügen/zu bearbeiten; validieren Sie diese Notiz mit einem einfachen Zod-Schema.                  |       -        |
| FR011 | Löschen – Aus Galerie entfernen       | Stellen Sie eine Steuerung bereit, um ein Kunstwerk (und seine Notiz) aus der Galerie zu löschen.                                                                                        |       -        |
| FR012 | Typsicherer Status                    | Behalten Sie TypeScript-Typen in allen Komponenten und Status bei und verwenden Sie nach Möglichkeit die von Zod abgeleiteten Typen wieder.                                              |       -        |
