/**
 * ContriTrack — Contributions & Payments Client Script (js/contributions.js)
 * Vanilla JavaScript implementation for:
 * - Payment Submission Form with receipt file validation
 * - Confirmation Dialog before submission
 * - Dynamic Status Summary Calculation (Total Verified, Pending, Rejected)
 * - Filterable Payment History Table (Search, Status Filter, Date Filter, Pagination)
 * - Payment Details Modal with audit trails
 * - Mobile Sidebar Navigation
 * 
 * Complies with strict security rules:
 * - Does not store financial records or files in localStorage/sessionStorage.
 * - Does not automatically add submitted funds to verified savings.
 * - Explains administrative verification protocol.
 * - Modular backend preparation function (submitContributionPayment).
 */

document.addEventListener('DOMContentLoaded', () => {
  initContributionsApp();
});

/**
 * Global App State (In-memory, session-scoped only)
 */
let paymentRecords = [
  {
    id: 'pay-001',
    reference: 'CTX-90188-NG',
    group: 'Alpha Thrift Syndicate · Cycle #4',
    amount: 15000,
    method: 'Bank transfer',
    paymentDate: '2026-10-20',
    submissionDate: '2026-10-20 09:42 AM',
    status: 'pending',
    receiptFileName: 'zenith_transfer_receipt_oct20.pdf',
    receiptFileSize: '245 KB',
    notes: 'Daily contribution dues for Day 20.',
    auditNote: 'Pending administrator reconciliation against bank escrow statement.'
  },
  {
    id: 'pay-002',
    reference: 'CTX-90112-NG',
    group: 'Family Home Builder Fund',
    amount: 30000,
    method: 'Bank transfer',
    paymentDate: '2026-10-19',
    submissionDate: '2026-10-19 11:15 AM',
    status: 'pending',
    receiptFileName: 'gtb_mobile_transfer_slip.jpg',
    receiptFileSize: '512 KB',
    notes: 'Mid-month cooperative pooled share.',
    auditNote: 'Under review by coordinator Sarah Jenkins.'
  },
  {
    id: 'pay-003',
    reference: 'CTX-89244-NG',
    group: 'Alpha Thrift Syndicate · Cycle #4',
    amount: 25000,
    method: 'Bank transfer',
    paymentDate: '2026-10-18',
    submissionDate: '2026-10-18 08:30 AM',
    status: 'verified',
    receiptFileName: 'access_bank_slip_89244.pdf',
    receiptFileSize: '320 KB',
    notes: 'Approved daily rotation quota.',
    auditNote: 'Verified by Coordinator Marcus Vance on Oct 18, 2026 at 10:14 AM.'
  },
  {
    id: 'pay-004',
    reference: 'CTX-89210-NG',
    group: 'Alpha Thrift Syndicate · Cycle #4',
    amount: 50000,
    method: 'Bank transfer',
    paymentDate: '2026-10-15',
    submissionDate: '2026-10-15 02:40 PM',
    status: 'verified',
    receiptFileName: 'firstbank_transfer_slip.png',
    receiptFileSize: '410 KB',
    notes: 'Advance dues for Cycle #4 week 3.',
    auditNote: 'Verified by Coordinator Sarah Jenkins on Oct 15, 2026 at 04:00 PM.'
  },
  {
    id: 'pay-005',
    reference: 'CTX-87550-NG',
    group: 'Weekly Tech Syndicate',
    amount: 10000,
    method: 'Cash',
    paymentDate: '2026-10-10',
    submissionDate: '2026-10-10 04:12 PM',
    status: 'rejected',
    receiptFileName: 'cash_collection_note.jpg',
    receiptFileSize: '180 KB',
    notes: 'Handed to meeting assistant.',
    auditNote: 'Rejected: Physical receipt serial number did not match collector log. Please contact group treasurer.'
  },
  {
    id: 'pay-006',
    reference: 'CTX-86100-NG',
    group: 'Alpha Thrift Syndicate · Cycle #4',
    amount: 100000,
    method: 'Bank transfer',
    paymentDate: '2026-10-01',
    submissionDate: '2026-10-01 10:00 AM',
    status: 'verified',
    receiptFileName: 'stanbic_corporate_slip.pdf',
    receiptFileSize: '610 KB',
    notes: 'Initial cycle capital deposit.',
    auditNote: 'Verified by Group Treasurer Elena Rostova on Oct 01, 2026 at 12:30 PM.'
  }
];

