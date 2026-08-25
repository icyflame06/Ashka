import { generateArticle } from './gemini.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  console.log('Generating Article 1...');
  await generateArticle('Business / Market Insight');
  console.log('Generating Article 2...');
  await generateArticle('Entrepreneurship / Opportunity Insight');
  console.log('Done!');
}
run();
