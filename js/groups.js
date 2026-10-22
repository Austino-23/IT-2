/**
 * ContriTrack — Groups & Members Management Script (js/groups.js)
 * Vanilla JavaScript implementation for:
 * - Group Overview Summary Statistics (Joined, Managed, Total Members)
 * - Searchable & Filterable Group Cards
 * - Create Group Modal with comprehensive validation
 * - Detailed Group Inspector with Member Roster
 * - Strict Frontend Permissions Enforcing (Admin vs Ordinary Member capabilities)
 * - Simulated Role Switcher with explicit demo disclosures
 * - Modular Django API preparation functions
 */

document.addEventListener('DOMContentLoaded', () => {
  initGroupsApp();
});

/**
 * Current Simulated User Profile & Permissions State
 * Note: Explicitly identified as frontend demonstration. Real authorization is server-side in Django.
 */
let currentUser = {
  id: 'usr-sarah',
  name: 'Sarah Jenkins',
  avatar: 'SJ',
  role: 'admin' // 'admin' or 'member'
};

/**
 * Initial Groups Dataset (Session-scoped in-memory state)
 */
let groupsData = [
  {
    id: 'grp-01',
    name: 'Alpha Thrift Syndicate · Cycle #4',
    description: 'Daily rotating savings circle for verified business owners and tech professionals. Automated daily payouts and verified deposit tracking.',
    adminId: 'usr-sarah',
    adminName: 'Sarah Jenkins',
    amount: 15000,
    frequency: 'Daily',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    maxMembers: 12,
    currentMembersCount: 12,
    status: 'Active',
    gracePeriod: '24 Hours',
    totalPool: 4500000,
    progressPercent: 83,
    members: [
      { id: 'm-01', name: 'Sarah Jenkins', avatar: 'SJ', joinDate: '2026-10-01', paidDays: 20, totalDays: 20, status: 'Active', role: 'Admin' },
      { id: 'm-02', name: 'Marcus Vance', avatar: 'MV', joinDate: '2026-10-01', paidDays: 20, totalDays: 20, status: 'Active', role: 'Member' },
      { id: 'm-03', name: 'Elena Rostova', avatar: 'ER', joinDate: '2026-10-01', paidDays: 19, totalDays: 20, status: 'Active', role: 'Member' },
      { id: 'm-04', name: 'David Okafor', avatar: 'DO', joinDate: '2026-10-02', paidDays: 18, totalDays: 20, status: 'Active', role: 'Member' },
      { id: 'm-05', name: 'Amara Chen', avatar: 'AC', joinDate: '2026-10-02', paidDays: 20, totalDays: 20, status: 'Active', role: 'Member' },
      { id: 'm-06', name: 'Tariq Al-Mansoor', avatar: 'TA', joinDate: '2026-10-03', paidDays: 16, totalDays: 20, status: 'Pending Verification', role: 'Member' },
      { id: 'm-07', name: 'Kofi Mensah', avatar: 'KM', joinDate: '2026-10-03', paidDays: 20, totalDays: 20, status: 'Active', role: 'Member' },
      { id: 'm-08', name: 'Sophia Reyes', avatar: 'SR', joinDate: '2026-10-04', paidDays: 19, totalDays: 20, status: 'Active', role: 'Member' }
    ]
  },
  {
    id: 'grp-02',
    name: 'Family Home Builder Fund',
    description: 'Targeted cooperative building and renovation fund. Pooling capital for land acquisition, building materials, and emergency contractor reserves.',
    adminId: 'usr-marcus',
    adminName: 'Marcus Vance',
    amount: 30000,
    frequency: 'Weekly',
    startDate: '2026-09-15',
    endDate: '2026-12-15',
    maxMembers: 15,
    currentMembersCount: 8,
    status: 'Active',
    gracePeriod: '48 Hours',
    totalPool: 2880000,
    progressPercent: 64,
    members: [
      { id: 'm-11', name: 'Marcus Vance', avatar: 'MV', joinDate: '2026-09-15', paidDays: 5, totalDays: 5, status: 'Active', role: 'Admin' },
      { id: 'm-12', name: 'Sarah Jenkins', avatar: 'SJ', joinDate: '2026-09-16', paidDays: 5, totalDays: 5, status: 'Active', role: 'Member' },
      { id: 'm-13', name: 'Beatrice Jenkins', avatar: 'BJ', joinDate: '2026-09-18', paidDays: 4, totalDays: 5, status: 'Active', role: 'Member' },
      { id: 'm-14', name: 'Samuel Vance', avatar: 'SV', joinDate: '2026-09-20', paidDays: 5, totalDays: 5, status: 'Active', role: 'Member' }
    ]
  },
  {
    id: 'grp-03',
    name: 'Weekly Tech Syndicate',
    description: 'Mutual developer and engineer gadget acquisition and emergency reserve thrift circle with weekend rotational distributions.',
    adminId: 'usr-kofi',
    adminName: 'Kofi Mensah',
    amount: 20000,
    frequency: 'Weekly',
    startDate: '2026-10-10',
    endDate: '2027-01-10',
    maxMembers: 10,
    currentMembersCount: 6,
    status: 'Active',
    gracePeriod: '24 Hours',
    totalPool: 960000,
    progressPercent: 35,
    members: [
      { id: 'm-21', name: 'Kofi Mensah', avatar: 'KM', joinDate: '2026-10-10', paidDays: 2, totalDays: 2, status: 'Active', role: 'Admin' },
      { id: 'm-22', name: 'David Okafor', avatar: 'DO', joinDate: '2026-10-11', paidDays: 1, totalDays: 2, status: 'Active', role: 'Member' },
      { id: 'm-23', name: 'Liam K. Zhang', avatar: 'LZ', joinDate: '2026-10-12', paidDays: 2, totalDays: 2, status: 'Active', role: 'Member' }
    ]
  },
  {
    id: 'grp-04',
    name: 'Lagos Agri-Cooperative Circle',
    description: 'Seasonal grain harvest and fertilizer pooled purchasing cooperative. In formation for next agricultural harvest quarter.',
    adminId: 'usr-fatima',
    adminName: 'Fatima Bello',
    amount: 25000,
    frequency: 'Weekly',
    startDate: '2026-11-01',
    endDate: '2027-02-28',
    maxMembers: 20,
    currentMembersCount: 4,
    status: 'In Formation',
    gracePeriod: 'None',
    totalPool: 100000,
    progressPercent: 10,
    members: [
      { id: 'm-31', name: 'Fatima Bello', avatar: 'FB', joinDate: '2026-10-15', paidDays: 0, totalDays: 0, status: 'Active', role: 'Admin' },
      { id: 'm-32', name: 'Amara Chen', avatar: 'AC', joinDate: '2026-10-16', paidDays: 0, totalDays: 0, status: 'Active', role: 'Member' }
    ]
  }
];

