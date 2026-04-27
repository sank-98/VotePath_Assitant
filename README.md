# VotePath BHARAT

An interactive AI assistant for the Indian democratic process.

## Features
- **AI Voting Assistant**: Powered by Gemini 3 Flash for election guidance.
- **Dual Language**: Support for English and Hindi (Designed for Bharat).
- **Roadmap**: Visualization of the voting process from registration to results.
- **Impact Simulator**: Interactive tool to see the power of your vote.
- **Station Finder**: Quick access to polling station information.

## Deployment to GitHub Pages
1. Build the project: `npm run build`
2. Deploy to GitHub: `npm run deploy`
   - This script automatically pushes the `dist` folder to your `gh-pages` branch.
3. In your GitHub Repository Settings:
   - Go to **Settings** > **Pages**.
   - Ensure the source is set to "Deploy from a branch" and the branch is **`gh-pages`**.

## Development
- `npm run dev`: Start development server (Port 3000)
- `npm run build`: Production build
- `npm test`: Run logic tests
