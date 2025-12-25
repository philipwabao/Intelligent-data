# Auxerta Next.js (Animated v6)

- Tone and wording stay close to auxerta.com (simple, direct).
- In the hero "Annotation preview" card:
  - Removed the pill "For ML scientists".
  - Removed the metrics row you disliked.
  - Added a 3D-feeling stack of animated layers that look like batches / tasks, with:
    - Subtle perspective transforms.
    - Slow orbit/breathe motion.
    - Flowing gradient edges above/below to hint at data moving through a pipeline.
  - Kept:
    - CV boxes (car/person) with scan line.
    - Tokens for intent/sentiment/priority.
    - JSON block with `reviewed: true` and blinking caret.
- The card still has 3D breathing motion and stays performant (CSS only, with `will-change` where it matters).
- Rest of the page (services, process, pricing, research, contact) unchanged.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3000


## Routes

- `/` — Landing page
- `/privacy` — Privacy Policy
- `/terms-of-service` — Terms of Service
