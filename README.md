# Farmers4Forest – Sat Bara Data Extractor

This app extracts structured data from Sat Bara land record documents (Maharashtra, India) using a local Ollama AI model.

---

## Run Locally

**Prerequisites:**
- Node.js
- [Ollama](https://ollama.com/) running locally with the required model (`gemma3:27b`)
- (Optional) Tailwind CSS CLI for custom builds

1. Install dependencies:
   ```
   npm install
   ```
2. Make sure Ollama is running:
   ```
   ollama serve
   ollama run gemma3:27b
   ```
3. Run the app:
   ```
   npm run dev
   ```

---

## Features

- Upload Sat Bara documents (PDF or image)
- Extracts structured data via local AI
- Stores extracted data in browser local storage

---

## Notes

- PDF extraction is experimental. Results may vary; images work better.
- All data is stored locally in your browser (no cloud sync).
- For best results, use high-quality scans.
