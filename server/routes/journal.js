import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get all published posts
router.get('/posts', (req, res) => {
  try {
    const posts = db.prepare("SELECT id, title, slug, summary, category, hero_image, published_at, content FROM BlogPost WHERE status = 'PUBLISHED' ORDER BY created_at DESC").all();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public: Get a single post by slug
router.get('/posts/:slug', (req, res) => {
  try {
    const post = db.prepare("SELECT * FROM BlogPost WHERE slug = ? AND status = 'PUBLISHED'").get(req.params.slug);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const sources = db.prepare('SELECT * FROM BlogSource WHERE blog_post_id = ?').all(post.id);
    post.sources = sources;
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin auth middleware
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${process.env.ADMIN_PASSWORD}`) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Admin: Get all posts
router.get('/admin/posts', auth, (req, res) => {
  try {
    const posts = db.prepare('SELECT * FROM BlogPost ORDER BY created_at DESC').all();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Generate new article
import { generateArticle } from '../gemini.js';
router.post('/admin/generate', auth, async (req, res) => {
  try {
    const { articleType, customTopic } = req.body;
    if (!articleType) return res.status(400).json({ error: 'articleType is required' });
    const postId = await generateArticle(articleType, { customTopic });
    res.json({ success: true, postId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Approve and Publish
router.post('/admin/posts/:id/approve', auth, (req, res) => {
  try {
    db.prepare("UPDATE BlogPost SET status = 'PUBLISHED', published_at = CURRENT_TIMESTAMP WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete post
router.delete('/admin/posts/:id', auth, (req, res) => {
  try {
    db.prepare('DELETE FROM BlogPost WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
