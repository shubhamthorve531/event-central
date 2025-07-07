# 🎟️ Event Central — Full-Stack Event Management Platform

**Event Central** is a full-stack web application that enables users to discover, register, and provide feedback for events, while giving admins the ability to manage events, view feedback, and analyze attendee data — all in real time.

---

## 🚀 Tech Stack

* **Frontend**: React (Vite) + TypeScript + Tailwind CSS
* **Backend**: .NET 8 Web API (C#)
* **Database**: Azure SQL
* **Authentication**: JWT-based auth with role support (`admin`, `user`)
* **Cloud Services**:

  * Azure Blob Storage (file/resource uploads)
  * Azure OpenAI (sentiment analysis for feedback)
  * Azure App Service (backend deployment)
  * Azure Static Web Apps (frontend deployment)

---

## 📸 Features

### 👤 User

* View all upcoming events
* Register for events
* View event details
* Submit post-event feedback (text-based)
* Get confirmation emails (optional extension)

### 🛠 Admin

* Create, edit, delete events
* View registered users per event
* See real-time feedback with sentiment insights (via OpenAI)
* Upload/download event resources (e.g., PPTs, brochures)
* View analytics dashboard

---

## 📁 Project Structure

```
event-central/
├── backend/                  # .NET 8 API
│   ├── Controllers/
│   ├── Models/
│   ├── DTOs/
│   ├── Services/
│   └── Program.cs
│
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.tsx
│   └── index.html
│
└── README.md
```

---

## 🧪 Setup Instructions

### ⚙ Backend (.NET API)

1. Navigate to backend:

   ```bash
   cd backend
   ```

2. Configure `appsettings.json` with Azure SQL and JWT key.

3. Run EF migrations:

   ```bash
   dotnet ef database update
   ```

4. Start the API:

   ```bash
   dotnet run
   ```

---

### 💻 Frontend (React)

1. Navigate to frontend:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run locally:

   ```bash
   npm run dev
   ```

---

## 🔐 Demo Credentials (for testing)

> **Admin Login**

```
email: admin@example.com  
password: admin123
```

> **User Login**

```
email: user@example.com  
password: user123
```

> Or use the Register screen to create your own account.

---

## 🌐 Deployment

* **Frontend**: Azure Static Web Apps
* **Backend**: Azure App Service
* **Database**: Azure SQL
* **Storage**: Azure Blob
* **AI Feedback**: Azure OpenAI (GPT-based sentiment + summary)

---

## 📈 Screenshots

*Coming soon...*

---

## 📚 License

MIT — Feel free to use, fork, or modify.

---

## 👨‍💻 Author

**Shubham Thorve**
🔗 [LinkedIn](https://www.linkedin.com/in/shubhamthorve) • 💻 [GitHub](https://github.com/shubhamthorve)

---
