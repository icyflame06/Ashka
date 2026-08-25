import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// DATA ARCHITECTURE
// ============================================================================
const teamMembers = [
  {
    id: "alpesh-thakkar",
    name: "Mr. Alpesh Thakkar",
    role: "Founder & Chief Mentor",
    organization: "Ashka Education",
    image: "/founder.jpg",
    bio: "With an unwavering commitment since 1992, Mr. Alpesh Thakkar has transformed the lives of thousands of students. His vision, personal mentorship, and student-first approach are the foundation of Ashka's success.",
    philosophy: "A Teacher is always a Teacher — Inside the class and Outside the class too.",
    mission: "My mission is to make quality education accessible and to build not just good students, but good human beings.",
    founded: "1992",
    featured: true
  }
  // Future members can easily be added here.
];

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedLeader();
  initAnimations();
});

// ============================================================================
// RENDERING LOGIC
// ============================================================================
function renderFeaturedLeader() {
  const container = document.getElementById("featured-leader-section");
  const founder = teamMembers.find(member => member.id === "alpesh-thakkar");
  
  if (!founder || !container) return;
  
  container.innerHTML = `
    <div class="leader-grid">
      
      <!-- Portrait Column -->
      <div class="leader-portrait-column">
        <div class="leader-portrait-container">
          <div class="gold-accent-line"></div>
          <img src="${founder.image}" alt="${founder.name}" class="leader-portrait" />
        </div>
      </div>
      
      <!-- Info Column -->
      <div class="leader-info">
        <p class="leader-role-label">${founder.role}</p>
        <h2 class="leader-name" id="founder-name">
          <span class="line">MR. ALPESH</span>
          <span class="line" style="font-weight:bold;">THAKKAR</span>
        </h2>
        <h3 class="leader-org">${founder.organization}</h3>
        
        <p class="leader-bio">${founder.bio}</p>
        <p class="leader-timeline-marker">Since ${founder.founded}</p>
        
        <!-- Philosophy -->
        <div class="leader-philosophy">
          <p class="section-label">HIS PHILOSOPHY</p>
          <p class="philosophy-quote">"${founder.philosophy}"</p>
        </div>
        
        <!-- Mission -->
        <div class="leader-mission">
          <p class="section-label">HIS MISSION</p>
          <p class="mission-text">"${founder.mission}"</p>
        </div>
        
        <!-- Journey Connection snippet -->
        <div class="mini-timeline">
          <div class="timeline-node">1992</div>
          <div class="timeline-arrow">↓</div>
          <div class="timeline-node">THE BEGINNING</div>
          <div class="timeline-arrow">↓</div>
          <div class="timeline-node">YEARS OF MENTORSHIP</div>
          <div class="timeline-arrow">↓</div>
          <div class="timeline-node">10,000+ STUDENTS</div>
          <div class="timeline-arrow">↓</div>
          <div class="timeline-node final">TODAY</div>
          <div class="final-connections">
            <span>ASHKA BUSINESS CIRCLE</span>
            <span>ASHKA YOUTH FOUNDATION</span>
            <span>ASHKA EDUCATION</span>
          </div>
        </div>
        
      </div>
    </div>
  `;
}

// ============================================================================
// ANIMATIONS
// ============================================================================
function initAnimations() {
  
  // 1. Hero Reveal
  const tlHero = gsap.timeline({ defaults: { ease: "power3.out" } });
  tlHero.to(".people-label", { opacity: 1, y: 0, duration: 1 })
        .to(".people-title .line", { opacity: 1, y: 0, duration: 1, stagger: 0.2 }, "-=0.5")
        .to(".people-subtitle", { opacity: 1, y: 0, duration: 1 }, "-=0.5")
        .to(".scroll-indicator", { opacity: 1, duration: 1 }, "+=0.5");

  // 2. Founder Section Scroll Animations
  
  // Portrait Parallax & Reveal
  gsap.to(".leader-portrait", {
    yPercent: 10,
    ease: "none",
    scrollTrigger: {
      trigger: ".featured-leader-section",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
  
  // Gold Line Draw
  ScrollTrigger.matchMedia({
    // Desktop
    "(min-width: 993px)": function() {
      gsap.to(".gold-accent-line", {
        height: "100%",
        duration: 1.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".featured-leader-section",
          start: "top center+=100",
        }
      });
    },
    // Mobile
    "(max-width: 992px)": function() {
      gsap.to(".gold-accent-line", {
        width: "100%",
        duration: 1.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".featured-leader-section",
          start: "top center+=100",
        }
      });
    }
  });

  // Name Reveal (line by line)
  gsap.fromTo("#founder-name .line", 
    { opacity: 0, y: 30 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      stagger: 0.3,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".leader-info",
        start: "top center+=150",
      }
    }
  );

  // Pillars Stagger Reveal
  gsap.fromTo(".pillar-card",
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".three-pillars-section",
        start: "top center+=200"
      }
    }
  );
}
