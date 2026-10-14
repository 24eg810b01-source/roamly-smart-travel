# Smart Travel Management System — Frontend

A responsive React + Vite travel planning interface for a student full-stack Java project.

## Features
- Responsive travel landing page
- Destination search and category filters
- Favorite destinations (session state)
- Trip request form with basic validation
- Saved trip requests in browser local storage
- Responsive mobile navigation
- Designed to connect to a Java Spring Boot REST API

## Requirements
- Node.js 18 or newer
- npm
- VS Code (recommended)

## Run locally
1. Extract this ZIP file.
2. Open the `smart-travel-frontend` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed by Vite, usually `http://localhost:5173`.

## Create a production build
```bash
npm run build
```
The production files are generated in the `dist` folder.

## Important backend note
This initial frontend is a runnable UI prototype. Trip requests are stored in the current browser's local storage, not in MySQL yet. For a real full-stack app, connect the booking form to a Spring Boot API and configure the API to save data to MySQL. Do not describe local-storage demo data as database-backed bookings.

## Deployment
The frontend can be deployed to Vercel or Netlify after the code is pushed to GitHub. The Spring Boot backend and MySQL database must be deployed/configured separately for full-stack functionality.
