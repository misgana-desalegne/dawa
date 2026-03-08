# Duoling Lite (React)

Lightweight Duolingo-style learning app with:
- Native language: Amharic
- Teaching languages: English and French
- Easy extension model for adding more languages later

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Add a new teaching language

1. Add the language in `src/data/languages.js`.
2. Add the course in `src/data/courses.js` using a matching language code.
3. Include lessons and questions under the new course key.
