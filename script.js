function resolveApiBaseUrl() {
    // Preferred: same origin when served by the Node app (http://localhost:3004)
    const origin = window.location.origin || '';
    if (origin && origin !== 'null' && !origin.startsWith('file:')) return origin;
    // Fallback: if user opens index.html directly, still point to local backend.
    return 'http://localhost:3004';
}

// API Configuration (same-origin so it works behind reverse proxies and deep links)
const API_BASE_URL = resolveApiBaseUrl();
const PAYPAL_DONATE_URL = 'https://www.paypal.com/donate/?hosted_button_id=VKR4HREY38HJU';
const STRIPE_DONATE_URL = 'https://donate.stripe.com/6oU28t1ND16I2V063H7kc04';

// UI state
const themeToggleBtn = document.getElementById('themeToggleBtn');
const logoutBtn = document.getElementById('logoutBtn');
const toastContainer = document.getElementById('toastContainer');
const apiStatusPill = document.getElementById('apiStatusPill');
const loginBtnText = document.getElementById('loginBtnText');
const loginBtnSpinner = document.getElementById('loginBtnSpinner');
const stickyDonateBtn = document.getElementById('stickyDonateBtn');
const whatsAppDonateLink = document.getElementById('whatsAppDonateLink');
const stripeMonthlyLink = document.getElementById('stripeMonthlyLink');
const donateOnceLink = document.getElementById('donateOnceLink');
const monthlySupportLink = document.getElementById('monthlySupportLink');

// QR toggle section
const qrOnceBtn = document.getElementById('qrOnceBtn');
const qrMonthlyBtn = document.getElementById('qrMonthlyBtn');
const donationQrImg = document.getElementById('donationQrImg');
const donateOnceCta = document.getElementById('donateOnceCta');
const monthlySupportCta = document.getElementById('monthlySupportCta');
const whatsAppShareBtn = document.getElementById('whatsAppShareBtn');

// Mobile menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

// DOM Elements
// -- Login Elements --
const loginSection = document.getElementById('login');
const roleSelect = document.getElementById('roleSelect');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');
const registerBtn = document.getElementById('registerBtn');
const forgotBtn = document.getElementById('forgotBtn');

// -- Register Modal Elements --
const registerModal = document.getElementById('registerModal');
const registerCloseBtn = document.getElementById('registerCloseBtn');
const registerCancelBtn = document.getElementById('registerCancelBtn');
const registerForm = document.getElementById('registerForm');
const registerRole = document.getElementById('registerRole');
const registerName = document.getElementById('registerName');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerMsg = document.getElementById('registerMsg');

// -- Reset Modal Elements --
const resetModal = document.getElementById('resetModal');
const resetCloseBtn = document.getElementById('resetCloseBtn');
const resetRequestForm = document.getElementById('resetRequestForm');
const resetConfirmForm = document.getElementById('resetConfirmForm');
const resetEmail = document.getElementById('resetEmail');
const resetTokenBox = document.getElementById('resetTokenBox');
const resetTokenValue = document.getElementById('resetTokenValue');
const resetTokenInput = document.getElementById('resetTokenInput');
const resetNewPassword = document.getElementById('resetNewPassword');
const resetMsg = document.getElementById('resetMsg');

// Donate section elements
const donationStatusBox = document.getElementById('donationStatusBox');
const donationStatusTitle = document.getElementById('donationStatusTitle');
const donationStatusText = document.getElementById('donationStatusText');
const paypalDonateLink = document.getElementById('paypalDonateLink');
const paypalQrImg = document.getElementById('paypalQrImg');
const stripeDonateLink = document.getElementById('stripeDonateLink');
const stripeQrImg = document.getElementById('stripeQrImg');

// -- Admin user provisioning elements --
const adminCreateUserForm = document.getElementById('adminCreateUserForm');
const adminUserRole = document.getElementById('adminUserRole');
const adminUserName = document.getElementById('adminUserName');
const adminUserEmail = document.getElementById('adminUserEmail');
const adminUserTempPassword = document.getElementById('adminUserTempPassword');
const adminCreateUserMsg = document.getElementById('adminCreateUserMsg');
const adminCreatedCreds = document.getElementById('adminCreatedCreds');
const adminCreatedEmail = document.getElementById('adminCreatedEmail');
const adminCreatedPassword = document.getElementById('adminCreatedPassword');

// -- Project Management Elements --
const projectForm = document.getElementById('projectForm');
const projectName = document.getElementById('projectName');
const projectDesc = document.getElementById('projectDesc');
const projectFunds = document.getElementById('projectFunds');
const projectCountry = document.getElementById('projectCountry');
const projectsList = document.getElementById('projectsList');

// -- Admin Dashboard Stats Elements --
const statTotalProjects = document.getElementById('statTotalProjects');
const statPendingProjects = document.getElementById('statPendingProjects');
const statActiveProjects = document.getElementById('statActiveProjects');
const statCompletedProjects = document.getElementById('statCompletedProjects');
const statTotalDonations = document.getElementById('statTotalDonations');

// -- Volunteer Elements --
const volunteerForm = document.getElementById('volunteerForm');
const volunteerName = document.getElementById('volunteerName');
const volunteerEmail = document.getElementById('volunteerEmail');
const volunteerPhone = document.getElementById('volunteerPhone');
const volunteerAvailability = document.getElementById('volunteerAvailability');
const volunteersList = document.getElementById('volunteersList');

