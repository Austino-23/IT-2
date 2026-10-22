/**
 * ContriTrack — Notifications & Profile Controller (js/account.js)
 * Vanilla JavaScript implementation for user profile, bank accounts,
 * notifications feed, alert channels, and security settings.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAccountApp();
});

function initAccountApp() {
  initMobileSidebar();
  initTabs();
  initProfileForm();
  initBankDetailsForm();
  initNotificationsFeed();
  initPreferencesForm();
  initSecurityForm();
  initSessionRevocation();
}

/**
 * Mobile Sidebar Controller
 */
function initMobileSidebar() {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const closeBtn = document.getElementById('sidebar-close');
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (!toggleBtn || !sidebar) return;

  function openSidebar() {
    sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openSidebar();
  });

  closeBtn?.addEventListener('click', closeSidebar);
  backdrop?.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
      closeSidebar();
    }
  });
}

/**
 * Tab Switching Controller
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-trigger');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Update button styles
      tabButtons.forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      btn.setAttribute('aria-selected', 'true');

      // Show target tab pane
      tabPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.style.display = 'block';
          pane.classList.add('active');
        } else {
          pane.style.display = 'none';
          pane.classList.remove('active');
        }
      });
    });
  });
}

/**
 * Personal Profile Form Handler
 */
function initProfileForm() {
  const form = document.getElementById('form-profile');
  const saveBtn = document.getElementById('btn-save-profile');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving Changes...';
    }

    setTimeout(() => {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Profile Changes';
      }
      showToast('Profile Updated', 'Your personal contact details have been successfully saved.', 'success');
    }, 600);
  });
}

/**
 * Payout Bank Details Handler
 */
function initBankDetailsForm() {
  const form = document.getElementById('form-bank-details');
  const saveBtn = document.getElementById('btn-save-bank');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Verifying Account...';
    }

    setTimeout(() => {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Update Settlement Account';
      }
      showToast('Settlement Account Saved', 'NUBAN bank payout destination confirmed for upcoming Esusu lump-sum disbursements.', 'success');
    }, 700);
  });
}

/**
 * Notifications Feed & Filtering
 */
function initNotificationsFeed() {
  const filterButtons = document.querySelectorAll('.notif-filter-btn');
  const items = document.querySelectorAll('.notification-item-card');
  const markAllBtn = document.getElementById('btn-mark-all-read');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        if (filter === 'all') {
          item.style.display = 'flex';
        } else if (filter === 'unread') {
          item.style.display = item.classList.contains('unread') ? 'flex' : 'none';
        } else {
          item.style.display = item.getAttribute('data-category') === filter ? 'flex' : 'none';
        }
      });
    });
  });

  // Individual dismiss buttons
  document.querySelectorAll('.btn-dismiss-notif').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.notification-item-card');
      card?.remove();
      showToast('Alert Dismissed', 'Notification removed from your feed.', 'info');
    });
  });

  // Mark all read
  markAllBtn?.addEventListener('click', () => {
    document.querySelectorAll('.notification-item-card.unread').forEach(item => {
      item.classList.remove('unread');
    });
    showToast('All Caught Up', 'All alerts have been marked as read.', 'success');
  });
}

/**
 * Notification Preferences
 */
function initPreferencesForm() {
  const btn = document.getElementById('btn-save-preferences');
  btn?.addEventListener('click', () => {
    btn.disabled = true;
    btn.textContent = 'Updating...';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Save Preferences';
      showToast('Preferences Saved', 'Your reminder channels (SMS, Email, WhatsApp) are updated.', 'success');
    }, 500);
  });
}

/**
 * Password & Security Form
 */
function initSecurityForm() {
  const form = document.getElementById('form-change-password');
  const pwdNew = document.getElementById('pwd-new');
  const pwdConfirm = document.getElementById('pwd-confirm');
  const submitBtn = document.getElementById('btn-update-pwd');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (pwdNew.value !== pwdConfirm.value) {
      showToast('Validation Error', 'New password and confirmation do not match.', 'error');
      pwdConfirm.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Updating Password...';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Update Password';
      }
      form.reset();
      showToast('Security Updated', 'Your account password has been safely updated across all devices.', 'success');
    }, 700);
  });
}

/**
 * Session Revocation
 */
function initSessionRevocation() {
  document.querySelectorAll('.btn-revoke-session').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('div[style*="display: flex; justify-content: space-between"]');
      if (row) {
        row.style.opacity = '0.4';
        btn.textContent = 'Revoked';
        btn.disabled = true;
      }
      showToast('Session Revoked', 'The mobile session has been invalidated.', 'info');
    });
  });
}

/**
 * In-App Toast Notification Utility
 */
function showToast(title, message, type = 'info') {
  const container = document.getElementById('admin-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `admin-toast toast-${type}`;
  
  const iconSvg = type === 'success'
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : (type === 'error'
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-icon"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toast-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`);

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button type="button" class="toast-close-btn" aria-label="Close message">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="21" y2="18"></line></svg>
    </button>
  `;

  const closeBtn = toast.querySelector('.toast-close-btn');
  closeBtn?.addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4200);
}
