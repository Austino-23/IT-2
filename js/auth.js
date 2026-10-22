/**
 * ContriTrack — Authentication Page Client Script (js/auth.js)
 * Vanilla JavaScript implementation for multi-view authentication:
 * - Login View
 * - Registration View
 * - Forgot Password View
 * 
 * Includes inline validation, password visibility toggles, URL parameter handling,
 * accessible error management, and modular handlers prepared for Django endpoints.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuthApp();
});

/**
 * Main Authentication Controller
 */
function initAuthApp() {
  // DOM View Elements
  const viewLogin = document.getElementById('view-login');
  const viewRegister = document.getElementById('view-register');
  const viewForgot = document.getElementById('view-forgot');

  // Tab switcher buttons in header
  const tabLogin = document.getElementById('tab-btn-login');
  const tabRegister = document.getElementById('tab-btn-register');
  const tabsWrapper = document.getElementById('auth-view-tabs');

  // Form Elements
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const formForgot = document.getElementById('form-forgot');

  // View Switching Triggers (Links within forms)
  const toRegisterLinks = document.querySelectorAll('.js-switch-to-register');
  const toLoginLinks = document.querySelectorAll('.js-switch-to-login');
  const toForgotLinks = document.querySelectorAll('.js-switch-to-forgot');

  /**
   * Switch the active view
   * @param {'login' | 'register' | 'forgot'} mode 
   * @param {boolean} updateHistory
   */
  function switchView(mode, updateHistory = true) {
    // Clear all inline errors and alerts
    clearAllErrors();
    hideAllAlerts();

    // Toggle views
    if (viewLogin) viewLogin.classList.toggle('active', mode === 'login');
    if (viewRegister) viewRegister.classList.toggle('active', mode === 'register');
    if (viewForgot) viewForgot.classList.toggle('active', mode === 'forgot');

    // Update top tabs
    if (tabsWrapper) {
      if (mode === 'forgot') {
        tabsWrapper.style.display = 'none';
      } else {
        tabsWrapper.style.display = 'grid';
        if (tabLogin) {
          tabLogin.classList.toggle('active', mode === 'login');
          tabLogin.setAttribute('aria-selected', (mode === 'login').toString());
        }
        if (tabRegister) {
          tabRegister.classList.toggle('active', mode === 'register');
          tabRegister.setAttribute('aria-selected', (mode === 'register').toString());
        }
      }
    }

    // Update browser URL query string without reloading
    if (updateHistory) {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', mode);
      window.history.pushState({ mode }, '', url);
    }

    // Auto-focus first input in the active view
    setTimeout(() => {
      const activeContainer = mode === 'login' ? viewLogin : (mode === 'register' ? viewRegister : viewForgot);
      const firstInput = activeContainer?.querySelector('input:not([type="hidden"])');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  // 1. Initial State from URL Query Parameters
  const initialParams = new URLSearchParams(window.location.search);
  const initialMode = initialParams.get('mode');
  if (initialMode === 'register') {
    switchView('register', false);
  } else if (initialMode === 'forgot') {
    switchView('forgot', false);
  } else {
    switchView('login', false);
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.mode) {
      switchView(e.state.mode, false);
    } else {
      const params = new URLSearchParams(window.location.search);
      const currentMode = params.get('mode') || 'login';
      switchView(currentMode, false);
    }
  });

  // 2. Wire Tab Switcher & Inline Link Events
  if (tabLogin) {
    tabLogin.addEventListener('click', () => switchView('login'));
  }
  if (tabRegister) {
    tabRegister.addEventListener('click', () => switchView('register'));
  }

  toRegisterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('register');
    });
  });

  toLoginLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('login');
    });
  });

  toForgotLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('forgot');
    });
  });

  // 3. Password Visibility Toggles
  initPasswordToggles();

  // 4. Form Submissions
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => onLoginSubmit(e));
  }
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => onRegisterSubmit(e));
  }
  if (formForgot) {
    formForgot.addEventListener('submit', (e) => onForgotSubmit(e));
  }
}

