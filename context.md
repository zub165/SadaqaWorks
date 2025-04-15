# 📘 Application Context: SadaqaWorks Backend + Frontend

## ✅ Application Workflow

1. **User Login:**
   - User selects their role (Admin, Worker, Volunteer, Donor)
   - Authenticates with password (initially static, can be replaced with secure auth)

2. **Dashboard Routing:**
   - Based on role, the corresponding dashboard is shown:
     - Admin: Create/manage projects, view funds, assign workers
     - Worker: View assigned projects and update progress
     - Volunteer: View and sign up for volunteer tasks
     - Donor: View donation history

3. **Project Management:**
   - Admin fills out project form (name, funds, description)
   - On submit, the data is sent to the Node.js backend API via POST
   - Backend stores project in memory or database (e.g., MongoDB in future)

4. **Display + Interaction:**
   - Dashboards fetch relevant data from backend via API (GET requests)
   - Data is dynamically displayed using JS frontend logic

---

## 🗂️ File Structure

```
project-root/
├── backend/
│   ├── index.js                 # Main Express server file
│   ├── package.json            # Node dependencies
│   ├── routes/
│   │   └── projects.js         # API routes for project management
│   └── models/
│       └── projectModel.js     # Optional: schema definition for MongoDB
│
├── frontend/
│   ├── index.html              # Main UI
│   ├── style.css               # Custom styling
│   └── script.js               # JavaScript for API calls & DOM manipulation
│
├── setup-node-backend.sh      # Auto-setup script for Node.js backend
└── context.md                 # This documentation file
```

---

## 🧠 Functions Implemented

### 🔐 Auth Logic
- Basic password + role check
- UI-based routing using JS

### 📤 Project Handling
- `POST /projects` – Save new project data
- `GET /projects` – Retrieve all projects

### 🧩 Dashboard Interaction
- Show/hide dashboard based on role
- Dynamically load content

### 🌐 Frontend → Backend Connection
- `fetch()` requests for sending and retrieving data

### 🖥️ PM2 Integration
- Runs the backend persistently on VPS

---

## 🚀 Future Enhancements

### 🔐 Authentication
- Add JWT or session-based auth with user roles

### 🧾 Database Support
- Connect to **MongoDB Atlas** or **Supabase** for data persistence

### 🌍 Domain + HTTPS
- Configure **NGINX + Let's Encrypt**
- Use domain like `api.sadaqaworks.com`

### 📈 Admin Features
- Edit/Delete project entries
- Export project data (CSV/PDF)
- Dashboard analytics for funds & team activity

### 🤝 Worker & Volunteer Features
- Worker progress updates
- Volunteer scheduling system

### 💸 Donor Portal
- Donation entry form
- Stripe/PayPal integration
- PDF receipts + email confirmations

### 📱 Mobile Support
- Convert frontend to responsive PWA

---

Let me know if you want this as a downloadable `.md` file or in HTML format too!
