# VotePath BHARAT

An interactive AI assistant for the Indian democratic process.

## Deployment Instructions

### 1. GitHub Pages (Static Demo)
To host this as a static site on GitHub Pages:
1. Initialize a git repository: `git init`
2. Add your remote: `git remote add origin https://github.com/yourusername/your-repo.git`
3. Set your Gemini API key in your environment or a `.env` file as `GEMINI_API_KEY`.
4. Run the deploy command: `npm run deploy`

*Note: GitHub Pages is a static host. The AI features work via client-side API calls. Ensure your API key is correctly configured in the build environment.*

### 2. Google Cloud Run (Full-Stack Demo)
To host this on Google Cloud Run with a backend:
1. Ensure `GEMINI_API_KEY` is set in your Cloud Run environment variables.
2. Build and push the container using the provided `package.json` entry point (`npm start`).
3. The app will serve the frontend and can be extended with backend API routes in `server.ts`.

## Development
- `npm install`: Install dependencies
- `npm run dev`: Start local development server
- `npm run build`: Build for production
- `npm test`: Run logic tests
