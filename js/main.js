/**
 * ContriTrack — Daily Contribution and Savings Management System
 * Core Client-side Script (Vanilla JavaScript)
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initSmoothScroll();
  initActiveNavLinkHighlight();
  initScrollAnimations();
  initDashboardDemo();
  initLegalModals();
});

/**
 * 1. Sticky Navigation Bar with Scroll Detection
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/**
 * 2. Mobile Menu Drawer Toggle & Keyboard Accessibility
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!toggleBtn || !mobileNav) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen.toString());
    
    // Update SVG icon (hamburger vs close 'x')
    if (isOpen) {
      toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else {
      toggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
    }
  };

  toggleBtn.addEventListener('click', () => toggleMenu());

  // Close mobile nav when clicking any link
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMenu(false);
      toggleBtn.focus();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });
}

/**
 * 3. Smooth Scrolling with Offset Calculation for Sticky Header
 */
function initSmoothScroll() {
  const scrollTriggers = document.querySelectorAll('a[href^="#"]');
  const headerHeight = document.querySelector('.site-header')?.offsetHeight || 76;

  scrollTriggers.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - (headerHeight - 2);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Set focus for keyboard navigation accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });
}

/**
 * 4. Active Navigation Link Highlighting via IntersectionObserver
 */
function initActiveNavLinkHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * 5. Subtle Entrance Animations (Accessible & Reduced-Motion Conscious)
 */
function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));
}

/**
 * 6. Interactive Demo Dashboard Simulation
 * Features:
 * - Real-time calculation of Total Savings, Expected, Outstanding & Progress bar.
 * - Interactive Group Switcher with diverse simulated data sets.
 * - Working "Verify" button on pending members.
 * - Working "Simulate Deposit" form that updates figures immediately!
 */
