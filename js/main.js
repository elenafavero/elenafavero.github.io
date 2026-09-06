/**
 * Portfolio Elena Favero - Main JavaScript
 * Handles Dark/Light theme, mobile navigation, active link scrollspy,
 * interactive project modals, and contact form handling (in English).
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initProjectModals();
  initContactForm();
  initScrollEffects();
  updateCopyrightYear();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  const sunIcon = document.getElementById('themeSunIcon');
  const moonIcon = document.getElementById('themeMoonIcon');

  // Determine initial theme: localStorage > OS preference > default light
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });

  // Listen for OS system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
      themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }
}

/* ==========================================================================
   2. Navigation & Mobile Menu
   ========================================================================== */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const siteHeader = document.querySelector('.site-header');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close mobile menu on link click
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Header shadow on scroll
  window.addEventListener('scroll', () => {
    if (siteHeader) {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   3. Scrollspy & Section Highlight
   ========================================================================== */
function initScrollEffects() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  function setActiveNav(id) {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function updateActiveNavLink() {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollBottom = window.scrollY + window.innerHeight;

    // 1. Bottom of page check: unconditionally activate "Contact" when scrolled to bottom
    if (scrollBottom >= scrollHeight - 80) {
      setActiveNav('contact');
      return;
    }

    // 2. Determine currently viewed section from top to bottom
    const readingOffset = 160; // Offset below fixed header
    let currentId = sections[0].getAttribute('id');

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const rect = section.getBoundingClientRect();
      const id = section.getAttribute('id');

      if (id === 'contact') {
        // Activate contact if it occupies a noticeable portion of the viewport
        if (rect.top <= window.innerHeight * 0.55) {
          currentId = id;
        }
      } else if (rect.top <= readingOffset) {
        currentId = id;
      }
    }

    if (currentId) {
      setActiveNav(currentId);
    }
  }

  // Smooth click interaction: immediately reflect active state on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        setActiveNav(href.substring(1));
      }
    });
  });

  // 60fps throttled scroll event with requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateActiveNavLink, { passive: true });
  window.addEventListener('load', updateActiveNavLink, { passive: true });

  // Initial call on page load
  updateActiveNavLink();
}

/* ==========================================================================
   4. Projects Data & Interactive Modals (in English)
   ========================================================================== */

/**
 * Formats basic markdown patterns like **bold** into <strong>bold</strong>
 * and `code` into <code>code</code> so they render properly in HTML.
 */
function formatMarkdownText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="background: var(--bg-subtle); padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.88em;">$1</code>');
}

