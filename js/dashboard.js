/**
 * ContriTrack — Member Overview Dashboard Controller (js/dashboard.js)
 * Vanilla JavaScript implementation for personal savings overview:
 * - Mobile sidebar toggling & accessibility
 * - Interactive SVG savings trajectory chart
 * - Recent contributions ledger with status filtering
 * - In-app notification toast alerts (replaces window.alert)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMemberDashboard();
});

// Demo Member Data
const memberContributionsData = [
  {
    id: 'TXN-90241',
    date: '2026-10-24',
    group: 'Lagos Techies Thrift Club',
    amount: 5000,
    method: 'Bank Transfer',
    ref: 'PAY-LT-90241',
    status: 'Verified',
    receiptUrl: 'receipt-90241.png'
  },
  {
    id: 'TXN-90238',
    date: '2026-10-23',
    group: 'Family Daily Payout Club',
    amount: 2500,
    method: 'Bank Transfer',
    ref: 'PAY-FAM-90238',
    status: 'Verified',
    receiptUrl: 'receipt-90238.png'
  },
  {
    id: 'TXN-90230',
    date: '2026-10-23',
    group: 'Market Traders Daily Esusu',
    amount: 1000,
    method: 'Cash',
    ref: 'CASH-MT-90230',
    status: 'Verified',
    receiptUrl: 'receipt-90230.png'
  },
  {
    id: 'TXN-90215',
    date: '2026-10-22',
    group: 'Lagos Techies Thrift Club',
    amount: 5000,
    method: 'Bank Transfer',
    ref: 'PAY-LT-90215',
    status: 'Verified',
    receiptUrl: 'receipt-90215.png'
  },
  {
    id: 'TXN-90199',
    date: '2026-10-21',
    group: 'Lagos Techies Thrift Club',
    amount: 5000,
    method: 'Bank Transfer',
    ref: 'PAY-LT-90199',
    status: 'Verified',
    receiptUrl: 'receipt-90199.png'
  },
  {
    id: 'TXN-90184',
    date: '2026-10-20',
    group: 'Family Daily Payout Club',
    amount: 2500,
    method: 'Bank Transfer',
    ref: 'PAY-FAM-90184',
    status: 'Pending',
    receiptUrl: 'receipt-90184.png'
  }
];

const monthlySavingsHistory = [
  { month: 'Jan', verified: 15000, target: 20000 },
  { month: 'Feb', verified: 35000, target: 40000 },
  { month: 'Mar', verified: 58000, target: 60000 },
  { month: 'Apr', verified: 82000, target: 80000 },
  { month: 'May', verified: 110000, target: 100000 },
  { month: 'Jun', verified: 135000, target: 120000 },
  { month: 'Jul', verified: 162000, target: 140000 },
  { month: 'Aug', verified: 188000, target: 160000 },
  { month: 'Sep', verified: 220000, target: 180000 },
  { month: 'Oct', verified: 245000, target: 200000 }
];

function initMemberDashboard() {
  initMobileSidebar();
  renderSavingsChart();
  renderContributionsTable('all');
  initFilterEvents();
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
 * Render Vanilla SVG Savings Trajectory Chart
 */