function initDashboardDemo() {
  // Preset Demo Datasets for different group profiles
  const demoGroups = {
    alpha: {
      name: 'Alpha Thrift Syndicate · Cycle #4',
      totalSavings: 24850,
      expected: 30000,
      outstanding: 1450,
      nextRecipient: 'Marcus Vance',
      payoutAmount: 6000,
      payoutDate: 'Friday, Oct 24, 2026',
      members: [
        { id: 'm1', name: 'Amara Chen', avatar: 'AC', amount: 250, date: 'Today, 09:15 AM', status: 'verified' },
        { id: 'm2', name: 'Marcus Vance', avatar: 'MV', amount: 250, date: 'Today, 09:42 AM', status: 'verified' },
        { id: 'm3', name: 'Elena Rostova', avatar: 'ER', amount: 250, date: 'Today, 10:30 AM', status: 'verified' },
        { id: 'm4', name: 'David Okafor', avatar: 'DO', amount: 250, date: 'Today, 11:05 AM', status: 'pending' },
        { id: 'm5', name: 'Sarah Jenkins', avatar: 'SJ', amount: 250, date: 'Yesterday', status: 'verified' },
        { id: 'm6', name: 'Tariq Al-Mansoor', avatar: 'TA', amount: 200, date: 'Yesterday', status: 'pending' }
      ]
    },
    family: {
      name: 'Family Home Builder Fund',
      totalSavings: 48200,
      expected: 50000,
      outstanding: 800,
      nextRecipient: 'Beatrice Jenkins',
      payoutAmount: 12500,
      payoutDate: 'Saturday, Nov 01, 2026',
      members: [
        { id: 'f1', name: 'Beatrice Jenkins', avatar: 'BJ', amount: 500, date: 'Today, 08:00 AM', status: 'verified' },
        { id: 'f2', name: 'Samuel Vance', avatar: 'SV', amount: 500, date: 'Today, 09:12 AM', status: 'verified' },
        { id: 'f3', name: 'Claire Okafor', avatar: 'CO', amount: 500, date: 'Yesterday', status: 'verified' },
        { id: 'f4', name: 'Anthony Chen', avatar: 'AC', amount: 400, date: '2 days ago', status: 'pending' }
      ]
    },
    tech: {
      name: 'Tech Syndicate Savings Pool',
      totalSavings: 15600,
      expected: 20000,
      outstanding: 2200,
      nextRecipient: 'Liam K. Zhang',
      payoutAmount: 5000,
      payoutDate: 'Wednesday, Oct 29, 2026',
      members: [
        { id: 't1', name: 'Liam K. Zhang', avatar: 'LZ', amount: 300, date: 'Today, 07:45 AM', status: 'verified' },
        { id: 't2', name: 'Nadia Petrova', avatar: 'NP', amount: 300, date: 'Today, 10:15 AM', status: 'pending' },
        { id: 't3', name: 'Kofi Mensah', avatar: 'KM', amount: 300, date: 'Today, 11:20 AM', status: 'verified' },
        { id: 't4', name: 'Sophia Reyes', avatar: 'SR', amount: 300, date: 'Yesterday', status: 'pending' }
      ]
    }
  };

  let currentKey = 'alpha';
  let state = JSON.parse(JSON.stringify(demoGroups[currentKey]));

  const formatCurrency = (val) => '$' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const renderDashboard = () => {
    const totalEl = document.getElementById('kpi-total-savings');
    const expectedEl = document.getElementById('kpi-expected');
    const outstandingEl = document.getElementById('kpi-outstanding');
    const progressPercentEl = document.getElementById('kpi-progress-percent');
    const progressBarFill = document.getElementById('kpi-progress-fill');
    const tableBody = document.getElementById('dashboard-member-rows');
    const recipientEl = document.getElementById('payout-recipient-name');
    const payoutAmountEl = document.getElementById('payout-amount-val');
    const payoutDateEl = document.getElementById('payout-date-val');

    if (!totalEl || !tableBody) return;

    // Calculate percentage
    const percent = Math.min(100, Math.round((state.totalSavings / state.expected) * 100));

    // Update KPI Numbers
    totalEl.textContent = formatCurrency(state.totalSavings);
    expectedEl.textContent = formatCurrency(state.expected);
    outstandingEl.textContent = formatCurrency(state.outstanding);
    progressPercentEl.textContent = `${percent}%`;
    progressBarFill.style.width = `${percent}%`;

    // Update Payout Card
    if (recipientEl) recipientEl.textContent = state.nextRecipient;
    if (payoutAmountEl) payoutAmountEl.textContent = formatCurrency(state.payoutAmount);
    if (payoutDateEl) payoutDateEl.textContent = state.payoutDate;

    // Render Table Rows
    tableBody.innerHTML = '';
    state.members.forEach((m) => {
      const tr = document.createElement('tr');
      const isVerified = m.status === 'verified';
      
      tr.innerHTML = `
        <td>
          <div class="member-cell">
            <span class="member-avatar">${m.avatar}</span>
            <span class="member-cell-name">${m.name}</span>
          </div>
        </td>
        <td class="tabular-nums font-semibold">${formatCurrency(m.amount)}</td>
        <td class="tabular-nums text-muted">${m.date}</td>
        <td>
          <span class="status-badge ${isVerified ? 'verified' : 'pending'}">
            ${isVerified ? '✓ Verified' : '⏳ Pending'}
          </span>
        </td>
        <td>
          ${isVerified ? 
            `<span style="font-size: 0.775rem; color: #64748B;">Confirmed</span>` : 
            `<button class="btn-verify-demo" data-id="${m.id}" title="Simulate Coordinator Verification">Verify</button>`
          }
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Attach click listeners to "Verify" buttons
    const verifyButtons = tableBody.querySelectorAll('.btn-verify-demo');
    verifyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const targetMember = state.members.find(item => item.id === id);
        if (targetMember) {
          targetMember.status = 'verified';
          state.totalSavings += targetMember.amount;
          state.outstanding = Math.max(0, state.outstanding - targetMember.amount);
          renderDashboard();
        }
      });
    });
  };

  // Switcher Handler
  const groupSelect = document.getElementById('dashboard-group-select');
  if (groupSelect) {
    groupSelect.addEventListener('change', (e) => {
      currentKey = e.target.value;
      state = JSON.parse(JSON.stringify(demoGroups[currentKey]));
      renderDashboard();
    });
  }

  // Quick Deposit Simulation Input
  const simBtn = document.getElementById('sim-deposit-btn');
  const simInput = document.getElementById('sim-deposit-amount');
  if (simBtn && simInput) {
    simBtn.addEventListener('click', () => {
      const val = parseFloat(simInput.value);
      if (isNaN(val) || val <= 0) {
        simInput.focus();
        return;
      }
      
      // Add a simulated entry
      state.totalSavings += val;
      state.members.unshift({
        id: 'sim-' + Date.now(),
        name: 'You (Demo Contributor)',
        avatar: 'ME',
        amount: val,
        date: 'Just now',
        status: 'verified'
      });
      simInput.value = '';
      renderDashboard();

      // Show micro notification
      const feedback = document.getElementById('sim-feedback');
      if (feedback) {
        feedback.textContent = `✓ Recorded simulated deposit of ${formatCurrency(val)}`;
        feedback.style.display = 'block';
        setTimeout(() => {
          feedback.style.display = 'none';
        }, 3500);
      }
    });
  }

  // Initial Render
  renderDashboard();
}

/**
 * 7. Accessible Legal Modals (Privacy Policy & Terms)
 */
function initLegalModals() {
  const modalOverlay = document.getElementById('legal-modal');
  const modalTitle = document.getElementById('legal-modal-title');
  const modalBody = document.getElementById('legal-modal-body');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modalOverlay || !modalTitle || !modalBody || !closeBtn) return;

  const privacyTrigger = document.getElementById('privacy-trigger');
  const termsTrigger = document.getElementById('terms-trigger');

  const openModal = (title, content) => {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modalOverlay.classList.add('active');
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (privacyTrigger) {
    privacyTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(
        'ContriTrack Privacy Policy',
        `
          <p><strong>Effective Date:</strong> January 1, 2026</p>
          <h4>1. Introduction</h4>
          <p>ContriTrack values your trust and is committed to protecting your personal data. This Privacy Policy outlines our principles regarding the collection, safeguarding, and use of information provided on our daily contribution and savings management platform.</p>
          <h4>2. Data We Collect</h4>
          <p>We only collect data strictly necessary to facilitate transparent contribution logging and savings group administration, including your name, contact identifier (phone/email), and contribution transactions.</p>
          <h4>3. No Third-Party Data Selling</h4>
          <p>We do not sell, rent, or monetize personal financial details to advertisers or external data brokers. All ledger records remain encrypted.</p>
          <h4>4. Contact</h4>
          <p>For privacy inquiries, please contact our compliance desk at privacy@contritrack.com.</p>
        `
      );
    });
  }

  if (termsTrigger) {
    termsTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(
        'ContriTrack Terms and Conditions',
        `
          <p><strong>Last Updated:</strong> January 1, 2026</p>
          <h4>1. Acceptance of Terms</h4>
          <p>By creating an account or joining a savings circle on ContriTrack, you agree to abide by these Terms and Conditions and comply with all applicable local cooperative laws.</p>
          <h4>2. Role of ContriTrack</h4>
          <p>ContriTrack provides digital record-keeping, contribution tracking, and scheduling tools. ContriTrack does not function as an investment fund or depository bank, but as a transparency ledger for self-managed groups.</p>
          <h4>3. Group Coordinator Responsibilities</h4>
          <p>Group leaders and coordinators are responsible for verifying actual receipt of funds according to agreed circle policies.</p>
          <h4>4. Demo Data Notice</h4>
          <p>All figures, member names, and metrics displayed across landing preview areas represent simulated demo data.</p>
        `
      );
    });
  }

  closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}
