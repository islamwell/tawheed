// Main Application Controller
import { NAMES_DATA, ALLAH_SUPREME, CATEGORIES } from './data/names.js';
import { SITUATIONAL_THEMES } from './data/situational.js';
import { Storage } from './storage.js';
import { QuizManager } from './quiz.js';

class TawheedApp {
  constructor() {
    this.names = NAMES_DATA || [];
    this.filteredNames = [...this.names];
    this.currentCategory = 'All';
    this.currentFilter = 'all'; // all, bookmarked, learned, unlearned
    this.searchQuery = '';
    this.activeName = null;
    this.currentFontSize = 'large'; // standard, large, xl
    this.currentTheme = 'midnight'; // midnight, emerald, pearl

    this.quizManager = new QuizManager(this.names, () => this.updateLearnedProgress());

    this.init();
  }

  init() {
    try { this.loadSettings(); } catch (e) { console.error('Settings error:', e); }
    try { this.initCanvasBackground(); } catch (e) { console.error('Canvas error:', e); }
    try { this.initCategoryPills(); } catch (e) { console.error('Category pills error:', e); }
    try { this.initSituationalBar(); } catch (e) { console.error('Situational bar error:', e); }
    try { this.initNameOfTheDay(); } catch (e) { console.error('Hero error:', e); }
    try { this.renderGrid(); } catch (e) { console.error('Grid render error:', e); }
    try { this.updateLearnedProgress(); } catch (e) { console.error('Progress error:', e); }
    try { this.initEventListeners(); } catch (e) { console.error('Event listeners error:', e); }
    try { this.initKeyboardShortcuts(); } catch (e) { console.error('Shortcuts error:', e); }
  }

