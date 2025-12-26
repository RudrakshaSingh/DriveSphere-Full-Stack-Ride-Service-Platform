<p align="center">
  <img src="Frontend/src/assets/logo.png" alt="DriveSphere Logo" width="200"/>
</p>

<h1 align="center">🚗 DriveSphere</h1>

<p align="center">
  <strong>A Modern Ride-Sharing Platform</strong>
  <br/>
  <em>Connecting Riders with Captains in Real-Time</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Socket.io-Real--Time-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-ISC-blue?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome"/>
  <img src="https://img.shields.io/badge/Version-1.0.0-orange?style=flat-square" alt="Version"/>
</p>

---

## 📖 Overview

**DriveSphere** is a comprehensive, full-stack ride-sharing application built with the MERN stack. It provides a seamless experience for both **riders** (users) and **drivers** (captains), featuring real-time ride matching, live location tracking, fare calculation, secure payments, and interactive maps.

Whether you need a quick ride across town or want to earn as a driver, DriveSphere delivers a premium, Uber-like experience with modern UI/UX and robust backend architecture.

---

## ✨ Key Features

### 🚕 For Riders (Users)
| Feature | Description |
|---------|-------------|
| **Smart Booking** | Enter pickup & destination with autocomplete suggestions |
| **Real-Time Tracking** | Live map showing driver location and ETA |
| **Multi-Vehicle Options** | Choose from Car, Motorcycle, Auto, or Bus |
| **Fare Estimation** | Transparent pricing before confirming ride |
| **Secure Payments** | Cashfree integration for online payments |
| **Ride History** | Complete history with receipts and route maps |
| **Scratch Cards** | Win discounts through interactive scratch cards |
| **User Profiles** | Manage profile, view stats, and ride analytics |
| **Coupons** | Apply discount coupons for reduced fares |
| **Feedback System** | Rate and review completed rides |

### 🎯 For Drivers (Captains)
| Feature | Description |
|---------|-------------|
| **Ride Requests** | Real-time notifications for nearby ride requests |
| **Smart Matching** | Automatic matching based on location and availability |
| **OTP Verification** | Secure ride start with OTP verification |
| **Earnings Dashboard** | Track daily, weekly, and total earnings |
| **Ride Management** | Accept, start, and complete rides seamlessly |
| **Profile Management** | Vehicle info, documents, and performance stats |
| **Analytics** | Distance traveled, rides completed, and ratings |

### 🗺️ Maps & Navigation
- **Interactive Maps** powered by Leaflet.js
- **Real-Time Routing** with OpenRouteService API
- **Autocomplete Search** for addresses
- **Distance & Time Calculation** for accurate ETAs
- **Geolocation** for current position detection
- **Route Visualization** between pickup and destination

### 💬 Real-Time Features
- **Live Location Updates** via Socket.io
- **Instant Ride Matching** with nearby captains
- **In-App Chat** for rider-captain communication
- **Push Notifications** for ride status updates
- **Live Status Tracking** (pending → accepted → ongoing → completed)

### 🎨 Premium UI/UX
- **Modern Dark Theme** with vibrant accents
- **Smooth Animations** using Framer Motion
- **Responsive Design** for all devices
- **Glassmorphism Effects** for premium feel
- **Intuitive Navigation** with slide-up panels

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| Vite | 6.0.5 | Build Tool |
| Tailwind CSS | 3.4.17 | Styling |
| Framer Motion | 12.3.1 | Animations |
| Socket.io Client | 4.8.1 | Real-time Communication |
| Leaflet | 1.9.4 | Interactive Maps |
| React Router DOM | 7.1.3 | Routing |
| Axios | 1.7.9 | HTTP Client |
| Lucide React | 0.474.0 | Icons |
| React Hot Toast | 2.5.1 | Notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | - | Runtime |
| Express.js | 4.21.2 | Web Framework |
| MongoDB | - | Database |
| Mongoose | 8.9.5 | ODM |
| Socket.io | 4.8.1 | Real-time Communication |
| Cloudinary | 2.5.1 | Image Storage |
| Cashfree PG | 4.3.10 | Payment Gateway |
| JWT | 9.0.2 | Authentication |
| Bcrypt | 5.1.1 | Password Hashing |
| Express Validator | 7.2.1 | Input Validation |