let selectedGroupId = null;

/**
 * Main Initialization
 */
function initGroupsApp() {
  initRoleSwitcher();
  initCreateGroupModal();
  initSearchAndFilters();
  refreshOverviewStats();
  renderGroupCards();

  // Set default dates in create modal
  const startInput = document.getElementById('new-group-start');
  const endInput = document.getElementById('new-group-end');
  if (startInput && endInput) {
    const today = new Date().toISOString().split('T')[0];
    startInput.value = today;
    // Default 30 days cycle
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    endInput.value = nextMonth.toISOString().split('T')[0];
  }
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
 * 1. Demo Role Switcher
 */
function initRoleSwitcher() {
  const roleSelect = document.getElementById('demo-role-select');
  const roleIndicator = document.getElementById('demo-role-name-display');

  if (!roleSelect) return;

  roleSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'admin') {
      currentUser = {
        id: 'usr-sarah',
        name: 'Sarah Jenkins',
        avatar: 'SJ',
        role: 'admin'
      };
      if (roleIndicator) roleIndicator.textContent = 'Sarah Jenkins (Group Administrator)';
    } else {
      currentUser = {
        id: 'usr-david',
        name: 'David Okafor',
        avatar: 'DO',
        role: 'member'
      };
      if (roleIndicator) roleIndicator.textContent = 'David Okafor (Ordinary Circle Member)';
    }

    refreshOverviewStats();
    renderGroupCards();
    if (selectedGroupId) {
      renderGroupDetails(selectedGroupId);
    }
  });
}

/**
 * 2. Section 1: Refresh Overview Statistics
 */
