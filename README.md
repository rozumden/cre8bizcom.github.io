# Creative Business Communications — website (2026)

A five-page static website. No build step, no dependencies — just open it.

## View it
From this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/> in a browser. (Opening `index.html` directly also works.)

## Pages
| File | Section | Dominant colour (from the logo) |
|------|---------|--------------------------------|
| `index.html` | Home — all colours + hero slideshow | teal / all |
| `about.html` | About us | indigo `#2E1A78` |
| `services.html` | Services we offer | red `#C1121F` |
| `creativity.html` | Communication through creativity | teal `#006773` |
| `contact.html` | Contact us | grey `#808080` |

## Structure
```
site/
├── index.html · about.html · services.html · creativity.html · contact.html
└── assets/
    ├── css/style.css      design system + all styles
    ├── js/main.js         nav, slideshow, scroll reveals, lightbox, form
    └── img/
        ├── large/         1800px web-optimised (heroes + lightbox)  — 78 files
        ├── med/           900px web-optimised (cards + galleries)   — 78 files
        ├── logo.jpg · favicon.png · manifest.json
```

## Notes
- **All 78 supplied photographs/images are used** and were optimised from ~250 MB down to ~24 MB.
- Type: Fira Sans Condensed (headings), Prociono (display/quotes), Roboto (body) — from the brief's options; all text ranged left.
- Fully responsive, keyboard-accessible (slideshow + lightbox), respects `prefers-reduced-motion`, every image has alt text.
- The enquiry form composes a pre-filled email to `info@cre8bizcom.com`.