### External APIs
| Service | Purpose |
|---------|---------|
| OpenRouteService | Geocoding, Autocomplete, Distance Matrix |
| Cloudinary | Image Upload & Storage |
| Cashfree | Payment Processing |

---

## 📁 Project Structure

```
DriveSphere/
├── 📂 Backend/                 # Node.js/Express Server
│   ├── controllers/           # Route handlers
│   ├── db/                    # Database configuration
│   ├── middlewares/           # Auth & error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   ├── socket.js              # Socket.io configuration
│   ├── app.js                 # Express app setup
│   └── server.js              # Entry point
│
├── 📂 Frontend/                # React SPA
│   ├── src/
│   │   ├── assets/            # Images, icons
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context providers
│   │   ├── pages/             # Page components
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   └── tailwind.config.js
│
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher
- **MongoDB** (local or Atlas cloud)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/RudrakshaSingh/DriveSphere-Full-Stack-Ride-Service-Platform.git
cd DriveSphere
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URL=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OpenRouteService (Maps)
OPEN_ROUTE_SERVICE_API_KEY=your_ors_api_key

# Cashfree Payments
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
```

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file:

```env
VITE_BASE_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 📱 Application Routes

### User Routes
| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | User login |
| `/signup` | User registration |
| `/home` | Main booking page |
| `/riding` | Active ride view |
| `/user-profile` | User profile |
| `/user-rideHistory` | Ride history |
| `/user-feedback` | Submit feedback |
| `/user-scratch-card` | Scratch card rewards |

### Captain Routes
| Route | Description |
|-------|-------------|
| `/captain-login` | Captain login |
| `/captain-signup` | Captain registration |
| `/captain-home` | Captain dashboard |
| `/captain-riding` | Active ride view |
| `/captain-profile` | Captain profile |
| `/captain-ride-history` | Ride history |
| `/captain-dashboard` | Earnings & analytics |

### General Routes
| Route | Description |
|-------|-------------|
| `/support` | Customer support |
| `/aboutus` | About page |
| `/chat` | Live chat |
| `/terms-of-service` | Terms of service |
| `/privacy-policy` | Privacy policy |

---

## 🔑 API Endpoints

For detailed API documentation, see [Backend README](./Backend/README.md).

### Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users/register` | POST | Register new user |
| `/users/login` | POST | User login |
| `/captains/register` | POST | Register new captain |
| `/captains/login` | POST | Captain login |
| `/rides/create` | POST | Create new ride |
| `/rides/fare` | GET | Get fare estimate |
| `/maps/suggestions` | GET | Address autocomplete |

---

## 🔒 Security Features

- ✅ **JWT Authentication** with HTTP-only cookies
- ✅ **Password Hashing** with bcrypt
- ✅ **Token Blacklisting** for secure logout
- ✅ **Input Validation** with express-validator
- ✅ **Protected Routes** on frontend and backend
- ✅ **OTP Verification** for ride security
- ✅ **CORS Configuration** for API security

---

## 🌟 Screenshots

<details>
<summary>Click to view screenshots</summary>

### Landing Page
![Landing Page](path/to/landing.png)

### Booking Interface
![Booking](path/to/booking.png)

### Captain Dashboard
![Captain Dashboard](path/to/captain-dashboard.png)

### Live Tracking
![Live Tracking](path/to/tracking.png)

</details>

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

<table>
  <tr>
    <td align="center">
      <strong>Thakur Rudraksha Singh</strong>
      <br/>
      <em>Full Stack Developer</em>
      <br/>
      <a href="https://github.com/RudrakshaSingh">GitHub</a>
    </td>
  </tr>
</table>

---

## 🙏 Acknowledgments

- [OpenRouteService](https://openrouteservice.org/) for mapping APIs
- [Cloudinary](https://cloudinary.com/) for image management
- [Cashfree](https://www.cashfree.com/) for payment processing
- [Socket.io](https://socket.io/) for real-time features
- [Leaflet](https://leafletjs.com/) for interactive maps

---

<p align="center">
  Made with ❤️ by Thakur Rudraksha Singh
</p>
