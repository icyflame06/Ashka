import gsap from 'gsap';

// ============================================================================
// MEDIA DATA ARCHITECTURE
// ============================================================================
const mediaItems = [
  {
    id: 1,
    type: "song",
    title: "Ashka Anthem",
    src: "/media/songs/ashka-anthem.mp3",
    thumbnail: "/gallery/WhatsApp Image 2026-08-07 at 10.06.30 PM.jpeg",
    duration: "3:45",
    category: "song",
    year: "2026",
    description: "The official anthem of Ashka Group."
  },
  {
    id: 2,
    type: "video",
    title: "Silver Jubilee Celebration",
    src: "/media/videos/silver-jubilee.mp4",
    thumbnail: "/gallery/WhatsApp Image 2026-08-07 at 9.48.30 PM.jpeg",
    category: "celebration",
    year: "2017",
    description: "Highlights from our 25-year milestone celebration."
  }
];

const memoryWallItems = [
  { img: "/gallery/WhatsApp Image 2026-08-07 at 9.40.15 PM.jpeg", caption: "The Early Years" },
  { img: "/gallery/WhatsApp Image 2026-08-07 at 9.54.22 PM (1).jpeg", caption: "Graduation Day 2022" },
  { img: "/gallery/WhatsApp Image 2026-08-07 at 10.12.52 PM (2).jpeg", caption: "Leadership Workshop" },
  { img: "/gallery/WhatsApp Image 2026-08-07 at 9.40.15 PM (1).jpeg", caption: "Sports Meet" },
];

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  renderMediaGrid(mediaItems);
  renderMemoryWall();
  initAudioPlayer();
  initVideoModal();
});

// ============================================================================
// RENDERERS
// ============================================================================
function renderMediaGrid(items) {
  const grid = document.getElementById('media-grid');
  grid.innerHTML = ''; // clear

  if(items.length === 0) {
    grid.innerHTML = '<p style="color: white; grid-column: 1/-1; text-align: center;">No media found.</p>';
    return;
  }

  items.forEach(item => {
    let playIcon = '';
    if(item.type === 'song' || item.type === 'video') {
      playIcon = '<div class="play-icon-overlay">▶</div>';
    }

    const cardHTML = \`
      <div class="media-card type-\${item.type}" data-id="\${item.id}">
        <div class="media-thumbnail-container">
          <img src="\${item.thumbnail}" alt="\${item.title}" class="media-thumbnail" loading="lazy" />
          \${playIcon}
        </div>
        <div class="media-info">
          <span class="media-category">\${item.category}</span>
          <h3 class="media-title">\${item.title}</h3>
          <p class="media-desc">\${item.description}</p>
          <div class="media-footer">
            <span>\${item.year || ''}</span>
            <span>\${item.duration || ''}</span>
          </div>
        </div>
      </div>
    \`;
    grid.insertAdjacentHTML('beforeend', cardHTML);
  });

  // Attach click listeners for media playback
  document.querySelectorAll('.media-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.getAttribute('data-id'));
      const item = mediaItems.find(m => m.id === id);
      if(item.type === 'song') {
        playSong(item);
      } else if(item.type === 'video') {
        playVideo(item);
      }
    });
  });

  // Stagger animate cards in
  gsap.fromTo('.media-card', 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
  );
}

function renderMemoryWall() {
  const container = document.getElementById('memory-wall-scroll');
  memoryWallItems.forEach(item => {
    const html = \`
      <div class="memory-item">
        <img src="\${item.img}" alt="\${item.caption}" loading="lazy" />
        <div class="memory-caption">\${item.caption}</div>
      </div>
    \`;
    container.insertAdjacentHTML('beforeend', html);
  });
}



// ============================================================================
// AUDIO PLAYER
// ============================================================================
let currentAudioItem = null;
const audioEl = document.getElementById('global-audio');
const stickyPlayer = document.getElementById('sticky-audio-player');
const playPauseBtn = document.getElementById('player-playpause');
const progressBar = document.getElementById('player-progress-bar');
const visualizer = document.getElementById('player-visualizer');

function initAudioPlayer() {
  document.getElementById('player-close').addEventListener('click', () => {
    audioEl.pause();
    stickyPlayer.classList.add('hidden');
    visualizer.classList.add('paused');
  });

  playPauseBtn.addEventListener('click', () => {
    if(audioEl.paused) {
      audioEl.play();
      playPauseBtn.innerText = '⏸ Pause';
      visualizer.classList.remove('paused');
    } else {
      audioEl.pause();
      playPauseBtn.innerText = '▶ Play';
      visualizer.classList.add('paused');
    }
  });

  audioEl.addEventListener('timeupdate', () => {
    if(audioEl.duration) {
      const progress = (audioEl.currentTime / audioEl.duration) * 100;
      progressBar.style.width = \`\${progress}%\`;
    }
  });

  audioEl.addEventListener('ended', () => {
    playPauseBtn.innerText = '▶ Play';
    visualizer.classList.add('paused');
  });
  
  // Suppress errors for missing files in development
  audioEl.addEventListener('error', (e) => {
    console.log("Audio file missing or failed to load. (Expected during dev without media files)");
    visualizer.classList.add('paused');
    playPauseBtn.innerText = '▶ Play';
  });
}

function playSong(item) {
  currentAudioItem = item;
  document.getElementById('player-title').innerText = item.title;
  audioEl.src = item.src;
  
  // Show player
  stickyPlayer.classList.remove('hidden');
  
  // Attempt play
  playPauseBtn.innerText = '⏸ Pause';
  visualizer.classList.remove('paused');
  audioEl.play().catch(e => {
    console.log("Autoplay prevented or file missing.", e);
    playPauseBtn.innerText = '▶ Play';
    visualizer.classList.add('paused');
  });
}

// ============================================================================
// VIDEO MODAL
// ============================================================================
const videoModal = document.getElementById('video-modal');
const videoEl = document.getElementById('modal-video-player');

function initVideoModal() {
  document.getElementById('video-close').addEventListener('click', closeVideo);
  document.querySelector('.video-modal-overlay').addEventListener('click', closeVideo);
  
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !videoModal.classList.contains('hidden')) {
      closeVideo();
    }
  });
}

function playVideo(item) {
  document.getElementById('video-modal-title').innerText = item.title;
  document.getElementById('video-modal-category').innerText = item.category;
  document.getElementById('video-modal-desc').innerText = item.description;
  
  videoEl.src = item.src;
  videoModal.classList.remove('hidden');
  
  // Pause global audio if playing
  if(!audioEl.paused) {
    audioEl.pause();
    playPauseBtn.innerText = '▶ Play';
    visualizer.classList.add('paused');
  }

  videoEl.play().catch(e => console.log("Video missing or autoplay prevented.", e));
}

function closeVideo() {
  videoModal.classList.add('hidden');
  videoEl.pause();
  videoEl.src = "";
}
