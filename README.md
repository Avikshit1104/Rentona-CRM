# 🏠 Rentona CRM

Rentona is a full-stack Property Management CRM that connects Property Owners, Tenants, and Workers on a single platform. It streamlines property listing, tenant applications, complaint management, worker assignment, rent tracking, real-time communication, notifications, and analytics.

---

## 🚀 Features

### 👤 Authentication & Authorization

* JWT-based authentication
* Role-based access control
* Separate dashboards for:

  * Owner
  * Tenant
  * Worker

---

### 🏠 Property Management

* Create and manage property listings
* Upload property images
* View all listed properties
* Property details page

---

### 📝 Tenant Applications

* Tenants can apply for properties
* Owners can:

  * Approve applications
  * Reject applications
* Application status tracking

---

### 🛠 Complaint Management

* Create maintenance complaints
* Upload complaint images
* Track complaint status
* Complaint lifecycle:

  * OPEN
  * ASSIGNED
  * COMPLETED

---

### 👷 Worker Management

* Worker registration with skills
* Nearby worker recommendations
* Smart worker recommendation system
* Assign workers to complaints
* Accept/Reject jobs
* Mark jobs as completed

---

### 💬 Real-Time Chat

* Socket.IO powered messaging
* Tenant ↔ Worker communication
* Job-specific chat rooms
* Real-time message updates

---

### 🔔 Notifications

* Real-time notifications
* Notification history
* Mark notifications as read
* Mark all notifications as read
* Unread notification tracking

---

### ⭐ Reviews & Ratings

* Rate workers after job completion
* Worker review system
* Dynamic worker ratings
* Review history

---

### 📊 Analytics Dashboard

* Revenue analytics
* Property statistics
* Complaint statistics
* Worker performance metrics

---

## 🛠 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* Recharts
* Socket.IO Client
* React Hot Toast

### Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Multer
* Socket.IO

### Database

* PostgreSQL

---

## 📂 Project Structure

```bash
Rentona-CRM/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── routes/
│   │
│   └── public/
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Avikshit1104/Rentona-CRM.git
cd Rentona-CRM
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

## 📸 Screenshots

Add screenshots here after deployment.

### Owner Dashboard

![Owner Dashboard](screenshots/owner-dashboard.png)

### Tenant Dashboard

![Tenant Dashboard](screenshots/tenant-dashboard.png)

### Worker Dashboard

![Worker Dashboard](screenshots/worker-dashboard.png)

### Job Chat

![Job Chat](screenshots/chat.png)

---

## 🔮 Future Enhancements

* Occupancy Management
* Rent Due Reminders
* Online Rent Payments
* Owner Chat Monitoring
* Cloudinary Image Storage
* AI-Based Worker Recommendation
* Mobile App Version

---

## 👨‍💻 Author

**Avikshit Bhowmick**

B.Tech ECE (Data Science Specialization)
SRM Institute of Science and Technology

GitHub: https://github.com/Avikshit1104

---

## 📜 License

This project is created for educational and portfolio purposes.
