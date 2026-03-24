# 🏥 Healthcare Analytics with Temporal Data

A full-stack healthcare analytics system designed to manage patient records, track temporal medical history, and visualize insights using interactive dashboards.

---

## Live Demo

🔗 Frontend: https://healthcare-analytics-rho.vercel.app/  
🔗 Backend API: https://healthcare-backend-kr89.onrender.com 

---

## Project Overview

This project implements a **temporal healthcare database system** that stores and analyzes time-based patient data such as diagnosis history and treatment records.

It provides:
- Real-time analytics dashboards
- Role-based access system
- Historical tracking of patient data
- Full-stack deployment on cloud platforms

---

## Key Features

- 📊 **Interactive Dashboard** – Visualizes disease trends, patient growth, and treatment patterns  
- 🧾 **Temporal Data Tracking** – Maintains history using `valid_from` and `valid_to`  
- 👨‍⚕️ **User Management System** – Admin can add/manage users (doctor, nurse, admin)  
- 🔐 **Role-Based Access Control** – Secure access based on user roles  
- 🗂 **Access Logs & Audit Trail** – Tracks system usage  
- ☁️ **Cloud Deployment** – Fully deployed and accessible online  

---

## Tech Stack

### Frontend
- React.js
- Material UI (MUI)
- Chart.js

### Backend
- Node.js
- Express.js
- MySQL2
- REST APIs

### Database
- MySQL (Temporal Database Design)

### Deployment
- Vercel (Frontend)
- Render (Backend)
- Railway (Database)

---

## System Architecture

```

React (Vercel)
↓
Node.js API (Render)
↓
MySQL Database (Railway)

```

---

## Database Design

### Core Tables
- Patient
- Doctor
- Appointment

### Temporal Tables
- Diagnosis_History
- Treatment_History

### Security Module
- Access_Log
- Users

---

## Sample Analytics

- Disease Frequency Distribution  
- Patient Trend Over Time  
- Treatment Status Analysis  
- Access Logs Monitoring  

---

## Authentication

- Login-based access system  
- Role-based permissions (Admin / Doctor / Nurse)  
- Secure backend validation  

---

## Test Credentials

```

Username: admin
Password: admin123

````

---

## Notes

- Backend may take ~20–30 seconds to wake up (Render free tier)
- Ensure API URL is correctly configured in frontend environment variables

---

## Installation (Local Setup)

### 1. Clone Repo
```bash
git clone https://github.com/thegitguy-56/healthcare_project.git
````

---

### 2. Backend Setup

```bash
cd backend
npm install
node server.js
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Future Enhancements

* JWT Authentication
* Real-time notifications
* AI-based disease prediction
* Mobile app integration
* Advanced analytics dashboards

---

## Conclusion

This project demonstrates the implementation of a **temporal database system in healthcare**, combined with modern full-stack development and cloud deployment.

It showcases:

* Database design concepts (DBMS)
* API development
* Frontend dashboarding
* Real-world system deployment

---

## 👨‍💻 Author

Rohan V
BTech Student – Computer Science
Project: Healthcare Analytics with Temporal Data

---
