# Pokédex Lite

A fast, responsive, and aesthetically pleasing Pokédex web application built with **Next.js** (App Router) and **TypeScript**. 

## Features
- **Data Fetching:** Fetches Pokémon data from the [PokéAPI](https://pokeapi.co/).
- **Search & Filter:** Instantly search by name or filter Pokémon by type.
- **Pagination:** Browse through all available Pokémon efficiently.
- **Favorites:** Mark Pokémon as favorites, persisting across sessions using `localStorage`.
- **Detail Modal:** Click a Pokémon to view its high-res image, stats, abilities, and basic metrics.
- **Responsive Design:** Optimized for mobile, tablet, and desktop viewports.
- **Modern UI:** Uses a custom Neon Green & Dark theme inspired by modern glassmorphism.

## Technologies Used
- **Next.js 15 (App Router):** Provides Server-Side Rendering (SSR) capabilities for faster initial load, optimal SEO, and simple file-based routing.
- **TypeScript:** Ensures type safety and better developer experience, preventing runtime errors.
- **Vanilla CSS (CSS Modules):** Used strictly as requested for maximum flexibility, control, and scoping of styles without relying on utility frameworks like Tailwind.
- **NextAuth.js:** Implemented for secure, production-ready GitHub OAuth authentication.
- **PokéAPI:** The comprehensive RESTful API for Pokémon data.

## Challenges & Solutions
1. **PokéAPI Listing Endpoint Constraints:** The main `/pokemon` endpoint only returns the name and URL of a Pokémon. It doesn't return the types or images. 
   - *Solution:* Instead of making 1000+ individual requests which would be incredibly slow, I fetched the master list (`limit=10000`) of names and URLs once. I implemented searching locally on this master list. For type filtering, I fetch from the `/type/{type_name}` endpoint and intersect the lists client-side. The full details are only fetched for the Pokémon currently visible on the page (e.g., 20 at a time), ensuring the app remains lightning-fast.

2. **Theming without Utility Frameworks:** Creating a robust, responsive dark mode with neon accents using only CSS.
   - *Solution:* Implemented a strict CSS variables system in `globals.css` to manage theme tokens. This allows easy maintenance and consistent application of the Neon Green and Deep Dark styling.

3. **Authentication & Deployment Configuration:** Integrating GitHub OAuth seamlessly while ensuring correct environment configurations across local and production environments (Vercel).
   - *Solution:* Utilized NextAuth.js for a robust authentication flow. I ensured all callback URLs and environment variables (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`) were strictly managed and synced between my local `.env.local` and the Vercel project settings to prevent deployment errors.

## Running the Project Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Instructions

1. Clone the repository and navigate into the directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

## Build for Production
To create a production build:
```bash
npm run build
npm start
```