let selectedFile = null;
let currentPendingSubmission = null;
let filteredRecords = [];
let displayLimit = 5;

/**
 * Main Initialization
 */
function initContributionsApp() {
  initMobileSidebar();
  initFileUploadDropzone();
  initContributionForm();
  initConfirmationModal();
  initDetailsModal();
  initHistoryControls();
  
  // Set default payment date to today in YYYY-MM-DD
  const dateInput = document.getElementById('payment-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.max = today; // Prevent future dates
  }

  // Initial renders
  refreshSummaryCards();
  applyFiltersAndRenderTable();
}

/**
 * Format currency in Nigerian Naira (₦) with tabular numbers
 */
function formatNaira(amount) {
  return '₦' + Number(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * 1. Mobile Sidebar Navigation
 */
function initMobileSidebar() {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const closeBtn = document.getElementById('sidebar-close');
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (!toggleBtn || !sidebar || !backdrop) return;

  const openSidebar = () => {
    sidebar.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  backdrop.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });
}

/**
 * 2. File Upload Dropzone & Validation
 */
function initFileUploadDropzone() {
  const dropzone = document.getElementById('file-dropzone');
  const fileInput = document.getElementById('receipt-file');
  const filePill = document.getElementById('file-selected-pill');
  const fileNameDisplay = document.getElementById('selected-file-name');
  const removeBtn = document.getElementById('remove-file-btn');
  const errEl = document.getElementById('err-receipt-file');

  if (!dropzone || !fileInput) return;

  const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];

  function handleFile(file) {
    if (!file) return;

    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|pdf)$/i)) {
      showError('err-receipt-file', 'Invalid file type. Only JPG, PNG, and PDF receipts are accepted.');
      fileInput.value = '';
      selectedFile = null;
      filePill.classList.remove('visible');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('err-receipt-file', 'File is too large. Maximum allowed size is 5 MB.');
      fileInput.value = '';
      selectedFile = null;
      filePill.classList.remove('visible');
      return;
    }

    clearError('err-receipt-file');
    selectedFile = file;
    const sizeKb = Math.round(file.size / 1024);
    fileNameDisplay.textContent = `${file.name} (${sizeKb} KB)`;
    filePill.classList.add('visible');
  }

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  // Drag and drop events
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      fileInput.files = e.dataTransfer.files;
      handleFile(e.dataTransfer.files[0]);
    }
  });

  // Remove file handler
  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.value = '';
      selectedFile = null;
      filePill.classList.remove('visible');
      clearError('err-receipt-file');
    });
  }
}

/**
 * 3. Form Validation & Submission Preparation
 */