function refreshOverviewStats() {
  const joinedEl = document.getElementById('stat-groups-joined');
  const managedEl = document.getElementById('stat-groups-managed');
  const totalMembersEl = document.getElementById('stat-total-managed-members');

  let joinedCount = 0;
  let managedCount = 0;
  let totalManagedMembers = 0;

  groupsData.forEach(grp => {
    const isUserMember = grp.members.some(m => m.name === currentUser.name);
    const isUserAdmin = grp.adminName === currentUser.name;

    if (isUserMember) joinedCount++;
    if (isUserAdmin) {
      managedCount++;
      totalManagedMembers += grp.members.length;
    }
  });

  if (joinedEl) joinedEl.textContent = joinedCount;
  if (managedEl) managedEl.textContent = managedCount;
  if (totalMembersEl) totalMembersEl.textContent = totalManagedMembers;
}

/**
 * 3. Section 2: Render Group Cards with Filters
 */
function initSearchAndFilters() {
  const searchInput = document.getElementById('groups-search-input');
  const filterSelect = document.getElementById('groups-filter-select');

  if (searchInput) {
    searchInput.addEventListener('input', () => renderGroupCards());
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', () => renderGroupCards());
  }

  // Back button from details view
  const backBtn = document.getElementById('btn-back-to-groups');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      document.getElementById('section-group-details').classList.remove('active');
      document.getElementById('section-groups-list').style.display = 'block';
      selectedGroupId = null;
    });
  }
}

function renderGroupCards() {
  const container = document.getElementById('groups-cards-container');
  const emptyState = document.getElementById('groups-empty-state');
  const searchVal = document.getElementById('groups-search-input')?.value.toLowerCase().trim() || '';
  const filterVal = document.getElementById('groups-filter-select')?.value || 'all';

  if (!container) return;
  container.innerHTML = '';

  const filtered = groupsData.filter(grp => {
    // 1. Search text
    const matchesSearch = !searchVal ||
      grp.name.toLowerCase().includes(searchVal) ||
      grp.description.toLowerCase().includes(searchVal) ||
      grp.adminName.toLowerCase().includes(searchVal);

    // 2. Filter mode
    const isMember = grp.members.some(m => m.name === currentUser.name);
    const isAdmin = grp.adminName === currentUser.name;

    let matchesFilter = true;
    if (filterVal === 'joined') matchesFilter = isMember;
    else if (filterVal === 'managed') matchesFilter = isAdmin;

    return matchesSearch && matchesFilter;
  });

  if (filtered.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  filtered.forEach(grp => {
    const isMember = grp.members.some(m => m.name === currentUser.name);
    const isAdmin = grp.adminName === currentUser.name;

    let statusClass = 'status-verified';
    if (grp.status === 'In Formation') statusClass = 'status-pending';
    else if (grp.status === 'Completed') statusClass = 'status-rejected';

    let userRoleBadge = '';
    if (isAdmin) {
      userRoleBadge = `<span style="font-size: 0.7rem; font-weight: 700; color: #065F46; background: #D1FAE5; padding: 2px 6px; border-radius: 4px;">Coordinator</span>`;
    } else if (isMember) {
      userRoleBadge = `<span style="font-size: 0.7rem; font-weight: 700; color: #1E40AF; background: #DBEAFE; padding: 2px 6px; border-radius: 4px;">Member</span>`;
    }

    const card = document.createElement('article');
    card.className = 'group-card';

    card.innerHTML = `
      <div class="group-card-header">
        <div>
          <h3 class="group-card-title">${grp.name}</h3>
        </div>
        <div style="display: flex; gap: 0.4rem; align-items: center;">
          ${userRoleBadge}
          <span class="badge-status ${statusClass}" style="font-size: 0.725rem;">${grp.status}</span>
        </div>
      </div>

      <p class="group-card-desc">${grp.description}</p>

      <div class="group-meta-grid">
        <div class="meta-item">
          <span class="meta-label">Contribution</span>
          <span class="meta-val tabular-nums">${formatNaira(grp.amount)} / ${grp.frequency}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Roster Size</span>
          <span class="meta-val tabular-nums">${grp.members.length} / ${grp.maxMembers} Members</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Cycle Start</span>
          <span class="meta-val tabular-nums">${grp.startDate}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Cycle End</span>
          <span class="meta-val tabular-nums">${grp.endDate}</span>
        </div>
      </div>

      <div class="group-admin-row">
        <span>Administrator:</span>
        <span class="group-admin-name">${grp.adminName} ${isAdmin ? '(You)' : ''}</span>
      </div>

      <button type="button" class="btn btn-secondary btn-view-group" data-id="${grp.id}" style="width: 100%;">
        View Group Details &amp; Members &rarr;
      </button>
    `;

    container.appendChild(card);
  });

  // Attach click listener to "View Group" buttons
  const viewBtns = container.querySelectorAll('.btn-view-group');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openGroupDetails(id);
    });
  });
}

