const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for projects - Now includes status and country
let projects = []; // Example: { id: ..., name: '..', description: '..', funds: '..', status: '..', country: '..' }

// In-memory storage for volunteers
let volunteers = []; // Example: { id: Date.now(), name: '..', email: '..', phone: '..', specialties: ['..', '..'], availability: '..' }

// Routes
app.get('/projects', (req, res) => {
    res.json(projects); // Country is now included automatically
});

app.post('/projects', (req, res) => {
    const { name, description, funds, country } = req.body;
    if (!name || !description || !funds || !country) { // Added country check
        return res.status(400).json({ message: 'Missing project details (Name, Description, Funds, Country are required)' });
    }
    const newProject = {
        id: Date.now(), // Simple unique ID
        name,
        description,
        funds,
        country, // Store the country
        status: 'Pending Review' // Default status
    };
    projects.push(newProject);
    console.log('Project Added:', newProject);
    console.log('Current Projects:', projects);
    res.status(201).json({ message: 'Project added successfully!', project: newProject });
});

// New route for dashboard statistics
app.get('/dashboard-stats', (req, res) => {
    const totalProjects = projects.length;
    const pendingProjects = projects.filter(p => p.status === 'Pending Review').length;
    const activeProjects = projects.filter(p => p.status === 'Active').length; // Assuming 'Active' status exists later
    const completedProjects = projects.filter(p => p.status === 'Completed').length; // Assuming 'Completed' status exists later
    
    // Placeholder for donation data
    const totalDonations = "N/A"; 

    res.json({
        totalProjects,
        pendingProjects,
        activeProjects,
        completedProjects,
        totalDonations 
    });
});

// Volunteer Routes
app.post('/volunteers', (req, res) => {
    const { name, email, phone, specialties, availability } = req.body;

    if (!name || !email || !specialties || specialties.length === 0) {
        return res.status(400).json({ message: 'Missing required volunteer details (Name, Email, Specialties)' });
    }

    const newVolunteer = {
        id: Date.now(),
        name,
        email,
        phone: phone || '', // Optional field
        specialties, // Should be an array of strings
        availability: availability || '' // Optional field
    };

    volunteers.push(newVolunteer);
    console.log('Volunteer Registered:', newVolunteer);
    console.log('Current Volunteers:', volunteers);
    res.status(201).json({ message: 'Volunteer registered successfully!', volunteer: newVolunteer });
});

app.get('/volunteers', (req, res) => {
    // In a real app, you might restrict who can see this list
    res.json(volunteers);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 