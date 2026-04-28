import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

// Helper to handle ESM vs CJS paths
const getDirname = () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    return path.dirname(__filename);
  } catch (e) {
    // In CJS bundled by esbuild, it might fall back to __dirname
    return __dirname;
  }
};

const distPath = process.env.NODE_ENV === "production" 
  ? path.resolve(process.cwd(), "dist")
  : path.resolve(getDirname(), "dist");

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // SECURITY: Set security headers
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));

  // SECURITY: Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests from this IP, please try again after 15 minutes" }
  });
  app.use("/api/", limiter);

  app.use(express.json());

  console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Working directory: ${process.cwd()}`);
  console.log(`Dist path: ${distPath}`);

  // Health check endpoint for Cloud Run
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      mode: process.env.NODE_ENV || 'development',
      time: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Initializing Vite middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(vite.middlewares);
  } else {
    console.log(`Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Index not found in " + distPath);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
