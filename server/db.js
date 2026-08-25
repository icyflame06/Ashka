import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../database/journal.db');

export const db = new Database(dbPath);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS BlogPost (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      slug TEXT UNIQUE,
      subtitle TEXT,
      summary TEXT,
      content TEXT,
      category TEXT,
      tags TEXT,
      hero_image TEXT,
      status TEXT DEFAULT 'DRAFT',
      published_at DATETIME,
      scheduled_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reading_time INTEGER,
      seo_title TEXT,
      meta_description TEXT,
      gemini_model TEXT,
      research_timestamp DATETIME,
      ashka_perspective TEXT,
      entrepreneur_questions TEXT,
      conclusion TEXT
    );

    CREATE TABLE IF NOT EXISTS BlogSource (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      blog_post_id INTEGER,
      source_name TEXT,
      source_title TEXT,
      source_url TEXT,
      publication_date TEXT,
      source_type TEXT,
      FOREIGN KEY(blog_post_id) REFERENCES BlogPost(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS BlogGenerationLog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      run_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      article_type TEXT,
      gemini_model TEXT,
      status TEXT,
      selected_topic TEXT,
      error_message TEXT
    );
  `);
}
