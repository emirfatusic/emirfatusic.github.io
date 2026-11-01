# Emir's portfolio

A personal corner of the web: thoughtful interfaces, frontend craft, and a small interactive lab.

Built with Vue 3, TypeScript and Vite. Vue renders the content to HTML at build time, then hydrates the same components in the browser. GitHub Pages serves static files only.

## Development

Use Node 24 and npm:

```sh
npm ci
npm run dev
```

## Production and checks

```sh
npm run build
npx playwright install --with-deps chromium firefox webkit
npm test
npm run preview
```

The preview runs at `http://127.0.0.1:4173`. With it running, `npm run size` reports the page's initial transfer sizes. Targets are advisory.

Playwright exercises Chromium, Firefox, WebKit and mobile-sized Chromium/WebKit. Tests cover prerendered content without JavaScript, hydration, command navigation, focus restoration, reduced motion, failed artwork and accessibility checks. Automated tests complement manual keyboard, screen-reader and visual inspection.

## Interface lab

The hero offers section navigation. The dialog has typed actions for Notes, Contact and the component source. It owns keyboard navigation and its close lifecycle. Selecting a section closes the dialog and focuses the destination heading; dismissal restores the opener. The source action is an ordinary GitHub link.

Source links open the actual dialog component on GitHub for syntax highlighting and history. The production build also includes a plain-text copy at `/source/command-menu.vue.txt`.

The page uses native links, native dialog semantics, local fonts and optimized local artwork. There are no third-party runtime requests.

## Publishing

`Check portfolio` validates changes without publishing. `Publish portfolio` builds and tests every push to `main`, then deploys that exact static output to GitHub Pages only when its checks pass. It can also be triggered manually. The site is https://emirfatusic.github.io/.

## Assets

The scenic artwork was generated for this site. It is decorative, not a photograph of a specific location. Asset provenance is recorded with the source artwork. Inter is distributed under the SIL Open Font License, included in `public/fonts/OFL.txt`.
