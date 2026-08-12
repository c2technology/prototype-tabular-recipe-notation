# Agent Notes

## Read Order

1. `README.md` for user-facing purpose and quick start.
2. `MEMORY.md` for durable project facts and decisions.
3. `docs/handoff.md` for current state, verification, and next steps.
4. GitHub issues for backlog and findings.

## Source of Truth

This repository owns all project context for the Tabular Recipe Notation prototype. Do not rely on hidden chat history for requirements.

## Run and Verify

```bash
npm run check
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/` and use either the demo button or a recipe URL.

## Deployment

This is a static GitHub Pages app. The prototype intentionally avoids a backend by fetching recipe text through the public `r.jina.ai` reader service.

## Secret Rules

Do not commit secrets, API keys, private data, `.env` files, tokens, or personal device identifiers.

## Contribution Policy

PrototypeBot may push the initial scaffold directly to `main`. Follow-up non-trivial work should use a focused branch and PR unless Jim asks otherwise. PrototypeBot does not merge PRs by default.
