# Live Interpreter (EN → JA)

Type English, get an instant Japanese translation plus romaji underneath — built for reading aloud during a live meeting.

## How it works
- `index.html` — the page itself. You type a sentence, hit Enter, it appears in a running log with the Japanese translation and romaji.
- `api/translate.js` — a small serverless function that calls the DeepL API on your behalf.
- Romaji is generated **in your browser** (via kuroshiro), so only the translation step needs the internet round-trip.

**Why there's a separate `api/translate.js` at all:** DeepL's API blocks requests sent directly from a browser (a CORS restriction, and it would also expose your API key to anyone who views the page source). Routing through this small serverless function keeps your key private and works around that block. This is why the site needs to be deployed on Vercel (or similar) rather than plain GitHub Pages, which can't run this kind of function.

## 1. Get a DeepL API key
1. Go to https://www.deepl.com/pro-api and sign up for the **Free** plan (500,000 characters/month, no cost).
2. In your DeepL account, go to **Account → API Keys** and copy your key. It will end in `:fx`.

## 2. Put this project on GitHub
Same as your other projects — create a new repo (e.g. `live-interpreter`) and push these files to it.

## 3. Deploy on Vercel
1. Go to https://vercel.com and sign in with GitHub.
2. **Add New → Project**, pick this repo, and click **Deploy** (no build settings needed — it's plain HTML + one function).
3. Once it's deployed, go to **Project → Settings → Environment Variables** and add:
   - Name: `DEEPL_API_KEY`
   - Value: your key from step 1
4. Go to **Deployments** and redeploy once so the function picks up the new variable.

Your site will be live at something like `https://live-interpreter.vercel.app`.

## Notes
- First load takes a couple of seconds while the romaji dictionary downloads in the browser — after that, romaji conversion is instant.
- If romaji fails to load for any reason, translation still works on its own (romaji is just skipped).
- Only English → Japanese is wired up right now. If you ever want the reverse direction too, that's a small change to `target_lang`/`source_lang` in `api/translate.js` plus a toggle in the page.
