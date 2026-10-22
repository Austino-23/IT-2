/**
 * ContriTrack — Contribution Schedule Client Script (js/schedule.js)
 * Vanilla JavaScript implementation for:
 * - Dynamic Monthly Calendar Navigation (Prev, Next, Today)
 * - Accessible Status Badges (Paid, Upcoming, Overdue, Rest Days)
 * - Monthly Schedule Summary Totals Calculation (Expected, Verified, Upcoming, Overdue)
 * - Upcoming Payments List with direct link to contributions.html
 * - Interactive Date Details Modal with Escape key support
 * - Dynamic Month-based Empty State handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initScheduleApp();
});

/**
 * Structured Demo Schedule Dataset (Indexed by 'YYYY-MM-DD')
 * Clearly identified as demonstration data.
 * Notice: Not every day is a contribution day (Sundays are designated rest days).
 */
const demoScheduleData = {
  // October 2026 (Active Month)
  '2026-10-01': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 1 opening cycle dues.' },
  '2026-10-02': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 2 contribution.' },
  '2026-10-03': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 3 contribution.' },
  '2026-10-04': { group: 'Alpha Thrift Syndicate', amount: 0, status: 'rest', note: 'Sunday: Circle reconciliation & rest day.' },
  '2026-10-05': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 5 contribution.' },
  '2026-10-06': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 6 contribution.' },
  '2026-10-07': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 7 contribution.' },
  '2026-10-08': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 8 contribution.' },
  '2026-10-09': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 9 contribution.' },
  '2026-10-10': { group: 'Weekly Tech Syndicate', amount: 20000, status: 'overdue', note: 'Overdue: Flagged cash slip pending review.' },
  '2026-10-11': { group: 'Alpha Thrift Syndicate', amount: 0, status: 'rest', note: 'Sunday: Circle reconciliation & rest day.' },
  '2026-10-12': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 12 contribution.' },
  '2026-10-13': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 13 contribution.' },
  '2026-10-14': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 14 contribution.' },
  '2026-10-15': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 15 contribution.' },
  '2026-10-16': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 16 contribution.' },
  '2026-10-17': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 17 contribution.' },
  '2026-10-18': { group: 'Alpha Thrift Syndicate', amount: 0, status: 'rest', note: 'Sunday: Circle reconciliation & rest day.' },
  '2026-10-19': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Day 19 contribution.' },
  '2026-10-20': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'paid', note: 'Today: Day 20 contribution deposited.' },
  '2026-10-21': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Tomorrow: Day 21 contribution deadline 11:59 PM.' },
  '2026-10-22': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Day 22 contribution.' },
  '2026-10-23': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Day 23 contribution.' },
  '2026-10-24': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Day 24 contribution.' },
  '2026-10-25': { group: 'Alpha Thrift Syndicate', amount: 0, status: 'rest', note: 'Sunday: Circle reconciliation & rest day.' },
  '2026-10-26': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Day 26 contribution.' },
  '2026-10-27': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Day 27 contribution.' },
  '2026-10-28': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Day 28 contribution.' },
  '2026-10-29': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Day 29 contribution.' },
  '2026-10-30': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Day 30 contribution.' },
  '2026-10-31': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Cycle #4 final day contribution.' },

  // November 2026 (Preview Schedule)
  '2026-11-01': { group: 'Alpha Thrift Syndicate', amount: 0, status: 'rest', note: 'Sunday: Rest & new cycle setup.' },
  '2026-11-02': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Cycle #5 Day 1.' },
  '2026-11-03': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Cycle #5 Day 2.' },
  '2026-11-04': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Cycle #5 Day 3.' },
  '2026-11-05': { group: 'Alpha Thrift Syndicate', amount: 15000, status: 'upcoming', note: 'Cycle #5 Day 4.' }
};

// Current display date anchor: October 2026 (matches system date 2026-10-20)
let currentYear = 2026;
let currentMonth = 9; // 0-indexed (9 = October)
const systemTodayStr = '2026-10-20';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Main App Controller
 */
function initScheduleApp() {
  initCalendarNavControls();
  initDateModal();
  renderCalendarAndSummary();
  renderUpcomingPaymentsList();
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
 * 1. Calendar Navigation & Month Switching
 */
function initCalendarNavControls() {
  const prevBtn = document.getElementById('cal-prev-month');
  const nextBtn = document.getElementById('cal-next-month');
  const todayBtn = document.getElementById('cal-today-jump');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendarAndSummary();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendarAndSummary();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      currentYear = 2026;
      currentMonth = 9; // October
      renderCalendarAndSummary();
    });
  }
}

/**
 * 2. Render Calendar Grid & Recalculate Monthly Summary Cards
 */
