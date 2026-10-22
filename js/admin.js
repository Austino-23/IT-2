/**
 * ContriTrack — Administrator Dashboard Client Script (js/admin.js)
 * Vanilla JavaScript implementation for:
 * - Dynamic Summary Statistics (Total Verified, Expected, Pending, Active Members)
 * - Custom SVG Chart for Collection Trends (Daily vs Monthly toggle with hover tooltips)
 * - Filterable Recent Payments Table with direct links to verify-payments.html
 * - Group Performance Table with outstanding amounts calculation
 * - Members Requiring Attention list with simulated reminder alerts
 * - Strict financial accuracy: only verified payments count toward confirmed collections
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
});

/**
 * Demo Datasets for Administrator Dashboard
 */
const adminData = {
  summary: {
    verifiedCollections: 8340000,
    expectedCollections: 10500000,
    pendingPayments: 175000,
    pendingCount: 8,
    activeMembers: 24
  },

  trends: {
    daily: [
      { label: 'Oct 07', amount: 210000 },
      { label: 'Oct 08', amount: 195000 },
      { label: 'Oct 09', amount: 240000 },
      { label: 'Oct 10', amount: 0, isRest: true },
      { label: 'Oct 11', amount: 0, isRest: true },
      { label: 'Oct 12', amount: 225000 },
      { label: 'Oct 13', amount: 210000 },
      { label: 'Oct 14', amount: 255000 },
      { label: 'Oct 15', amount: 240000 },
      { label: 'Oct 16', amount: 225000 },
      { label: 'Oct 17', amount: 270000 },
      { label: 'Oct 18', amount: 0, isRest: true },
      { label: 'Oct 19', amount: 255000 },
      { label: 'Oct 20', amount: 285000, isToday: true }
    ],
    monthly: [
      { label: 'Jan', amount: 4200000 },
      { label: 'Feb', amount: 4800000 },
      { label: 'Mar', amount: 5400000 },
      { label: 'Apr', amount: 5900000 },
      { label: 'May', amount: 6300000 },
      { label: 'Jun', amount: 6800000 },
      { label: 'Jul', amount: 7100000 },
      { label: 'Aug', amount: 7500000 },
      { label: 'Sep', amount: 7900000 },
      { label: 'Oct', amount: 8340000, isCurrent: true }
    ]
  },

  recentPayments: [
    {
      id: 'pay-adm-01',
      reference: 'CTX-90188-NG',
      member: 'Amara Chen',
      avatar: 'AC',
      group: 'Alpha Thrift Syndicate · Cycle #4',
      amount: 15000,
      submissionDate: '2026-10-20 09:42 AM',
      status: 'pending'
    },
    {
      id: 'pay-adm-02',
      reference: 'CTX-90112-NG',
      member: 'David Okafor',
      avatar: 'DO',
      group: 'Family Home Builder Fund',
      amount: 30000,
      submissionDate: '2026-10-20 09:15 AM',
      status: 'pending'
    },
    {
      id: 'pay-adm-03',
      reference: 'CTX-89244-NG',
      member: 'Marcus Vance',
      avatar: 'MV',
      group: 'Alpha Thrift Syndicate · Cycle #4',
      amount: 15000,
      submissionDate: '2026-10-19 11:20 AM',
      status: 'verified'
    },
    {
      id: 'pay-adm-04',
      reference: 'CTX-89210-NG',
      member: 'Elena Rostova',
      avatar: 'ER',
      group: 'Alpha Thrift Syndicate · Cycle #4',
      amount: 15000,
      submissionDate: '2026-10-19 10:14 AM',
      status: 'verified'
    },
    {
      id: 'pay-adm-05',
      reference: 'CTX-88550-NG',
      member: 'Tariq Al-Mansoor',
      avatar: 'TA',
      group: 'Alpha Thrift Syndicate · Cycle #4',
      amount: 15000,
      submissionDate: '2026-10-18 04:30 PM',
      status: 'rejected'
    },
    {
      id: 'pay-adm-06',
      reference: 'CTX-87100-NG',
      member: 'Kofi Mensah',
      avatar: 'KM',
      group: 'Weekly Tech Syndicate',
      amount: 20000,
      submissionDate: '2026-10-18 02:15 PM',
      status: 'verified'
    }
  ],

  groupPerformance: [
    {
      name: 'Alpha Thrift Syndicate · Cycle #4',
      membersCount: 12,
      expected: 5400000,
      verified: 4500000,
      outstanding: 900000,
      percent: 83
    },
    {
      name: 'Family Home Builder Fund',
      membersCount: 8,
      expected: 3600000,
      verified: 2880000,
      outstanding: 720000,
      percent: 80
    },
    {
      name: 'Weekly Tech Syndicate',
      membersCount: 6,
      expected: 1500000,
      verified: 960000,
      outstanding: 540000,
      percent: 64
    }
  ],

  attentionMembers: [
    {
      name: 'Tariq Al-Mansoor',
      avatar: 'TA',
      group: 'Alpha Thrift Syndicate',
      amount: 15000,
      overdueDays: 3,
      reason: 'Missed cutoff for Day 18 & 19 dues',
      statusText: '⚠ Overdue: 3 Days'
    },
    {
      name: 'David Okafor',
      avatar: 'DO',
      group: 'Weekly Tech Syndicate',
      amount: 20000,
      overdueDays: 2,
      reason: 'Rejected slip: Reference mismatch',
      statusText: '⚠ Incomplete Slip'
    },
    {
      name: 'Anthony Chen',
      avatar: 'AC',
      group: 'Family Home Builder Fund',
      amount: 30000,
      overdueDays: 4,
      reason: 'Past grace period for Week 5 allocation',
      statusText: '⚠ Overdue: 4 Days'
    }
  ]
};

