/**
 * ContriTrack — Reports & Analytics Script (js/reports.js)
 * Vanilla JavaScript implementation for:
 * - Dynamic Report Filtering (Date range, Circle Group, Payment Status)
 * - Strict Financial Calculation Engine (Only verified payments count as collections)
 * - Three Pure SVG / CSS Charts (Collection Trends, Expected vs Verified, Status Breakdown)
 * - Member Compliance & Performance Audit Table
 * - Group Collections Breakdown Table
 * - Real Dynamic CSV Export Generator
 * - Print-friendly layout trigger
 * - Explicit Demo PDF Placeholder handling
 * - Modular Django REST API integration interfaces
 */

document.addEventListener('DOMContentLoaded', () => {
  initReportsApp();
});

/**
 * ============================================================================
 * DEMO AUDIT DATASETS (In-Memory Baseline)
 * ============================================================================
 */
const reportBaseData = {
  groups: [
    {
      id: 'grp-01',
      name: 'Alpha Thrift Syndicate · Cycle #4',
      type: 'Daily',
      rate: 15000,
      startDate: '2026-10-01',
      endDate: '2026-10-31',
      members: ['Sarah Jenkins', 'Marcus Vance', 'Elena Rostova', 'Amara Chen', 'Tariq Al-Mansoor', 'Kofi Mensah', 'Sophia Reyes', 'David Okafor']
    },
    {
      id: 'grp-02',
      name: 'Family Home Builder Fund',
      type: 'Weekly',
      rate: 30000,
      startDate: '2026-10-01',
      endDate: '2026-12-31',
      members: ['David Okafor', 'Anthony Chen', 'Chioma Adeyemi', 'Fatima Bello']
    },
    {
      id: 'grp-03',
      name: 'Weekly Tech Syndicate',
      type: 'Weekly',
      rate: 20000,
      startDate: '2026-10-01',
      endDate: '2026-11-30',
      members: ['Kofi Mensah', 'Marcus Vance', 'David Okafor', 'Elena Rostova']
    }
  ],

  // Granular payment submissions across cycles
  transactions: [
    // Alpha Thrift Syndicate (Daily: Oct 01 - Oct 20)
    { id: 'tx-01', date: '2026-10-20', member: 'Amara Chen', avatar: 'AC', group: 'Alpha Thrift Syndicate · Cycle #4', amount: 15000, status: 'pending', ref: 'CTX-90188-NG' },
    { id: 'tx-02', date: '2026-10-20', member: 'Marcus Vance', avatar: 'MV', group: 'Alpha Thrift Syndicate · Cycle #4', amount: 15000, status: 'verified', ref: 'CTX-90199-NG' },
    { id: 'tx-03', date: '2026-10-20', member: 'Elena Rostova', avatar: 'ER', group: 'Alpha Thrift Syndicate · Cycle #4', amount: 15000, status: 'verified', ref: 'CTX-90195-NG' },
    { id: 'tx-04', date: '2026-10-19', member: 'Sarah Jenkins', avatar: 'SJ', group: 'Alpha Thrift Syndicate · Cycle #4', amount: 15000, status: 'verified', ref: 'CTX-89244-NG' },
    { id: 'tx-05', date: '2026-10-19', member: 'David Okafor', avatar: 'DO', group: 'Family Home Builder Fund', amount: 30000, status: 'pending', ref: 'CTX-90112-NG' },
    { id: 'tx-06', date: '2026-10-18', member: 'Tariq Al-Mansoor', avatar: 'TA', group: 'Alpha Thrift Syndicate · Cycle #4', amount: 15000, status: 'rejected', ref: 'CTX-88550-NG' },
    { id: 'tx-07', date: '2026-10-18', member: 'Kofi Mensah', avatar: 'KM', group: 'Weekly Tech Syndicate', amount: 20000, status: 'verified', ref: 'CTX-87100-NG' },
    { id: 'tx-08', date: '2026-10-17', member: 'Sophia Reyes', avatar: 'SR', group: 'Alpha Thrift Syndicate · Cycle #4', amount: 15000, status: 'verified', ref: 'CTX-86400-NG' },
    { id: 'tx-09', date: '2026-10-16', member: 'Marcus Vance', avatar: 'MV', group: 'Weekly Tech Syndicate', amount: 20000, status: 'verified', ref: 'CTX-85210-NG' },
    { id: 'tx-10', date: '2026-10-15', member: 'Anthony Chen', avatar: 'AC', group: 'Family Home Builder Fund', amount: 30000, status: 'verified', ref: 'CTX-84190-NG' },
    { id: 'tx-11', date: '2026-10-14', member: 'Elena Rostova', avatar: 'ER', group: 'Weekly Tech Syndicate', amount: 20000, status: 'verified', ref: 'CTX-83210-NG' },
    { id: 'tx-12', date: '2026-10-13', member: 'Chioma Adeyemi', avatar: 'CA', group: 'Family Home Builder Fund', amount: 30000, status: 'verified', ref: 'CTX-82190-NG' },
    { id: 'tx-13', date: '2026-10-12', member: 'David Okafor', avatar: 'DO', group: 'Weekly Tech Syndicate', amount: 20000, status: 'rejected', ref: 'CTX-81440-NG' },
    { id: 'tx-14', date: '2026-10-09', member: 'Fatima Bello', avatar: 'FB', group: 'Family Home Builder Fund', amount: 30000, status: 'verified', ref: 'CTX-78900-NG' },
    { id: 'tx-15', date: '2026-10-07', member: 'Sarah Jenkins', avatar: 'SJ', group: 'Alpha Thrift Syndicate · Cycle #4', amount: 15000, status: 'verified', ref: 'CTX-77600-NG' },
    { id: 'tx-16', date: '2026-10-05', member: 'Tariq Al-Mansoor', avatar: 'TA', group: 'Alpha Thrift Syndicate · Cycle #4', amount: 15000, status: 'verified', ref: 'CTX-75400-NG' },
    { id: 'tx-17', date: '2026-10-02', member: 'Kofi Mensah', avatar: 'KM', group: 'Alpha Thrift Syndicate · Cycle #4', amount: 15000, status: 'verified', ref: 'CTX-72100-NG' },
    { id: 'tx-18', date: '2026-10-01', member: 'Elena Rostova', avatar: 'ER', group: 'Alpha Thrift Syndicate · Cycle #4', amount: 15000, status: 'verified', ref: 'CTX-70100-NG' }
  ],

  // Member scheduled dues compliance roster
  memberSchedules: [
    {
      name: 'Sarah Jenkins',
      avatar: 'SJ',
      group: 'Alpha Thrift Syndicate · Cycle #4',
      expectedDues: 300000,
      verifiedDues: 300000,
      overdueCount: 0
    },
    {
      name: 'Marcus Vance',
      avatar: 'MV',
      group: 'Alpha Thrift Syndicate · Cycle #4',
      expectedDues: 300000,
      verifiedDues: 300000,
      overdueCount: 0
    },
    {
      name: 'Elena Rostova',
      avatar: 'ER',
      group: 'Alpha Thrift Syndicate · Cycle #4',
      expectedDues: 300000,
      verifiedDues: 285000,
      overdueCount: 1
    },
    {
      name: 'Amara Chen',
      avatar: 'AC',
      group: 'Alpha Thrift Syndicate · Cycle #4',
      expectedDues: 300000,
      verifiedDues: 285000,
      overdueCount: 0 // has 1 pending slip
    },
    {
      name: 'Tariq Al-Mansoor',
      avatar: 'TA',
      group: 'Alpha Thrift Syndicate · Cycle #4',
      expectedDues: 300000,
      verifiedDues: 240000,
      overdueCount: 3
    },
    {
      name: 'Kofi Mensah',
      avatar: 'KM',
      group: 'Alpha Thrift Syndicate · Cycle #4',
      expectedDues: 300000,
      verifiedDues: 300000,
      overdueCount: 0
    },
    {
      name: 'Sophia Reyes',
      avatar: 'SR',
      group: 'Alpha Thrift Syndicate · Cycle #4',
      expectedDues: 300000,
      verifiedDues: 285000,
      overdueCount: 1
    },
    {
      name: 'David Okafor',
      avatar: 'DO',
      group: 'Alpha Thrift Syndicate · Cycle #4',
      expectedDues: 300000,
      verifiedDues: 270000,
      overdueCount: 2
    },
    // Family Home Builder Fund members
    {
      name: 'David Okafor',
      avatar: 'DO',
      group: 'Family Home Builder Fund',
      expectedDues: 120000,
      verifiedDues: 90000,
      overdueCount: 0 // has pending slip
    },
    {
      name: 'Anthony Chen',
      avatar: 'AC',
      group: 'Family Home Builder Fund',
      expectedDues: 120000,
      verifiedDues: 60000,
      overdueCount: 2
    },
    {
      name: 'Chioma Adeyemi',
      avatar: 'CA',
      group: 'Family Home Builder Fund',
      expectedDues: 120000,
      verifiedDues: 120000,
      overdueCount: 0
    },
    {
      name: 'Fatima Bello',
      avatar: 'FB',
      group: 'Family Home Builder Fund',
      expectedDues: 120000,
      verifiedDues: 90000,
      overdueCount: 1
    },
    // Weekly Tech Syndicate members
    {
      name: 'Kofi Mensah',
      avatar: 'KM',
      group: 'Weekly Tech Syndicate',
      expectedDues: 80000,
      verifiedDues: 80000,
      overdueCount: 0
    },
    {
      name: 'Marcus Vance',
      avatar: 'MV',
      group: 'Weekly Tech Syndicate',
      expectedDues: 80000,
      verifiedDues: 80000,
      overdueCount: 0
    },
    {
      name: 'David Okafor',
      avatar: 'DO',
      group: 'Weekly Tech Syndicate',
      expectedDues: 80000,
      verifiedDues: 40000,
      overdueCount: 2
    },
    {
      name: 'Elena Rostova',
      avatar: 'ER',
      group: 'Weekly Tech Syndicate',
      expectedDues: 80000,
      verifiedDues: 60000,
      overdueCount: 1
    }
  ]
};

