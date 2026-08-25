import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(ScrollTrigger, Draggable)

document.addEventListener("DOMContentLoaded", () => {
  initPortalHero();
  initStatsCounter();
  initGalleryDeck();
});

function initPortalHero() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".portal-hero",
      start: "top top",
      end: "bottom bottom",
      scrub: 1, // Smooth scrubbing
    }
  });

  // 1. Doors open
  tl.to(".door-left", { xPercent: -100, ease: "none" }, 0);
  tl.to(".door-right", { xPercent: 100, ease: "none" }, 0);

  // 2. Image scales down to 100% and text color changes
  tl.to(".portal-image-container", { scale: 1, ease: "none" }, 0);
  tl.to(".hero-title, .hero-subheading, .hero-label", { color: "#FFFDFC", ease: "none" }, 0);
  tl.to("#hero-ctas .btn-primary:first-child", { color: "#FFFDFC", borderColor: "#FFFDFC", ease: "none" }, 0);

  // 3. Title scales up slightly
  tl.to("#title-line1", { scale: 1.1, ease: "none" }, 0);
  
  // 4. Fade in subheading and label
  tl.to(".hero-subheading", { opacity: 1, y: 0, ease: "power2.out" }, 0.2);
  tl.to(".hero-label", { opacity: 1, y: 0, ease: "power2.out" }, 0.3);
}

function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'), 10);
    ScrollTrigger.create({
      trigger: stat,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(stat, {
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: "power2.out"
        });
      }
    });
  });
}

function initGalleryDeck() {
  const cards = gsap.utils.toArray('.deck-card');
  // Initial stack offset
  cards.forEach((card, i) => {
    gsap.set(card, {
      rotation: (Math.random() - 0.5) * 10, // slight random rotation
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
      zIndex: cards.length - i
    });
  });

  Draggable.create(".deck-card", {
    type: "x,y",
    edgeResistance: 0.65,
    bounds: ".gallery-section",
    onDragStart: function() {
      gsap.to(this.target, { scale: 1.05, duration: 0.2 });
    },
    onDragEnd: function() {
      gsap.to(this.target, { scale: 1, duration: 0.2 });
      // Bring dragged card to back
      gsap.set(this.target, { zIndex: 0 });
      // Push all other cards' zIndex up
      const siblings = Array.from(this.target.parentNode.children).filter(el => el !== this.target);
      siblings.forEach(sib => {
        gsap.set(sib, { zIndex: parseInt(gsap.getProperty(sib, "zIndex")) + 1 });
      });
      
      // Animate back to roughly center
      gsap.to(this.target, {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        rotation: (Math.random() - 0.5) * 10,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  });
}

