# 🛒 E-Commerce Platform

A full-stack **MERN** e-commerce application with secure authentication, role-based authorization, product management, payment integration, and scalable REST APIs.

> Built to demonstrate real-world backend engineering — JWT auth, Redux state management, Stripe payments, Cloudinary media, and a modular, production-ready architecture.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Security](#-security)
- [Third-Party Services](#-third-party-services)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication (access token + refresh token)
- Password hashing with **bcryptjs**
- Protected routes
- Role-based access control (**Admin / User**)

### 📦 Product Management
- Create, update, and delete products
- Fetch all products / product detail page
- Cloudinary image upload support

### 🛍️ Shopping
- Add to cart & cart management
- Stripe payment integration
- Full checkout flow

### 🛠️ Admin Dashboard
- Admin-only product management
- Protected admin APIs

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js, Redux Toolkit, React Router DOM, Axios, Vite |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Auth** | JWT, bcryptjs |
| **Media** | Cloudinary |
| **Payments** | Stripe |
| **Email** | Resend |

---

## 📁 Project Structure

```
BLINKIT/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── route/
│   ├── utils/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── vercel.json
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── common/
│       ├── components/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── provider/
│       ├── route/
│       ├── Store/
│       └── utils/
│   ├── App.jsx
│   ├── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB instance (local or Atlas)
- Cloudinary, Stripe, and Resend accounts

### 1. Clone the Repository

```bash
git clone https://github.com/Shubhamkumar000/E-commerce-platform.git
cd E-commerce-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend — `backend/.env`

```env
FRONTEND_URL=your_frontend_url

MONGODB_URL=your_mongodb_connection_string

RESEND_API=your_resend_api_key

SECRET_KEY_ACCESS_TOKEN=your_access_token_secret
SECRET_KEY_REFRESH_TOKEN=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET_KEY=your_cloudinary_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_ENDPOINT_WEBHOOK_KEY=your_webhook_secret
```

### Frontend — `frontend/.env`

```env
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/user/register` | Register a new user |
| `POST` | `/api/user/login` | Login user |
| `GET` | `/api/user/user-details` | Get authenticated user details |

### Products

| Method | Endpoint | Access |
|--------|----------|--------|
| `GET` | `/api/product/get-product` | Public |
| `POST` | `/api/product/create-product` | Admin only |
| `PUT` | `/api/product/update-product` | Admin only |
| `DELETE` | `/api/product/delete-product` | Admin only |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/order/checkout` | Initiate Stripe checkout |
| `POST` | `/api/order/webhook` | Stripe webhook handler |

> API testing can be done with **Postman** or **Swagger**.

---

## 🔒 Security

- JWT access & refresh token flow
- Password hashing via **bcryptjs**
- Protected route middleware
- Role-based authorization (Admin / User)
- Environment variable protection
- Input validation and sanitization

---

## ☁️ Third-Party Services

| Service | Purpose |
|---------|---------|
| **Cloudinary** | Image uploads and media storage |
| **Stripe** | Secure payment processing and checkout |
| **Resend** | Transactional email delivery |

---

## 🌍 Deployment

Frontend and backend can be deployed independently:

| Service | Use For |
|---------|---------|
| **Vercel** | Frontend (React/Vite) or Backend (Node/Express) |
| **Render** | Backend hosting |
| **Netlify** | Frontend hosting |

The backend already includes a `vercel.json` for one-click Vercel deployment.

---

## 🔮 Future Improvements

- [ ] Redis caching for performance
- [ ] Docker containerization
- [ ] Order tracking system
- [ ] Email notifications
- [ ] Load balancing
- [ ] Microservices architecture

---

<p align="center">Made with ❤️ by <a href="https://github.com/Shubhamkumar000">Shubham Kumar</a></p>