// Current Active Filter State
let activeFilters = {
  startDate: '2026-10-01',
  endDate: '2026-10-20',
  group: 'all',
  status: 'all'
};

// Cached calculated report data for exports and rendering
let currentReportResult = null;

/**
 * ============================================================================
 * MAIN INITIALIZATION
 * ============================================================================
 */
function initReportsApp() {
  initMobileSidebar();
  initFilterControls();
  initExportControls();

  // Initial calculation and view generation
  executeReportGeneration();
}

/**
 * Currency Formatter
 */
function formatNaira(num) {
  return '₦' + Number(num || 0).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
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
 * ============================================================================
 * 1. FILTER CONTROLS & DATE BOUNDS
 * ============================================================================
 */
function initFilterControls() {
  const startInput = document.getElementById('filter-start-date');
  const endInput = document.getElementById('filter-end-date');
  const groupSelect = document.getElementById('filter-group');
  const statusSelect = document.getElementById('filter-status');
  const btnGenerate = document.getElementById('btn-generate-report');
  const btnReset = document.getElementById('btn-reset-filters');

  // Set default form values
  if (startInput) startInput.value = activeFilters.startDate;
  if (endInput) endInput.value = activeFilters.endDate;

  if (btnGenerate) {
    btnGenerate.addEventListener('click', (e) => {
      e.preventDefault();
      activeFilters.startDate = startInput.value;
      activeFilters.endDate = endInput.value;
      activeFilters.group = groupSelect.value;
      activeFilters.status = statusSelect.value;

      executeReportGeneration();
      showReportsToast('Report Generated', `Filters applied from ${activeFilters.startDate} to ${activeFilters.endDate}.`, 'success');
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', (e) => {
      e.preventDefault();
      activeFilters = {
        startDate: '2026-10-01',
        endDate: '2026-10-20',
        group: 'all',
        status: 'all'
      };

      if (startInput) startInput.value = activeFilters.startDate;
      if (endInput) endInput.value = activeFilters.endDate;
      if (groupSelect) groupSelect.value = 'all';
      if (statusSelect) statusSelect.value = 'all';

      executeReportGeneration();
      showReportsToast('Filters Reset', 'Report reloaded with baseline cycle parameters.', 'info');
    });
  }
}

/**
 * ============================================================================
 * 2. REPORT CALCULATION ENGINE
 * ============================================================================
 * Strict Financial Accuracy Rules:
 * - Only verified payments count toward verified collections.
 * - Expected contributions are calculated from applicable member schedules.
 * - Outstanding = Expected - Verified (accounting for waivers/rules).
 */
function executeReportGeneration() {
  const { startDate, endDate, group, status } = activeFilters;

  // Filter granular transactions
  const filteredTx = reportBaseData.transactions.filter(t => {
    const matchDate = t.date >= startDate && t.date <= endDate;
    const matchGroup = group === 'all' || t.group === group;
    const matchStatus = status === 'all' || t.status === status;
    return matchDate && matchGroup && matchStatus;
  });

  // Filter member schedules
  const filteredMembers = reportBaseData.memberSchedules.filter(m => {
    const matchGroup = group === 'all' || m.group === group;
    if (status === 'verified') return matchGroup && m.overdueCount === 0;
    if (status === 'rejected') return matchGroup && m.overdueCount > 0;
    return matchGroup;
  });

  // Aggregated totals
  let totalExpected = 0;
  let totalVerified = 0;
  let totalOutstanding = 0;

  filteredMembers.forEach(m => {
    totalExpected += m.expectedDues;
    totalVerified += m.verifiedDues;
    const out = Math.max(0, m.expectedDues - m.verifiedDues);
    totalOutstanding += out;
  });

  const completionRate = totalExpected > 0 
    ? ((totalVerified / totalExpected) * 100).toFixed(1) 
    : '100.0';

  currentReportResult = {
    filters: { ...activeFilters },
    transactions: filteredTx,
    members: filteredMembers,
    summary: {
      totalExpected,
      totalVerified,
      totalOutstanding,
      completionRate: Number(completionRate)
    }
  };

  // Render all views
  renderSummaryCards(currentReportResult.summary);
  renderAnalyticsCharts(currentReportResult);
  renderMemberReportTable(currentReportResult.members);
  renderGroupReportTable(currentReportResult);
}

/**
 * ============================================================================
 * SECTION 2: SUMMARY CARDS
 * ============================================================================
 */
function renderSummaryCards(summary) {
  const expectedEl = document.getElementById('rep-sum-expected');
  const verifiedEl = document.getElementById('rep-sum-verified');
  const outstandingEl = document.getElementById('rep-sum-outstanding');
  const completionEl = document.getElementById('rep-sum-rate');

  if (expectedEl) expectedEl.textContent = formatNaira(summary.totalExpected);
  if (verifiedEl) verifiedEl.textContent = formatNaira(summary.totalVerified);
  if (outstandingEl) outstandingEl.textContent = formatNaira(summary.totalOutstanding);
  if (completionEl) completionEl.textContent = `${summary.completionRate}%`;
}

/**
 * ============================================================================
 * SECTION 3: ANALYTICS CHARTS (PURE SVG & VANILLA JS - NO EXTERNAL LIBS)
 * ============================================================================
 */
function renderAnalyticsCharts(reportData) {
  renderCollectionTrendsChart(reportData);
  renderExpectedVsVerifiedChart(reportData);
  renderStatusBreakdownChart(reportData);
}

/**
 * Chart 1: Daily Collection Trends (SVG Timeline)
 */
function renderCollectionTrendsChart(reportData) {
  const container = document.getElementById('chart-timeline-svg');
  const tooltip = document.getElementById('chart-tooltip-timeline');
  if (!container) return;

  // Aggregate daily verified collections
  const dailyMap = {};
  reportData.transactions.forEach(tx => {
    if (tx.status === 'verified') {
      dailyMap[tx.date] = (dailyMap[tx.date] || 0) + tx.amount;
    }
  });

  // Generate date points across filter range
  const dates = [];
  const start = new Date(reportData.filters.startDate);
  const end = new Date(reportData.filters.endDate);
  
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    const iso = dt.toISOString().split('T')[0];
    const label = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dates.push({
      dateStr: iso,
      label,
      amount: dailyMap[iso] || 0
    });
  }

  // Handle empty or very narrow date ranges
  if (dates.length === 0) {
    container.innerHTML = `<div class="empty-state-text" style="color: #94A3B8; padding: 2rem;">No verified collection events found in selected period.</div>`;
    return;
  }

  const width = container.clientWidth || 720;
  const height = 220;
  const padding = { top: 25, right: 20, bottom: 35, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...dates.map(d => d.amount), 50000);
  const ceiling = Math.ceil(maxVal * 1.2);
  const step = chartWidth / dates.length;
  const barWidth = Math.max(8, Math.min(28, Math.floor(step * 0.65)));

  let svg = `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="overflow: visible;">
      <defs>
        <linearGradient id="repEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
      </defs>

      <!-- Background Grid lines -->
      <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="#E2E8F0" stroke-dasharray="3,3" />
      <line x1="${padding.left}" y1="${padding.top + chartHeight * 0.5}" x2="${width - padding.right}" y2="${padding.top + chartHeight * 0.5}" stroke="#E2E8F0" stroke-dasharray="3,3" />
      <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}" stroke="#E2E8F0" />

      <!-- Y-Axis Labels -->
      <text x="${padding.left - 8}" y="${padding.top + 4}" fill="#64748B" font-size="10" font-family="Plus Jakarta Sans, sans-serif" text-anchor="end" font-variant-numeric="tabular-nums">${formatShortNaira(ceiling)}</text>
      <text x="${padding.left - 8}" y="${padding.top + chartHeight * 0.5 + 4}" fill="#64748B" font-size="10" font-family="Plus Jakarta Sans, sans-serif" text-anchor="end" font-variant-numeric="tabular-nums">${formatShortNaira(ceiling * 0.5)}</text>
      <text x="${padding.left - 8}" y="${padding.top + chartHeight + 4}" fill="#64748B" font-size="10" font-family="Plus Jakarta Sans, sans-serif" text-anchor="end">₦0</text>
  `;

  // Draw Bars
  dates.forEach((d, idx) => {
    const x = padding.left + idx * step + (step - barWidth) / 2;
    const barHeight = d.amount > 0 ? Math.max(4, (d.amount / ceiling) * chartHeight) : 2;
    const y = padding.top + chartHeight - barHeight;
    const fill = d.amount > 0 ? 'url(#repEmeraldGrad)' : '#E2E8F0';

    // Show label every few steps if many dates
    const showLabel = dates.length <= 14 || idx % Math.ceil(dates.length / 10) === 0 || idx === dates.length - 1;

    svg += `
      <g class="chart-timeline-bar" data-label="${d.label}" data-date="${d.dateStr}" data-amount="${d.amount}">
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="3" ry="3" fill="${fill}" />
        ${showLabel ? `<text x="${x + barWidth / 2}" y="${padding.top + chartHeight + 16}" fill="#64748B" font-size="9" font-weight="600" text-anchor="middle">${d.label}</text>` : ''}
      </g>
    `;
  });

  svg += `</svg>`;
  container.innerHTML = svg;

  // Tooltip interaction
  const barElements = container.querySelectorAll('.chart-timeline-bar');
  barElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      const label = el.getAttribute('data-label');
      const amt = parseFloat(el.getAttribute('data-amount'));
      const rect = el.querySelector('rect');
      const box = rect.getBoundingClientRect();
      const wrapBox = container.getBoundingClientRect();

      tooltip.innerHTML = `<strong>${label}</strong><br>Verified Inflow: <strong>${formatNaira(amt)}</strong>`;
      tooltip.style.left = `${box.left - wrapBox.left + box.width / 2}px`;
      tooltip.style.top = `${box.top - wrapBox.top - 6}px`;
      tooltip.style.display = 'block';
    });

    el.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
}

