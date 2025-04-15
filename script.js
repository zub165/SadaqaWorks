// API Configuration
const API_BASE_URL = 'http://208.109.215.53:3000';

// DOM Elements
// -- Login Elements --
const loginSection = document.getElementById('login');
const roleSelect = document.getElementById('roleSelect');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');

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

// Event Listeners
// -- Login Listener --
if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
}

// -- Project Form Listener --
if (projectForm) {
    projectForm.addEventListener('submit', handleProjectSubmit);
}

// -- Volunteer Form Listener --
if (volunteerForm) {
    volunteerForm.addEventListener('submit', handleVolunteerSubmit);
}

// Functions
// -- Login Handler --
function handleLogin() {
    if (!roleSelect || !passwordInput || !errorMsg || !loginSection) return;

    const role = roleSelect.value;
    const password = passwordInput.value;
    const correctPassword = '1234'; // Keep the simple password for now

    if (password !== correctPassword) {
        errorMsg.classList.remove('hidden');
        return;
    }

    errorMsg.classList.add('hidden');
    loginSection.classList.add('hidden');

    // Show the correct dashboard
    const dashboardId = role.toLowerCase() + 'Dashboard';
    const dashboard = document.getElementById(dashboardId);
    if (dashboard) {
        dashboard.classList.remove('hidden');
    } else {
        console.error(`Dashboard element with ID ${dashboardId} not found.`);
    }

    // If Admin logs in, load projects AND stats
    if (role === 'Admin') {
        loadAdminData();
        loadVolunteers(); // Load volunteers for Admin view
    } else if (role === 'Volunteer') {
        loadVolunteers(); // Load volunteers for Volunteer view
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
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
        const response = await fetch(`${API_BASE_URL}/projects`);
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
                    </div>
                    <div class="flex-shrink-0 mt-2 sm:mt-0">
                        <span class="text-xs sm:text-sm font-medium px-2 py-1 rounded ${ 
                            project.status === 'Pending Review' ? 'bg-yellow-200 text-yellow-800' : 
                            project.status === 'Active' ? 'bg-green-200 text-green-800' : 
                            project.status === 'Completed' ? 'bg-gray-300 text-gray-800' : 'bg-gray-200' 
                        }">
                            ${project.status}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsList.innerHTML = '<p class="text-red-500">Failed to load projects. Is the backend server running?</p>'; 
    }
}

// -- NEW: Load Dashboard Stats Handler --
async function loadDashboardStats() {
    if (!statTotalProjects || !statPendingProjects || !statActiveProjects || !statCompletedProjects || !statTotalDonations) {
        console.warn("Dashboard stat elements not found. Skipping stats update.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/dashboard-stats`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const stats = await response.json();

        statTotalProjects.textContent = stats.totalProjects;
        statPendingProjects.textContent = stats.pendingProjects;
        statActiveProjects.textContent = stats.activeProjects;
        statCompletedProjects.textContent = stats.completedProjects;
        statTotalDonations.textContent = stats.totalDonations;

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        statTotalProjects.textContent = 'Err';
        statPendingProjects.textContent = 'Err';
        statActiveProjects.textContent = 'Err';
        statCompletedProjects.textContent = 'Err';
        statTotalDonations.textContent = 'Err';
    }
}

// -- Volunteer Submission Handler --
async function handleVolunteerSubmit(e) {
    e.preventDefault();

    const specialtyCheckboxes = document.querySelectorAll('input[name="specialty"]:checked');
    const specialties = Array.from(specialtyCheckboxes).map(cb => cb.value);

    if (specialties.length === 0) {
        alert('Please select at least one area of expertise/interest.');
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
        const response = await fetch(`${API_BASE_URL}/volunteers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(volunteerData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to register volunteer');
        }

        alert(result.message);
        volunteerForm.reset();
        loadVolunteers();

    } catch (error) {
        console.error('Error registering volunteer:', error);
        alert(`Registration failed: ${error.message}`);
    }
}

// -- Load Volunteers Handler --
async function loadVolunteers() {
    if (!volunteersList) return;

    volunteersList.innerHTML = '<p class="text-gray-500">Loading volunteers...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/volunteers`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const volunteers = await response.json();

        if (volunteers.length === 0) {
            volunteersList.innerHTML = '<p class="text-gray-500">No volunteers registered yet.</p>';
        } else {
            volunteersList.innerHTML = volunteers.map(v => `
                <div class="bg-gray-50 p-3 rounded border">
                    <p class="font-semibold">${v.name} <span class="text-sm text-gray-600">(${v.email})</span></p>
                    <p class="text-sm">Phone: ${v.phone || 'Not provided'}</p>
                    <p class="text-sm">Specialties: <span class="font-medium">${v.specialties.join(', ')}</span></p>
                    ${v.availability ? `<p class="text-sm mt-1">Availability/Notes: ${v.availability}</p>` : ''}
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading volunteers:', error);
        volunteersList.innerHTML = '<p class="text-red-500">Failed to load volunteers list.</p>';
    }
}

// Initial Setup on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // No initial data load needed here, it's triggered by admin login.
}); 