const PROJECTS_DATA = {
  'thesis-ai-agent': {
    title: 'Master\'s Thesis: An AI Agent System to Generate JMH Microbenchmarks',
    category: 'Software Engineering & AI Agents',
    context: 'Chalmers University of Technology (Sweden) & Politecnico di Torino (2025 - 2026)',
    overview: 'Design and implementation of an autonomous AI agent system to generate, validate, and execute accurate Java Microbenchmark Harness (JMH) microbenchmarks.',
    challenge: 'Writing reliable Java microbenchmarks is notoriously error-prone due to aggressive JIT compiler optimizations (such as Dead Code Elimination and Constant Folding), JVM warmup non-determinism, state management errors, and harness loop overhead. Flawed microbenchmarks produce misleading performance data that misguide software engineering decisions.',
    architecture: 'The system operates using a multi-agent cooperative architecture with a feedback-driven execution loop:\n1. **Code Analyzer Agent**: Parses target Java classes, extracting method signatures, control flow, complexity, and dependencies.\n2. **Benchmark Generator Agent**: Synthesizes JMH benchmark code with correct annotations (@Benchmark, @State, @Warmup, @Measurement, Blackhole) and rigorous parameterization.\n3. **Validation & Sandbox Runner Agent**: Compiles and executes the benchmark in an isolated sandbox, inspecting generated bytecode and JVM execution logs to verify absence of dead-code elimination.\n4. **Feedback & Refinement Loop**: Diagnoses statistical variance or compilation issues, iteratively adjusting benchmark harness parameters until strict reliability criteria are met.',
    technologies: ['Java', 'JMH (Java Microbenchmark Harness)', 'AI Agents', 'LLM Tooling & Prompt Engineering', 'JVM Internals', 'Python', 'Benchmarking'],
    pdfUrl: 'assets/documents/Elena_Favero_Master_Thesis.pdf',
    pdfLabel: "Read Full Master's Thesis (PDF)"
  },
  'isi-conflict-analysis': {
    title: 'Conflict Analysis: An Explorational Study',
    category: 'Research Internship · Data Science & Geospatial Analysis',
    context: 'ISI Foundation (Turin, IT) — Research Internship (March 2024 – June 2024)',
    overview: 'An exploratory data science study analyzing international armed conflict dynamics and spatial event patterns across South America, with an in-depth focus on Brazil, examining relationships between violence hotspots, urbanization, and socio-economic vulnerability indicators.',
    challenge: 'Processing and harmonizing large-scale, heterogeneous conflict event logs from the ACLED dataset across disparate geographic boundaries, computing spatial indices (density and population exposure), and identifying statistically sound correlations with socio-economic and demographic census indicators.',
    architecture: 'Analytical methodology and geospatial data pipeline:\n1. **Data Ingestion & Cleaning**: Harmonized large-scale event-level records from the Armed Conflict Location & Event Data Project (ACLED) for South American regions, filtering event types, dates, and geographic coordinates.\n2. **Geospatial Feature Engineering**: Employed Geopandas, Shapely, and spatial indexing to calculate regional conflict density, incident frequency, and local population conflict exposure metrics.\n3. **Socio-Economic Correlation**: Merged spatial conflict layers with demographic and urbanization datasets using Pandas, identifying spatial clusters and statistically significant correlations.\n4. **Data Visualization & Thematic Mapping**: Developed rich cartographic maps and statistical distributions with Matplotlib to present analytical findings and geographic distributions clearly.',
    technologies: ['Python', 'Pandas', 'Geopandas', 'Matplotlib', 'Shapely', 'Dask', 'Geospatial Analysis', 'ACLED Dataset'],
    pdfUrl: 'assets/documents/Elena_Favero_ISI_Report.pdf',
    pdfLabel: 'Read Internship Final Report (PDF)'
  },
  'webapp-stuff-happens': {
    title: '"Stuff Happens" – Single-Player Web Application',
    category: 'Full-Stack Web Development',
    context: 'Politecnico di Torino — Web Applications I',
    overview: 'A full-stack single-player web adaptation of the board game "Stuff Happens", themed around Travel & Tourism misadventures. Players compete against the computer over multiple 30-second rounds to correctly position newly drawn horrible situation cards along an increasing "bad luck index" (1 to 100), aiming to collect 6 cards to win before accumulating 3 mistakes. Built with React 19 and Node.js/Express.',
    challenge: 'Ensuring fair real-time gameplay by validating card positions on the server without revealing hidden "bad luck" indices to the browser, while keeping the 30-second countdown timer and player score synchronized.',
    architecture: 'The system is organized into four main layers:\n1. **Frontend (React 19)**: Delivers a responsive Single Page Application that handles user interaction, visual card ordering, and the animated 30-second round timer.\n2. **Backend (Node.js & Express)**: Manages core game logic, randomly draws situation cards, and verifies whether the player\'s chosen placement is correct.\n3. **Database (SQLite)**: Stores the deck of 50+ situation cards, registered user credentials, and match history.\n4. **Authentication (Passport.js)**: Allows registered users to track their game history and progress across rounds, while providing visitors with a quick 1-round demo mode.',
    technologies: ['React 19', 'Node.js', 'Express', 'SQLite', 'Passport.js', 'JavaScript', 'REST API'],
    screenshots: [
      {
        url: 'assets/images/stuff-happens-game.png',
        caption: 'During the Game: Active round with 30-second timer countdown, drawn situation card, and interactive slot placement among owned cards.'
      },
      {
        url: 'assets/images/stuff-happens-user-history.png',
        caption: 'User Games Overview: Profile page displaying historical games, mistake counts, rounds won/lost, and collected cards.'
      }
    ]
  },
  'pacman-landtiger': {
    title: 'Pac-Man for LandTiger Board',
    category: 'Embedded Systems & Computer Architectures',
    context: 'Politecnico di Torino — Computer Architectures Coursework',
    overview: 'A bare-metal implementation of the classic Pac-Man arcade game in C for the LandTiger LPC1768 development board (ARM Cortex-M3). The system renders an interactive maze on the onboard LCD display, handles responsive joystick movement, simulates Blinky ghost chasing AI, manages real-time game states via hardware interrupts, and broadcasts telemetry externally over the CAN bus.',
    challenge: 'Developing responsive arcade gameplay directly on bare-metal hardware with constrained memory, orchestrating hardware timer interrupts (RIT and Timers) for 60-second countdowns and movement polling, detecting collisions across a 240-pill maze, and synchronizing asynchronous external push-button interrupts (INT0) without an operating system.',
    architecture: 'The firmware is structured into modular low-level drivers interfacing directly with LPC1768 peripherals:\n1. **Display & Graphics Driver (LCD)**: Renders the customized maze layout, animated Pac-Man, 240 standard pills (+10 pts), 6 randomly generated power pills (+50 pts), and real-time on-screen telemetry (score, extra life every 1000 pts, and 60-second timer).\n2. **Motion & Teleport Controller (Joystick & RIT)**: Polls the 5-way joystick using Repetitive Interrupt Timers (RIT), providing continuous directional motion until wall collision, and handles horizontal tunnel wrap-around teleportation through the central box.\n3. **Ghost AI (Blinky)**: Implements autonomous chasing logic for the red ghost, continually tracking and minimizing the distance toward Pac-Man\'s coordinates.\n4. **Interrupt Management & Game States (INT0 & Timers)**: Uses hardware timers for the 60s countdown and external push-button interrupts (INT0) to toggle the game into and out of PAUSE mode.\n5. **Telemetry over CAN Bus**: Continuously broadcasts game metrics to external CAN nodes, including current score, remaining lives, and the active countdown timer.',
    technologies: ['C Programming', 'ARM Cortex-M3', 'LandTiger LPC1768', 'CAN Bus', 'Embedded Peripherals (LCD, Joystick, Timers, RIT)', 'Hardware Interrupts (ISR)'],
    video: {
      sources: [
        { src: 'assets/videos/pacman-demo.mov', type: 'video/quicktime' },
        { src: 'assets/videos/video.mov', type: 'video/quicktime' },
        { src: 'assets/videos/pacman-demo.mp4', type: 'video/mp4' },
        { src: 'assets/videos/video.mp4', type: 'video/mp4' }
      ],
      caption: 'Gameplay Demonstration on LandTiger Board: Maze navigation, joystick steering, pill consumption, and Blinky ghost chase AI.'
    }
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('projectModalBackdrop');
  const modalCloseBtn = document.getElementById('projectModalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalContext = document.getElementById('modalContext');
  const modalOverview = document.getElementById('modalOverview');
  const modalChallenge = document.getElementById('modalChallenge');
  const modalArchitecture = document.getElementById('modalArchitecture');
  const modalTechStack = document.getElementById('modalTechStack');
  const modalResultsSection = document.getElementById('modalResultsSection');
  const modalResults = document.getElementById('modalResults');
  const modalGallerySection = document.getElementById('modalGallerySection');
  const modalGallery = document.getElementById('modalGallery');
  const modalVideoSection = document.getElementById('modalVideoSection');
  const modalVideoContainer = document.getElementById('modalVideoContainer');
  const modalDocContainer = document.getElementById('modalDocumentContainer');

  const detailButtons = document.querySelectorAll('[data-project-id]');
  let lastFocusedElement = null;

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project-id');
      const project = PROJECTS_DATA[projectId];
      if (!project) return;

      lastFocusedElement = btn;

      // Fill modal fields
      if (modalTitle) modalTitle.textContent = project.title;
      if (modalCategory) modalCategory.textContent = project.category;
      if (modalContext) modalContext.textContent = project.context;
      if (modalOverview) modalOverview.innerHTML = formatMarkdownText(project.overview);
      if (modalChallenge) modalChallenge.innerHTML = formatMarkdownText(project.challenge);
      
      // Architecture formatting (converting 1. **Title**: ... into styled list items with real <strong> tags)
      if (modalArchitecture) {
        const lines = (project.architecture || '').split('\n').filter(l => l.trim().length > 0);
        let html = '';
        let inList = false;

        lines.forEach(line => {
          const trimmed = line.trim();
          const isListItem = /^\d+\.\s+/.test(trimmed);

          if (isListItem) {
            if (!inList) {
              html += '<ol class="modal-architecture-list">';
              inList = true;
            }
            const itemContent = trimmed.replace(/^\d+\.\s+/, '');
            html += `<li>${formatMarkdownText(itemContent)}</li>`;
          } else {
            if (inList) {
              html += '</ol>';
              inList = false;
            }
            html += `<p style="margin-bottom: 0.75rem; line-height: 1.65; color: var(--text-secondary);">${formatMarkdownText(trimmed)}</p>`;
          }
        });

        if (inList) {
          html += '</ol>';
        }

        modalArchitecture.innerHTML = html;
      }

      if (modalTechStack) {
        modalTechStack.innerHTML = project.technologies
          .map(tech => `<span class="tag accent">${tech}</span>`)
          .join('');
      }

      // Results section: Show only if project has results (hidden for thesis as requested)
      if (modalResultsSection && modalResults) {
        if (project.results && project.results.trim() !== '') {
          modalResults.innerHTML = formatMarkdownText(project.results);
          modalResultsSection.style.display = 'block';
        } else {
          modalResults.innerHTML = '';
          modalResultsSection.style.display = 'none';
        }
      }

      // Application Screenshots gallery: Display screenshots if available
      if (modalGallerySection && modalGallery) {
        if (project.screenshots && project.screenshots.length > 0) {
          modalGallery.innerHTML = project.screenshots.map(shot => `
            <div class="modal-gallery-item">
              <a href="${shot.url}" target="_blank" rel="noopener noreferrer" title="Click to view full screenshot in new tab">
                <img src="${shot.url}" alt="${shot.caption}" class="modal-gallery-img" loading="lazy">
              </a>
              <div class="modal-gallery-caption">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; color: var(--accent-primary); margin-top: 2px;">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>${shot.caption}</span>
              </div>
            </div>
          `).join('');
          modalGallerySection.style.display = 'block';
        } else {
          modalGallery.innerHTML = '';
          modalGallerySection.style.display = 'none';
        }
      }

      // Gameplay Video: Display HTML5 video player if available
      if (modalVideoSection && modalVideoContainer) {
        if (project.video) {
          const sourcesHtml = project.video.sources
            .map(s => `                <source src="${s.src}" type="${s.type}">`)
            .join('\n');

          modalVideoContainer.innerHTML = `
            <div class="modal-video-wrapper">
              <video controls preload="metadata" playsinline class="modal-video-element">
${sourcesHtml}
                Your browser does not support the video tag.
              </video>
              <div class="modal-video-caption">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; color: var(--accent-primary); margin-top: 2px;">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                <span>${project.video.caption}</span>
              </div>
            </div>
          `;
          modalVideoSection.style.display = 'block';
        } else {
          modalVideoContainer.innerHTML = '';
          modalVideoSection.style.display = 'none';
        }
      }

      if (modalDocContainer) {
        if (project.pdfUrl) {
          const btnLabel = project.pdfLabel || "Read Full Document (PDF)";
          modalDocContainer.innerHTML = `
            <a href="${project.pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.6rem 1.25rem; font-size: 0.9rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>${btnLabel}</span>
            </a>
          `;
          modalDocContainer.style.display = 'block';
        } else {
          modalDocContainer.innerHTML = '';
          modalDocContainer.style.display = 'none';
        }
      }

      // Show modal
      openModal();
    });
  });

  function openModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalCloseBtn?.focus();
  }

  function closeModal() {
    if (!modalBackdrop) return;
    const activeVideo = modalBackdrop.querySelector('video');
    if (activeVideo) {
      activeVideo.pause();
    }
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. Contact Form Handler (in English)
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');

    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const subject = subjectInput?.value.trim() || 'Portfolio Contact';
    const message = messageInput?.value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    // Format mailto link to open email client with prefilled details
    const mailtoBody = encodeURIComponent(
      `Hi Elena,\n\nI am ${name} (${email}).\n\n${message}\n\nBest regards,\n${name}`
    );
    const mailtoSubject = encodeURIComponent(`[Portfolio] ${subject}`);
    const mailtoLink = `mailto:faveroelena2@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Open mailto link
    window.location.href = mailtoLink;

    // Show feedback
    if (formFeedback) {
      formFeedback.textContent = 'Thank you for your message! Your default email client will open to send the email directly to faveroelena2@gmail.com.';
      formFeedback.className = 'form-feedback success';
      formFeedback.style.display = 'block';
    }

    contactForm.reset();
  });
}

/* ==========================================================================
   6. Dynamic Copyright Year
   ========================================================================== */
function updateCopyrightYear() {
  const yearElement = document.getElementById('copyrightYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
