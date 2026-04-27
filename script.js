// API Configuration (same-origin so it works behind reverse proxies and deep links)
const API_BASE_URL = window.location.origin;
const PAYPAL_DONATE_URL = 'https://www.paypal.com/donate/?hosted_button_id=VKR4HREY38HJU';

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
const stripeDonateBtn = document.getElementById('stripeDonateBtn');
const stripeDonateMsg = document.getElementById('stripeDonateMsg');

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
if (stripeDonateBtn) stripeDonateBtn.addEventListener('click', handleStripeDonate);

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

// Functions
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

async function handleStripeDonate() {
    if (stripeDonateMsg) stripeDonateMsg.classList.add('hidden');
    try {
        const amount = prompt('Enter donation amount (USD):', '10.00');
        if (!amount) return;
        const resp = await fetch(`${API_BASE_URL}/payments/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: 'stripe', amount, currency: 'USD' })
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) {
            const msg = data?.message || 'Stripe checkout failed';
            if (stripeDonateMsg) {
                stripeDonateMsg.textContent = msg;
                stripeDonateMsg.classList.remove('hidden');
            }
            return;
        }
        if (data.redirectUrl) window.location.href = data.redirectUrl;
    } catch (e) {
        if (stripeDonateMsg) {
            stripeDonateMsg.textContent = 'Stripe checkout failed.';
            stripeDonateMsg.classList.remove('hidden');
        }
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

async function apiFetch(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    const token = getAuthToken();
    if (token) headers.set('Authorization', `Token ${token}`);
    if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const resp = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    return resp;
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
            return;
        }

        setAuthToken(data.token);
        hideInlineMsg(errorMsg);
        loginSection.classList.add('hidden');

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
    } catch (e) {
        console.error('Login error:', e);
        errorMsg.textContent = 'Login failed. Please try again.';
        errorMsg.classList.remove('hidden');
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

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to add project');
        }

        alert(result.message);
        
        projectForm.reset();
        
        loadAdminData();
    } catch (error) {
        console.error('Error adding project:', error);
        alert(`Failed to add project: ${error.message}`);
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
        
        projectsList.innerHTML = projects.map(project => `
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
                        <button onclick="assignProject(${project.id})" class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 mr-2">Assign</button>
                        <button onclick="deleteProject(${project.id})" class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsList.innerHTML = '<p class="text-red-600">Error loading projects</p>';
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

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to record donation');
        }

        alert(result.message);
        
        donationForm.reset();
        
        loadDonorData();
        loadDashboardStats(); // Update admin stats
    } catch (error) {
        console.error('Error recording donation:', error);
        alert(`Failed to record donation: ${error.message}`);
    }
}

// -- Assign Project to Worker --
async function assignProject(projectId) {
    try {
        // Get available workers
        const workersResponse = await apiFetch(`/available-workers`);
        const workers = await workersResponse.json();
        
        if (workers.length === 0) {
            alert('No available workers found. Please register workers first.');
            return;
        }
        
        // For demo purposes, assign to first available worker
        // In a real app, you'd show a selection dialog
        const workerId = workers[0].id;
        
        const response = await apiFetch(`/assign-project`, {
            method: 'POST',
            body: JSON.stringify({ projectId, workerId })
        });

        if (!response.ok) {
            throw new Error('Failed to assign project');
        }

        alert('Project assigned successfully!');
        loadProjects();
    } catch (error) {
        console.error('Error assigning project:', error);
        alert('Failed to assign project');
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
            throw new Error('Failed to delete project');
        }

        alert('Project deleted successfully!');
        loadProjects();
        loadDashboardStats();
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
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
    handleDonationReturn();
}); 