/**
 * ==========================================================================
 * PASSWORD VISIBILITY TOGGLE LOGIC
 * ==========================================================================
 */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.js-toggle-password');
  
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

      // Update icon SVG
      btn.innerHTML = isPassword ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      ` : `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      `;
    });
  });
}

/**
 * ==========================================================================
 * VALIDATION HELPERS & ERROR DISPLAY
 * ==========================================================================
 */
function isValidEmail(email) {
  // RFC 5322 compatible pattern for client validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

function showFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  if (input) {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
  }
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function clearFieldError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  if (input) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  }
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

function clearAllErrors() {
  document.querySelectorAll('.form-input').forEach(input => {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  });
  document.querySelectorAll('.field-error').forEach(err => {
    err.textContent = '';
    err.classList.remove('visible');
  });
}

function hideAllAlerts() {
  document.querySelectorAll('.auth-alert').forEach(alert => {
    alert.classList.remove('visible', 'alert-success', 'alert-error');
    alert.innerHTML = '';
  });
}

function showAlert(alertContainerId, type, title, message) {
  const alertEl = document.getElementById(alertContainerId);
  if (!alertEl) return;

  alertEl.className = `auth-alert visible ${type === 'success' ? 'alert-success' : 'alert-error'}`;
  alertEl.innerHTML = `
    <span class="alert-demo-badge">Demo Mode Response</span>
    <div><strong>${title}</strong></div>
    <div>${message}</div>
  `;
}

/**
 * ==========================================================================
 * 1. LOGIN VIEW FORM HANDLER
 * ==========================================================================
 */
async function onLoginSubmit(e) {
  e.preventDefault();
  clearAllErrors();
  hideAllAlerts();

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const rememberCheckbox = document.getElementById('login-remember');
  const submitBtn = document.getElementById('btn-submit-login');

  const email = emailInput?.value.trim() || '';
  const password = passwordInput?.value || '';
  const rememberMe = rememberCheckbox?.checked || false;

  let hasError = false;

  // Validation
  if (!email) {
    showFieldError('login-email', 'err-login-email', 'Email address is required.');
    hasError = true;
  } else if (!isValidEmail(email)) {
    showFieldError('login-email', 'err-login-email', 'Please enter a valid email address.');
    hasError = true;
  }

  if (!password) {
    showFieldError('login-password', 'err-login-password', 'Password is required.');
    hasError = true;
  } else if (password.length < 6) {
    showFieldError('login-password', 'err-login-password', 'Password must be at least 6 characters.');
    hasError = true;
  }

  if (hasError) return;

  // Backend Preparation: Execute simulated authentication
  setButtonLoading(submitBtn, true);

  try {
    const payload = { email, password, rememberMe };
    const response = await handleLoginSubmit(payload);

    setButtonLoading(submitBtn, false);

    if (response.success) {
      showAlert(
        'alert-login',
        'success',
        'Authentication Validated (Demo)',
        `${response.message} Directing to Member Overview dashboard...`
      );

      // Auto redirect to member dashboard after brief pause
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1200);
    } else {
      showAlert('alert-login', 'error', 'Authentication Failed', response.message);
    }
  } catch (err) {
    setButtonLoading(submitBtn, false);
    showAlert('alert-login', 'error', 'Connection Error', 'An unexpected demo error occurred.');
  }
}

/**
 * ==========================================================================
 * 2. REGISTRATION VIEW FORM HANDLER
 * ==========================================================================
 */
async function onRegisterSubmit(e) {
  e.preventDefault();
  clearAllErrors();
  hideAllAlerts();

  const firstNameInput = document.getElementById('reg-firstname');
  const lastNameInput = document.getElementById('reg-lastname');
  const emailInput = document.getElementById('reg-email');
  const phoneInput = document.getElementById('reg-phone');
  const passwordInput = document.getElementById('reg-password');
  const confirmPasswordInput = document.getElementById('reg-confirm-password');
  const termsCheckbox = document.getElementById('reg-terms');
  const submitBtn = document.getElementById('btn-submit-register');

  const firstName = firstNameInput?.value.trim() || '';
  const lastName = lastNameInput?.value.trim() || '';
  const email = emailInput?.value.trim() || '';
  const phone = phoneInput?.value.trim() || '';
  const password = passwordInput?.value || '';
  const confirmPassword = confirmPasswordInput?.value || '';
  const termsAccepted = termsCheckbox?.checked || false;

  let hasError = false;

  if (!firstName) {
    showFieldError('reg-firstname', 'err-reg-firstname', 'First name is required.');
    hasError = true;
  }

  if (!lastName) {
    showFieldError('reg-lastname', 'err-reg-lastname', 'Last name is required.');
    hasError = true;
  }

  if (!email) {
    showFieldError('reg-email', 'err-reg-email', 'Email address is required.');
    hasError = true;
  } else if (!isValidEmail(email)) {
    showFieldError('reg-email', 'err-reg-email', 'Please enter a valid email address.');
    hasError = true;
  }

  if (!phone) {
    showFieldError('reg-phone', 'err-reg-phone', 'Phone number is required.');
    hasError = true;
  }

  if (!password) {
    showFieldError('reg-password', 'err-reg-password', 'Password is required.');
    hasError = true;
  } else if (password.length < 8) {
    showFieldError('reg-password', 'err-reg-password', 'Password must be at least 8 characters long.');
    hasError = true;
  }

  if (!confirmPassword) {
    showFieldError('reg-confirm-password', 'err-reg-confirm-password', 'Please confirm your password.');
    hasError = true;
  } else if (password !== confirmPassword) {
    showFieldError('reg-confirm-password', 'err-reg-confirm-password', 'Passwords do not match.');
    hasError = true;
  }

  if (!termsAccepted) {
    showFieldError('reg-terms', 'err-reg-terms', 'You must agree to the Terms & Conditions.');
    hasError = true;
  }

  if (hasError) return;

  // Execute simulated registration
  setButtonLoading(submitBtn, true);

  try {
    const payload = { firstName, lastName, email, phone, password, termsAccepted };
    const response = await handleRegisterSubmit(payload);

    setButtonLoading(submitBtn, false);

    if (response.success) {
      showAlert(
        'alert-register',
        'success',
        'Account Registered (Demo)',
        `${response.message} Directing to Member Overview dashboard...`
      );

      // Reset form
      document.getElementById('form-register').reset();

      // Redirect to member dashboard after short delay
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1400);
    } else {
      showAlert('alert-register', 'error', 'Registration Failed', response.message);
    }
  } catch (err) {
    setButtonLoading(submitBtn, false);
    showAlert('alert-register', 'error', 'Submission Error', 'Could not process registration request.');
  }
}

/**
 * ==========================================================================
 * 3. FORGOT PASSWORD VIEW FORM HANDLER
 * ==========================================================================
 */
async function onForgotSubmit(e) {
  e.preventDefault();
  clearAllErrors();
  hideAllAlerts();

  const emailInput = document.getElementById('forgot-email');
  const submitBtn = document.getElementById('btn-submit-forgot');

  const email = emailInput?.value.trim() || '';

  if (!email) {
    showFieldError('forgot-email', 'err-forgot-email', 'Email address is required.');
    return;
  } else if (!isValidEmail(email)) {
    showFieldError('forgot-email', 'err-forgot-email', 'Please enter a valid email address.');
    return;
  }

  // Execute simulated password reset
  setButtonLoading(submitBtn, true);

  try {
    const payload = { email };
    const response = await handleForgotPasswordSubmit(payload);

    setButtonLoading(submitBtn, false);

    if (response.success) {
      showAlert(
        'alert-forgot',
        'success',
        'Reset Request Prepared (Demo)',
        `${response.message}`
      );
      if (emailInput) emailInput.value = '';
    } else {
      showAlert('alert-forgot', 'error', 'Reset Failed', response.message);
    }
  } catch (err) {
    setButtonLoading(submitBtn, false);
    showAlert('alert-forgot', 'error', 'Service Error', 'Could not process reset instructions.');
  }
}

/**
 * Helper to toggle button loading state
 */
function setButtonLoading(button, isLoading) {
  if (!button) return;
  button.disabled = isLoading;
  button.classList.toggle('loading', isLoading);
}

/**
 * ==========================================================================
 * BACKEND PREPARATION: DJANGO ENDPOINT INTERFACES
 * ==========================================================================
 * These clean async functions handle form data and simulate server responses.
 * When integrating with Django, replace the simulated timeouts with real fetch
 * calls (e.g. POST /api/auth/login/, POST /api/auth/register/, etc.)
 * Notice: Passwords are NEVER written to localStorage or sessionStorage.
 */

/**
 * Handles Login API submission
 * Django Integration: POST /api/v1/auth/login/
 */
async function handleLoginSubmit(credentials) {
  // Simulated network latency (600ms)
  await new Promise(resolve => setTimeout(resolve, 600));

  // Simulated validation test
  return {
    success: true,
    user: {
      email: credentials.email,
      name: credentials.email.split('@')[0]
    },
    message: `Welcome back! Simulated credentials for "${credentials.email}" verified.`
  };
}

/**
 * Handles Registration API submission
 * Django Integration: POST /api/v1/auth/register/
 */
async function handleRegisterSubmit(userData) {
  // Simulated network latency (750ms)
  await new Promise(resolve => setTimeout(resolve, 750));

  return {
    success: true,
    message: `Account registration prepared for ${userData.firstName} ${userData.lastName} (${userData.email}). No live database was altered.`
  };
}

/**
 * Handles Password Reset API submission
 * Django Integration: POST /api/v1/auth/password-reset/
 */
async function handleForgotPasswordSubmit(data) {
  // Simulated network latency (600ms)
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    success: true,
    message: `Password reset simulation triggered for "${data.email}". In a live Django production deployment, a cryptographic reset token email will be dispatched.`
  };
}
