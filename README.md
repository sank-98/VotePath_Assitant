# VotePath BHARAT

An interactive AI assistant for the Indian democratic process.

## Features
- **AI Voting Assistant**: Powered by Gemini 3 Flash for election guidance.
- **Dual Language**: Support for English and Hindi (Designed for Bharat).
- **Roadmap**: Visualization of the voting process from registration to results.
- **Impact Simulator**: Interactive tool to see the power of your vote.
- **Station Finder**: Quick access to polling station information.

## Deployment to GitHub Pages
1. **GitHub Settings**: 
   - Go to your repository on GitHub.
   - Click **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Branch**:
     - Select **`gh-pages`** (NOT `main`).
     - Select folder **`/(root)`**.
     - Click **Save**.
2. **Setup Secret**: 
   - Go to **Settings** > **Secrets and variables** > **Actions**.
   - Add a New Repository Secret: `GEMINI_API_KEY` with your actual API key.
3. **Trigger Build**: 
   - Push your code to the `main` branch. 
   - The GitHub Action will compile your TSX into JS and move it to the `gh-pages` branch automatically.

### Why was I seeing ".tsx MIME error"?
GitHub Pages is a static host. It cannot run `.tsx` files directly. If you see this error, it means you are serving your **source code** (from the `main` branch) instead of the **compiled code** (from the `gh-pages` branch). Follow the settings above to fix it.

## Development
- `npm run dev`: Start development server (Port 3000)
- `npm run build`: Production build
- `npm test`: Run logic tests
