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
        const response = await fetch(`${API_BASE_URL}/dashboard-stats`);
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
        const response = await fetch(`${API_BASE_URL}/volunteers`);
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
        const response = await fetch(`${API_BASE_URL}/workers`);
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
        const response = await fetch(`${API_BASE_URL}/projects`);
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
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/progress`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
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
        const response = await fetch(`${API_BASE_URL}/donations`);
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
                    <p class="text-sm text-gray-500">Date: ${new Date(donation.date).toLocaleDateString()}</p>
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
        const response = await fetch(`${API_BASE_URL}/donations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
        const workersResponse = await fetch(`${API_BASE_URL}/available-workers`);
        const workers = await workersResponse.json();
        
        if (workers.length === 0) {
            alert('No available workers found. Please register workers first.');
            return;
        }
        
        // For demo purposes, assign to first available worker
        // In a real app, you'd show a selection dialog
        const workerId = workers[0].id;
        
        const response = await fetch(`${API_BASE_URL}/assign-project`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
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
        const response = await fetch(`${API_BASE_URL}/donations`);
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
        const response = await fetch(`${API_BASE_URL}/workers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
}); 
}); 