function initContributionForm() {
  const form = document.getElementById('contribution-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllFormErrors();

    const groupSelect = document.getElementById('contribution-group');
    const amountInput = document.getElementById('contribution-amount');
    const dateInput = document.getElementById('payment-date');
    const methodSelect = document.getElementById('payment-method');
    const refInput = document.getElementById('payment-reference');
    const notesInput = document.getElementById('payment-notes');

    const group = groupSelect?.value.trim();
    const rawAmount = parseFloat(amountInput?.value);
    const paymentDate = dateInput?.value.trim();
    const method = methodSelect?.value.trim();
    const reference = refInput?.value.trim();
    const notes = notesInput?.value.trim() || '';

    let isValid = true;

    // Validate Group
    if (!group) {
      showError('err-contribution-group', 'Please select a contribution group.');
      isValid = false;
    }

    // Validate Amount (Must be positive)
    if (isNaN(rawAmount) || rawAmount <= 0) {
      showError('err-contribution-amount', 'Please enter a valid amount greater than ₦0.');
      isValid = false;
    }

    // Validate Date (Required, cannot be future)
    if (!paymentDate) {
      showError('err-payment-date', 'Payment date is required.');
      isValid = false;
    } else {
      const selected = new Date(paymentDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selected > today) {
        showError('err-payment-date', 'Payment date cannot be in the future.');
        isValid = false;
      }
    }

    // Validate Payment Method
    if (!method) {
      showError('err-payment-method', 'Please select a payment method.');
      isValid = false;
    }

    // Validate Reference
    if (!reference) {
      showError('err-payment-reference', 'Transaction reference or teller number is required.');
      isValid = false;
    } else if (reference.length < 4) {
      showError('err-payment-reference', 'Reference must be at least 4 characters.');
      isValid = false;
    }

    // Validate Receipt Upload
    if (!selectedFile) {
      showError('err-receipt-file', 'Please attach your payment receipt or transfer slip.');
      isValid = false;
    }

    if (!isValid) return;

    // Cache pending submission details and open Confirmation Modal
    currentPendingSubmission = {
      group,
      amount: rawAmount,
      paymentDate,
      method,
      reference,
      notes,
      fileName: selectedFile.name,
      fileSize: Math.round(selectedFile.size / 1024) + ' KB',
      fileObject: selectedFile
    };

    openConfirmationModal(currentPendingSubmission);
  });
}

/**
 * 4. Confirmation Dialog
 */
function initConfirmationModal() {
  const modal = document.getElementById('confirmation-modal');
  const closeBtn = document.getElementById('confirm-modal-close');
  const cancelBtn = document.getElementById('confirm-modal-cancel');
  const proceedBtn = document.getElementById('confirm-modal-proceed');

  if (!modal || !proceedBtn) return;

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle final submission confirmation
  proceedBtn.addEventListener('click', async () => {
    if (!currentPendingSubmission) return;

    proceedBtn.disabled = true;
    proceedBtn.textContent = 'Submitting...';

    // Construct FormData ready for Django API
    const formData = new FormData();
    formData.append('group', currentPendingSubmission.group);
    formData.append('amount', currentPendingSubmission.amount.toString());
    formData.append('payment_date', currentPendingSubmission.paymentDate);
    formData.append('payment_method', currentPendingSubmission.method);
    formData.append('reference', currentPendingSubmission.reference);
    formData.append('notes', currentPendingSubmission.notes);
    formData.append('receipt_slip', currentPendingSubmission.fileObject);

    try {
      const result = await submitContributionPayment(formData);

      proceedBtn.disabled = false;
      proceedBtn.textContent = 'Confirm & Submit';
      closeModal();

      if (result.success) {
        // Prepend to in-memory records with pending status
        const newRecord = {
          id: 'pay-' + Date.now(),
          reference: currentPendingSubmission.reference,
          group: currentPendingSubmission.group,
          amount: currentPendingSubmission.amount,
          method: currentPendingSubmission.method,
          paymentDate: currentPendingSubmission.paymentDate,
          submissionDate: 'Just now',
          status: 'pending', // Explicitly pending
          receiptFileName: currentPendingSubmission.fileName,
          receiptFileSize: currentPendingSubmission.fileSize,
          notes: currentPendingSubmission.notes || 'None provided.',
          auditNote: 'Submitted just now. Awaiting group coordinator review.'
        };

        paymentRecords.unshift(newRecord);

        // Reset form & state
        document.getElementById('contribution-form').reset();
        document.getElementById('file-selected-pill').classList.remove('visible');
        selectedFile = null;
        currentPendingSubmission = null;

        // Reset default date
        const dateInput = document.getElementById('payment-date');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

        // Refresh UI
        refreshSummaryCards();
        applyFiltersAndRenderTable();

        // Show feedback banner
        showSubmissionSuccessAlert(newRecord);
      }
    } catch (err) {
      proceedBtn.disabled = false;
      proceedBtn.textContent = 'Confirm & Submit';
      alert('Demo submission error occurred.');
    }
  });
}

