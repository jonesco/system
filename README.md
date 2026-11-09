# Jonesco System

The shared design language for Jonesco sites (jonescoartdept.com and jonesco.com).

**Docs:** https://jonesco.github.io/system/

| File | What | Strictness |
| --- | --- | --- |
| `PRINCIPLES.md` | How it should feel | Firm direction; bend with a written reason |
| `system.css` | Tokens, Trade Gothic (with the cap-centering fix), minimal base | Every site loads it; override tokens as needed |
| `patterns.css` | Opt-in components, `sys-` prefixed | Use what fits |
| `fonts/` | Trade Gothic Bold Cond No. 20, Bold No. 2, and the body cuts (Regular, Oblique, Bold, Bold Oblique), trimmed WOFF2 | |

## Use it

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jonesco/system@3.3.1/system.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jonesco/system@3.3.1/patterns.css"> <!-- optional -->
<link rel="stylesheet" href="/css/site.css"> <!-- the site's own, last -->
```

Pin an exact version. Release by tagging (`git tag v1.2.0 && git push --tags`); jsDelivr serves the tag.

## Docs

Plain HTML, no build. Each page is a `<main class="docs-main">`; `docs/docs.js` adds the header, sidebar and code panels. To add a page, write the HTML file and add one line to `NAV` in `docs/docs.js`. Record site variations under `sites/`, rules under the component's Stipulations, and every release in `changelog.html`.

## Note on fonts

These are desktop-licensed Trade Gothic files (the two display cuts have an added Ō/ō). Jonesco is now all Trade Gothic, so get the web license and replace the six files in `fonts/`.