let currentChartMode = 'daily';

/**
 * Main Controller
 */
function initAdminDashboard() {
  initMobileSidebar();
  initNotificationsModal();
  renderSummaryCards();
  initTrendsChart();
  renderRecentPaymentsTable();
  renderGroupPerformanceTable();
  renderAttentionMembersList();
}

/**
 * Format currency in Nigerian Naira (₦)
 */
function formatNaira(val) {
  return '₦' + Number(val).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * 1. Render Summary Cards
 */
function renderSummaryCards() {
  const verifiedEl = document.getElementById('adm-sum-verified');
  const expectedEl = document.getElementById('adm-sum-expected');
  const pendingEl = document.getElementById('adm-sum-pending');
  const membersEl = document.getElementById('adm-sum-members');

  if (verifiedEl) verifiedEl.textContent = formatNaira(adminData.summary.verifiedCollections);
  if (expectedEl) expectedEl.textContent = formatNaira(adminData.summary.expectedCollections);
  if (pendingEl) pendingEl.textContent = formatNaira(adminData.summary.pendingPayments);
  if (membersEl) membersEl.textContent = adminData.summary.activeMembers;
}

/**
 * 2. Render SVG Collection Trends Chart (No external libraries)
 */
function initTrendsChart() {
  const tabDaily = document.getElementById('chart-tab-daily');
  const tabMonthly = document.getElementById('chart-tab-monthly');

  if (tabDaily) {
    tabDaily.addEventListener('click', () => {
      currentChartMode = 'daily';
      tabDaily.classList.add('active');
      tabDaily.setAttribute('aria-selected', 'true');
      if (tabMonthly) {
        tabMonthly.classList.remove('active');
        tabMonthly.setAttribute('aria-selected', 'false');
      }
      drawSvgChart();
    });
  }

  if (tabMonthly) {
    tabMonthly.addEventListener('click', () => {
      currentChartMode = 'monthly';
      tabMonthly.classList.add('active');
      tabMonthly.setAttribute('aria-selected', 'true');
      if (tabDaily) {
        tabDaily.classList.remove('active');
        tabDaily.setAttribute('aria-selected', 'false');
      }
      drawSvgChart();
    });
  }

  // Initial draw
  drawSvgChart();
  window.addEventListener('resize', drawSvgChart, { passive: true });
}

function drawSvgChart() {
  const wrapper = document.getElementById('chart-svg-container');
  const tooltip = document.getElementById('chart-tooltip');
  if (!wrapper) return;

  const width = wrapper.clientWidth || 800;
  const height = 240;
  const padding = { top: 25, right: 20, bottom: 35, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const dataset = currentChartMode === 'daily' ? adminData.trends.daily : adminData.trends.monthly;
  const maxVal = Math.max(...dataset.map(d => d.amount), 100000);

  // Round maxVal to nice upper ceiling
  const ceiling = Math.ceil(maxVal * 1.15);

  const barWidth = Math.max(14, Math.min(38, Math.floor((chartWidth / dataset.length) * 0.65)));
  const step = chartWidth / dataset.length;

  let svgHtml = `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="overflow: visible;">
      <defs>
        <linearGradient id="barGradEmerald" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
        <linearGradient id="barGradNavy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1E293B" />
          <stop offset="100%" stop-color="#0B1220" />
        </linearGradient>
      </defs>

      <!-- Background Grid Lines -->
      <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="#E2E8F0" stroke-dasharray="3,3" />
      <line x1="${padding.left}" y1="${padding.top + chartHeight * 0.5}" x2="${width - padding.right}" y2="${padding.top + chartHeight * 0.5}" stroke="#E2E8F0" stroke-dasharray="3,3" />
      <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}" stroke="#E2E8F0" />

      <!-- Y-Axis Scale Text -->
      <text x="${padding.left - 8}" y="${padding.top + 4}" fill="#64748B" font-size="10" font-family="Plus Jakarta Sans, sans-serif" text-anchor="end" font-variant-numeric="tabular-nums">${formatShortNaira(ceiling)}</text>
      <text x="${padding.left - 8}" y="${padding.top + chartHeight * 0.5 + 4}" fill="#64748B" font-size="10" font-family="Plus Jakarta Sans, sans-serif" text-anchor="end" font-variant-numeric="tabular-nums">${formatShortNaira(ceiling * 0.5)}</text>
      <text x="${padding.left - 8}" y="${padding.top + chartHeight + 4}" fill="#64748B" font-size="10" font-family="Plus Jakarta Sans, sans-serif" text-anchor="end">₦0</text>
  `;

  // Draw Bars
  dataset.forEach((item, idx) => {
    const x = padding.left + idx * step + (step - barWidth) / 2;
    const barHeight = Math.max(3, (item.amount / ceiling) * chartHeight);
    const y = padding.top + chartHeight - barHeight;

    const fill = item.isRest ? '#E2E8F0' : (item.isToday || item.isCurrent ? 'url(#barGradNavy)' : 'url(#barGradEmerald)');

    svgHtml += `
      <g class="chart-bar-group" data-label="${item.label}" data-amount="${item.amount}">
        <rect class="chart-bar-rect" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" ry="4" fill="${fill}" />
        <text x="${x + barWidth / 2}" y="${padding.top + chartHeight + 18}" fill="#64748B" font-size="10" font-weight="600" font-family="Plus Jakarta Sans, sans-serif" text-anchor="middle">${item.label}</text>
      </g>
    `;
  });

  svgHtml += `</svg>`;
  wrapper.innerHTML = svgHtml;

  // Tooltip interaction
  const barGroups = wrapper.querySelectorAll('.chart-bar-group');
  barGroups.forEach(g => {
    g.addEventListener('mouseenter', (e) => {
      const label = g.getAttribute('data-label');
      const amt = parseFloat(g.getAttribute('data-amount'));
      const rect = g.querySelector('rect');
      const box = rect.getBoundingClientRect();
      const wrapBox = wrapper.getBoundingClientRect();

      tooltip.innerHTML = `<strong>${label}</strong>: ${formatNaira(amt)}`;
      tooltip.style.left = `${box.left - wrapBox.left + box.width / 2}px`;
      tooltip.style.top = `${box.top - wrapBox.top - 6}px`;
      tooltip.style.display = 'block';
    });

    g.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
}

function formatShortNaira(num) {
  if (num >= 1000000) {
    return '₦' + (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return '₦' + Math.round(num / 1000) + 'k';
  }
  return '₦' + num;
}

/**
 * 3. Recent Payments Table
 */
function renderRecentPaymentsTable() {
  const tableBody = document.getElementById('adm-payments-table-body');
  const filterSelect = document.getElementById('adm-payments-filter');

  if (!tableBody) return;

  const render = (filter = 'all') => {
    tableBody.innerHTML = '';

    const list = adminData.recentPayments.filter(p => filter === 'all' || p.status === filter);

    list.forEach(item => {
      const tr = document.createElement('tr');

      let badgeClass = 'status-pending';
      let badgeLabel = '⏳ Pending Review';
      if (item.status === 'verified') {
        badgeClass = 'status-verified';
        badgeLabel = '✓ Verified';
      } else if (item.status === 'rejected') {
        badgeClass = 'status-rejected';
        badgeLabel = '✕ Rejected';
      }

      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span class="member-avatar-sm">${item.avatar}</span>
            <div>
              <div style="font-weight: 700; color: #0B1220;">${item.member}</div>
              <div style="font-size: 0.75rem; font-family: monospace; color: #64748B;">${item.reference}</div>
            </div>
          </div>
        </td>
        <td style="font-size: 0.85rem; font-weight: 500; color: #0B1220;">${item.group}</td>
        <td class="tabular-nums" style="font-weight: 800; color: #0B1220;">${formatNaira(item.amount)}</td>
        <td class="tabular-nums" style="font-size: 0.8125rem; color: #64748B;">${item.submissionDate}</td>
        <td>
          <span class="badge-status ${badgeClass}" style="font-size: 0.725rem;">${badgeLabel}</span>
        </td>
        <td>
          <a href="verify-payments.html?ref=${item.reference}" class="btn-verify-demo" style="text-decoration: none; display: inline-block;">
            Review Slip &rarr;
          </a>
        </td>
      `;

      tableBody.appendChild(tr);
    });
  };

  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      render(e.target.value);
    });
  }

  render();
}

/**
 * 4. Group Performance Breakdown
 */
function renderGroupPerformanceTable() {
  const container = document.getElementById('adm-group-perf-body');
  if (!container) return;

  container.innerHTML = '';

  adminData.groupPerformance.forEach(grp => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>
        <div style="font-weight: 700; color: #0B1220;">${grp.name}</div>
        <div style="font-size: 0.75rem; color: #64748B;">${grp.membersCount} Active Members</div>
      </td>
      <td class="tabular-nums" style="font-weight: 600;">${formatNaira(grp.expected)}</td>
      <td class="tabular-nums" style="font-weight: 700; color: #065F46;">${formatNaira(grp.verified)}</td>
      <td class="tabular-nums" style="font-weight: 700; color: #DC2626;">${formatNaira(grp.outstanding)}</td>
      <td>
        <div class="member-progress-wrap">
          <div class="member-progress-track">
            <div class="member-progress-fill" style="width: ${grp.percent}%;"></div>
          </div>
          <span class="tabular-nums" style="font-size: 0.75rem; font-weight: 700;">${grp.percent}%</span>
        </div>
      </td>
    `;

    container.appendChild(tr);
  });
}

/**
 * 5. Members Requiring Attention List
 */
function renderAttentionMembersList() {
  const container = document.getElementById('adm-attention-list');
  if (!container) return;

  container.innerHTML = '';

  adminData.attentionMembers.forEach(mem => {
    const div = document.createElement('div');
    div.className = 'attention-item';

    div.innerHTML = `
      <div class="attention-user">
        <span class="member-avatar-sm" style="background-color: #FEF2F2; color: #DC2626; border: 1px solid #FECACA;">${mem.avatar}</span>
        <div class="attention-meta">
          <h5>${mem.name}</h5>
          <p>${mem.group} · <span style="color: #DC2626; font-weight: 600;">${mem.reason}</span></p>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 1rem;">
        <div>
          <div class="attention-amount tabular-nums">${formatNaira(mem.amount)}</div>
          <div style="font-size: 0.725rem; color: #DC2626; font-weight: 700; text-align: right;">${mem.statusText}</div>
        </div>
        <button type="button" class="btn btn-secondary btn-sm btn-nudge-member" data-name="${mem.name}" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">
          Send SMS Nudge
        </button>
      </div>
    `;

    container.appendChild(div);
  });

  const nudgeButtons = container.querySelectorAll('.btn-nudge-member');
  nudgeButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const name = btn.getAttribute('data-name');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Dispatching...';

      // Simulate Celery dispatch
      await new Promise(r => setTimeout(r, 450));

      btn.textContent = '✓ Nudged';
      btn.style.backgroundColor = 'var(--emerald-surface)';
      btn.style.color = 'var(--emerald-text)';
      btn.style.borderColor = 'var(--emerald-light)';

      showAdminToast(
        'SMS Reminder Queued',
        `Automated payment reminder SMS dispatched to ${name}. In production with Django, this queues an asynchronous Celery task.`,
        'success'
      );

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 5000);
    });
  });
}

/**
 * 6. Mobile Sidebar Navigation
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
 * 7. In-App Notifications & Profile Modal
 */
function initNotificationsModal() {
  const modal = document.getElementById('admin-notifications-modal');
  const topbarBtn = document.getElementById('topbar-notifications-btn');
  const sidebarBtn = document.getElementById('sidebar-notifications-btn');
  const closeBtn = document.getElementById('admin-notif-modal-close');
  const dismissBtn = document.getElementById('admin-notif-modal-dismiss');

  if (!modal) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (topbarBtn) topbarBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * 8. Toast Notification Utility (Non-blocking replacement for window.alert)
 */
function showAdminToast(title, message, type = 'success') {
  const container = document.getElementById('admin-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `admin-toast toast-${type}`;

  let iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--emerald);">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  `;

  if (type === 'warning') {
    iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #D97706;">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    `;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button type="button" class="toast-close-btn" aria-label="Dismiss toast">✕</button>
  `;

  const closeBtn = toast.querySelector('.toast-close-btn');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 250);
    }
  }, 5000);
}

/**
 * ==========================================================================
 * BACKEND PREPARATION: MODULAR DJANGO API INTERFACES
 * ==========================================================================
 * These clean async handlers model Django REST Framework endpoints:
 * - fetchAdminOverviewData() -> GET /api/v1/admin/overview/
 * - dispatchNudge(memberId) -> POST /api/v1/admin/members/<id>/nudge/
 * - updateCollectionRules() -> PATCH /api/v1/admin/rules/
 */
async function fetchAdminOverviewData() {
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    success: true,
    data: adminData
  };
}

async function dispatchNudge(memberId) {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    success: true,
    message: 'Nudge task queued in Celery.'
  };
}