function renderCalendarAndSummary() {
  const monthDisplayEl = document.getElementById('cal-current-month-text');
  const daysGrid = document.getElementById('cal-days-grid');
  const emptyStateEl = document.getElementById('cal-empty-state');

  if (monthDisplayEl) {
    monthDisplayEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
  }

  if (!daysGrid) return;
  daysGrid.innerHTML = '';

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();

  let expectedMonthTotal = 0;
  let verifiedMonthTotal = 0;
  let upcomingMonthTotal = 0;
  let upcomingCount = 0;
  let overdueMonthTotal = 0;
  let overdueCount = 0;
  let hasAnyContributionsThisMonth = false;

  // 1. Render Preceding Month Padding Days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthTotalDays - i;
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell other-month';
    cell.innerHTML = `
      <div class="cal-day-top">
        <span class="cal-day-num">${dayNum}</span>
      </div>
    `;
    daysGrid.appendChild(cell);
  }

  // 2. Render Current Month Days
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dateKey = `${currentYear}-${monthStr}-${dayStr}`;

    const item = demoScheduleData[dateKey];
    const isToday = dateKey === systemTodayStr;

    const cell = document.createElement('div');
    cell.className = `cal-day-cell ${isToday ? 'is-today' : ''} ${item ? 'has-contribution' : ''}`;
    cell.setAttribute('tabindex', item ? '0' : '-1');

    let badgeHtml = '';

    if (item) {
      if (item.status === 'paid') {
        expectedMonthTotal += item.amount;
        verifiedMonthTotal += item.amount;
        hasAnyContributionsThisMonth = true;
        badgeHtml = `<span class="cal-status-badge paid" title="Paid and verified">✓ ${formatK(item.amount)} Paid</span>`;
      } else if (item.status === 'upcoming') {
        expectedMonthTotal += item.amount;
        upcomingMonthTotal += item.amount;
        upcomingCount++;
        hasAnyContributionsThisMonth = true;
        badgeHtml = `<span class="cal-status-badge upcoming" title="Upcoming deadline">⏳ ${formatK(item.amount)} Due</span>`;
      } else if (item.status === 'overdue') {
        expectedMonthTotal += item.amount;
        overdueMonthTotal += item.amount;
        overdueCount++;
        hasAnyContributionsThisMonth = true;
        badgeHtml = `<span class="cal-status-badge overdue" title="Overdue contribution">⚠ ${formatK(item.amount)} Overdue</span>`;
      } else if (item.status === 'rest') {
        badgeHtml = `<span class="cal-status-badge rest" title="Rest Day: No contribution scheduled">— Rest Day</span>`;
      }
    }

    cell.innerHTML = `
      <div class="cal-day-top">
        <span class="cal-day-num">${day}</span>
        ${isToday ? '<span style="font-size: 0.65rem; color: #065F46; font-weight: 800; background: #D1FAE5; padding: 1px 4px; border-radius: 3px;">TODAY</span>' : ''}
      </div>
      <div>
        ${badgeHtml}
      </div>
    `;

    // Click handler for date details
    if (item) {
      cell.addEventListener('click', () => {
        openDateDetailsModal(dateKey, item);
      });

      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDateDetailsModal(dateKey, item);
        }
      });
    }

    daysGrid.appendChild(cell);
  }

  // 3. Render Trailing Month Padding Days (fill 35 or 42 grid cells)
  const totalRendered = firstDayIndex + totalDaysInMonth;
  const trailingCount = (totalRendered <= 35 ? 35 : 42) - totalRendered;

  for (let d = 1; d <= trailingCount; d++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell other-month';
    cell.innerHTML = `
      <div class="cal-day-top">
        <span class="cal-day-num">${d}</span>
      </div>
    `;
    daysGrid.appendChild(cell);
  }

  // Handle empty state banner if no contributions in month
  if (emptyStateEl) {
    emptyStateEl.style.display = hasAnyContributionsThisMonth ? 'none' : 'block';
  }

  // Update Summary Cards for the active month
  updateSummaryCards(expectedMonthTotal, verifiedMonthTotal, upcomingMonthTotal, upcomingCount, overdueMonthTotal, overdueCount);
}

/**
 * Format thousands shorthand (e.g. ₦15k)
 */
function formatK(num) {
  if (num >= 1000) {
    return '₦' + (num / 1000) + 'k';
  }
  return '₦' + num;
}

/**
 * 3. Update Schedule Summary Cards
 */
function updateSummaryCards(expected, verified, upcoming, upcomingCount, overdue, overdueCount) {
  const expectedEl = document.getElementById('sum-expected-month');
  const verifiedEl = document.getElementById('sum-verified-month');
  const upcomingEl = document.getElementById('sum-upcoming-month');
  const overdueEl = document.getElementById('sum-overdue-month');

  const verifiedMetaEl = document.getElementById('sum-verified-meta');
  const upcomingMetaEl = document.getElementById('sum-upcoming-meta');
  const overdueMetaEl = document.getElementById('sum-overdue-meta');

  if (expectedEl) expectedEl.textContent = formatNaira(expected);
  if (verifiedEl) verifiedEl.textContent = formatNaira(verified);
  if (upcomingEl) upcomingEl.textContent = formatNaira(upcoming);
  if (overdueEl) overdueEl.textContent = formatNaira(overdue);

  const percentVerified = expected > 0 ? Math.round((verified / expected) * 100) : 0;
  if (verifiedMetaEl) verifiedMetaEl.textContent = `${percentVerified}% cycle target completed`;
  if (upcomingMetaEl) upcomingMetaEl.textContent = `${upcomingCount} deadlines remaining`;
  if (overdueMetaEl) overdueMetaEl.textContent = `${overdueCount} missed contributions flagged`;
}