function openConfirmationModal(sub) {
  const modal = document.getElementById('confirmation-modal');
  const groupEl = document.getElementById('confirm-group');
  const amountEl = document.getElementById('confirm-amount');
  const methodEl = document.getElementById('confirm-method');
  const refEl = document.getElementById('confirm-ref');
  const dateEl = document.getElementById('confirm-date');
  const fileEl = document.getElementById('confirm-file');

  if (!modal) return;

  if (groupEl) groupEl.textContent = sub.group;
  if (amountEl) amountEl.textContent = formatNaira(sub.amount);
  if (methodEl) methodEl.textContent = sub.method;
  if (refEl) refEl.textContent = sub.reference;
  if (dateEl) dateEl.textContent = sub.paymentDate;
  if (fileEl) fileEl.textContent = `${sub.fileName} (${sub.fileSize})`;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * 5. Submission Success Feedback Banner
 */
function showSubmissionSuccessAlert(record) {
  const alertBox = document.getElementById('submission-alert');
  if (!alertBox) return;

  alertBox.innerHTML = `
    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;">
      <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #065F46; flex-shrink: 0; margin-top: 0.1rem;" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <div>
          <div style="font-weight: 700; font-size: 0.95rem; color: #065F46; margin-bottom: 0.2rem;">
            Demo Contribution Submitted (Pending Verification)
          </div>
          <div style="font-size: 0.85rem; color: #065F46; line-height: 1.45;">
            Your payment slip of <strong>${formatNaira(record.amount)}</strong> for <em>${record.group}</em> has been queued under <strong>Pending Verification</strong>.
            In compliance with circle security rules, it will NOT count toward verified savings until approved by an administrator.
          </div>
        </div>
      </div>
      <button type="button" id="close-alert-btn" style="background: none; border: none; color: #065F46; cursor: pointer; padding: 0.2rem;" aria-label="Dismiss alert">
        ✕
      </button>
    </div>
  `;

  alertBox.style.display = 'block';
  alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const closeBtn = document.getElementById('close-alert-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      alertBox.style.display = 'none';
    });
  }

  // Auto-hide after 8 seconds
  setTimeout(() => {
    if (alertBox.style.display !== 'none') {
      alertBox.style.display = 'none';
    }
  }, 8000);
}

/**
 * 6. Summary Cards Calculation
 */
function refreshSummaryCards() {
  const verifiedEl = document.getElementById('summary-verified-amount');
  const verifiedCountEl = document.getElementById('summary-verified-count');
  const pendingEl = document.getElementById('summary-pending-amount');
  const pendingCountEl = document.getElementById('summary-pending-count');
  const rejectedEl = document.getElementById('summary-rejected-amount');
  const rejectedCountEl = document.getElementById('summary-rejected-count');

  let verifiedTotal = 0;
  let verifiedCount = 0;
  let pendingTotal = 0;
  let pendingCount = 0;
  let rejectedTotal = 0;
  let rejectedCount = 0;

  paymentRecords.forEach(rec => {
    if (rec.status === 'verified') {
      verifiedTotal += rec.amount;
      verifiedCount++;
    } else if (rec.status === 'pending') {
      pendingTotal += rec.amount;
      pendingCount++;
    } else if (rec.status === 'rejected') {
      rejectedTotal += rec.amount;
      rejectedCount++;
    }
  });

  if (verifiedEl) verifiedEl.textContent = formatNaira(verifiedTotal);
  if (verifiedCountEl) verifiedCountEl.textContent = `${verifiedCount} payments credited`;

  if (pendingEl) pendingEl.textContent = formatNaira(pendingTotal);
  if (pendingCountEl) pendingCountEl.textContent = `${pendingCount} awaiting approval`;

  if (rejectedEl) rejectedEl.textContent = formatNaira(rejectedTotal);
  if (rejectedCountEl) rejectedCountEl.textContent = `${rejectedCount} flagged slips`;
}