/**
 * Chart 2: Expected vs. Verified Comparison per Circle
 */
function renderExpectedVsVerifiedChart(reportData) {
  const container = document.getElementById('chart-comparison-svg');
  const tooltip = document.getElementById('chart-tooltip-comparison');
  if (!container) return;

  // Aggregate by group
  const groupMetrics = {};
  reportBaseData.groups.forEach(g => {
    groupMetrics[g.name] = { expected: 0, verified: 0, shortName: g.name.split('·')[0].trim() };
  });

  reportData.members.forEach(m => {
    if (groupMetrics[m.group]) {
      groupMetrics[m.group].expected += m.expectedDues;
      groupMetrics[m.group].verified += m.verifiedDues;
    }
  });

  const activeGroups = Object.keys(groupMetrics).filter(g => 
    reportData.filters.group === 'all' || g === reportData.filters.group
  );

  if (activeGroups.length === 0) {
    container.innerHTML = `<div class="empty-state-text" style="color: #94A3B8; padding: 2rem;">No circle comparative metrics available.</div>`;
    return;
  }

  const width = container.clientWidth || 380;
  const height = 220;
  const padding = { top: 25, right: 15, bottom: 35, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  let maxVal = 100000;
  activeGroups.forEach(g => {
    maxVal = Math.max(maxVal, groupMetrics[g].expected, groupMetrics[g].verified);
  });
  const ceiling = Math.ceil(maxVal * 1.2);

  const groupStep = chartWidth / activeGroups.length;
  const dualBarWidth = Math.min(24, Math.floor(groupStep * 0.35));

  let svg = `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="overflow: visible;">
      <!-- Grid -->
      <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="#E2E8F0" stroke-dasharray="3,3" />
      <line x1="${padding.left}" y1="${padding.top + chartHeight * 0.5}" x2="${width - padding.right}" y2="${padding.top + chartHeight * 0.5}" stroke="#E2E8F0" stroke-dasharray="3,3" />
      <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${width - padding.right}" y2="${padding.top + chartHeight}" stroke="#E2E8F0" />

      <!-- Y Axis -->
      <text x="${padding.left - 8}" y="${padding.top + 4}" fill="#64748B" font-size="10" text-anchor="end">${formatShortNaira(ceiling)}</text>
      <text x="${padding.left - 8}" y="${padding.top + chartHeight * 0.5 + 4}" fill="#64748B" font-size="10" text-anchor="end">${formatShortNaira(ceiling * 0.5)}</text>
      <text x="${padding.left - 8}" y="${padding.top + chartHeight + 4}" fill="#64748B" font-size="10" text-anchor="end">₦0</text>
  `;

  activeGroups.forEach((grpName, idx) => {
    const data = groupMetrics[grpName];
    const groupCenterX = padding.left + idx * groupStep + groupStep / 2;

    const expH = (data.expected / ceiling) * chartHeight;
    const verH = (data.verified / ceiling) * chartHeight;

    const expX = groupCenterX - dualBarWidth - 2;
    const expY = padding.top + chartHeight - expH;

    const verX = groupCenterX + 2;
    const verY = padding.top + chartHeight - verH;

    svg += `
      <!-- Expected Bar (Navy) -->
      <g class="chart-dual-bar" data-group="${data.shortName}" data-type="Expected" data-amount="${data.expected}">
        <rect x="${expX}" y="${expY}" width="${dualBarWidth}" height="${expH}" rx="3" fill="#1E293B" />
      </g>

      <!-- Verified Bar (Emerald) -->
      <g class="chart-dual-bar" data-group="${data.shortName}" data-type="Verified" data-amount="${data.verified}">
        <rect x="${verX}" y="${verY}" width="${dualBarWidth}" height="${verH}" rx="3" fill="#10B981" />
      </g>

      <!-- Group Label -->
      <text x="${groupCenterX}" y="${padding.top + chartHeight + 16}" fill="#0B1220" font-size="10" font-weight="700" text-anchor="middle">
        ${data.shortName.length > 14 ? data.shortName.substring(0, 12) + '…' : data.shortName}
      </text>
    `;
  });

  svg += `</svg>`;
  container.innerHTML = svg;

  // Tooltip interaction
  const dualBars = container.querySelectorAll('.chart-dual-bar');
  dualBars.forEach(el => {
    el.addEventListener('mouseenter', () => {
      const grp = el.getAttribute('data-group');
      const type = el.getAttribute('data-type');
      const amt = parseFloat(el.getAttribute('data-amount'));
      const rect = el.querySelector('rect');
      const box = rect.getBoundingClientRect();
      const wrapBox = container.getBoundingClientRect();

      tooltip.innerHTML = `<strong>${grp}</strong><br>${type}: <strong>${formatNaira(amt)}</strong>`;
      tooltip.style.left = `${box.left - wrapBox.left + box.width / 2}px`;
      tooltip.style.top = `${box.top - wrapBox.top - 6}px`;
      tooltip.style.display = 'block';
    });

    el.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
}

/**
 * Chart 3: Contribution Status Breakdown (Interactive Proportional Donut)
 */
function renderStatusBreakdownChart(reportData) {
  const container = document.getElementById('chart-status-svg');
  const tooltip = document.getElementById('chart-tooltip-status');
  if (!container) return;

  // Count submissions by status
  let verifiedCount = 0;
  let pendingCount = 0;
  let rejectedCount = 0;

  reportData.transactions.forEach(t => {
    if (t.status === 'verified') verifiedCount++;
    else if (t.status === 'pending') pendingCount++;
    else if (t.status === 'rejected') rejectedCount++;
  });

  const total = verifiedCount + pendingCount + rejectedCount;

  if (total === 0) {
    container.innerHTML = `<div class="empty-state-text" style="color: #94A3B8; padding: 2rem;">No transaction status entries found.</div>`;
    return;
  }

  const verPct = (verifiedCount / total) * 100;
  const pendPct = (pendingCount / total) * 100;
  const rejPct = (rejectedCount / total) * 100;

  // Update Legend Labels & Badges
  const legVer = document.getElementById('leg-status-verified');
  const legPend = document.getElementById('leg-status-pending');
  const legRej = document.getElementById('leg-status-rejected');

  if (legVer) legVer.textContent = `${verifiedCount} (${verPct.toFixed(0)}%)`;
  if (legPend) legPend.textContent = `${pendingCount} (${pendPct.toFixed(0)}%)`;
  if (legRej) legRej.textContent = `${rejectedCount} (${rejPct.toFixed(0)}%)`;

  // SVG Circular Donut Math
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const verOffset = circumference - (verPct / 100) * circumference;
  const pendLength = (pendPct / 100) * circumference;
  const rejLength = (rejPct / 100) * circumference;

  let svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg); overflow: visible;">
      <!-- Base Background Circle -->
      <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="#F1F5F9" stroke-width="${strokeWidth}" />

      <!-- Verified Segment (Emerald) -->
      <circle class="donut-slice" cx="${size/2}" cy="${size/2}" r="${radius}" fill="none"
              stroke="#10B981" stroke-width="${strokeWidth}"
              stroke-dasharray="${circumference}" stroke-dashoffset="${verOffset}"
              data-label="Verified Contributions" data-count="${verifiedCount}" data-pct="${verPct.toFixed(1)}%" />

      <!-- Pending Segment (Amber) -->
      <circle class="donut-slice" cx="${size/2}" cy="${size/2}" r="${radius}" fill="none"
              stroke="#F59E0B" stroke-width="${strokeWidth}"
              stroke-dasharray="${pendLength} ${circumference}"
              stroke-dashoffset="-${(verPct / 100) * circumference}"
              data-label="Pending Review Slips" data-count="${pendingCount}" data-pct="${pendPct.toFixed(1)}%" />

      <!-- Rejected Segment (Red) -->
      <circle class="donut-slice" cx="${size/2}" cy="${size/2}" r="${radius}" fill="none"
              stroke="#DC2626" stroke-width="${strokeWidth}"
              stroke-dasharray="${rejLength} ${circumference}"
              stroke-dashoffset="-${((verPct + pendPct) / 100) * circumference}"
              data-label="Rejected / Discrepancy Slips" data-count="${rejectedCount}" data-pct="${rejPct.toFixed(1)}%" />
    </svg>

    <!-- Center Label -->
    <div style="position: absolute; text-align: center; pointer-events: none;">
      <div style="font-size: 1.45rem; font-weight: 800; color: #0B1220; line-height: 1;">${total}</div>
      <div style="font-size: 0.6875rem; text-transform: uppercase; color: #64748B; font-weight: 700; margin-top: 0.15rem;">Submissions</div>
    </div>
  `;

  container.innerHTML = svg;

  // Tooltip interaction
  const slices = container.querySelectorAll('.donut-slice');
  slices.forEach(slice => {
    slice.addEventListener('mouseenter', (e) => {
      const label = slice.getAttribute('data-label');
      const count = slice.getAttribute('data-count');
      const pct = slice.getAttribute('data-pct');

      tooltip.innerHTML = `<strong>${label}</strong><br>${count} transactions (${pct})`;
      tooltip.style.left = '50%';
      tooltip.style.top = '10px';
      tooltip.style.display = 'block';
    });

    slice.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
}

/**
 * ============================================================================
 * SECTION 4: MEMBER REPORT TABLE
 * ============================================================================
 */
function renderMemberReportTable(members) {
  const tableBody = document.getElementById('rep-member-table-body');
  const emptyState = document.getElementById('rep-member-empty-state');
  if (!tableBody) return;

  tableBody.innerHTML = '';

  if (!members || members.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  members.forEach(mem => {
    const outstanding = Math.max(0, mem.expectedDues - mem.verifiedDues);
    const completionPct = mem.expectedDues > 0 
      ? Math.round((mem.verifiedDues / mem.expectedDues) * 100) 
      : 100;

    const tr = document.createElement('tr');

    let overdueBadge = `<span class="badge-completion badge-ontime">✓ 0 Overdue</span>`;
    if (mem.overdueCount > 0) {
      overdueBadge = `<span class="badge-completion badge-overdue">⚠ ${mem.overdueCount} Overdue</span>`;
    }

    tr.innerHTML = `
      <td>
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <span class="member-avatar-sm" aria-hidden="true">${mem.avatar}</span>
          <div>
            <div style="font-weight: 700; color: #0B1220;">${mem.name}</div>
            <div style="font-size: 0.75rem; color: #64748B;">${mem.group}</div>
          </div>
        </div>
      </td>
      <td class="tabular-nums" style="font-weight: 600;">${formatNaira(mem.expectedDues)}</td>
      <td class="tabular-nums" style="font-weight: 700; color: #065F46;">${formatNaira(mem.verifiedDues)}</td>
      <td class="tabular-nums" style="font-weight: 700; color: ${outstanding > 0 ? '#DC2626' : '#64748B'};">
        ${formatNaira(outstanding)}
      </td>
      <td>
        <div class="member-progress-wrap">
          <div class="member-progress-track">
            <div class="member-progress-fill" style="width: ${completionPct}%;"></div>
          </div>
          <span class="tabular-nums" style="font-size: 0.75rem; font-weight: 700;">${completionPct}%</span>
        </div>
      </td>
      <td>
        ${overdueBadge}
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

/**
 * ============================================================================
 * SECTION 5: GROUP REPORT TABLE
 * ============================================================================
 */
function renderGroupReportTable(reportData) {
  const container = document.getElementById('rep-group-table-body');
  if (!container) return;

  container.innerHTML = '';

  const groups = reportBaseData.groups.filter(g => 
    reportData.filters.group === 'all' || g.name === reportData.filters.group
  );

  groups.forEach(grp => {
    // Find members belonging to this group in the filtered report
    const grpMembers = reportData.members.filter(m => m.group === grp.name);
    const memberCount = grpMembers.length;

    let grpExpected = 0;
    let grpVerified = 0;

    grpMembers.forEach(m => {
      grpExpected += m.expectedDues;
      grpVerified += m.verifiedDues;
    });

    const grpOutstanding = Math.max(0, grpExpected - grpVerified);
    const rate = grpExpected > 0 ? ((grpVerified / grpExpected) * 100).toFixed(1) : '100.0';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="font-weight: 700; color: #0B1220;">${grp.name}</div>
        <div style="font-size: 0.75rem; color: #64748B;">Frequency: ${grp.type} (Rate: ${formatNaira(grp.rate)})</div>
      </td>
      <td class="tabular-nums" style="font-weight: 600;">${memberCount} Members</td>
      <td class="tabular-nums" style="font-weight: 600;">${formatNaira(grpExpected)}</td>
      <td class="tabular-nums" style="font-weight: 700; color: #065F46;">${formatNaira(grpVerified)}</td>
      <td class="tabular-nums" style="font-weight: 700; color: ${grpOutstanding > 0 ? '#DC2626' : '#64748B'};">
        ${formatNaira(grpOutstanding)}
      </td>
      <td>
        <div class="member-progress-wrap">
          <div class="member-progress-track">
            <div class="member-progress-fill" style="width: ${rate}%;"></div>
          </div>
          <span class="tabular-nums" style="font-size: 0.75rem; font-weight: 700;">${rate}%</span>
        </div>
      </td>
    `;

    container.appendChild(tr);
  });
}

/**
 * ============================================================================
 * SECTION 6: EXPORT OPTIONS & ACTIONS
 * ============================================================================
 */
function initExportControls() {
  const csvBtn = document.getElementById('btn-export-csv');
  const printBtn = document.getElementById('btn-print-report');
  const pdfPlaceholderBtn = document.getElementById('btn-download-pdf-placeholder');

  // 1. Export CSV
  if (csvBtn) {
    csvBtn.addEventListener('click', () => {
      if (!currentReportResult) return;

      let csv = "Member_Name,Circle_Group,Expected_Amount_NGN,Verified_Amount_NGN,Outstanding_Amount_NGN,Overdue_Cycles\r\n";

      currentReportResult.members.forEach(m => {
        const out = Math.max(0, m.expectedDues - m.verifiedDues);
        const cleanName = `"${m.name.replace(/"/g, '""')}"`;
        const cleanGroup = `"${m.group.replace(/"/g, '""')}"`;
        csv += `${cleanName},${cleanGroup},${m.expectedDues},${m.verifiedDues},${out},${m.overdueCount}\r\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `ContriTrack_Audit_Report_${activeFilters.startDate}_to_${activeFilters.endDate}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showReportsToast(
        'CSV Export Complete',
        `Verifiable statement downloaded: ${filename}. Contains ${currentReportResult.members.length} member audit records.`,
        'success'
      );
    });
  }

  // 2. Print Report
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      showReportsToast('Preparing Print Statement', 'Opening print preview dialog with executive formatting.', 'info');
      setTimeout(() => {
        window.print();
      }, 350);
    });
  }

  // 3. Download PDF Placeholder (Explicitly labeled as placeholder)
  if (pdfPlaceholderBtn) {
    pdfPlaceholderBtn.addEventListener('click', () => {
      showReportsToast(
        'PDF Export (Demo Placeholder)',
        'Server-side signed PDF generation will be handled by Django (WeasyPrint / ReportLab) upon production deployment. Please use "Print Report" or "Export CSV" for current records.',
        'warning'
      );
    });
  }
}