// -- Worker Elements --
const workerDashboard = document.getElementById('workerDashboard');
const workerProjectsList = document.getElementById('workerProjectsList');

// -- Donor Elements --
const donorDashboard = document.getElementById('donorDashboard');
const donationForm = document.getElementById('donationForm');
const donorHistoryList = document.getElementById('donorHistoryList');
const donationProjectId = document.getElementById('donationProjectId');
const donatePresetBtns = document.querySelectorAll('.donatePresetBtn');

// Donation links (keep as plain constants, like the React example)
// Primary donation links used across the UI
// - One-time: PayPal hosted donate page
// - Monthly: Stripe hosted donate page (replace with your Stripe monthly link if you create one)
const DONATE_ONCE_LINK = PAYPAL_DONATE_URL;
const MONTHLY_SUPPORT_LINK = STRIPE_DONATE_URL;

// Admin project tools
const projectSearchInput = document.getElementById('projectSearchInput');
const projectStatusFilter = document.getElementById('projectStatusFilter');
const projectRefreshBtn = document.getElementById('projectRefreshBtn');
const projectExportBtn = document.getElementById('projectExportBtn');

// Assign modal elements
const assignModal = document.getElementById('assignModal');
const assignCloseBtn = document.getElementById('assignCloseBtn');
const assignCancelBtn = document.getElementById('assignCancelBtn');
const assignConfirmBtn = document.getElementById('assignConfirmBtn');
const assignWorkerSelect = document.getElementById('assignWorkerSelect');
const assignMsg = document.getElementById('assignMsg');
let pendingAssignProjectId = null;

// Event Listeners
// -- Login Listener --
if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
}

if (registerBtn) registerBtn.addEventListener('click', () => openModal(registerModal));
if (registerCloseBtn) registerCloseBtn.addEventListener('click', () => closeModal(registerModal));
if (registerCancelBtn) registerCancelBtn.addEventListener('click', () => closeModal(registerModal));
if (forgotBtn) forgotBtn.addEventListener('click', () => openModal(resetModal));
if (resetCloseBtn) resetCloseBtn.addEventListener('click', () => closeModal(resetModal));

if (registerForm) registerForm.addEventListener('submit', handleRegister);
if (resetRequestForm) resetRequestForm.addEventListener('submit', handlePasswordResetRequest);
if (resetConfirmForm) resetConfirmForm.addEventListener('submit', handlePasswordResetConfirm);
if (adminCreateUserForm) adminCreateUserForm.addEventListener('submit', handleAdminCreateUser);
// Stripe hosted link does not need JS handler

// -- Project Form Listener --
if (projectForm) {
    projectForm.addEventListener('submit', handleProjectSubmit);
}

// -- Volunteer Form Listener --
if (volunteerForm) {
    volunteerForm.addEventListener('submit', handleVolunteerSubmit);
}

// -- Donation Form Listener --
if (donationForm) {
    donationForm.addEventListener('submit', handleDonationSubmit);
}

// -- Worker Form Listener --
const workerForm = document.getElementById('workerForm');
if (workerForm) {
    workerForm.addEventListener('submit', handleWorkerSubmit);
}

if (projectSearchInput) projectSearchInput.addEventListener('input', () => renderProjects());
if (projectStatusFilter) projectStatusFilter.addEventListener('change', () => renderProjects());
if (projectRefreshBtn) projectRefreshBtn.addEventListener('click', () => loadProjects());
if (projectExportBtn) projectExportBtn.addEventListener('click', () => exportProjectsCsv());

if (assignCloseBtn) assignCloseBtn.addEventListener('click', () => closeModal(assignModal));
if (assignCancelBtn) assignCancelBtn.addEventListener('click', () => closeModal(assignModal));
if (assignConfirmBtn) assignConfirmBtn.addEventListener('click', () => confirmAssign());

// Functions
function toast(kind, title, message, opts = {}) {
    if (!toastContainer) return;
    const el = document.createElement('div');
    const color = kind === 'success' ? 'border-green-200 bg-green-50 text-green-900'
        : kind === 'error' ? 'border-red-200 bg-red-50 text-red-900'
        : 'border-gray-200 bg-white text-gray-900';
    el.className = `border ${color} shadow-sm rounded-xl p-4`;
    el.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-1 min-w-0">
          <div class="font-semibold">${escapeHtml(title || '')}</div>
          ${message ? `<div class="text-sm mt-1 opacity-90">${escapeHtml(message)}</div>` : ''}
        </div>
        <button class="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">Close</button>
      </div>
    `;
    const closeBtn = el.querySelector('button');
    if (closeBtn) closeBtn.addEventListener('click', () => el.remove());
    toastContainer.appendChild(el);
    const ttl = typeof opts.ttlMs === 'number' ? opts.ttlMs : 4500;
    if (ttl > 0) setTimeout(() => el.remove(), ttl);
}

function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    }[c]));
}

function scrollToDonate() {
    document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setDonationAmount(amount) {
    const el = document.getElementById('donationAmount');
    if (el) el.value = String(amount || '');
}

function whatsappShareLink(link) {
    return `https://wa.me/?text=${encodeURIComponent(`Support SadaqaWorks by donating here: ${link}`)}`;
}

