import './style.css';
import './journey.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Timeline Data mapped to existing images and requested milestones
const timelineData = [
  {
    year: "1992",
    title: "THE BEGINNING",
    description: "<p>Ashka Education was founded by Mr. Alpesh Thakkar.</p><p>A vision was established: to provide quality education while nurturing discipline, values, confidence, and character.</p>",
    image: "/gallery/WhatsApp Image 2026-08-07 at 10.06.30 PM (1).jpeg"
  },
  {
    year: "1992 → PRESENT",
    title: "A JOURNEY FROM THE SAME HOME",
    description: "<p>Ashka has continued serving students from the same location since its establishment.</p><p>This consistency represents more than a physical location. It represents trust.</p><p>Generations of families have continued to place their confidence in Ashka.</p>",
    image: "/gallery/WhatsApp Image 2026-08-07 at 10.12.52 PM (1).jpeg"
  },
  {
    year: "THE YEARS THAT FOLLOWED",
    title: "GROWING TOGETHER",
    description: "<p>Over the years, thousands of students were guided through their academic journeys.</p><p>Ashka's philosophy remained centered around:</p><ul style='list-style: none; padding: 0;'><li>✓ Education</li><li>✓ Discipline</li><li>✓ Mentorship</li><li>✓ Values</li><li>✓ Personal attention</li></ul>",
    image: "/gallery/WhatsApp Image 2026-08-07 at 9.40.15 PM.jpeg"
  },
  {
    year: "25",
    title: "YEARS",
    description: "<h4 style='color: var(--accent-gold); margin-bottom: 1rem;'>SILVER JUBILEE</h4><p>Celebrating 25 years of academic excellence and commitment to shaping futures.</p>",
    image: "/gallery/WhatsApp Image 2026-08-07 at 9.48.30 PM.jpeg"
  },
  {
    year: "10,000+",
    title: "STUDENTS MENTORED",
    description: "<p>More than 10,000 students have been guided through Ashka's educational journey.</p>",
    image: "/gallery/WhatsApp Image 2026-08-07 at 9.54.22 PM.jpeg"
  },
  {
    year: "ACADEMIC EXCELLENCE",
    title: "RESULTS THAT REFLECT DEDICATION",
    description: "<p>Ashka students have consistently achieved strong academic results, with students reaching approximately 85% to 99.99 percentile rank in different years.</p>",
    image: "/gallery/WhatsApp Image 2026-08-07 at 9.50.54 PM.jpeg"
  },
  {
    year: "ASHKA YOUTH FOUNDATION",
    title: "ONE FOR ALL. ALL FOR ONE.",
    description: "<p>Through the Ashka Youth Foundation, the community participates in:</p><ul style='list-style: none; padding: 0;'><li>🌱 Tree Plantation</li><li>📚 Educational Aid</li><li>🩸 Blood Donation</li><li>📢 Social Awareness</li><li>🤝 Community Service</li></ul>",
    image: "/gallery/WhatsApp Image 2026-08-07 at 9.57.34 PM (2).jpeg"
  },
  {
    year: "ASHKA BUSINESS CIRCLE",
    title: "RISHTA VAHI, SOCH NAYI.",
    description: "<p>The evolution of Ashka's community vision into entrepreneurship and business.</p><p>A platform for Entrepreneurs, Traders, Professionals, Startups, and Business Leaders focusing on Networking, Mentorship, Business Knowledge, Leadership, Collaboration, and Growth.</p>",
    image: "/gallery/WhatsApp Image 2026-08-07 at 10.06.31 PM.jpeg"
  },
  {
    year: "TODAY",
    title: "ONE ECOSYSTEM. THREE PILLARS.",
    description: "<p><strong>ASHKA BUSINESS CIRCLE</strong><br>Entrepreneurship, Networking, Business Growth</p><p><strong>ASHKA YOUTH FOUNDATION</strong><br>Service, Community, Social Responsibility</p><p><strong>ASHKA EDUCATION</strong><br>Learning, Mentorship, Academic Excellence</p>",
    image: "/gallery/WhatsApp Image 2026-08-07 at 10.12.52 PM (2).jpeg"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  initTimeline();
  initAnimations();
});

function initTimeline() {
  const bgContainer = document.getElementById('journey-bg-container');
  const trackContainer = document.querySelector('.timeline-track');
  const triggersContainer = document.getElementById('timeline-triggers');

  // Inject HTML based on data
  timelineData.forEach((item, index) => {
    // 1. Background Image
    const img = document.createElement('img');
    img.src = item.image;
    img.className = 'bg-image bg-image-' + index;
    if(index === 0) img.classList.add('active'); // First active by default
    bgContainer.appendChild(img);

    // 2. Timeline Node
    const nodeY = (index / (timelineData.length - 1)) * 100;
    const nodeHTML = '<div class="timeline-node node-' + index + '" style="top: ' + nodeY + '%"><span class="timeline-year-label">' + item.year + '</span></div>';
    trackContainer.insertAdjacentHTML('beforeend', nodeHTML);
  });
}

function initAnimations() {
  // --- INTRO ANIMATION ---
  const tl = gsap.timeline();
  tl.to('.journey-label', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.5)
    .to('.journey-title', { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }, 0.8)
    .to('.journey-subtitle', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 1.5)
    .to('.scroll-instruction', { opacity: 1, duration: 1 }, 2)
    .to('.scroll-indicator', { opacity: 1, duration: 1 }, 2)
    .to('.timeline-story-container', { opacity: 1, duration: 1 }, 2);

  // --- PROGRESS LINE ANIMATION & MILESTONE TRIGGERS ---
  let activeIndex = -1;

  gsap.to('.timeline-progress', {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.journey-timeline-section',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0,
      onUpdate: (self) => {
        // Map progress (0 to 1) to an index (0 to length-1)
        const progress = self.progress;
        
        // At the very end, we want the last item
        let newIndex = Math.floor(progress * timelineData.length);
        if (newIndex >= timelineData.length) {
          newIndex = timelineData.length - 1;
        }
        
        // Prevent re-triggering if we are already on this index
        if (newIndex !== activeIndex) {
          activeIndex = newIndex;
          activateMilestone(activeIndex);
        }
      }
    }
  });
}

function activateMilestone(index) {
  const data = timelineData[index];
  if(!data) return;

  // 1. Update Backgrounds (Crossfade)
  document.querySelectorAll('.bg-image').forEach((img, i) => {
    if (i === index) {
      img.classList.add('active');
    } else {
      img.classList.remove('active');
    }
  });

  // 2. Update Timeline Nodes
  document.querySelectorAll('.timeline-node').forEach((node, i) => {
    if (i === index) {
      node.classList.add('active');
    } else {
      node.classList.remove('active');
    }
  });

  // 3. Update Story Content with GSAP Fade
  const storyContent = document.querySelector('.timeline-story-container');
  
  gsap.to(storyContent, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    onComplete: () => {
      document.getElementById('story-year').innerHTML = data.year;
      document.getElementById('story-title').innerHTML = data.title;
      document.getElementById('story-description').innerHTML = data.description;
      
      gsap.to(storyContent, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  });
}
