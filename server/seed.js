import { db } from './db.js';

const posts = [
  {
    title: "The Silent Rise of Tier-2 Tech Hubs: Why Metros Are Losing Their Edge",
    slug: "tier-2-tech-hubs",
    category: "India Business Insight",
    summary: "Recent data indicates a massive shift in tech talent migration towards Tier-2 cities in India.",
    content: "<h3>What Happened?</h3><p>Recent data indicates a massive shift in tech talent migration. Cities like Ahmedabad, Indore, and Kochi are absorbing over 30% of new IT setups that would have traditionally gone to Bangalore or Gurgaon.</p><h3>Why It Matters</h3><p>For MSMEs and startups, this means access to premium talent at a fraction of the cost, lower attrition rates, and significant state government incentives designed to decentralize the tech economy.</p><h3>The Ashka Perspective</h3><p style='padding: 1.5rem; background: #f0ece1; border-left: 4px solid #c9a050; color: #1a2530;'>At Ashka Business Circle, we see this not just as a trend, but as a foundational shift. Entrepreneurs should reconsider their expansion strategies. The next billion-dollar Indian startup won't be born in a traffic jam; it will be born in an emerging tier-2 city where the cost of living supports risk-taking.</p>"
  },
  {
    title: "Bootstrapping the Green Revolution: Profiting from India's Solar Push",
    slug: "india-solar-push",
    category: "Entrepreneurship Opportunity",
    summary: "The PM Surya Ghar Muft Bijli Yojana is driving an unprecedented surge in residential solar installations.",
    content: "<h3>What Happened?</h3><p>The PM Surya Ghar Muft Bijli Yojana is driving an unprecedented surge in residential solar installations. Over 1 crore households are targeted, creating a massive gap in supply, installation, and maintenance services.</p><h3>Why It Matters</h3><p>While massive conglomerates are handling the solar panel manufacturing, the real margin for SMEs lies in the last mile - procurement, local installation, financing facilitation, and maintenance contracts.</p><h3>The Ashka Perspective</h3><p style='padding: 1.5rem; background: #f0ece1; border-left: 4px solid #c9a050; color: #1a2530;'>This is a textbook fragmented market ripe for organized players. Members of the Ashka Youth Foundation with technical backgrounds can easily upskill into solar auditing, creating service-based businesses with virtually zero upfront capital.</p>"
  }
];

const insertPost = db.prepare("INSERT INTO BlogPost (title, slug, summary, content, category, status) VALUES (?, ?, ?, ?, ?, 'PUBLISHED')");

for (const post of posts) {
  insertPost.run(post.title, post.slug, post.summary, post.content, post.category);
}

console.log('Seed successful');