/**
 * 4. Section 4 & 5: Group Details Inspector & Member Roster
 */
function openGroupDetails(groupId) {
  selectedGroupId = groupId;
  document.getElementById('section-groups-list').style.display = 'none';
  const detailsSection = document.getElementById('section-group-details');
  detailsSection.classList.add('active');
  detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  renderGroupDetails(groupId);
}

function renderGroupDetails(groupId) {
  const grp = groupsData.find(g => g.id === groupId);
  if (!grp) return;

  const isMember = grp.members.some(m => m.name === currentUser.name);
  const isAdmin = grp.adminName === currentUser.name;

  // Header Details
  document.getElementById('dtl-group-name').textContent = grp.name;
  document.getElementById('dtl-group-desc').textContent = grp.description;
  document.getElementById('dtl-group-admin').textContent = grp.adminName + (isAdmin ? ' (You)' : '');
  document.getElementById('dtl-pool-amount').textContent = formatNaira(grp.totalPool);
  document.getElementById('dtl-member-count').textContent = `${grp.members.length} of ${grp.maxMembers}`;
  document.getElementById('dtl-progress-percent').textContent = `${grp.progressPercent}%`;
  document.getElementById('dtl-cycle-dates').textContent = `${grp.startDate} to ${grp.endDate}`;

  // Operating Rules Grid
  document.getElementById('rule-dtl-amount').textContent = `${formatNaira(grp.amount)} per ${grp.frequency.toLowerCase()}`;
  document.getElementById('rule-dtl-freq').textContent = grp.frequency;
  document.getElementById('rule-dtl-grace').textContent = grp.gracePeriod;
  document.getElementById('rule-dtl-status').textContent = grp.status;

  // Action Button depending on permissions
  const actionContainer = document.getElementById('dtl-action-container');
  if (actionContainer) {
    if (isAdmin) {
      actionContainer.innerHTML = `
        <button type="button" class="btn btn-primary" id="btn-manage-group-settings">
          ⚙ Manage Group Rules &amp; Roster
        </button>
      `;
      document.getElementById('btn-manage-group-settings')?.addEventListener('click', () => {
        alert(`Demo Admin Action: Opening circle administrative controls for "${grp.name}". In a Django production deployment, this invokes group settings management.`);
      });
    } else if (isMember) {
      actionContainer.innerHTML = `
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge-status status-verified" style="font-size: 0.85rem; padding: 0.5rem 0.85rem;">
            ✓ Joined Member
          </span>
          <a href="contributions.html" class="btn btn-primary btn-sm">
            Make Deposit
          </a>
        </div>
      `;
    } else {
      actionContainer.innerHTML = `
        <button type="button" class="btn btn-primary" id="btn-join-group-action">
          + Join Savings Circle
        </button>
      `;
      document.getElementById('btn-join-group-action')?.addEventListener('click', () => {
        handleJoinGroupDemo(grp.id);
      });
    }
  }

  // Section 5: Render Member Roster Table
  renderMembersTable(grp, isAdmin);
}