function qrUrl(link) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(link)}`;
}

function setDonationLinks() {
    // Wire all “once/monthly” anchors consistently (hero + donate section)
    if (donateOnceLink) donateOnceLink.href = DONATE_ONCE_LINK;
    if (monthlySupportLink) monthlySupportLink.href = MONTHLY_SUPPORT_LINK;
    if (donateOnceCta) donateOnceCta.href = DONATE_ONCE_LINK;
    if (monthlySupportCta) monthlySupportCta.href = MONTHLY_SUPPORT_LINK;

    // WhatsApp share buttons
    if (whatsAppDonateLink) whatsAppDonateLink.href = whatsappShareLink(DONATE_ONCE_LINK);
    if (whatsAppShareBtn) whatsAppShareBtn.href = whatsappShareLink(DONATE_ONCE_LINK);
}

function setQrMode(mode) {
    const isOnce = mode === 'once';
    if (qrOnceBtn) {
        qrOnceBtn.classList.toggle('bg-green-600', isOnce);
        qrOnceBtn.classList.toggle('text-white', isOnce);
        qrOnceBtn.classList.toggle('hover:bg-green-700', isOnce);
    }
    if (qrMonthlyBtn) {
        qrMonthlyBtn.classList.toggle('bg-green-600', !isOnce);
        qrMonthlyBtn.classList.toggle('text-white', !isOnce);
        qrMonthlyBtn.classList.toggle('hover:bg-green-700', !isOnce);
    }
    if (qrOnceBtn && !isOnce) {
        qrOnceBtn.classList.remove('bg-green-600', 'text-white', 'hover:bg-green-700');
        qrOnceBtn.classList.add('text-gray-700');
    }
    if (qrMonthlyBtn && isOnce) {
        qrMonthlyBtn.classList.remove('bg-green-600', 'text-white', 'hover:bg-green-700');
        qrMonthlyBtn.classList.add('text-gray-700');
    }
    const link = isOnce ? DONATE_ONCE_LINK : MONTHLY_SUPPORT_LINK;
    if (donationQrImg) donationQrImg.src = qrUrl(link);
    if (whatsAppShareBtn) whatsAppShareBtn.href = whatsappShareLink(link);
}

function setBusy(btn, isBusy, text) {
    if (!btn) return;
    btn.disabled = !!isBusy;
    btn.classList.toggle('opacity-70', !!isBusy);
    if (loginBtnSpinner) loginBtnSpinner.classList.toggle('hidden', !isBusy);
    if (loginBtnText && typeof text === 'string') loginBtnText.textContent = text;
}

function setApiStatus(kind, text) {
    if (!apiStatusPill) return;
    apiStatusPill.classList.remove('hidden', 'border-green-200', 'bg-green-50', 'text-green-700', 'border-red-200', 'bg-red-50', 'text-red-700', 'border-yellow-200', 'bg-yellow-50', 'text-yellow-700');
    if (kind === 'ok') apiStatusPill.classList.add('border-green-200', 'bg-green-50', 'text-green-700');
    else if (kind === 'warn') apiStatusPill.classList.add('border-yellow-200', 'bg-yellow-50', 'text-yellow-700');
    else apiStatusPill.classList.add('border-red-200', 'bg-red-50', 'text-red-700');
    apiStatusPill.textContent = text || '';
}

function openModal(el) {
    if (!el) return;
    el.classList.remove('hidden');
    el.classList.add('flex');
}

function closeModal(el) {
    if (!el) return;
    el.classList.add('hidden');
    el.classList.remove('flex');
}

function showDonationStatus(kind, title, text) {
    if (!donationStatusBox || !donationStatusTitle || !donationStatusText) return;
    donationStatusBox.classList.remove('hidden');
    donationStatusBox.classList.remove('border-green-200', 'bg-green-50', 'border-red-200', 'bg-red-50', 'border-yellow-200', 'bg-yellow-50');
    if (kind === 'success') {
        donationStatusBox.classList.add('border-green-200', 'bg-green-50');
    } else if (kind === 'error') {
        donationStatusBox.classList.add('border-red-200', 'bg-red-50');
    } else {
        donationStatusBox.classList.add('border-yellow-200', 'bg-yellow-50');
    }
    donationStatusTitle.textContent = title || '';
    donationStatusText.textContent = text || '';
}

function handleDonationReturn() {
    try {
        // PayPal return URL can be configured as /donation-success OR #donation-success
        const path = window.location.pathname || '';
        const hash = (window.location.hash || '').toLowerCase();
        const params = new URLSearchParams((window.location.search || '').replace(/^\?/, ''));

        if (path.includes('donation-success') || hash.includes('donation-success') || params.get('status') === 'success') {
            showDonationStatus('success', 'Thank you for your donation!', 'Your payment was completed. If you included your email, you will receive a receipt.');
            // Scroll into view
            document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' });
        } else if (path.includes('donation-cancel') || hash.includes('donation-cancel') || params.get('status') === 'cancel') {
            showDonationStatus('info', 'Donation canceled', 'No payment was taken. You can try again anytime.');
            document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (_) {
        // ignore
    }
}

function showInlineMsg(el, msg) {
    if (!el) return;
    el.textContent = msg || '';
    el.classList.remove('hidden');
}

function hideInlineMsg(el) {
    if (!el) return;
    el.classList.add('hidden');
    el.textContent = '';
}

function setAuthToken(token) {
    if (token) localStorage.setItem('sw_token', token);
}

function getAuthToken() {
    return localStorage.getItem('sw_token') || '';
}

function clearSession() {
    localStorage.removeItem('sw_token');
    localStorage.removeItem('sw_role');
    localStorage.removeItem('sw_email');
}

function saveSessionHints({ role, email }) {
    if (role) localStorage.setItem('sw_role', role);
    if (email) localStorage.setItem('sw_email', email);
}

function restoreSessionHints() {
    try {
        const role = localStorage.getItem('sw_role') || '';
        const email = localStorage.getItem('sw_email') || '';
        if (roleSelect && role) roleSelect.value = role;
        if (emailInput && email) emailInput.value = email;
    } catch (_) {
        // ignore
    }
}

async function apiFetch(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    const token = getAuthToken();
    if (token) headers.set('Authorization', `Token ${token}`);
    if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const resp = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    return resp;
}

async function readApiError(resp) {
    const ct = resp.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
        const j = await resp.json().catch(() => ({}));
        const msg = j?.detail || j?.message || j?.error || j?.email || j?.password;
        if (typeof msg === 'string' && msg.trim()) return msg;
        return 'Request failed';
    }
    const t = await resp.text().catch(() => '');
    return t?.trim() || 'Request failed';
}

function showLoggedInUi() {
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    if (themeToggleBtn) themeToggleBtn.classList.remove('hidden');
}

function showLoggedOutUi() {
    if (logoutBtn) logoutBtn.classList.add('hidden');
}

// Project list state for filtering/exporting
let cachedProjects = [];

async function checkApiReachability() {
    try {
        const resp = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
        setApiStatus(resp.ok ? 'ok' : 'bad', resp.ok ? 'API: connected' : 'API: error');
    } catch (_) {
        setApiStatus('bad', 'API: offline');
    }
}

// -- Login Handler (Django-backed) --
async function handleLogin() {
    if (!roleSelect || !passwordInput || !errorMsg || !loginSection || !emailInput) return;

    const role = roleSelect.value;
    const email = (emailInput.value || '').trim();
    const password = passwordInput.value || '';

    if (!email || !password) {
        errorMsg.textContent = 'Email and password are required.';
        errorMsg.classList.remove('hidden');
        return;
    }

    try {
        setBusy(loginBtn, true, 'Signing in…');
        const resp = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || data.status !== 'success') {
            const msg = data?.email || data?.password || data?.detail || data?.message || 'Login failed';
            errorMsg.textContent = typeof msg === 'string' ? msg : 'Login failed';
            errorMsg.classList.remove('hidden');
            setApiStatus('bad', 'API: error');
            return;
        }

        setAuthToken(data.token);
        saveSessionHints({ role, email });
        hideInlineMsg(errorMsg);
        loginSection.classList.add('hidden');
        showLoggedInUi();
        setApiStatus('ok', 'API: connected');

    // Show the correct dashboard
    const dashboardId = role.toLowerCase() + 'Dashboard';
    const dashboard = document.getElementById(dashboardId);
    if (dashboard) {
        dashboard.classList.remove('hidden');
    } else {
        console.error(`Dashboard element with ID ${dashboardId} not found.`);
    }

    // Load appropriate data based on role
    if (role === 'Admin') {
        loadAdminData();
        loadVolunteers();
        loadWorkers();
        loadDonations();
    } else if (role === 'Volunteer') {
        loadVolunteers();
    } else if (role === 'Worker') {
        loadWorkerData();
    } else if (role === 'Donor') {
        loadDonorData();
    }
        // Always populate donor project selector when possible
        loadDonationProjects();
    } catch (e) {
        console.error('Login error:', e);
        errorMsg.textContent = 'Login failed. Please try again.';
        errorMsg.classList.remove('hidden');
        setApiStatus('bad', 'API: offline');
        toast('error', 'Login failed', 'Please check the server and try again.');
    } finally {
        setBusy(loginBtn, false, 'Login');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    if (!registerForm || !registerRole || !registerName || !registerEmail || !registerPassword) return;
    hideInlineMsg(registerMsg);

    const role = registerRole.value;
    const name = (registerName.value || '').trim();
    const email = (registerEmail.value || '').trim();
    const password = registerPassword.value || '';

    if (!name || !email || !password) {
        showInlineMsg(registerMsg, 'Name, email, and password are required.');
        return;
    }

    try {
        const resp = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, name, email, password })
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || data.status !== 'success') {
            const msg = data?.email || data?.password || data?.detail || data?.message || 'Registration failed';
            showInlineMsg(registerMsg, typeof msg === 'string' ? msg : 'Registration failed');
            return;
        }

        setAuthToken(data.token);
        // Pre-fill login fields and auto-login into selected role
        if (roleSelect) roleSelect.value = role;
        if (emailInput) emailInput.value = email;
        if (passwordInput) passwordInput.value = password;
        closeModal(registerModal);
        await handleLogin();
    } catch (err) {
        console.error('Register error:', err);
        showInlineMsg(registerMsg, 'Registration failed. Please try again.');
    }
}

async function handlePasswordResetRequest(e) {
    e.preventDefault();
    if (!resetEmail || !resetTokenBox || !resetTokenValue || !resetTokenInput) return;
    hideInlineMsg(resetMsg);
    resetTokenBox.classList.add('hidden');
    resetTokenValue.textContent = '';

    const email = (resetEmail.value || '').trim();
    if (!email) {
        showInlineMsg(resetMsg, 'Email is required.');
        return;
    }

    try {
        const resp = await fetch(`${API_BASE_URL}/auth/password-reset/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
            showInlineMsg(resetMsg, data?.detail || data?.message || 'Reset request failed');
            return;
        }
        const token = data?.resetToken;
        if (token) {
            resetTokenValue.textContent = token;
            resetTokenBox.classList.remove('hidden');
            resetTokenInput.value = token;
        }
    } catch (err) {
        console.error('Reset request error:', err);
        showInlineMsg(resetMsg, 'Reset request failed. Please try again.');
    }
}

