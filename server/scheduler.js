import cron from 'node-cron';
import { generateArticle } from './gemini.js';

export function initScheduler() {
  // Tuesday at 8:00 AM
  cron.schedule('0 8 * * 2', async () => {
    console.log('Running Tuesday scheduler...');
    await generateArticle('Business / Market Insight');
  });

  // Friday at 8:00 AM
  cron.schedule('0 8 * * 5', async () => {
    console.log('Running Friday scheduler...');
    await generateArticle('Entrepreneurship / Opportunity Insight');
  });
  
  console.log('Scheduler initialized for Tue & Fri at 8:00 AM');
}