/**
 * 4. Render Upcoming Payments List
 */
function renderUpcomingPaymentsList() {
  const container = document.getElementById('upcoming-payments-list');
  const emptyUpcoming = document.getElementById('upcoming-empty-state');
  if (!container) return;

  container.innerHTML = '';

  // Filter items in demoScheduleData from today (2026-10-20) onwards with status 'upcoming' or 'overdue'
  const upcomingKeys = Object.keys(demoScheduleData)
    .filter(k => k >= systemTodayStr && (demoScheduleData[k].status === 'upcoming' || demoScheduleData[k].status === 'overdue'))
    .sort()
    .slice(0, 5); // Show next 5 upcoming

  if (upcomingKeys.length === 0) {
    if (emptyUpcoming) emptyUpcoming.style.display = 'block';
    return;
  }

  if (emptyUpcoming) emptyUpcoming.style.display = 'none';

  upcomingKeys.forEach(key => {
    const item = demoScheduleData[key];
    const dateObj = new Date(key + 'T00:00:00');
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    let isTomorrow = key === '2026-10-21';
    let label = isTomorrow ? 'Tomorrow' : `${dayName}, ${monthDay}`;

    const div = document.createElement('div');
    div.className = 'upcoming-item';

    div.innerHTML = `
      <div class="upcoming-date-box">
        <span class="upcoming-day-text">${label}</span>
        <span class="upcoming-sub-date tabular-nums">${key}</span>
      </div>

      <div class="upcoming-info">
        <div class="upcoming-group">${item.group}</div>
        <div class="upcoming-amount tabular-nums">${formatNaira(item.amount)}</div>
      </div>

      <div class="upcoming-actions">
        <span class="badge-status ${item.status === 'overdue' ? 'status-rejected' : 'status-pending'}" style="font-size: 0.725rem;">
          ${item.status === 'overdue' ? '⚠ Overdue' : '⏳ Due by 11:59 PM'}
        </span>
        <div style="display: flex; gap: 0.4rem;">
          <button type="button" class="btn btn-outline btn-sm btn-view-date-detail" data-date="${key}" style="font-size: 0.75rem; padding: 0.25rem 0.55rem;">
            Details
          </button>
          <a href="contributions.html" class="btn btn-primary btn-sm" style="font-size: 0.75rem; padding: 0.25rem 0.55rem;">
            Pay Now
          </a>
        </div>
      </div>
    `;

    container.appendChild(div);
  });

  // Attach detail triggers
  const detailButtons = container.querySelectorAll('.btn-view-date-detail');
  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dateKey = btn.getAttribute('data-date');
      const item = demoScheduleData[dateKey];
      if (item) openDateDetailsModal(dateKey, item);
    });
  });
}

/**
 * 5. Interactive Date Details Modal Logic
 */
function initDateModal() {
  const modal = document.getElementById('date-details-modal');
  const closeBtn = document.getElementById('modal-date-close');
  const dismissBtn = document.getElementById('modal-date-dismiss');

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
  });
}

function openDateDetailsModal(dateKey, item) {
  const modal = document.getElementById('date-details-modal');
  if (!modal) return;

  const dateObj = new Date(dateKey + 'T00:00:00');
  const fullDateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  document.getElementById('modal-schedule-date').textContent = fullDateStr;
  document.getElementById('modal-schedule-group').textContent = item.group;
  document.getElementById('modal-schedule-amount').textContent = item.status === 'rest' ? '₦0.00 (Rest Day)' : formatNaira(item.amount);
  document.getElementById('modal-schedule-notes').textContent = item.note || 'Regular scheduled contribution.';

  const statusBadge = document.getElementById('modal-schedule-status');
  const payBtn = document.getElementById('modal-schedule-pay-btn');

  if (statusBadge) {
    if (item.status === 'paid') {
      statusBadge.className = 'badge-status status-verified';
      statusBadge.textContent = '✓ Verified & Credited';
      if (payBtn) payBtn.style.display = 'none';
    } else if (item.status === 'upcoming') {
      statusBadge.className = 'badge-status status-pending';
      statusBadge.textContent = '⏳ Upcoming Deadline (Due by 11:59 PM)';
      if (payBtn) payBtn.style.display = 'inline-flex';
    } else if (item.status === 'overdue') {
      statusBadge.className = 'badge-status status-rejected';
      statusBadge.textContent = '⚠ Overdue — Immediate Action Required';
      if (payBtn) payBtn.style.display = 'inline-flex';
    } else {
      statusBadge.className = 'badge-status';
      statusBadge.style.backgroundColor = '#F1F5F9';
      statusBadge.style.color = '#64748B';
      statusBadge.textContent = '— Rest / Reconciliation Day';
      if (payBtn) payBtn.style.display = 'none';
    }
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
