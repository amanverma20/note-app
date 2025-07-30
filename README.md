# 🛣️ Highway Delite – Notes App with OTP & Google Authentication

Highway Delite is a full-stack, mobile-friendly note-taking app that allows users to securely sign up or log in using **Email OTP** or **Google OAuth**. Authenticated users can create and manage personal notes. All protected actions are secured using **JWT authentication**.

---

## ✨ Features

- ✅ Sign up/Login via **Email OTP**
- ✅ One-click Google Login via **OAuth**
- ✅ Protected Routes using **JWT tokens**
- ✅ Create and Delete personal Notes
- ✅ View authenticated user profile (name & email)
- ✅ Beautiful UI using **ShadCN** & **TailwindCSS**
- ✅ Toast notifications for real-time feedback
- ✅ Fully responsive on all devices

---

## 🛠️ Tech Stack

| Layer         | Tech Used                                |
|---------------|-------------------------------------------|
| Frontend      | React (TypeScript), Vite, ShadCN, TailwindCSS |
| Backend       | Node.js, Express (TypeScript)             |
| Auth          | SendGrid (Email OTP), Google OAuth        |
| Database      | MongoDB with Mongoose                     |
| Token System  | JSON Web Tokens (JWT)                     |
| Deployment    | Vercel (Frontend), Render (Backend)       |

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/highway-delite.git
cd highway-delite
```
---
### 2. Backend Setup
```bash
cd server
npm install
```
## Create a .env file in the server folder:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
GOOGLE_CLIENT_ID=your_google_client_id
```

## Run the server
```bash
npm run dev
```
---
### 3. Frontend Setup
```bash
cd ../client
npm install
```

## Create a .env file in the client folder:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Start The Frontend
```bash
npm run dev
```
---
### 🚀 Deployment

  <h3>Frontend (Vercel)</h3>
  <ul>
    <li>Connect your repo</li>
    <li>Set environment variables:
      <ul>
        <li><code>VITE_API_BASE_URL</code></li>
        <li><code>VITE_GOOGLE_CLIENT_ID</code></li>
      </ul>
    </li>
  </ul>

  <h3>Backend (Render)</h3>
  <ul>
    <li>Add environment variables:
      <ul>
        <li><code>MONGO_URI</code></li>
        <li><code>JWT_SECRET</code></li>
        <li><code>SENDGRID_API_KEY</code></li>
        <li><code>GOOGLE_CLIENT_ID</code></li>
      </ul>
    </li>
  </ul>

  <hr/>

### 📂 Folder Structure
  <pre><code>highway-delite/
│
├── client/              # React Frontend
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── lib/
│
├── server/              # Node.js Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── middlewares/
│
└── README.md</code></pre>
