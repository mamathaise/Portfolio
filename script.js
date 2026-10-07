/**
 * Software Engineer Portfolio - Interactive Scripts
 * Handles Night Mode Toggle, LocalStorage Persistence, Mobile Nav, and Smooth Scrolling
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. NIGHT MODE / THEME TOGGLE (WITH CSS MEDIA QUERY DETECTION)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const pixelThemeSwitch = document.getElementById('pixel-theme-switch');
  const pixelThemeLabel = document.getElementById('pixel-theme-label');
  const rootElement = document.documentElement;
  const STORAGE_KEY = 'portfolio_theme';

  // Media Query detecting user's default browser theme
  const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Helper to update theme UI elements and attributes
  function applyTheme(theme, isUserManual = true) {
    if (isUserManual) {
      rootElement.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
    } else {
      // Let CSS Media Queries take precedence if not explicitly set by user
      rootElement.removeAttribute('data-theme');
    }

    const activeMode = theme || (darkMediaQuery.matches ? 'dark' : 'light');

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        activeMode === 'dark' ? 'Switch to light mode' : 'Switch to night mode'
      );
      themeToggleBtn.setAttribute(
        'title',
        activeMode === 'dark' ? 'Night mode active (click for light)' : 'Light mode active (click for night)'
      );
    }

    if (pixelThemeLabel) {
      const modeText = activeMode === 'dark' ? '8-BIT NIGHT' : '8-BIT DAY';
      const sourceText = isUserManual ? 'MANUAL' : 'MEDIA QUERY';
      pixelThemeLabel.textContent = `THEME: ${modeText} (${sourceText})`;
    }
  }

  // Determine initial theme on page load: check localStorage, otherwise auto-detect via media query
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) {
    applyTheme(savedTheme, true);
  } else {
    // Rely on CSS Media Query detection directly
    applyTheme(darkMediaQuery.matches ? 'dark' : 'light', false);
  }

  // Listen to OS/Browser theme preference changes in real time
  darkMediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });

  // Toggle theme action handler
  function toggleThemeAction() {
    const currentActiveTheme = rootElement.getAttribute('data-theme') || (darkMediaQuery.matches ? 'dark' : 'light');
    const newTheme = currentActiveTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleThemeAction);
  }

  if (pixelThemeSwitch) {
    pixelThemeSwitch.addEventListener('click', toggleThemeAction);
  }

  const sidebarThemeToggle = document.getElementById('sidebar-theme-toggle');
  if (sidebarThemeToggle) {
    sidebarThemeToggle.addEventListener('click', toggleThemeAction);
  }

  // 2. VERTICAL SIDEBAR NAVIGATION & MOBILE DRAWER TOGGLE
  const verticalSidebar = document.getElementById('vertical-sidebar');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  function openSidebar() {
    if (verticalSidebar) {
      verticalSidebar.classList.add('open');
      if (sidebarToggleBtn) {
        sidebarToggleBtn.setAttribute('aria-expanded', 'true');
      }
      if (sidebarBackdrop) {
        sidebarBackdrop.classList.add('active');
      }
    }
  }

  function closeSidebar() {
    if (verticalSidebar) {
      verticalSidebar.classList.remove('open');
      if (sidebarToggleBtn) {
        sidebarToggleBtn.setAttribute('aria-expanded', 'false');
      }
      if (sidebarBackdrop) {
        sidebarBackdrop.classList.remove('active');
      }
    }
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      const isOpen = verticalSidebar && verticalSidebar.classList.contains('open');
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Keyboard accessibility: Close mobile sidebar with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && verticalSidebar && verticalSidebar.classList.contains('open')) {
      closeSidebar();
      if (sidebarToggleBtn) sidebarToggleBtn.focus();
    }
  });

  // Close sidebar on link click (for mobile/tablet screens)
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });

  // 3. ACTIVE NAV LINK HIGHLIGHT ON SCROLL (SPY ALL 8 SECTIONS)
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        sidebarLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav(); // Initial evaluation on load

  // 4. INTERACTIVE 8-BIT CHAT TERMINAL
  const chatForm = document.getElementById('terminal-chat-form');
  const chatInput = document.getElementById('terminal-input');
  const chatMessages = document.getElementById('terminal-messages');
  const chipButtons = document.querySelectorAll('.terminal-chip-btn');

  const botResponses = {
    'stack': 'Mamatha excels in TypeScript, JavaScript (ES6+), React.js, Next.js, Node.js, Python (FastAPI), PostgreSQL, Docker, AWS, and distributed event-driven systems.',
    'avail': 'Mamatha is currently AVAILABLE for full-time software engineering roles and ambitious contracts (Remote or Hybrid). Feel free to reach out via the Contact section!',
    'project': 'Check out CloudScale (distributed metrics engine), DevFlow (containerized CLI pipeline), and SmartQuery (LLM natural language SQL assistant) above in the Projects section!',
    'resume': 'You can download Mamatha\'s official PDF resume anytime from the button above or directly at RESUME.pdf!',
    'default': 'Message received, Player 1! Mamatha will review your inquiry. You can also send a direct message through the Contact form below!'
  };

  function appendChatMessage(sender, text, isUser = false) {
    if (!chatMessages) return;
    const msgEl = document.createElement('div');
    msgEl.className = `terminal-msg ${isUser ? 'user-msg' : 'bot-msg'}`;
    
    const prefixEl = document.createElement('span');
    prefixEl.className = 'msg-prefix';
    prefixEl.textContent = sender;

    const contentEl = document.createElement('span');
    contentEl.className = 'msg-content';
    contentEl.textContent = text;

    msgEl.appendChild(prefixEl);
    msgEl.appendChild(contentEl);
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleUserQuery(userQuery) {
    if (!userQuery.trim()) return;
    appendChatMessage('> YOU:', userQuery, true);

    const lower = userQuery.toLowerCase();
    let reply = botResponses.default;

    if (lower.includes('tech') || lower.includes('stack') || lower.includes('skill')) {
      reply = botResponses.stack;
    } else if (lower.includes('avail') || lower.includes('job') || lower.includes('hire') || lower.includes('role')) {
      reply = botResponses.avail;
    } else if (lower.includes('project') || lower.includes('work') || lower.includes('cloudscale')) {
      reply = botResponses.project;
    } else if (lower.includes('resume') || lower.includes('cv') || lower.includes('download')) {
      reply = botResponses.resume;
    }

    setTimeout(() => {
      appendChatMessage('> MAMATHA_BOT:', reply, false);
    }, 450);
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = chatInput.value;
      chatInput.value = '';
      handleUserQuery(query);
    });
  }

  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.getAttribute('data-query');
      if (query) {
        handleUserQuery(query);
      }
    });
  });

  // 5. DYNAMIC COPYRIGHT YEAR
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 6. CONTACT FORM HANDLER (PREVIEW)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Message Sent! ✓</span>';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 3000);
    });
  }
});