  loadSettings() {
    const settings = Storage.getSettings();
    this.currentFontSize = settings.fontSize || 'large';
    this.currentTheme = settings.theme || 'midnight';
    document.documentElement.setAttribute('data-font-size', this.currentFontSize);
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    // Update active state on font size buttons
    document.querySelectorAll('.font-scale-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === this.currentFontSize);
    });
  }

  // Animated celestial particle canvas for ambient background
  initCanvasBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const stars = [];
    const count = Math.min(width > 768 ? 85 : 40, 90);

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.25 + 0.05,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
        const alpha = star.alpha + Math.sin(frame * star.twinkleSpeed + star.twinkleOffset) * 0.25;
        ctx.fillStyle = `rgba(240, 220, 180, ${Math.max(0.1, Math.min(1, alpha))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        window.requestAnimationFrame(render);
      }
    };
    render();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }

  // Name of the Day
  initNameOfTheDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const dayName = this.names.length > 0 ? this.names[dayOfYear % this.names.length] : ALLAH_SUPREME;

    const heroSection = document.getElementById('hero-name-day');
    if (!heroSection || !dayName) return;

    heroSection.innerHTML = `
      <div class="hero-backdrop" style="background-image: linear-gradient(to right, rgba(7, 11, 25, 0.92) 15%, rgba(7, 11, 25, 0.65) 60%, rgba(7, 11, 25, 0.9)), url('${dayName.natureImage}');"></div>
      <div class="hero-content">
        <div class="hero-tag-badge">
          <span class="pulse-dot"></span>
          <span>Contemplation of the Day • ${today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
        <div class="hero-main-row">
          <div class="hero-arabic-wrap">
            <h1 class="hero-arabic quranic-arabic">${dayName.arabic}</h1>
          </div>
          <div class="hero-details">
            <div class="hero-translit-row">
              <span class="hero-number">#${dayName.id === 0 ? 'Supreme' : dayName.id}</span>
              <h2 class="hero-transliteration">${dayName.transliteration}</h2>
              <span class="hero-category-chip">${dayName.category}</span>
            </div>
            <p class="hero-meaning">${dayName.meaning}</p>
            <p class="hero-insight-snippet">
              <strong>Spiritual Core:</strong> ${dayName.howToLive ? dayName.howToLive.slice(0, 160) : ''}...
            </p>
            <div class="hero-actions">
              <button class="btn btn-primary open-deep-dive-btn" data-name-id="${dayName.id}">
                <span>Deep Dive & Reflections</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
              <button class="btn btn-glass bookmark-toggle-btn ${Storage.isBookmarked(dayName.id) ? 'active' : ''}" data-name-id="${dayName.id}" aria-label="Bookmark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${Storage.isBookmarked(dayName.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
                <span>${Storage.isBookmarked(dayName.id) ? 'Bookmarked' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Category filter pills
  initCategoryPills() {
    const container = document.getElementById('category-pills');
    if (!container) return;

    container.innerHTML = CATEGORIES.map(cat => `
      <button class="pill-btn ${cat === this.currentCategory ? 'active' : ''}" data-category="${cat}">
        ${cat === 'All' ? '✨ All 99 Names' : cat}
      </button>
    `).join('');
  }

  // Situational "Call Upon Him" Bar
  initSituationalBar() {
    const container = document.getElementById('situational-chips');
    if (!container) return;

    container.innerHTML = SITUATIONAL_THEMES.map(theme => `
      <button class="mood-card-btn" data-mood-id="${theme.id}">
        <span class="mood-icon">${theme.icon}</span>
        <div class="mood-info">
          <strong class="mood-title">${theme.title}</strong>
          <span class="mood-desc">${theme.description}</span>
        </div>
      </button>
    `).join('');
  }

  // Grid rendering
  renderGrid() {
    const grid = document.getElementById('names-grid');
    const emptyState = document.getElementById('empty-state');
    const countBadge = document.getElementById('results-count');
    if (!grid) return;

    // Apply filtering
    this.filteredNames = this.names.filter(item => {
      // Category filter
      if (this.currentCategory !== 'All' && item.category !== this.currentCategory) {
        return false;
      }
      // Status filter
      if (this.currentFilter === 'bookmarked' && !Storage.isBookmarked(item.id)) return false;
      if (this.currentFilter === 'learned' && !Storage.isLearned(item.id)) return false;
      if (this.currentFilter === 'unlearned' && Storage.isLearned(item.id)) return false;

      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase().trim();
        const matchesArabic = item.arabic && item.arabic.includes(q);
        const matchesTranslit = item.transliteration && item.transliteration.toLowerCase().includes(q);
        const matchesMeaning = item.meaning && item.meaning.toLowerCase().includes(q);
        const matchesRoot = item.root && item.root.toLowerCase().includes(q);
        const matchesTags = item.moodTags && item.moodTags.some(t => t.toLowerCase().includes(q));
        return matchesArabic || matchesTranslit || matchesMeaning || matchesRoot || matchesTags;
      }

      return true;
    });

    if (countBadge) {
      countBadge.textContent = `Showing ${this.filteredNames.length} of 100 Divine Names`;
    }

    if (this.filteredNames.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = this.filteredNames.map(item => {
      const isLearned = Storage.isLearned(item.id);
      const isBookmarked = Storage.isBookmarked(item.id);

      return `
        <article class="name-card ${item.isSupreme ? 'supreme-card' : ''} ${isLearned ? 'is-learned' : ''}" data-name-id="${item.id}" style="cursor: pointer;">
          <div class="card-bg-image" style="background-image: url('${item.natureImage}');"></div>
          <div class="card-glass-overlay"></div>
          
          <div class="card-top-bar">
            <span class="name-badge-num">${item.id === 0 ? '★ Supreme' : '#' + item.id}</span>
            <div class="card-quick-actions">
              <button class="icon-btn bookmark-card-btn ${isBookmarked ? 'active' : ''}" data-name-id="${item.id}" title="Bookmark" aria-label="Bookmark">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
              </button>
              <button class="icon-btn learned-card-btn ${isLearned ? 'active' : ''}" data-name-id="${item.id}" title="Mark as memorized" aria-label="Learned">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-arabic quranic-arabic">${item.arabic}</h3>
            <h4 class="card-transliteration">${item.transliteration}</h4>
            <p class="card-meaning">${item.meaning}</p>
          </div>

          <div class="card-footer">
            <span class="card-root-badge">Root: ${item.root}</span>
            <button class="card-deep-link open-deep-dive-btn" data-name-id="${item.id}">
              <span>Explore Gems</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"></path></svg>
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  // Overall Learned Progress Ring
  updateLearnedProgress() {
    const learnedList = Storage.getLearned();
    const count = learnedList.length;
    const percent = Math.min(Math.round((count / 99) * 100), 100);

    const progressNumber = document.getElementById('learned-count-text');
    const ringCircle = document.getElementById('progress-ring-circle');

    if (progressNumber) progressNumber.textContent = `${count} / 99`;

    if (ringCircle) {
      // The SVG path in index.html has a normalized length of 100
      ringCircle.style.strokeDasharray = '100, 100';
      const offset = 100 - percent;
      ringCircle.style.strokeDashoffset = offset;
    }
  }

  // Open Deep-Dive Modal
  openModal(nameId) {
    const nameObj = this.names.find(n => n.id === Number(nameId));
    if (!nameObj) return;
    this.activeName = nameObj;

    const modal = document.getElementById('name-detail-modal');
    if (!modal) return;

    this.renderModalContent(nameObj);
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    document.body.classList.add('modal-open');
  }

  closeModal() {
    const modal = document.getElementById('name-detail-modal');
    if (modal && modal.open) {
      if (typeof modal.close === 'function') modal.close();
      else modal.removeAttribute('open');
      document.body.classList.remove('modal-open');
    }
  }

  renderModalContent(nameObj) {
    const container = document.getElementById('modal-inner-content');
    if (!container) return;

    const isLearned = Storage.isLearned(nameObj.id);
    const isBookmarked = Storage.isBookmarked(nameObj.id);
    const savedNote = Storage.getNote(nameObj.id);

    container.innerHTML = `
      <div class="modal-hero-header" style="background-image: linear-gradient(to bottom, rgba(7, 11, 25, 0.4) 0%, rgba(7, 11, 25, 0.95) 100%), url('${nameObj.natureImage}');">
        <div class="modal-nav-bar">
          <button class="nav-arrow-btn modal-prev-btn" title="Previous Name (Arrow Left)" aria-label="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"></path></svg>
            <span>Prev</span>
          </button>
          <span class="modal-num-badge">#${nameObj.id === 0 ? 'Supreme Name' : nameObj.id + ' of 99'}</span>
          <button class="nav-arrow-btn modal-next-btn" title="Next Name (Arrow Right)" aria-label="Next">
            <span>Next</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"></path></svg>
          </button>
        </div>

        <div class="modal-hero-body">
          <h2 class="modal-arabic-title quranic-arabic">${nameObj.arabic}</h2>
          <h3 class="modal-transliteration">${nameObj.transliteration}</h3>
          <p class="modal-english-meaning">${nameObj.meaning}</p>
          <div class="modal-meta-pills">
            <span class="meta-pill">Root: ${nameObj.root}</span>
            <span class="meta-pill">${nameObj.category}</span>
          </div>
        </div>

        <div class="modal-quick-toolbar">
          <button class="modal-tool-btn bookmark-toggle-btn ${isBookmarked ? 'active' : ''}" data-name-id="${nameObj.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
            <span>${isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
          <button class="modal-tool-btn learned-toggle-btn ${isLearned ? 'active' : ''}" data-name-id="${nameObj.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${isLearned ? 'Memorized ✓' : 'Mark Memorized'}</span>
          </button>
          <button class="modal-tool-btn copy-quote-btn" data-name-id="${nameObj.id}">
            <span>📋 Copy Reflection Card</span>
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="modal-tabs-nav">
        <button class="tab-btn active" data-tab="tab-theology">
          <span class="tab-icon">📖</span>
          <span>Theological Depth</span>
        </button>
        <button class="tab-btn" data-tab="tab-linguistic">
          <span class="tab-icon">💡</span>
          <span>Linguistic Nuances</span>
        </button>
        <button class="tab-btn" data-tab="tab-quran">
          <span class="tab-icon">📜</span>
          <span>Quranic Ayah</span>
        </button>
        <button class="tab-btn" data-tab="tab-living">
          <span class="tab-icon">🤲</span>
          <span>Living by this Name</span>
        </button>
        <button class="tab-btn" data-tab="tab-journal">
          <span class="tab-icon">📝</span>
          <span>My Notes</span>
        </button>
      </div>

      <!-- Tab Contents -->
      <div class="modal-tab-body">
        <!-- Tab 1: Theological Depth -->
        <div class="tab-panel active" id="tab-theology">
          <div class="commentary-header">
            <div class="scholar-badge">
              <div class="scholar-avatar-initial">TD</div>
              <div>
                <strong>Theological Depth</strong>
                <span class="scholar-role">Classical Scholarly Synthesis & Divine Attributes</span>
              </div>
            </div>
          </div>
          <div class="commentary-text">
            <p>${nameObj.yqExplanation}</p>
          </div>
          <div class="scholarly-footer-callout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
            <span>Drawing from classical works including Imam Al-Ghazali's <em>Al-Maqsad Al-Asna</em> and Ibn Al-Qayyim's discourses on the Divine Names.</span>
          </div>
        </div>

        <!-- Tab 2: Linguistic Nuances -->
        <div class="tab-panel" id="tab-linguistic">
          <div class="commentary-header">
            <div class="scholar-badge nak-badge">
              <div class="scholar-avatar-initial nak-avatar">LN</div>
              <div>
                <strong>Linguistic Nuance</strong>
                <span class="scholar-role">Quranic Arabic Morphology & Heart-Centered Reflection</span>
              </div>
            </div>
          </div>
          <div class="linguistic-box">
            <span class="linguistic-label">Linguistic Root Analysis:</span>
            <p class="linguistic-desc">${nameObj.rootMeaning}</p>
          </div>
          <div class="commentary-text">
            <p>${nameObj.nakExplanation}</p>
          </div>
        </div>

        <!-- Tab 3: Quranic Ayah -->
        <div class="tab-panel" id="tab-quran">
          <div class="ayah-display-card">
            <span class="ayah-surah-tag">${nameObj.quranAyah ? nameObj.quranAyah.surah : ''}</span>
            <p class="ayah-arabic quranic-arabic">${nameObj.quranAyah ? nameObj.quranAyah.arabic : ''}</p>
            <p class="ayah-translation">"${nameObj.quranAyah ? nameObj.quranAyah.translation : ''}"</p>
          </div>
        </div>

        <!-- Tab 4: Living by this Name & Du'as -->
        <div class="tab-panel" id="tab-living">
          <div class="living-card">
            <h4 class="living-title">🌱 How to Embody this Name in Daily Life</h4>
            <p class="living-desc">${nameObj.howToLive}</p>
          </div>

          <div class="dua-card">
            <h4 class="dua-title">🤲 Supplication to Call Upon ${nameObj.transliteration}</h4>
            <p class="dua-arabic quranic-arabic">${nameObj.dua}</p>
          </div>
        </div>

        <!-- Tab 5: Reflection Journal -->
        <div class="tab-panel" id="tab-journal">
          <div class="journal-wrapper">
            <label for="user-reflection-input" class="journal-label">Your Personal Contemplation & Dua Journal</label>
            <p class="journal-sub">Reflections are saved privately to your local device only.</p>
            <textarea id="user-reflection-input" class="journal-textarea" rows="6" placeholder="Write how this Divine Name touches your current life, what du'a you want to make, or insights you gained...">${savedNote}</textarea>
            <div class="journal-actions">
              <button class="btn btn-primary save-journal-btn" data-name-id="${nameObj.id}">
                <span>Save Reflection</span>
              </button>
              <span class="journal-status" id="journal-status-msg"></span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachModalEvents(container, nameObj);
  }

  attachModalEvents(container, nameObj) {
    // Tab switching
    const tabBtns = container.querySelectorAll('.tab-btn');
    const tabPanels = container.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const targetPanel = container.querySelector('#' + targetId);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });

    // Save journal note
    const saveNoteBtn = container.querySelector('.save-journal-btn');
    const noteInput = container.querySelector('#user-reflection-input');
    const statusMsg = container.querySelector('#journal-status-msg');

    if (saveNoteBtn && noteInput) {
      saveNoteBtn.addEventListener('click', () => {
        Storage.saveNote(nameObj.id, noteInput.value.trim());
        if (statusMsg) {
          statusMsg.textContent = 'Saved privately ✓';
          setTimeout(() => { statusMsg.textContent = ''; }, 2500);
        }
      });
    }

    // Modal navigation next/prev
    const prevBtn = container.querySelector('.modal-prev-btn');
    const nextBtn = container.querySelector('.modal-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const currentIdx = this.names.findIndex(n => n.id === nameObj.id);
        const prevIdx = (currentIdx - 1 + this.names.length) % this.names.length;
        this.openModal(this.names[prevIdx].id);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const currentIdx = this.names.findIndex(n => n.id === nameObj.id);
        const nextIdx = (currentIdx + 1) % this.names.length;
        this.openModal(this.names[nextIdx].id);
      });
    }
  }



  // Flashcards UI
  openFlashcardsModal() {
    const modal = document.getElementById('flashcard-modal');
    if (!modal) return;
    this.renderFlashcardUI();
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
    document.body.classList.add('modal-open');
  }

  renderFlashcardUI() {
    const container = document.getElementById('flashcard-deck-container');
    if (!container) return;

    const card = this.quizManager.getCurrentFlashcard();
    const isLearned = Storage.isLearned(card.id);

    container.innerHTML = `
      <div class="flashcard-controls-top">
        <span class="flashcard-counter-label">Card ${this.quizManager.flashcardIndex + 1} of ${this.quizManager.flashcardList.length}</span>
        <div class="flashcard-top-btns">
          <button class="btn btn-sm btn-glass" id="fc-shuffle-btn">🔀 Shuffle</button>
          <button class="btn btn-sm btn-glass" id="fc-side-btn">${this.quizManager.cardFrontArabic ? 'Arabic First' : 'Meaning First'}</button>
        </div>
      </div>

      <div class="flashcard-3d-scene" id="fc-card-trigger">
        <div class="flashcard-inner ${this.quizManager.isCardFlipped ? 'flipped' : ''}">
          <!-- Front -->
          <div class="flashcard-face flashcard-front" style="background-image: linear-gradient(to bottom, rgba(7, 11, 25, 0.7), rgba(7, 11, 25, 0.95)), url('${card.natureImage}');">
            <span class="fc-badge">#${card.id}</span>
            <div class="fc-front-content">
              ${this.quizManager.cardFrontArabic ? `
                <h2 class="fc-arabic quranic-arabic">${card.arabic}</h2>
                <p class="fc-translit">${card.transliteration}</p>
                <span class="fc-tap-hint">Tap or press Space to reveal meaning</span>
              ` : `
                <h3 class="fc-english-prompt">${card.meaning}</h3>
                <span class="fc-tap-hint">Tap or press Space to reveal Arabic</span>
              `}
            </div>
          </div>

          <!-- Back -->
          <div class="flashcard-face flashcard-back" style="background-image: linear-gradient(to bottom, rgba(7, 11, 25, 0.8), rgba(7, 11, 25, 0.98)), url('${card.natureImage}');">
            <span class="fc-badge">#${card.id}</span>
            <div class="fc-back-content">
              <h2 class="fc-arabic-back quranic-arabic">${card.arabic}</h2>
              <h3 class="fc-translit-back">${card.transliteration}</h3>
              <p class="fc-meaning-back">${card.meaning}</p>
              <div class="fc-root-box">Root: <strong>${card.root}</strong></div>
              <p class="fc-gem-snippet">${card.yqExplanation.slice(0, 180)}...</p>
            </div>
            <span class="fc-tap-hint">Tap to flip back</span>
          </div>
        </div>
      </div>

      <div class="flashcard-actions-row">
        <button class="btn btn-glass" id="fc-prev-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"></path></svg>
          <span>Previous</span>
        </button>
        <button class="btn btn-primary ${isLearned ? 'btn-learned-active' : ''}" id="fc-learned-btn">
          <span>${isLearned ? '✓ Memorized' : 'Mark as Memorized'}</span>
        </button>
        <button class="btn btn-glass" id="fc-next-btn">
          <span>Next</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"></path></svg>
        </button>
      </div>
    `;

    // Events
    const cardEl = container.querySelector('#fc-card-trigger');
    if (cardEl) {
      cardEl.addEventListener('click', () => {
        this.quizManager.flipCard();
        cardEl.querySelector('.flashcard-inner').classList.toggle('flipped', this.quizManager.isCardFlipped);
      });
    }

    const nextBtn = container.querySelector('#fc-next-btn');
    const prevBtn = container.querySelector('#fc-prev-btn');
    const learnedBtn = container.querySelector('#fc-learned-btn');
    const shuffleBtn = container.querySelector('#fc-shuffle-btn');
    const sideBtn = container.querySelector('#fc-side-btn');

    if (nextBtn) nextBtn.addEventListener('click', () => { this.quizManager.nextCard(); this.renderFlashcardUI(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { this.quizManager.prevCard(); this.renderFlashcardUI(); });
    if (shuffleBtn) shuffleBtn.addEventListener('click', () => { this.quizManager.shuffleCards(); this.renderFlashcardUI(); });
    if (sideBtn) sideBtn.addEventListener('click', () => { this.quizManager.toggleCardSide(); this.renderFlashcardUI(); });
    if (learnedBtn) {
      learnedBtn.addEventListener('click', () => {
        this.quizManager.toggleLearnedCurrent();
        this.renderGrid();
        this.renderFlashcardUI();
      });
    }
  }

  // Quiz Mode UI
  openQuizModal() {
    const modal = document.getElementById('quiz-modal');
    if (!modal) return;
    this.renderNextQuizQuestion();
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
    document.body.classList.add('modal-open');
  }

  renderNextQuizQuestion() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    // Reset scroll position to top for the fresh question
    container.scrollTop = 0;

    const q = this.quizManager.generateQuestion();
    const stats = Storage.getQuizStats();

    container.innerHTML = `
      <div class="quiz-stats-header">
        <div class="quiz-stat-item">
          <span class="quiz-stat-label">Streak</span>
          <span class="quiz-stat-value streak-badge">🔥 ${this.quizManager.streak}</span>
        </div>
        <div class="quiz-stat-item">
          <span class="quiz-stat-label">Score</span>
          <span class="quiz-stat-value">⭐ ${this.quizManager.score}</span>
        </div>
        <div class="quiz-stat-item">
          <span class="quiz-stat-label">Best Streak</span>
          <span class="quiz-stat-value">🏆 ${stats.bestStreak || 0}</span>
        </div>
      </div>

      <div class="quiz-question-box">
        <span class="quiz-q-num">Question ${this.quizManager.totalAnswered + 1}</span>
        <h3 class="quiz-q-title">${q.questionText}</h3>
        ${q.isArabicToMeaning ? `
          <div class="quiz-big-arabic quranic-arabic">${q.correctName.arabic}</div>
        ` : ''}
      </div>

      <div class="quiz-options-grid">
        ${q.options.map((opt, idx) => `
          <button class="quiz-option-btn" data-option-id="${opt.id}">
            <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
            <span class="opt-content">
              ${q.isArabicToMeaning ? opt.meaning : `${opt.transliteration} <span class="opt-ar quranic-arabic">(${opt.arabic})</span>`}
            </span>
          </button>
        `).join('')}
      </div>

      <div class="quiz-feedback-box hidden" id="quiz-feedback"></div>
      <div class="quiz-next-row hidden" id="quiz-next-row">
        <button class="btn btn-primary" id="quiz-continue-btn">
          <span>Next Question</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"></path></svg>
        </button>
      </div>
    `;

    const optionBtns = container.querySelectorAll('.quiz-option-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.quizManager.isAnswered) return;
        const chosenId = Number(btn.dataset.optionId);
        const result = this.quizManager.submitAnswer(chosenId);
        if (!result) return;

        // Highlight buttons
        optionBtns.forEach(b => {
          const bId = Number(b.dataset.optionId);
          if (bId === result.correctId) {
            b.classList.add('correct');
          } else if (bId === chosenId && !result.isCorrect) {
            b.classList.add('incorrect');
          }
        });

        // Update streak & score immediately in UI
        const streakEl = container.querySelector('.streak-badge');
        if (streakEl) streakEl.textContent = `🔥 ${result.streak}`;
        const scoreEl = container.querySelectorAll('.quiz-stat-value')[1];
        if (scoreEl) scoreEl.textContent = `⭐ ${result.score}`;

        const feedback = container.querySelector('#quiz-feedback');
        const nextRow = container.querySelector('#quiz-next-row');

        if (feedback) {
          feedback.classList.remove('hidden');
          if (result.isCorrect) {
            feedback.className = 'quiz-feedback-box success';
            feedback.innerHTML = `
              <strong>✨ Excellent! Correct!</strong>
              <p>${result.correctName.transliteration} (${result.correctName.arabic}): ${result.correctName.meaning}.</p>
            `;
            if (result.streak > 1 && result.streak % 3 === 0) {
              this.triggerCelebration(`🔥 ${result.streak} in a row!`);
            }
          } else {
            feedback.className = 'quiz-feedback-box error';
            feedback.innerHTML = `
              <strong>Not quite.</strong>
              <p>The correct Divine Name is <strong>${result.correctName.transliteration} (${result.correctName.arabic})</strong>: ${result.correctName.meaning}.</p>
            `;
          }
        }

        if (nextRow) {
          nextRow.classList.remove('hidden');
          // Smoothly ensure Next Question button is scrolled into complete view
          requestAnimationFrame(() => {
            nextRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        }
      });
    });

    const continueBtn = container.querySelector('#quiz-continue-btn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        this.renderNextQuizQuestion();
      });
    }
  }

  // Confetti celebration
  triggerCelebration(message = '') {
    const toast = document.getElementById('celebration-toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // Floating stardust burst
    const burstCount = 28;
    for (let i = 0; i < burstCount; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.left = `${50 + (Math.random() * 40 - 20)}%`;
      p.style.top = `${50 + (Math.random() * 30 - 15)}%`;
      p.style.setProperty('--dx', `${(Math.random() - 0.5) * 450}px`);
      p.style.setProperty('--dy', `${(Math.random() - 0.7) * 450}px`);
      p.style.backgroundColor = ['#D4AF37', '#10B981', '#38BDF8', '#F59E0B', '#E0E7FF'][Math.floor(Math.random() * 5)];
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  // Copy Quote Card
  copyQuoteCard(nameObj) {
    const text = `✨ ${nameObj.transliteration} (${nameObj.arabic}) - ${nameObj.meaning}
Category: ${nameObj.category} | Root: ${nameObj.root}

📖 Quranic Ayah:
"${nameObj.quranAyah ? nameObj.quranAyah.translation : ''}" (${nameObj.quranAyah ? nameObj.quranAyah.surah : ''})

🎙️ Classical Theological Insight:
${nameObj.yqExplanation.slice(0, 200)}...

💡 Quranic Linguistic Gem:
${nameObj.nakExplanation.slice(0, 200)}...

🤲 Dua:
${nameObj.dua}

— Learned via Tawheed (Asma-ul-Husna Experience)`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.triggerCelebration('Reflection card copied to clipboard! 📋');
      }).catch(() => {
        this.triggerCelebration('Reflection copied! 📋');
      });
    } else {
      this.triggerCelebration('Reflection copied! 📋');
    }
  }

  // Global Event Listeners
  initEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        if (clearSearchBtn) {
          clearSearchBtn.style.display = this.searchQuery ? 'block' : 'none';
        }
        this.renderGrid();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          this.searchQuery = '';
          clearSearchBtn.style.display = 'none';
          this.renderGrid();
          searchInput.focus();
        }
      });
    }

    // Category pills click
    const pillsContainer = document.getElementById('category-pills');
    if (pillsContainer) {
      pillsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.pill-btn');
        if (!btn) return;
        this.currentCategory = btn.dataset.category;
        pillsContainer.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderGrid();
      });
    }

    // Status filter select (All, Bookmarked, Learned, Unlearned)
    const filterSelect = document.getElementById('filter-select');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.currentFilter = e.target.value;
        this.renderGrid();
      });
    }

    // Font size switcher
    const fontBtns = document.querySelectorAll('.font-scale-btn');
    fontBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFontSize = btn.dataset.size;
        document.documentElement.setAttribute('data-font-size', this.currentFontSize);
        fontBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const settings = Storage.getSettings();
        settings.fontSize = this.currentFontSize;
        Storage.saveSettings(settings);
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const themes = ['midnight', 'emerald', 'pearl'];
        const nextIdx = (themes.indexOf(this.currentTheme) + 1) % themes.length;
        this.currentTheme = themes[nextIdx];
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const settings = Storage.getSettings();
        settings.theme = this.currentTheme;
        Storage.saveSettings(settings);
      });
    }

    // Situational mood cards click
    const situationalContainer = document.getElementById('situational-chips');
    if (situationalContainer) {
      situationalContainer.addEventListener('click', (e) => {
        const cardBtn = e.target.closest('.mood-card-btn');
        if (!cardBtn) return;
        const moodId = cardBtn.dataset.moodId;
        const theme = SITUATIONAL_THEMES.find(t => t.id === moodId);
        if (theme) {
          this.openSituationalDrawer(theme);
        }
      });
    }

    // Top Navigation buttons: Flashcards, Quiz
    const openFlashcardBtn = document.getElementById('open-flashcards-btn');
    if (openFlashcardBtn) openFlashcardBtn.addEventListener('click', () => this.openFlashcardsModal());

    const openQuizBtn = document.getElementById('open-quiz-btn');
    if (openQuizBtn) openQuizBtn.addEventListener('click', () => this.openQuizModal());

    // Delegated clicks for cards & buttons across the entire app
    document.addEventListener('click', (e) => {
      // Card bookmark
      const bookmarkBtn = e.target.closest('.bookmark-card-btn, .bookmark-toggle-btn');
      if (bookmarkBtn) {
        e.stopPropagation();
        const id = Number(bookmarkBtn.dataset.nameId);
        const isNow = Storage.toggleBookmark(id);
        bookmarkBtn.classList.toggle('active', isNow);
        this.renderGrid();
        return;
      }

      // Card learned
      const learnedBtn = e.target.closest('.learned-card-btn, .learned-toggle-btn');
      if (learnedBtn) {
        e.stopPropagation();
        const id = Number(learnedBtn.dataset.nameId);
        const isNow = Storage.toggleLearned(id);
        learnedBtn.classList.toggle('active', isNow);
        this.updateLearnedProgress();
        this.renderGrid();
        if (this.activeName && this.activeName.id === id) {
          this.renderModalContent(this.activeName);
        }
        return;
      }


      // Copy quote
      const copyBtn = e.target.closest('.copy-quote-btn');
      if (copyBtn) {
        e.stopPropagation();
        const id = Number(copyBtn.dataset.nameId);
        const nameObj = this.names.find(n => n.id === id);
        if (nameObj) this.copyQuoteCard(nameObj);
        return;
      }

      // Open deep-dive from button
      const deepDiveBtn = e.target.closest('.open-deep-dive-btn, .card-deep-link');
      if (deepDiveBtn) {
        e.stopPropagation();
        const sitDrawer = document.getElementById('situational-drawer-modal');
        if (sitDrawer && sitDrawer.open) {
          if (typeof sitDrawer.close === 'function') sitDrawer.close();
          else sitDrawer.removeAttribute('open');
        }
        this.openModal(deepDiveBtn.dataset.nameId);
        return;
      }

      // Click card itself to open deep-dive
      const nameCard = e.target.closest('.name-card');
      if (nameCard && !e.target.closest('.icon-btn, .card-quick-actions, .card-footer')) {
        this.openModal(nameCard.dataset.nameId);
        return;
      }

      // Modal close button
      const closeBtn = e.target.closest('.modal-close-x-btn, .close-dialog-btn');
      if (closeBtn) {
        const dialog = closeBtn.closest('dialog');
        if (dialog) {
          if (typeof dialog.close === 'function') dialog.close();
          else dialog.removeAttribute('open');
        }
        document.body.classList.remove('modal-open');
        return;
      }
    });

    // Close modal on backdrop click
    document.querySelectorAll('dialog').forEach(dlg => {
      dlg.addEventListener('click', (e) => {
        if (e.target === dlg) {
          const rect = dlg.getBoundingClientRect();
          const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
          if (!isInDialog) {
            if (typeof dlg.close === 'function') dlg.close();
            else dlg.removeAttribute('open');
            document.body.classList.remove('modal-open');
          }
        }
      });
    });
  }

  // Situational Drawer / Modal
  openSituationalDrawer(theme) {
    const matchedNames = this.names.filter(n => theme.primaryNameIds.includes(n.id));
    const drawer = document.getElementById('situational-drawer-modal');
    if (!drawer) return;

    const body = document.getElementById('situational-drawer-body');
    if (body) {
      body.innerHTML = `
        <div class="sit-header">
          <span class="sit-icon">${theme.icon}</span>
          <div>
            <h3 class="sit-title">${theme.title}</h3>
            <p class="sit-desc">${theme.description}</p>
          </div>
        </div>

        <div class="sit-rec-box">
          <strong>💡 Spiritual Remedy:</strong>
          <p>${theme.recommendation}</p>
        </div>

        <h4 class="sit-section-title">Divine Names to Invoke in Your Du'a:</h4>
        <div class="sit-names-list">
          ${matchedNames.map(n => `
            <div class="sit-name-row">
              <div class="sit-name-text">
                <span class="sit-name-ar quranic-arabic">${n.arabic}</span>
                <div>
                  <strong>${n.transliteration}</strong>
                  <p>${n.meaning}</p>
                </div>
              </div>
              <div class="sit-row-btns">
                <button class="btn btn-sm btn-primary open-deep-dive-btn" data-name-id="${n.id}">Learn More</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (typeof drawer.showModal === 'function') drawer.showModal();
    else drawer.setAttribute('open', '');
    document.body.classList.add('modal-open');
  }

  // Keyboard Navigation & Shortcuts
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Escape closes dialogs
      if (e.key === 'Escape') {
        const openDialog = document.querySelector('dialog[open]');
        if (openDialog) {
          if (typeof openDialog.close === 'function') openDialog.close();
          else openDialog.removeAttribute('open');
          document.body.classList.remove('modal-open');
        }
        return;
      }

      // Quick slash focuses search
      if (e.key === '/' && document.activeElement && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const search = document.getElementById('search-input');
        if (search) search.focus();
        return;
      }

      // Spacebar flips flashcard if flashcard modal is open
      const flashcardModal = document.getElementById('flashcard-modal');
      if (flashcardModal && flashcardModal.open && document.activeElement && document.activeElement.tagName !== 'TEXTAREA') {
        if (e.code === 'Space') {
          e.preventDefault();
          this.quizManager.flipCard();
          const inner = flashcardModal.querySelector('.flashcard-inner');
          if (inner) inner.classList.toggle('flipped', this.quizManager.isCardFlipped);
        } else if (e.key === 'ArrowRight') {
          this.quizManager.nextCard();
          this.renderFlashcardUI();
        } else if (e.key === 'ArrowLeft') {
          this.quizManager.prevCard();
          this.renderFlashcardUI();
        }
      }

      // Quiz modal keyboard shortcuts (Next Question: Enter/Space, Options: 1-4 or A-D)
      const quizModal = document.getElementById('quiz-modal');
      if (quizModal && quizModal.open && document.activeElement && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        const nextRow = document.getElementById('quiz-next-row');
        const isNextVisible = nextRow && !nextRow.classList.contains('hidden');
        if (isNextVisible && (e.key === 'Enter' || e.code === 'Space')) {
          e.preventDefault();
          this.renderNextQuizQuestion();
          return;
        }
        if (!this.quizManager.isAnswered) {
          const key = e.key.toUpperCase();
          let keyIdx = -1;
          if (['1', '2', '3', '4'].includes(e.key)) {
            keyIdx = parseInt(e.key, 10) - 1;
          } else if (['A', 'B', 'C', 'D'].includes(key)) {
            keyIdx = ['A', 'B', 'C', 'D'].indexOf(key);
          }
          if (keyIdx >= 0) {
            const btns = quizModal.querySelectorAll('.quiz-option-btn');
            if (btns[keyIdx]) {
              e.preventDefault();
              btns[keyIdx].click();
            }
          }
        }
      }
    });
  }
}

// Start application safely regardless of when script is loaded
function launchApp() {
  if (!window.app) {
    window.app = new TawheedApp();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', launchApp);
} else {
  launchApp();
}
