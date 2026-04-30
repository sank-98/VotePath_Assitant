import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const getDistPath = () => {
  const root = process.cwd();
  const rootDist = path.resolve(root, "dist");
  if (fs.existsSync(rootDist) && fs.statSync(rootDist).isDirectory()) {
    return rootDist;
  }
  
  let currentDir = "";
  try {
    currentDir = path.dirname(fileURLToPath(import.meta.url));
  } catch {
    currentDir = __dirname;
  }
  
  if (currentDir.split(path.sep).pop() === "dist") {
    return currentDir;
  }
  return path.resolve(currentDir, "dist");
};

const distPath = getDistPath();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // SECURITY: Set security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://*.firebaseapp.com"],
        connectSrc: ["'self'", "https://*.googleapis.com", "https://*.firebaseio.com", "https://generativelanguage.googleapis.com", "https://*.google.com"],
        imgSrc: ["'self'", "data:", "https://maps.gstatic.com", "https://*.googleapis.com", "https://*.google.com", "https://*.gstatic.com"],
        frameSrc: ["'self'", "https://*.firebaseapp.com", "https://*.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        frameAncestors: ["'self'", "https://*.google.com", "https://*.run.app"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: false,
  }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
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