/**
 * ============================================================================
 * MOBILE SIDEBAR TOGGLE
 * ============================================================================
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
 * ============================================================================
 * TOAST UTILITY (Avoid window.alert)
 * ============================================================================
 */
function showReportsToast(title, message, type = 'success') {
  let container = document.getElementById('reports-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'reports-toast-container';
    container.className = 'admin-toast-container';
    document.body.appendChild(container);
  }

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
  } else if (type === 'info') {
    iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #0284C7;">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
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

  toast.querySelector('.toast-close-btn').addEventListener('click', () => toast.remove());
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 250);
    }
  }, 4500);
}

/**
 * ============================================================================
 * BACKEND PREPARATION: MODULAR DJANGO API INTERFACES
 * ============================================================================
 * In production with Django REST Framework:
 * - GET /api/v1/reports/financial/?start=...&end=...&group=...&status=...
 * - GET /api/v1/reports/export/csv/?...
 * - POST /api/v1/reports/export/pdf/?...
 */
async function fetchServerReportData(filters) {
  // Simulated asynchronous network latency
  await new Promise(resolve => setTimeout(resolve, 350));
  return {
    success: true,
    data: currentReportResult
  };
}

async function requestServerPdfGeneration(filters) {
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    success: false,
    message: 'PDF service endpoint is staged for Django celery worker deployment.'
  };
}