function renderSavingsChart() {
  const container = document.getElementById('member-savings-chart-container');
  if (!container) return;

  const width = 640;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 55 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = 260000;
  const minVal = 0;

  const points = monthlySavingsHistory.map((d, i) => {
    const x = padding.left + (i / (monthlySavingsHistory.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.verified - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, ...d };
  });

  const targetPoints = monthlySavingsHistory.map((d, i) => {
    const x = padding.left + (i / (monthlySavingsHistory.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.target - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y };
  });

  // Build SVG path strings
  const areaPath = `M ${points[0].x} ${points[0].y} ` +
    points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') +
    ` L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  const linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const targetLinePath = `M ${targetPoints[0].x} ${targetPoints[0].y} ` + targetPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

  // Horizontal Grid Lines
  const gridSteps = [0, 65000, 130000, 195000, 260000];
  const gridLines = gridSteps.map(val => {
    const y = padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
    const label = `₦${(val / 1000).toFixed(0)}k`;
    return `
      <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3,3" />
      <text x="${padding.left - 8}" y="${y + 4}" fill="#94A3B8" font-size="10" text-anchor="end" font-family="'Plus Jakarta Sans', sans-serif">${label}</text>
    `;
  }).join('');

  // Month Labels
  const monthLabels = points.map(p => `
    <text x="${p.x}" y="${height - 10}" fill="#64748B" font-size="11" font-weight="600" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif">${p.month}</text>
  `).join('');

  // Interactive Circles
  const circleNodes = points.map(p => `
    <circle cx="${p.x}" cy="${p.y}" r="4" fill="#FFFFFF" stroke="#10B981" stroke-width="2.5" class="chart-point" data-month="${p.month}" data-val="${p.verified}" style="cursor: pointer; transition: r 0.2s;" />
  `).join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%; overflow: visible;" aria-label="Savings Trajectory Chart">
      <defs>
        <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10B981" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#10B981" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      
      <!-- Grid -->
      ${gridLines}

      <!-- Target Baseline Line -->
      <path d="${targetLinePath}" fill="none" stroke="#CBD5E1" stroke-width="1.8" stroke-dasharray="4,4" />

      <!-- Area Fill -->
      <path d="${areaPath}" fill="url(#savingsGradient)" />

      <!-- Actual Growth Line -->
      <path d="${linePath}" fill="none" stroke="#10B981" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Month Labels -->
      ${monthLabels}

      <!-- Data Dots -->
      ${circleNodes}
    </svg>
    <div id="chart-tooltip-dashboard" class="chart-tooltip-reports" role="tooltip"></div>
  `;

  // Attach hover events to data points
  const tooltip = document.getElementById('chart-tooltip-dashboard');
  const dots = container.querySelectorAll('.chart-point');

  dots.forEach(dot => {
    dot.addEventListener('mouseenter', (e) => {
      dot.setAttribute('r', '6');
      dot.setAttribute('stroke-width', '3');
      const month = dot.getAttribute('data-month');
      const val = Number(dot.getAttribute('data-val')).toLocaleString('en-NG');
      if (tooltip) {
        tooltip.innerHTML = `<strong>${month} 2026</strong><br/>Verified Savings: ₦${val}.00`;
        tooltip.style.display = 'block';
        const rect = container.getBoundingClientRect();
        const dotRect = dot.getBoundingClientRect();
        tooltip.style.left = `${dotRect.left - rect.left + dotRect.width / 2}px`;
        tooltip.style.top = `${dotRect.top - rect.top}px`;
      }
    });

    dot.addEventListener('mouseleave', () => {
      dot.setAttribute('r', '4');
      dot.setAttribute('stroke-width', '2.5');
      if (tooltip) tooltip.style.display = 'none';
    });
  });
}

/**
 * Render Recent Contributions Table
 */
function renderContributionsTable(filter) {
  const tbody = document.getElementById('member-contributions-tbody');
  if (!tbody) return;

  const filtered = memberContributionsData.filter(item => {
    if (filter === 'verified') return item.status === 'Verified';
    if (filter === 'pending') return item.status === 'Pending';
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2rem; color: #64748B;">
          No contribution records match the selected status filter.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const isVerified = item.status === 'Verified';
    const badgeClass = isVerified ? 'badge-verified' : 'badge-pending';
    const statusIcon = isVerified
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';

    return `
      <tr>
        <td style="font-weight: 600; color: #0B1220;">${item.date}</td>
        <td>
          <div style="font-weight: 700; color: #0B1220;">${item.group}</div>
          <div style="font-size: 0.725rem; color: #64748B;">Ref: ${item.ref}</div>
        </td>
        <td class="tabular-nums" style="font-weight: 800; color: #0B1220;">₦${item.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
        <td>
          <span style="font-size: 0.8rem; color: #334155; font-weight: 600;">${item.method}</span>
        </td>
        <td>
          <code style="font-size: 0.75rem; background-color: #F1F5F9; padding: 0.2rem 0.4rem; border-radius: 4px; color: #334155;">${item.id}</code>
        </td>
        <td>
          <span class="badge ${badgeClass}" style="display: inline-flex; align-items: center; gap: 0.35rem;">
            ${statusIcon}
            ${item.status}
          </span>
        </td>
        <td>
          <button type="button" class="btn btn-secondary btn-sm btn-view-receipt" data-ref="${item.ref}" data-amount="${item.amount}" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;">
            Slip
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Wire receipt click events
  tbody.querySelectorAll('.btn-view-receipt').forEach(btn => {
    btn.addEventListener('click', () => {
      const ref = btn.getAttribute('data-ref');
      const amount = Number(btn.getAttribute('data-amount')).toLocaleString('en-NG', { minimumFractionDigits: 2 });
      showToast(
        'Receipt Validated (Demo)',
        `Digital payment slip for ${ref} (₦${amount}) is verified in the immutable ledger.`,
        'success'
      );
    });
  });
}

function initFilterEvents() {
  const select = document.getElementById('member-filter-status');
  select?.addEventListener('change', (e) => {
    renderContributionsTable(e.target.value);
  });
}

/**
 * In-App Toast Notification Utility (no window.alert)
 */
function showToast(title, message, type = 'info') {
  const container = document.getElementById('admin-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `admin-toast toast-${type}`;
  
  const iconSvg = type === 'success'
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toast-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

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
