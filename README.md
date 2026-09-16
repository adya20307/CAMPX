# CAMPX — Campus Management System

> A modern digital campus management platform for students, faculty, administrators, and campus services.

## 📌 About CAMPX

**CAMPX** is a full-stack campus management system designed to bring important college services into one platform.

It provides separate experiences for:

- 🎓 Students
- 👨‍💼 Admins
- 🛡️ Super Admin
- 🏢 Department-based administrators

The platform combines academic services, student services, campus communication, administration, hostel services, and other institutional workflows in a single web application.

---

## ✨ Key Features

### 🎓 Student Portal

Students can access:

- Student Dashboard
- Student Profile
- Attendance
- Overall Attendance
- Today's Class Schedule
- Weekly Timetable
- Complaints
- AI Assistant / CAMPY
- Requests
- Applications
- Notifications
- Gate Pass
- Canteen Menu
- Settings

Hosteller-specific services such as Gate Pass and Canteen are shown only to eligible hosteller students.

### 📊 Attendance

The attendance module provides:

- Subject-wise attendance
- Overall attendance percentage
- Present classes / total classes
- Attendance progress
- Subjects below the required percentage
- Attendance fine calculation
- Attendance alerts

The Student Dashboard also provides a quick overview of overall attendance.

### 📅 Timetable

Students can view:

- Today's classes
- Weekly schedule
- Class time
- Subject
- Faculty
- Classroom / lab
- Academic status
- Academic holidays

### 🤖 CAMPY AI Assistant

CAMPY is the campus AI assistant interface that helps students describe campus-related needs in their own words and access relevant campus services.

### 📝 Complaints & Requests

Students can:

- Submit complaints
- Track complaint status
- Submit service requests
- Track requests
- View recent activity

The system is designed to support department-based handling of campus issues.

### 🔔 Notifications

CAMPX supports student and administration notifications so users can receive relevant campus updates.

### 🏠 Hostel Services

Hosteller students can access:

- Gate Pass
- Hostel-related services
- Canteen menu

### 🍽️ Canteen

The canteen module provides a daily menu with:

- Breakfast
- Lunch
- Evening Snacks
- Dinner
- Item availability

---

## 🛡️ Administration

### Super Admin

The Super Admin has system-wide administrative access and can:

- View the administration dashboard
- Register Admins
- Assign Admin departments
- View registered Admins
- Delete normal Admin accounts
- Manage students
- Access administrative modules
- Monitor campus services

The Super Admin account cannot be deleted through the normal Admin deletion flow.

### Department Admins

CAMPX supports department-based administrative access.

Departments include:

| Department | Main Responsibilities |
|---|---|
| Documentation | Requests, Applications, Complaint Records, Student Documents |
| Accounts | Fee Payment, Refund Requests, Scholarships, Financial Records |
| Academic / Class | Attendance, Timetable, Course Registration, Academic Control |
| Examination | Exam Forms, Admit Cards, Results, Revaluation |
| Notice & Communication | Notifications, Circulars, Announcements |
| Hostel | Hostel Complaints, Room Allocation, Gate Pass Approvals |
| Student Affairs | Student Profiles, Student Services, Clubs & Activities |
| Administration | Dashboard, Overview, User Management, Gate Pass Monitoring |
| Library | Book Issue/Return, Fine Management |
| Transport | Bus Routes, Transport Requests |
| IT Services | Settings, Technical Support, System Maintenance |
| Placement | Job Postings, Company Drives, Placement Records |
| Discipline | Misconduct Reports, Disciplinary Actions |
| Health & Emergency | Medical Assistance, Emergency Reporting |
| Infrastructure & Maintenance | Electrical Complaints, Water Issues, Classroom Maintenance |
| Mess / Food Services | Food Complaints, Menu Management, Mess Feedback |

Access control is enforced through backend authentication and department permissions rather than relying only on frontend navigation.

---

## 👥 User Roles

### Student

Students use:

```text
/login
```

Student access includes academic and campus services according to their student profile.

### Admin / Super Admin

Admins use:

```text
/admin
```

The same login page handles both Admin and Super Admin accounts.

