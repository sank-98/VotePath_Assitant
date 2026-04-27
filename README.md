# VotePath BHARAT

An interactive AI assistant for the Indian democratic process.

## Features
- **AI Voting Assistant**: Powered by Gemini 3 Flash for election guidance.
- **Dual Language**: Support for English and Hindi (Designed for Bharat).
- **Roadmap**: Visualization of the voting process from registration to results.
- **Impact Simulator**: Interactive tool to see the power of your vote.
- **Station Finder**: Quick access to polling station information.

## Deployment to GitHub Pages (THE FIX)
We are using the **GitHub Actions** method. This means you **don't** need a `gh-pages` branch. 

1. **GitHub Settings (CRITICAL)**: 
   - Go to your repository on GitHub.
   - Click **Settings** > **Pages** (left sidebar).
   - Under **Build and deployment** > **Source**:
     - Change it from "Deploy from a branch" to **"GitHub Actions"**.
2. **Setup Secret**: 
   - Go to **Settings** > **Secrets and variables** > **Actions**.
   - Add a New Repository Secret: `GEMINI_API_KEY` with your actual API key.
3. **Trigger Build**: 
   - Push your code to the `main` branch. 
   - Go to the **Actions** tab in GitHub to watch the build progress. 
   - Once the "deploy" stage finishes, your site will be live!

### Why was I seeing ".tsx MIME error" or a blank page?
GitHub Pages was previously trying to serve your raw source code (`.tsx` files). Browsers can't read those. By switching to the "GitHub Actions" source, GitHub will now serve the **compiled** code in the `dist` folder, which browsers understand.

## Development
- `npm run dev`: Start development server (Port 3000)
- `npm run build`: Production build
- `npm test`: Run logic tests
