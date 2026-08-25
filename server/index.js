import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db.js';
import journalRoutes from './routes/journal.js';
import { initScheduler } from './scheduler.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// Routes
app.use('/api/journal', journalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initScheduler();
});