After authentication, the system identifies the user's role and department permissions.

---

## 🏗️ Technology Stack

### Frontend

- React
- Vite
- React Router
- Lucide React
- CSS

### Backend

- Node.js
- Express.js
- MySQL
- mysql2
- JWT authentication
- bcryptjs
- dotenv
- CORS

### Database

CAMPX uses MySQL for persistent application data.

Major database areas include:

- Students
- Faculty/Admins
- Complaints
- Requests
- Applications
- Attendance
- Notifications
- Gate Passes
- Hackathon Teams
- Canteen Menu
- Department assignments

---

## 📂 Project Structure

```text
CAMPX/
│
├── backend/
│   ├── config/
│   │   └── departmentPermissions.js
│   │
│   ├── middleware/
│   │   └── departmentAuth.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── canteen.js
│   │   ├── faculty.js
│   │   └── students.js
│   │
│   ├── db.js
│   ├── seed.js
│   └── server.js
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

---

## 🔐 Authentication & Security

CAMPX uses:

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Department-based permissions
- Protected backend routes
- Protected student/admin operations
- Super Admin-only Admin management

Sensitive environment variables should be stored in `.env` and should **not** be committed to GitHub.

Use `.env.example` as the configuration reference.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/adya20307/CAMPX.git
cd CAMPX
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create:

```text
backend/.env
```

Use the project's `.env.example` as the reference for the required values.

Do not publish database passwords, JWT secrets, or other private credentials.

### 5. Create the MySQL database

Create a MySQL database named:

```text
campx
```

Then configure the database connection in the backend environment file.

### 6. Start the backend

From the `backend` directory:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### 7. Start the frontend

From the project root:

```bash
npm run dev
```

The Vite development server normally runs on:

```text
http://localhost:5173
```

---

## 🔌 API Structure

Main API groups:

```text
/api/auth
/api/students
/api/faculty
/api/canteen
```

Examples:

```text
/api/auth/student/login
/api/auth/admin/login
/api/faculty/admin
/api/faculty/admins
/api/students
/api/canteen/today
```

Protected routes require the appropriate authentication token and permissions.

---

## 🧪 Development

Before making changes:

1. Start MySQL.
2. Start the CAMPX backend.
3. Start the React/Vite frontend.
4. Test the affected role and module.
5. Verify protected routes.
6. Run a production build before major releases.

Frontend build:

```bash
npm run build
```

---

## 📱 Main Application Areas

```text
Student
├── Dashboard
├── Profile
├── Attendance
├── Timetable
├── Complaints
├── AI Assistant
├── Requests
├── Applications
├── Notifications
├── Gate Pass
└── Canteen

Administration
├── Dashboard
├── Admin Management
├── Student Management
├── Complaints
├── Requests
├── Applications
├── Attendance
├── Academic Control
├── Notifications
├── Gate Pass
├── Library
├── Hostel
├── Transport
├── Placement
├── Accounts
└── Canteen
```

---

## 🎯 Project Goals

CAMPX aims to:

- Digitize campus services
- Reduce manual administrative processes
- Provide students with a single campus portal
- Improve communication between students and departments
- Provide role-based administrative control
- Centralize academic and campus information
- Make department workflows easier to manage

---

## 🔮 Future Scope

Potential future improvements include:

- Production deployment
- Cloud database integration
- Real-time notifications
- Online fee payment
- Advanced attendance analytics
- Mobile application
- Enhanced AI-powered campus support
- Automated department routing
- Advanced reports and analytics
- Institution-wide integrations

---

## 📸 Screenshots

Add project screenshots here as the project presentation is finalized.

Recommended screenshots:

1. Student Login
2. Student Dashboard
3. Overall Attendance
4. Timetable
5. CAMPY AI Assistant
6. Admin Dashboard
7. Admin Management
8. Add Admin
9. Student Management
10. Canteen Menu

---

## 👨‍💻 Project

**CAMPX — Campus Management System**

GitHub:

https://github.com/adya20307/CAMPX

---

## 📄 License

This project is currently maintained as an academic/project implementation.

Add an appropriate open-source license if the project is later intended for public redistribution.
