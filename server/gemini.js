import { GoogleGenAI, Type } from '@google/genai';
import { db } from './db.js';

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateArticle(articleType, options = {}) {
  try {
    console.log(`Starting generation for: ${articleType}`);
    const ai = getGenAI();
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    // 1. Identify existing recent topics to prevent duplicates
    const recentPosts = db.prepare('SELECT title, summary, category FROM BlogPost ORDER BY created_at DESC LIMIT 10').all();
    const existingTopicsContext = recentPosts.length > 0 
      ? `Recent articles we have published (do NOT duplicate these topics):\n` + 
        recentPosts.map(p => `- ${p.title}: ${p.summary}`).join('\n')
      : 'No recent articles.';

    // Define the required structured JSON schema
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        topic: { type: Type.STRING },
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        summary: { type: Type.STRING },
        category: { type: Type.STRING },
        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        what_happened: { type: Type.STRING },
        why_it_matters: { type: Type.STRING },
        business_impact: { type: Type.STRING },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        risks: { type: Type.ARRAY, items: { type: Type.STRING } },
        ashka_perspective: { type: Type.STRING },
        entrepreneur_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
        conclusion: { type: Type.STRING },
        sources: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              source_name: { type: Type.STRING },
              source_title: { type: Type.STRING },
              source_url: { type: Type.STRING },
              publication_date: { type: Type.STRING },
              source_type: { type: Type.STRING }
            }
          }
        },
        seo_title: { type: Type.STRING },
        meta_description: { type: Type.STRING },
        slug: { type: Type.STRING },
        featured_image_prompt: { type: Type.STRING }
      },
      required: ["topic", "title", "summary", "category", "what_happened", "why_it_matters", "business_impact", "ashka_perspective", "sources", "slug"]
    };

    const prompt = `
You are the Chief Editor for the "Ashka Business Journal", an editorial platform for India's business ecosystem (focusing on Gujarat, MSMEs, Startups).
Your task is to research a CURRENT, highly relevant Indian business development and generate an in-depth article.

Focus area: ${articleType}
${options.customTopic ? `Specific Topic Requested: ${options.customTopic}` : 'Find a highly impactful development from the last 7 days.'}

${existingTopicsContext}

Rules:
1. Provide facts, not fluff. What happened, why it matters, who is affected.
2. The "ashka_perspective" MUST connect this development to entrepreneurs and the Ashka Business Circle community.
3. Extract real sources (names, URLs, dates) used during your research and include them in the "sources" array.
4. Output MUST be valid JSON matching the schema.
5. If there is no sufficiently relevant development, do not invent a story (though in this context, always try to find the best recent news).
`;

    // Call Gemini with Google Search grounding enabled
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        tools: [{ googleSearch: {} }],
        temperature: 0.2
      }
    });

    const resultText = response.text;
    const articleData = JSON.parse(resultText);

    // Save to Database
    const insertPost = db.prepare(`
      INSERT INTO BlogPost (
        title, slug, subtitle, summary, content, category, tags,
        seo_title, meta_description, gemini_model, ashka_perspective,
        entrepreneur_questions, conclusion, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Construct the main body content from the structured fields for simple rendering
    const contentBody = `
      <h3>What Happened?</h3>
      <p>${articleData.what_happened}</p>
      
      <h3>Why It Matters</h3>
      <p>${articleData.why_it_matters}</p>
      
      <h3>Business Impact</h3>
      <p>${articleData.business_impact}</p>
      
      <h3>Opportunities</h3>
      <ul>${(articleData.opportunities || []).map(o => `<li>${o}</li>`).join('')}</ul>
      
      <h3>Risks & Uncertainties</h3>
      <ul>${(articleData.risks || []).map(r => `<li>${r}</li>`).join('')}</ul>
    `;

    const info = insertPost.run(
      articleData.title,
      articleData.slug || `article-${Date.now()}`,
      articleData.subtitle || '',
      articleData.summary,
      contentBody,
      articleData.category || 'India Business',
      JSON.stringify(articleData.tags || []),
      articleData.seo_title || articleData.title,
      articleData.meta_description || articleData.summary,
      model,
      articleData.ashka_perspective,
      JSON.stringify(articleData.entrepreneur_questions || []),
      articleData.conclusion || '',
      'PUBLISHED'
    );

    const postId = info.lastInsertRowid;

    // Insert sources
    if (articleData.sources && articleData.sources.length > 0) {
      const insertSource = db.prepare(`
        INSERT INTO BlogSource (blog_post_id, source_name, source_title, source_url, publication_date, source_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      for (const src of articleData.sources) {
        insertSource.run(postId, src.source_name, src.source_title, src.source_url, src.publication_date, src.source_type || 'SECONDARY');
      }
    }

    // Log success
    db.prepare('INSERT INTO BlogGenerationLog (article_type, gemini_model, status, selected_topic) VALUES (?, ?, ?, ?)').run(
      articleType, model, 'SUCCESS', articleData.topic
    );

    console.log(`Successfully generated and saved draft article: ${articleData.title}`);
    return postId;

  } catch (error) {
    console.error('Error generating article:', error);
    try {
      db.prepare('INSERT INTO BlogGenerationLog (article_type, gemini_model, status, error_message) VALUES (?, ?, ?, ?)').run(
        articleType, process.env.GEMINI_MODEL || 'unknown', 'FAILED', error.message
      );
    } catch (e) {
      console.error('Failed to write error log:', e);
    }
    throw error;
  }
}