async function handlePasswordResetConfirm(e) {
    e.preventDefault();
    if (!resetTokenInput || !resetNewPassword) return;
    hideInlineMsg(resetMsg);

    const resetToken = (resetTokenInput.value || '').trim();
    const newPassword = resetNewPassword.value || '';
    if (!resetToken || !newPassword) {
        showInlineMsg(resetMsg, 'Reset token and new password are required.');
        return;
    }

    try {
        const resp = await fetch(`${API_BASE_URL}/auth/password-reset/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resetToken, newPassword })
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || data.status !== 'ok') {
            const msg = data?.resetToken || data?.detail || data?.message || 'Reset failed';
            showInlineMsg(resetMsg, typeof msg === 'string' ? msg : 'Reset failed');
            return;
        }

        setAuthToken(data.token);
        closeModal(resetModal);
        // encourage user to login with new password
        if (passwordInput) passwordInput.value = newPassword;
    } catch (err) {
        console.error('Reset confirm error:', err);
        showInlineMsg(resetMsg, 'Reset failed. Please try again.');
    }
}

async function handleAdminCreateUser(e) {
    e.preventDefault();
    if (!adminCreateUserForm || !adminUserRole || !adminUserName || !adminUserEmail) return;
    hideInlineMsg(adminCreateUserMsg);
    if (adminCreatedCreds) adminCreatedCreds.classList.add('hidden');

    const role = adminUserRole.value;
    const name = (adminUserName.value || '').trim();
    const email = (adminUserEmail.value || '').trim();
    const tempPassword = (adminUserTempPassword?.value || '').trim();

    if (!name || !email) {
        showInlineMsg(adminCreateUserMsg, 'Name and email are required.');
        return;
    }

    try {
        const resp = await apiFetch('/admin/users', {
            method: 'POST',
            body: JSON.stringify({ role, name, email, tempPassword })
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || data.status !== 'success') {
            const msg = data?.email || data?.detail || data?.message || 'Failed to create user';
            showInlineMsg(adminCreateUserMsg, typeof msg === 'string' ? msg : 'Failed to create user');
            return;
        }
        if (adminCreatedEmail) adminCreatedEmail.textContent = data?.user?.email || email;
        if (adminCreatedPassword) adminCreatedPassword.textContent = data?.tempPassword || '(not returned)';
        if (adminCreatedCreds) adminCreatedCreds.classList.remove('hidden');
        adminCreateUserForm.reset();
    } catch (err) {
        console.error('Admin create user error:', err);
        showInlineMsg(adminCreateUserMsg, 'Failed to create user. Please try again.');
    }
}

// -- Project Submission Handler --
async function handleProjectSubmit(e) {
    e.preventDefault();

    const projectData = {
        name: projectName.value,
        description: projectDesc.value,
        funds: projectFunds.value,
        country: projectCountry.value
    };

    if (!projectData.country) {
        alert('Please enter the project country.');
        return;
    }

    try {
        const response = await apiFetch(`/projects`, {
            method: 'POST',
            body: JSON.stringify(projectData)
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result?.message || 'Failed to add project');
        toast('success', 'Project added', 'Your project was created successfully.');
        
        projectForm.reset();
        
        loadAdminData();
    } catch (error) {
        console.error('Error adding project:', error);
        toast('error', 'Project not added', error?.message || 'Please try again.');
    }
}

// -- NEW: Load All Admin Data (Projects + Stats) --
async function loadAdminData() {
    await loadProjects();
    await loadDashboardStats();
}

// -- Load Projects Handler --
async function loadProjects() {
    if (!projectsList) return; 

    try {
        const response = await apiFetch(`/projects`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json();
        cachedProjects = Array.isArray(projects) ? projects : [];
        
        renderProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsList.innerHTML = '<p class="text-red-600">Error loading projects</p>';
        cachedProjects = [];
    }
}

function renderProjects() {
    if (!projectsList) return;
    const q = (projectSearchInput?.value || '').trim().toLowerCase();
    const status = (projectStatusFilter?.value || '').trim();
    const filtered = (cachedProjects || []).filter(p => {
        if (status && String(p.status) !== status) return false;
        if (!q) return true;
        const hay = `${p.name || ''} ${p.country || ''} ${p.status || ''}`.toLowerCase();
        return hay.includes(q);
    });

    if (filtered.length === 0) {
        projectsList.innerHTML = `<div class="bg-white p-4 rounded-lg shadow mb-4"><p class="text-gray-600">No projects match your filters.</p></div>`;
        return;
    }

    projectsList.innerHTML = filtered.map(project => `
            <div class="bg-white p-4 rounded-lg shadow mb-4">
                <div class="flex justify-between items-start flex-wrap">
                    <div class="flex-grow pr-4">
                        <h3 class="text-xl font-bold">${project.name}</h3>
                        <p class="text-sm text-gray-500 mb-1">Country: <span class="font-medium">${project.country || 'N/A'}</span></p>
                        <p class="text-gray-600">${project.description}</p>
                        <p class="text-green-600 font-bold mt-1">Funds: $${project.funds}</p>
                        <div class="mt-2">
                            <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${project.status}</span>
                            ${project.progress > 0 ? `<span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">${project.progress}% Complete</span>` : ''}
                        </div>
                    </div>
                    <div class="flex-shrink-0 mt-2 sm:mt-0">
                        <button onclick="openAssignModal(${project.id})" class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 mr-2">Assign</button>
                        <button onclick="deleteProject(${project.id})" class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
}

function exportProjectsCsv() {
    const rows = (cachedProjects || []).map(p => ({
        id: p.id,
        name: p.name,
        country: p.country,
        status: p.status,
        progress: p.progress,
        funds: p.funds,
    }));
    if (!rows.length) {
        toast('info', 'Nothing to export', 'No projects available.');
        return;
    }
    const header = Object.keys(rows[0]);
    const csv = [
        header.join(','),
        ...rows.map(r => header.map(k => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sadaqaworks-projects-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast('success', 'Exported', 'Projects CSV downloaded.');
}

async function loadDonationProjects() {
    if (!donationProjectId) return;
    try {
        const resp = await apiFetch('/projects');
        if (!resp.ok) return;
        const projects = await resp.json().catch(() => []);
        const options = [
            `<option value="">No specific project</option>`,
            ...(Array.isArray(projects) ? projects : []).map(p => `<option value="${p.id}">${escapeHtml(p.name)} (${escapeHtml(p.country || 'N/A')})</option>`)
        ];
        donationProjectId.innerHTML = options.join('');
    } catch (_) {
        // ignore
    }
}

// -- Load Dashboard Stats --
async function loadDashboardStats() {
    try {
        const response = await apiFetch(`/dashboard-stats`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const stats = await response.json();
        
        if (statTotalProjects) statTotalProjects.textContent = stats.totalProjects;
        if (statPendingProjects) statPendingProjects.textContent = stats.pendingProjects;
        if (statActiveProjects) statActiveProjects.textContent = stats.activeProjects;
        if (statCompletedProjects) statCompletedProjects.textContent = stats.completedProjects;
        if (statTotalDonations) statTotalDonations.textContent = `$${stats.totalDonations}`;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// -- Load Volunteers --
async function loadVolunteers() {
    if (!volunteersList) return;

    try {
        const response = await apiFetch(`/volunteers`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const volunteers = await response.json();
        
        volunteersList.innerHTML = volunteers.map(volunteer => `
            <div class="bg-gray-50 p-3 rounded border">
                <h4 class="font-semibold">${volunteer.name}</h4>
                <p class="text-sm text-gray-600">${volunteer.email}</p>
                <p class="text-sm text-gray-600">${volunteer.phone || 'No phone'}</p>
                <p class="text-sm text-blue-600">Skills: ${volunteer.specialties.join(', ')}</p>
                ${volunteer.availability ? `<p class="text-sm text-gray-500">Available: ${volunteer.availability}</p>` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading volunteers:', error);
        volunteersList.innerHTML = '<p class="text-red-600">Error loading volunteers</p>';
    }
}

// -- Volunteer Submission Handler --
async function handleVolunteerSubmit(e) {
    e.preventDefault();

    const specialtyCheckboxes = document.querySelectorAll('input[name="specialty"]:checked');
    const specialties = Array.from(specialtyCheckboxes).map(cb => cb.value);

    if (specialties.length === 0) {
        alert('Please select at least one area of expertise.');
        return;
    }

    const volunteerData = {
        name: volunteerName.value,
        email: volunteerEmail.value,
        phone: volunteerPhone.value,
        specialties: specialties,
        availability: volunteerAvailability.value
    };

    try {
        const response = await apiFetch(`/volunteers`, {
            method: 'POST',
            body: JSON.stringify(volunteerData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to register volunteer');
        }

        alert(result.message);
        
        volunteerForm.reset();
        specialtyCheckboxes.forEach(cb => cb.checked = false);
        
        loadVolunteers();
    } catch (error) {
        console.error('Error registering volunteer:', error);
        alert(`Failed to register volunteer: ${error.message}`);
    }
}

// -- Load Workers --
async function loadWorkers() {
    try {
        const response = await apiFetch(`/workers`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const workers = await response.json();
        
        // Update workers list if it exists
        const workersList = document.getElementById('workersList');
        if (workersList) {
            workersList.innerHTML = workers.map(worker => `
                <div class="bg-gray-50 p-3 rounded border">
                    <h4 class="font-semibold">${worker.name}</h4>
                    <p class="text-sm text-gray-600">${worker.email}</p>
                    <p class="text-sm text-blue-600">Skills: ${worker.skills.join(', ')}</p>
                    <p class="text-sm text-gray-500">Assigned Projects: ${worker.assignedProjects.length}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading workers:', error);
    }
}

// -- Load Worker Data --
async function loadWorkerData() {
    // For demo purposes, we'll show all projects that could be assigned
    // In a real app, you'd authenticate the worker and show only their projects
    try {
        const response = await apiFetch(`/projects`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json();
        
        const workerProjectsList = document.getElementById('workerProjectsList');
        if (workerProjectsList) {
            workerProjectsList.innerHTML = projects.map(project => `
                <div class="bg-white p-4 rounded-lg shadow mb-4">
                    <h3 class="text-xl font-bold">${project.name}</h3>
                    <p class="text-gray-600">${project.description}</p>
                    <p class="text-green-600 font-bold">Funds: $${project.funds}</p>
                    <p class="text-sm text-gray-500">Country: ${project.country}</p>
                    <div class="mt-2">
                        <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${project.status}</span>
                    </div>
                    ${project.progress > 0 ? `
                        <div class="mt-2">
                            <label class="block text-sm font-medium">Progress: ${project.progress}%</label>
                            <input type="range" min="0" max="100" value="${project.progress}" 
                                   onchange="updateProgress(${project.id}, this.value)" 
                                   class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                        </div>
                    ` : ''}
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading worker data:', error);
    }
}

// -- Update Project Progress --
async function updateProgress(projectId, progress) {
    try {
        const response = await apiFetch(`/projects/${projectId}/progress`, {
            method: 'PUT',
            body: JSON.stringify({ progress: parseInt(progress) })
        });

        if (!response.ok) {
            throw new Error('Failed to update progress');
        }

        // Reload worker data to show updated progress
        loadWorkerData();
    } catch (error) {
        console.error('Error updating progress:', error);
        alert('Failed to update progress');
    }
}

// -- Load Donor Data --
async function loadDonorData() {
    // For demo purposes, we'll show all donations
    // In a real app, you'd authenticate the donor and show only their donations
    try {
        const response = await apiFetch(`/donations`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const donations = await response.json();
        
        const donorHistoryList = document.getElementById('donorHistoryList');
        if (donorHistoryList) {
            donorHistoryList.innerHTML = donations.map(donation => `
                <div class="bg-white p-4 rounded-lg shadow mb-4">
                    <h3 class="text-xl font-bold">$${donation.amount}</h3>
                    <p class="text-gray-600">Donor: ${donation.donorName}</p>
                    <p class="text-sm text-gray-500">Date: ${new Date(donation.created_at || donation.date || Date.now()).toLocaleDateString()}</p>
                    <p class="text-sm text-gray-500">Method: ${donation.paymentMethod}</p>
                    <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">${donation.status}</span>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading donor data:', error);
    }
}

// -- Donation Submission Handler --
async function handleDonationSubmit(e) {
    e.preventDefault();

    const donationData = {
        donorName: document.getElementById('donorName').value,
        amount: document.getElementById('donationAmount').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        email: document.getElementById('donorEmail').value,
        projectId: document.getElementById('donationProjectId')?.value || null
    };

    try {
        const response = await apiFetch(`/donations`, {
            method: 'POST',
            body: JSON.stringify(donationData)
        });

        if (!response.ok) throw new Error(await readApiError(response));
        toast('success', 'Donation recorded', 'Thank you — donation saved.');
        
        donationForm.reset();
        
        loadDonorData();
        loadDashboardStats(); // Update admin stats
    } catch (error) {
        console.error('Error recording donation:', error);
        toast('error', 'Donation failed', error?.message || 'Please try again.');
    }
}

// -- Assign Project to Worker --
async function openAssignModal(projectId) {
    pendingAssignProjectId = projectId;
    hideInlineMsg(assignMsg);
    if (!assignWorkerSelect) {
        toast('error', 'Assign unavailable', 'Missing worker selector.');
        return;
    }
    try {
        // Get available workers
        const workersResponse = await apiFetch(`/available-workers`);
        if (!workersResponse.ok) throw new Error(await readApiError(workersResponse));
        const workers = await workersResponse.json();
        
        if (workers.length === 0) {
            toast('info', 'No workers available', 'Register workers first, then assign projects.');
            return;
        }
        assignWorkerSelect.innerHTML = workers.map(w => `<option value="${w.id}">${escapeHtml(w.name || 'Worker')} (ID ${w.id})</option>`).join('');
        openModal(assignModal);
    } catch (error) {
        console.error('Error opening assign modal:', error);
        toast('error', 'Assign failed', error?.message || 'Please try again.');
    }
}

async function confirmAssign() {
    if (!pendingAssignProjectId) return;
    if (!assignWorkerSelect) return;
    hideInlineMsg(assignMsg);
    const workerId = assignWorkerSelect.value;
    if (!workerId) {
        showInlineMsg(assignMsg, 'Please select a worker.');
        return;
    }
    try {
        const response = await apiFetch(`/assign-project`, {
            method: 'POST',
            body: JSON.stringify({ projectId: pendingAssignProjectId, workerId })
        });
        if (!response.ok) throw new Error(await readApiError(response));
        closeModal(assignModal);
        toast('success', 'Assigned', 'Project assigned successfully.');
        pendingAssignProjectId = null;
        loadProjects();
        loadWorkers();
    } catch (e) {
        showInlineMsg(assignMsg, e?.message || 'Failed to assign project.');
    }
}

// -- Delete Project --
async function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }

    try {
        const response = await apiFetch(`/projects/${projectId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(await readApiError(response));
        }

        toast('success', 'Deleted', 'Project deleted successfully.');
        loadProjects();
        loadDashboardStats();
    } catch (error) {
        console.error('Error deleting project:', error);
        toast('error', 'Delete failed', error?.message || 'Please try again.');
    }
}

// -- Load Donations --
async function loadDonations() {
    try {
        const response = await apiFetch(`/donations`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const donations = await response.json();
        
        // Update donations list if it exists
        const donationsList = document.getElementById('donationsList');
        if (donationsList) {
            donationsList.innerHTML = donations.map(donation => `
                <div class="bg-gray-50 p-3 rounded border">
                    <h4 class="font-semibold">$${donation.amount}</h4>
                    <p class="text-sm text-gray-600">${donation.donorName}</p>
                    <p class="text-sm text-gray-500">${new Date(donation.date).toLocaleDateString()}</p>
                    <p class="text-sm text-blue-600">${donation.paymentMethod}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading donations:', error);
    }
}

// -- Worker Submission Handler --
async function handleWorkerSubmit(e) {
    e.preventDefault();

    const skillCheckboxes = document.querySelectorAll('input[name="skill"]:checked');
    const skills = Array.from(skillCheckboxes).map(cb => cb.value);

    if (skills.length === 0) {
        alert('Please select at least one skill.');
        return;
    }

    const workerData = {
        name: document.getElementById('workerName').value,
        email: document.getElementById('workerEmail').value,
        phone: document.getElementById('workerPhone').value,
        skills: skills
    };

    try {
        const response = await apiFetch(`/workers`, {
            method: 'POST',
            body: JSON.stringify(workerData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to register worker');
        }

        alert(result.message);
        
        workerForm.reset();
        skillCheckboxes.forEach(cb => cb.checked = false);
        
        loadWorkers();
    } catch (error) {
        console.error('Error registering worker:', error);
        alert(`Failed to register worker: ${error.message}`);
    }
}

// Initial Setup on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // No initial data load needed here, it's triggered by admin login.
    if (paypalDonateLink) paypalDonateLink.href = PAYPAL_DONATE_URL;
    if (paypalQrImg) paypalQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(PAYPAL_DONATE_URL)}`;
    if (stripeDonateLink) stripeDonateLink.href = STRIPE_DONATE_URL;
    if (stripeQrImg) stripeQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(STRIPE_DONATE_URL)}`;
    handleDonationReturn();
    restoreSessionHints();
    checkApiReachability();
    setDonationLinks();
    setQrMode('once');

    // Donation CTAs
    if (stickyDonateBtn) stickyDonateBtn.addEventListener('click', scrollToDonate);

    if (qrOnceBtn) qrOnceBtn.addEventListener('click', () => setQrMode('once'));
    if (qrMonthlyBtn) qrMonthlyBtn.addEventListener('click', () => setQrMode('monthly'));

    // Preset amount buttons (affect donor dashboard donation form if visible)
    donatePresetBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            const amt = btn.getAttribute('data-amount');
            if (amt) setDonationAmount(amt);
            toast('success', 'Amount selected', `$${amt} selected`, { ttlMs: 1500 });
        });
    });

    // Mobile menu
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        mobileMenu.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }

    // Stripe "monthly" currently points to the same hosted link until a recurring link is configured.
    if (stripeMonthlyLink) stripeMonthlyLink.addEventListener('click', () => {
        // No-op; keep link navigation. Toast is enough.
        toast('info', 'Monthly support', 'If you have a recurring Stripe link, replace the monthly URL in index.html.', { ttlMs: 3500 });
    });

    // Theme toggle (simple light/dark). Uses Tailwind v2 classes; we swap body background/text.
    if (themeToggleBtn) {
        const key = 'sw_theme';
        const apply = (t) => {
            const dark = t === 'dark';
            document.body.classList.toggle('bg-gray-900', dark);
            document.body.classList.toggle('text-gray-100', dark);
        };
        apply(localStorage.getItem(key) || 'light');
        themeToggleBtn.addEventListener('click', () => {
            const next = (localStorage.getItem(key) || 'light') === 'dark' ? 'light' : 'dark';
            localStorage.setItem(key, next);
            apply(next);
            toast('info', 'Theme updated', next === 'dark' ? 'Dark mode enabled' : 'Light mode enabled', { ttlMs: 2000 });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            clearSession();
            // Reload to reset UI state cheaply.
            window.location.href = `${window.location.origin}${window.location.pathname}#dashboard`;
            window.location.reload();
        });
    }

    // Make top nav tabs reliably scroll to a visible section.
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href') || '';
            const id = href.replace('#', '').trim();
            if (!id) return;

            // Prefer role dashboards when available
            let target = document.getElementById(id);
            if (!target && id === 'volunteer') {
                target = document.getElementById('volunteerDashboard') || document.getElementById('volunteer');
            }
            if (!target && id === 'projects') {
                target = document.getElementById('adminDashboard') || document.getElementById('projects');
            }

            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}); 