function renderMembersTable(grp, isAdmin) {
  const tableBody = document.getElementById('members-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = '';

  grp.members.forEach(member => {
    const tr = document.createElement('tr');
    const isCurrentUser = member.name === currentUser.name;
    const progressPercent = member.totalDays > 0 ? Math.round((member.paidDays / member.totalDays) * 100) : 100;

    // Available Actions Column (Permissions Sensitive!)
    let actionHtml = '';
    if (isAdmin) {
      // Administrator Actions: Verify Dues, Flag Member
      if (member.status === 'Pending Verification') {
        actionHtml = `
          <button type="button" class="btn-verify-demo btn-admin-verify" data-member="${member.id}" title="Approve member pending dues">
            Verify Dues
          </button>
        `;
      } else {
        actionHtml = `
          <button type="button" class="btn-verify-demo btn-admin-flag" data-member="${member.id}" style="color: #64748B; border-color: #E2E8F0;" title="Flag attendance">
            Flag / Review
          </button>
        `;
      }
    } else {
      // Ordinary Member Actions: View Profile (Read-only status)
      actionHtml = `
        <span style="font-size: 0.775rem; color: #64748B;">
          ${isCurrentUser ? 'Your Record' : 'Active Member'}
        </span>
      `;
    }

    let statusBadgeClass = 'status-verified';
    if (member.status === 'Pending Verification') statusBadgeClass = 'status-pending';
    else if (member.status === 'Suspended') statusBadgeClass = 'status-rejected';

    tr.innerHTML = `
      <td>
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <span class="member-avatar-sm">${member.avatar}</span>
          <div>
            <div style="font-weight: 700; color: #0B1220;">
              ${member.name} ${isCurrentUser ? '<span style="font-size: 0.75rem; color: #10B981;">(You)</span>' : ''}
            </div>
            <div style="font-size: 0.75rem; color: #64748B;">Role: ${member.role}</div>
          </div>
        </div>
      </td>
      <td class="tabular-nums" style="font-size: 0.85rem; color: #64748B;">${member.joinDate}</td>
      <td>
        <div class="member-progress-wrap">
          <div class="member-progress-track">
            <div class="member-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <span class="tabular-nums" style="font-size: 0.75rem; font-weight: 700; color: #0B1220;">${member.paidDays}/${member.totalDays}</span>
        </div>
      </td>
      <td>
        <span class="badge-status ${statusBadgeClass}" style="font-size: 0.75rem;">
          ${member.status === 'Pending Verification' ? '⏳ Pending Dues' : '✓ Active'}
        </span>
      </td>
      <td>
        ${actionHtml}
      </td>
    `;

    tableBody.appendChild(tr);
  });

  // Attach Admin verify button click handlers
  if (isAdmin) {
    const verifyButtons = tableBody.querySelectorAll('.btn-admin-verify');
    verifyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const memberId = btn.getAttribute('data-member');
        const targetMember = grp.members.find(m => m.id === memberId);
        if (targetMember) {
          targetMember.status = 'Active';
          targetMember.paidDays = Math.min(targetMember.totalDays, targetMember.paidDays + 1);
          renderGroupDetails(grp.id);
          showGroupsToast('Dues Verified', `Dues payment recorded for ${targetMember.name}.`, 'success');
        }
      });
    });

    const flagButtons = tableBody.querySelectorAll('.btn-admin-flag');
    flagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const memberId = btn.getAttribute('data-member');
        const targetMember = grp.members.find(m => m.id === memberId);
        if (targetMember) {
          showGroupsToast('Member Flagged', `Flagged member "${targetMember.name}" for attendance review.`, 'warning');
        }
      });
    });
  }
}

/**
 * 5. Handle Join Group (Demo simulation)
 */
async function handleJoinGroupDemo(groupId) {
  const grp = groupsData.find(g => g.id === groupId);
  if (!grp) return;

  if (grp.members.length >= grp.maxMembers) {
    showGroupsToast('Circle Full', 'This contribution circle has reached maximum membership capacity.', 'warning');
    return;
  }

  // Simulated backend call
  const response = await joinGroup(groupId);

  if (response.success) {
    grp.members.push({
      id: 'm-' + Date.now(),
      name: currentUser.name,
      avatar: currentUser.avatar,
      joinDate: new Date().toISOString().split('T')[0],
      paidDays: 0,
      totalDays: 20,
      status: 'Active',
      role: 'Member'
    });

    refreshOverviewStats();
    renderGroupDetails(groupId);
    showGroupsToast('Joined Circle', `Successfully joined "${grp.name}"! Your membership record has been added to the circle roster.`, 'success');
  }
}

/**
 * 6. Section 3: Create a Group Modal & Form Logic
 */