/**
 * 7. History Table Filtering & Rendering
 */
function initHistoryControls() {
  const searchInput = document.getElementById('history-search');
  const statusFilter = document.getElementById('history-status-filter');
  const dateFilter = document.getElementById('history-date-filter');
  const showMoreBtn = document.getElementById('btn-show-more');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      displayLimit = 5;
      applyFiltersAndRenderTable();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      displayLimit = 5;
      applyFiltersAndRenderTable();
    });
  }

  if (dateFilter) {
    dateFilter.addEventListener('change', () => {
      displayLimit = 5;
      applyFiltersAndRenderTable();
    });
  }

  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      displayLimit += 5;
      applyFiltersAndRenderTable();
    });
  }
}

function applyFiltersAndRenderTable() {
  const searchVal = document.getElementById('history-search')?.value.toLowerCase().trim() || '';
  const statusVal = document.getElementById('history-status-filter')?.value || 'all';
  const dateVal = document.getElementById('history-date-filter')?.value || 'all';

  const tableBody = document.getElementById('history-table-body');
  const emptyState = document.getElementById('table-empty-state');
  const countIndicator = document.getElementById('history-count-indicator');
  const showMoreBtn = document.getElementById('btn-show-more');

  if (!tableBody) return;

  const now = new Date();

  filteredRecords = paymentRecords.filter(rec => {
    // 1. Search filter
    const matchesSearch = !searchVal || 
      rec.reference.toLowerCase().includes(searchVal) ||
      rec.group.toLowerCase().includes(searchVal) ||
      rec.method.toLowerCase().includes(searchVal) ||
      rec.notes.toLowerCase().includes(searchVal);

    // 2. Status filter
    const matchesStatus = statusVal === 'all' || rec.status === statusVal;

    // 3. Date filter
    let matchesDate = true;
    if (dateVal !== 'all') {
      const recDate = new Date(rec.paymentDate);
      const diffDays = (now - recDate) / (1000 * 60 * 60 * 24);
      if (dateVal === '7days') {
        matchesDate = diffDays <= 7;
      } else if (dateVal === '30days') {
        matchesDate = diffDays <= 30;
      } else if (dateVal === 'month') {
        matchesDate = recDate.getMonth() === now.getMonth() && recDate.getFullYear() === now.getFullYear();
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Empty state check
  if (filteredRecords.length === 0) {
    tableBody.innerHTML = '';
    if (emptyState) emptyState.classList.add('visible');
    if (countIndicator) countIndicator.textContent = 'Showing 0 of 0 payments';
    if (showMoreBtn) showMoreBtn.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.classList.remove('visible');

  // Slice for pagination
  const recordsToShow = filteredRecords.slice(0, displayLimit);

  tableBody.innerHTML = '';
  recordsToShow.forEach(rec => {
    const tr = document.createElement('tr');

    let badgeClass = 'status-pending';
    let badgeLabel = '⏳ Pending Verification';
    if (rec.status === 'verified') {
      badgeClass = 'status-verified';
      badgeLabel = '✓ Verified';
    } else if (rec.status === 'rejected') {
      badgeClass = 'status-rejected';
      badgeLabel = '✕ Rejected';
    }

    tr.innerHTML = `
      <td class="tabular-nums" style="white-space: nowrap; font-weight: 500;">${rec.paymentDate}</td>
      <td style="font-weight: 600; color: #0B1220;">${rec.group}</td>
      <td class="tabular-nums" style="font-weight: 700; color: #0B1220;">${formatNaira(rec.amount)}</td>
      <td class="tabular-nums" style="font-family: monospace; font-size: 0.825rem; color: #64748B;">${rec.reference}</td>
      <td class="tabular-nums text-muted" style="font-size: 0.8125rem;">${rec.submissionDate}</td>
      <td>
        <span class="badge-status ${badgeClass}">${badgeLabel}</span>
      </td>
      <td>
        <button type="button" class="btn-details" data-id="${rec.id}">
          View Details
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  // Attach modal listeners to "View Details" buttons
  const detailBtns = tableBody.querySelectorAll('.btn-details');
  detailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = paymentRecords.find(r => r.id === id);
      if (item) openDetailsModal(item);
    });
  });

  // Update indicators
  if (countIndicator) {
    countIndicator.textContent = `Showing ${recordsToShow.length} of ${filteredRecords.length} records`;
  }

  if (showMoreBtn) {
    showMoreBtn.style.display = filteredRecords.length > displayLimit ? 'inline-block' : 'none';
  }
}

/**
 * 8. Details Modal Logic
 */
function initDetailsModal() {
  const modal = document.getElementById('details-modal');
  const closeBtn = document.getElementById('details-modal-close');
  const dismissBtn = document.getElementById('details-modal-dismiss');

  if (!modal) return;

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
    // Also handle confirmation modal escape
    const confirmModal = document.getElementById('confirmation-modal');
    if (e.key === 'Escape' && confirmModal && confirmModal.classList.contains('active')) {
      confirmModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

function openDetailsModal(rec) {
  const modal = document.getElementById('details-modal');
  if (!modal) return;

  // Populate data
  document.getElementById('modal-ref').textContent = rec.reference;
  document.getElementById('modal-group').textContent = rec.group;
  document.getElementById('modal-amount').textContent = formatNaira(rec.amount);
  document.getElementById('modal-method').textContent = rec.method;
  document.getElementById('modal-paydate').textContent = rec.paymentDate;
  document.getElementById('modal-subdate').textContent = rec.submissionDate;
  document.getElementById('modal-notes').textContent = rec.notes || 'None provided.';
  document.getElementById('modal-filename').textContent = rec.receiptFileName;
  document.getElementById('modal-filesize').textContent = rec.receiptFileSize;
  document.getElementById('modal-audit').textContent = rec.auditNote;

  const statusEl = document.getElementById('modal-status-badge');
  if (statusEl) {
    if (rec.status === 'verified') {
      statusEl.className = 'badge-status status-verified';
      statusEl.textContent = '✓ Verified & Credited';
    } else if (rec.status === 'pending') {
      statusEl.className = 'badge-status status-pending';
      statusEl.textContent = '⏳ Pending Administrator Review';
    } else {
      statusEl.className = 'badge-status status-rejected';
      statusEl.textContent = '✕ Rejected by Coordinator';
    }
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * ==========================================================================
 * BACKEND PREPARATION: DJANGO ENDPOINT INTERFACE
 * ==========================================================================
 * Modular function accepting a standard FormData object.
 * When integrating with Django:
 * 
 * const response = await fetch('/api/v1/contributions/submit/', {
 *   method: 'POST',
 *   headers: {
 *     'X-CSRFToken': getCookie('csrftoken'),
 *     // Do NOT set Content-Type header when sending FormData; browser sets boundary
 *   },
 *   body: formData
 * });
 * return await response.json();
 */
async function submitContributionPayment(formData) {
  // Simulated asynchronous network request (700ms)
  await new Promise(resolve => setTimeout(resolve, 700));

  return {
    success: true,
    message: 'Payment submission logged into pending queue.'
  };
}

/**
 * Helper error display functions
 */
function showError(errorId, message) {
  const el = document.getElementById(errorId);
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
  }
}

function clearError(errorId) {
  const el = document.getElementById(errorId);
  if (el) {
    el.textContent = '';
    el.style.display = 'none';
  }
}

function clearAllFormErrors() {
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
}
