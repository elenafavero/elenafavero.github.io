# Portfolio Personale - Elena Favero

Sito web portfolio personale sviluppato con architettura moderna, accessibile e responsive per presentare il percorso accademico al **Politecnico di Torino** e alla **Chalmers University of Technology**, le esperienze lavorative e di leadership (**ISI Foundation**, **IEEE-HKN**, **Teaching Assistant**) e i progetti in evidenza.

---

## 🚀 Come visualizzare il sito in locale

Non serve installare alcun pacchetto o dipendenza (zero configurazione):
1. Fai doppio clic sul file `index.html` per aprirlo direttamente nel tuo browser preferito (Chrome, Safari, Firefox, Edge).
2. *Oppure* (consigliato per sviluppatori): apri la cartella con VS Code e usa l'estensione **Live Server** (click su "Go Live" in basso a destra), oppure esegui da terminale:
   ```bash
   python3 -m http.server 8000
   ```
   e collegati su `http://localhost:8000`.

---

## 🌐 Come pubblicarlo online gratuitamente

Puoi mettere online il tuo portfolio in pochi minuti:

### Opzione A: GitHub Pages (Gratuito e ideale per sviluppatori)
1. Crea una nuova repository su GitHub denominata ad esempio `elena-favero.github.io` (oppure `portfolio`).
2. Fai il push di questi file nella repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/<tuo-username>/<tuo-repo>.git
   git push -u origin main
   ```
3. Vai nelle **Impostazioni (Settings)** della repository su GitHub -> **Pages** -> Seleziona il branch `main` e salva. Il sito sarà attivo in 1-2 minuti.

### Opzione B: Netlify o Vercel (Trascina e rilascia)
- Vai su [Netlify Drop](https://app.netlify.com/drop) e trascina semplicemente la cartella `Portfolio`. Otterrai subito un URL pubblico HTTPS personalizzabile.

---

## 📁 Struttura dei File

```
Portfolio/
├── index.html        # Struttura semantica completa in italiano, SEO e metadati OpenGraph
├── css/
│   └── style.css     # Design System moderno, CSS Variables per Dark/Light Mode, responsive
├── js/
│   └── main.js       # Gestione tema scuro/chiaro, mobile drawer menu, modali interattive e contatti
├── README.md         # Questa guida
└── assets/           # Cartella pronta per contenere foto profilo o PDF del CV
```

---

## 🎨 Funzionalità e Caratteristiche

- 🌓 **Dark Mode / Light Mode**: Rileva in automatico la preferenza di sistema (`prefers-color-scheme`) e permette lo switch manuale tramite il pulsante nella barra di navigazione con salvataggio persistente in `localStorage`.
- 📱 **Completamente Responsive**: Layout ottimizzato per smartphone, tablet e monitor widescreen ad alta risoluzione con menu mobile fluido.
- 🔍 **Modali Interattive per i Progetti**: Cliccando su *"Dettagli Progetto"* su ciascuna card, si apre un pop-up accessibile con approfondimento su sfide tecniche, architettura e stack tecnologico impiegato.
- ⚡ **Zero Dipendenze**: Caricamento istantaneo e punteggi massimi su Google Lighthouse.
- 📬 **Modulo Contatti con validazione**: Genera automaticamente una bozza email precompilata indirizzata a `faveroelena2@gmail.com`.

---

## ✏️ Come personalizzare ulteriormente il sito

- **Aggiungere il PDF del CV per il download**:
  Inserisci il tuo file `CV_Elena_Favero.pdf` dentro la cartella `assets/` e nel file `index.html` aggiorna il link del pulsante Curriculum:
  ```html
  <a href="assets/CV_Elena_Favero.pdf" download class="btn-header-cv">...</a>
  ```
- **Aggiungere la tua foto profilo**:
  Nella sezione `#hero`, all'interno della card con classe `hero-avatar-frame`, puoi sostituire il riquadro con le iniziali `EF` con un'immagine:
  ```html
  <img src="assets/foto-profilo.jpg" alt="Elena Favero" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">
  ```
