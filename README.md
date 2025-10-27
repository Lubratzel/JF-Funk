# JF Funkübung

Interaktive SvelteKit-Anwendung zur Verwaltung einer Funkübung der Jugendfeuerwehr. Die App läuft vollständig im Browser und speichert Daten in Svelte Stores.

## Entwicklung

```bash
npm install
npm run dev
```

Die Oberfläche ist mit TailwindCSS gestaltet. Für einen Produktionsbuild:

```bash
npm run build
npm run preview
```

## Funktionen

- Leitstellen-Übersicht aller Fahrzeuge inkl. offener Aufgaben
- Detailseiten pro Fahrzeug mit Aufgabenverwaltung und Notizblock
- Bearbeiten des Funkrufnamens, Abhaken von Aufgaben, Eintragen von Ergebnissen
- Export der Aufgaben- und Notizdaten pro Fahrzeug als CSV-Datei
