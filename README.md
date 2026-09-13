# Nestora

Nestora is a premium, portfolio-ready property discovery experience for Riyadh. It demonstrates data-driven browsing, multi-filter search, sorting, pagination, dynamic detail routes, related neighborhoods and agents, saved properties, saved searches, comparison, galleries, form validation and a mortgage estimate.

## Stack

- React 19 with the Vite-powered Vinext runtime
- JavaScript for product code
- Plain CSS with centralized variables
- Local storage for favorites, saved searches and comparison
- No backend, paid map API or state library

## Run locally

Requirements: Node.js 22.13 or later and npm.

```bash
npm install
npm run dev
```

Create a production build with `npm run build`. Start the production build locally with `npm start`.

## Project structure

```text
app/                    Vinext route shell, layout and global styles
src/NestoraApp.jsx      UI components, client routing and interactions
src/data/site.js        Editable demo content and relationships
public/images/brand/    Independent brand and page imagery
public/images/properties/ Property-card images
public/images/galleries/  Four-image gallery for every property
public/images/agents/     Fictional specialist portraits
```

## Where to edit

- `src/data/site.js`: settings, navigation, 28 properties, eight neighborhoods and six fictional agents
- `src/NestoraApp.jsx`: routes, components, filtering, saved state, forms and calculator
- `app/globals.css`: colors, typography, spacing and breakpoints
- `app/layout.tsx`: document metadata

Important design tokens are at the top of `app/globals.css`. Favorites, saved searches and comparison data use guarded `localStorage`; invalid or outdated stored entries are discarded safely.

## Responsive approach

The desktop property grid reduces to two columns on tablets and one column on phones. Search fields reflow instead of shrinking, filters become a compact disclosure control with removable active-filter chips, and detail layouts become single-column. The comparison table becomes readable property-by-property cards on smaller screens rather than relying on horizontal scrolling. Mobile navigation supports Escape-to-close and scroll locking.

## Configuration

Shared branding and contact values are in `src/data/site.js`. The comparison limit is centralized there. Route metadata is defined in `app/layout.tsx`, while the client updates page titles for internal views. The custom favicon is `public/favicon.svg`.

## Routes

| View                        | Route                                   |
| --------------------------- | --------------------------------------- |
| Home                        | `/`                                     |
| Buy / Rent                  | `/buy`, `/rent`                         |
| All properties              | `/properties`                           |
| Property details            | `/property/:slug`                       |
| Neighborhoods / detail      | `/neighborhoods`, `/neighborhood/:slug` |
| Agents / detail             | `/agents`, `/agent/:id`                 |
| Saved homes / searches      | `/favorites`, `/saved-searches`         |
| Comparison                  | `/compare`                              |
| About / Contact             | `/about`, `/contact`                    |
| Sign in / Sign up / Account | `/signin`, `/signup`, `/account`        |
| Not found                   | Any unmatched path                      |

## Demo limitations

Listings, agents, contact details, prices and market-style values are fictional sample data. Forms validate locally but send and store nothing. Authentication is a UI demonstration and does not create a real account. Favorites, saved searches and comparisons are device-local only. The map is a visual preview, not a live mapping service. Mortgage output is an illustrative estimate and not financial advice.
