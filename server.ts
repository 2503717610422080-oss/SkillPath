import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { handleApiRoute } from './src/server/apiHandler.ts';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// API routes handled by the API handler
app.use(async (req, res, next) => {
  if (req.url.startsWith('/api/')) {
    const handled = await handleApiRoute(req, res);
    if (handled) return;
  }
  next();
});

// Serve static frontend assets
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`SkillPath server running on port ${port}`);
});