function initCreateGroupModal() {
  const modal = document.getElementById('create-group-modal');
  const openBtn = document.getElementById('btn-open-create-group');
  const closeBtn = document.getElementById('modal-create-close');
  const cancelBtn = document.getElementById('modal-create-cancel');
  const form = document.getElementById('create-group-form');

  if (!modal || !openBtn) return;

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('new-group-name')?.focus();
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    clearFormErrors();
  };

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFormErrors();

      const nameInput = document.getElementById('new-group-name');
      const descInput = document.getElementById('new-group-desc');
      const amountInput = document.getElementById('new-group-amount');
      const freqSelect = document.getElementById('new-group-freq');
      const startInput = document.getElementById('new-group-start');
      const endInput = document.getElementById('new-group-end');
      const maxInput = document.getElementById('new-group-max');
      const graceSelect = document.getElementById('new-group-grace');
      const submitBtn = document.getElementById('btn-submit-create-group');

      const name = nameInput?.value.trim();
      const desc = descInput?.value.trim();
      const amount = parseFloat(amountInput?.value);
      const frequency = freqSelect?.value;
      const startDate = startInput?.value;
      const endDate = endInput?.value;
      const maxMembers = parseInt(maxInput?.value, 10);
      const gracePeriod = graceSelect?.value;

      let isValid = true;

      if (!name || name.length < 3) {
        showFieldError('err-new-group-name', 'Group name must be at least 3 characters.');
        isValid = false;
      }

      if (!desc || desc.length < 10) {
        showFieldError('err-new-group-desc', 'Please provide a clear description (at least 10 characters).');
        isValid = false;
      }

      if (isNaN(amount) || amount <= 0) {
        showFieldError('err-new-group-amount', 'Contribution amount must be greater than ₦0.');
        isValid = false;
      }

      if (!startDate) {
        showFieldError('err-new-group-start', 'Start date is required.');
        isValid = false;
      }

      if (!endDate) {
        showFieldError('err-new-group-end', 'End date is required.');
        isValid = false;
      } else if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
        showFieldError('err-new-group-end', 'End date must be after the start date.');
        isValid = false;
      }

      if (isNaN(maxMembers) || maxMembers < 2) {
        showFieldError('err-new-group-max', 'Maximum members must be at least 2.');
        isValid = false;
      }

      if (!isValid) return;

      // Submit
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Circle...';

      const payload = {
        name,
        description: desc,
        amount,
        frequency,
        startDate,
        endDate,
        maxMembers,
        gracePeriod
      };

      try {
        const response = await createGroup(payload);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Contribution Group';

        if (response.success) {
          // Prepend new demo group
          const newGroup = {
            id: 'grp-' + Date.now(),
            name: payload.name,
            description: payload.description,
            adminId: currentUser.id,
            adminName: currentUser.name,
            amount: payload.amount,
            frequency: payload.frequency,
            startDate: payload.startDate,
            endDate: payload.endDate,
            maxMembers: payload.maxMembers,
            currentMembersCount: 1,
            status: 'Active',
            gracePeriod: payload.gracePeriod,
            totalPool: 0,
            progressPercent: 0,
            members: [
              {
                id: 'm-' + Date.now(),
                name: currentUser.name,
                avatar: currentUser.avatar,
                joinDate: payload.startDate,
                paidDays: 0,
                totalDays: 30,
                status: 'Active',
                role: 'Admin'
              }
            ]
          };

          groupsData.unshift(newGroup);
          form.reset();
          closeModal();

          refreshOverviewStats();
          renderGroupCards();

          // Show confirmation
          showGroupsToast('Circle Created', `"${newGroup.name}" created successfully! You are designated as circle administrator.`, 'success');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Contribution Group';
        showGroupsToast('Creation Failed', 'Demo creation encountered an error.', 'warning');
      }
    });
  }
}

function showFieldError(errorId, msg) {
  const el = document.getElementById(errorId);
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

function clearFormErrors() {
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
}

/**
 * ==========================================================================
 * BACKEND PREPARATION: MODULAR DJANGO API INTERFACES
 * ==========================================================================
 * These clean async handlers model Django REST Framework endpoints:
 * - createGroup(data) -> POST /api/v1/groups/
 * - joinGroup(groupId) -> POST /api/v1/groups/<id>/join/
 * - updateMemberStatus(groupId, memberId, status) -> PATCH /api/v1/groups/<id>/members/<id>/
 */
async function createGroup(groupData) {
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    success: true,
    message: 'Group created successfully in demo memory.'
  };
}

async function joinGroup(groupId) {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    success: true,
    message: 'Member joined circle successfully.'
  };
}

async function updateMemberStatus(groupId, memberId, status) {
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    success: true,
    message: `Member status updated to ${status}.`
  };
}

function showGroupsToast(title, message, type = 'success') {
  let container = document.getElementById('groups-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'groups-toast-container';
    container.className = 'admin-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `admin-toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button type="button" class="toast-close-btn" aria-label="Dismiss toast">✕</button>
  `;

  toast.querySelector('.toast-close-btn').addEventListener('click', () => toast.remove());
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4500);
}

