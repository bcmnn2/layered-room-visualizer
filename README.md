# Layered Room Visualizer 🏠🎨

Un'applicazione web interattiva per visualizzare in tempo reale il cambio di colore delle pareti di una stanza, mantenendo ombre, riflessi e arredamento grazie a una tecnica di compositing a tre livelli.

## 🚀 Funzionalità

- **Rendering Multilivello**: Utilizza il `mix-blend-mode: multiply` dei CSS per fondere il colore scelto con il livello delle ombre (`IMGWALL`), protetto dal livello dell'arredamento (`IMGROOM`).
- **Gestione Progetti (CRUD)**: Crea, rinomina ed elimina diversi progetti di interior design.
- **Color Picker Flessibile**: Accetta codici Hex in vari formati con sanitizzazione automatica.
- **Upload Real-time**: Carica i tuoi asset (pareti e mobili) tramite click o drag-and-drop.
- **Canvas Dinamico**: L'area di visualizzazione si adatta automaticamente alle proporzioni delle immagini caricate.
- **Interfaccia Premium**: Design moderno, scuro, con animazioni fluide e feedback visivo.

## 🛠️ Stack Tecnologico

- **Frontend**: React (Vite), Tailwind CSS v4, Lucide Icons.
- **Backend**: Node.js, Express, Multer.
- **Rendering**: CSS Compositing (Multiply).

## ⚠️ Nota Importante (Disclaimer)

Questo progetto è un **Proof of Concept (PoC)** sviluppato per scopi dimostrativi.
- **Non è pronto per la produzione**: Non sono implementati sanity check avanzati (validazione estensioni file, limiti di dimensione, sanitizzazione input lato server, security headers, ecc.).
- **Utilizzo**: Da intendersi come base di studio o strumento ad uso interno.

## ✨ Vibe-Coding

Questo progetto è stato interamente sviluppato in modalità **vibe-coding** con l'assistenza di **Gemini**.

---

### Installazione Locale

1. Clona la repository.
2. Esegui `npm install`.
3. Avvia l'ambiente di sviluppo con `npm run dev`.
4. Accedi a `http://localhost:5173`.
