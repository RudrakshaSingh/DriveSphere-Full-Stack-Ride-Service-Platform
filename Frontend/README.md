<h1 align="center">🎨 DriveSphere Frontend</h1>

<p align="center">
  <strong>Modern React SPA for Ride-Sharing Platform</strong>
  <br/>
  <em>Built with React 18, Vite, TailwindCSS & Framer Motion</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-6.0.5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io"/>
</p>

---

## 📖 Overview

The DriveSphere Frontend is a feature-rich, modern Single Page Application (SPA) that delivers a premium ride-sharing experience. Built with performance and user experience in mind, it features real-time updates, interactive maps, smooth animations, and a responsive design that works flawlessly across all devices.

---

## ✨ Features

### 🎯 Core Features
- **Intuitive Ride Booking** - Streamlined pickup/destination selection with autocomplete
- **Real-Time Tracking** - Live map updates showing driver location
- **Multi-Vehicle Selection** - Choose from cars, motorcycles, autos, and buses
- **Fare Transparency** - Upfront pricing before ride confirmation

### 🗺️ Maps & Navigation
- **Interactive Leaflet Maps** - Smooth, responsive map interface
- **Auto-Complete Search** - Smart address suggestions as you type
- **Route Visualization** - Visual route between pickup and destination
- **Geolocation** - One-tap current location detection
- **Routing Engine** - Powered by Leaflet Routing Machine

### 🎨 UI/UX Excellence
- **Dark Theme** - Eye-friendly dark mode design
- **Framer Motion Animations** - Buttery-smooth transitions and micro-interactions
- **Glassmorphism Effects** - Modern, premium visual aesthetics
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Slide-Up Panels** - Intuitive mobile-first navigation patterns

### 👤 User Features
- **Profile Management** - Edit profile, upload photos
- **Ride History** - Complete history with map visualization
- **Scratch Cards** - Interactive rewards system
- **Feedback System** - Rate and review rides
- **Coupon System** - Apply discount codes

### 🎯 Captain Features
- **Earnings Dashboard** - Track income with visual charts
- **Ride Management** - Accept, start, complete rides
- **Performance Stats** - Distance, time, and ratings
- **Profile & Vehicle Info** - Manage captain details

### 💬 Real-Time Communication
- **Socket.io Integration** - Instant ride updates
- **In-App Chat** - Communicate with captains/riders
- **Live Notifications** - Toast notifications for ride events

---

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React | 18.3.1 | UI Library |
| **Build Tool** | Vite | 6.0.5 | Development & Build |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-First CSS |
| **Animations** | Framer Motion | 12.3.1 | Smooth Animations |
| **Maps** | Leaflet | 1.9.4 | Interactive Maps |
| **Maps (React)** | React Leaflet | 4.2.1 | React Map Components |
| **Routing** | Leaflet Routing Machine | 3.2.12 | Route Calculation |
| **Navigation** | React Router DOM | 7.1.3 | Client-Side Routing |
| **HTTP Client** | Axios | 1.7.9 | API Requests |
| **Real-Time** | Socket.io Client | 4.8.1 | WebSocket Connection |
| **Icons** | Lucide React | 0.474.0 | Modern Icons |
| **Icons (Alt)** | React Icons | 5.4.0 | Additional Icons |
| **Icons (Alt)** | Remixicon | 4.6.0 | Remix Icons |
| **Notifications** | React Hot Toast | 2.5.1 | Toast Messages |
| **Charts** | React ChartJS 2 | 5.3.0 | Data Visualization |
| **Webcam** | React Webcam | 7.2.0 | Profile Photos |
| **Effects** | React Confetti | 6.4.0 | Celebration Effects |
| **Loading** | React Loader Spinner | 6.1.6 | Loading States |
| **Cookies** | js-cookie | 3.0.5 | Cookie Management |
| **Payments** | Cashfree Payments | 1.0.5 | Payment Integration |

### Dev Dependencies
| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | 9.17.0 | Code Linting |
| PostCSS | 8.5.1 | CSS Processing |
| Autoprefixer | 10.4.20 | CSS Vendor Prefixes |

---

## 📁 Project Structure

```
Frontend/
├── 📂 src/
│   ├── 📂 assets/                 # Static assets
│   │   └── logo.png
│   │
│   ├── 📂 components/             # Reusable components
│   │   ├── 📂 CaptainMenu/        # Captain-specific components
│   │   │   ├── CaptainDashboard.jsx
│   │   │   ├── CaptainMenuPanel.jsx
│   │   │   ├── CaptainProfile.jsx
│   │   │   └── CaptainRideHistory.jsx
│   │   │
│   │   ├── 📂 UserMenu/           # User-specific components
│   │   │   ├── Feedback.jsx
│   │   │   ├── RideHistory.jsx
│   │   │   ├── ScratchCard.jsx
│   │   │   ├── UserHistoryMap.jsx
│   │   │   ├── UserMenuPanel.jsx
│   │   │   └── UserProfile.jsx
│   │   │
│   │   ├── 📂 Chat/               # Chat components
│   │   │   └── ChatComponent.jsx
│   │   │
│   │   ├── CaptainDetails.jsx     # Captain info card
│   │   ├── ConfirmRide.jsx        # Ride confirmation panel
│   │   ├── ConfirmRidePopUp.jsx   # Captain ride popup
│   │   ├── FinishRide.jsx         # Ride completion screen
│   │   ├── LocationSearchPanel.jsx # Address search
│   │   ├── LookingForDriver.jsx   # Driver search animation
│   │   ├── MapComponent.jsx       # Main map component
│   │   ├── RidePopUp.jsx          # Ride request popup
│   │   ├── VehiclePanel.jsx       # Vehicle selection
│   │   └── WaitingForDriver.jsx   # Waiting screen
│   │
│   ├── 📂 context/                # React Context providers
│   │   ├── CapatainContext.jsx    # Captain state
│   │   ├── SocketContext.jsx      # Socket.io provider
│   │   └── UserContext.jsx        # User state
│   │
│   ├── 📂 pages/                  # Page components
│   │   ├── 📂 Policy/             # Legal pages
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   └── TermsofService.jsx
│   │   │
│   │   ├── AboutUs.jsx            # About page
│   │   ├── CaptainHome.jsx        # Captain dashboard
│   │   ├── CaptainLogin.jsx       # Captain login
│   │   ├── CaptainProtectWrapper.jsx
│   │   ├── CaptainRiding.jsx      # Captain ride view
│   │   ├── CaptainSignup.jsx      # Captain registration
│   │   ├── Error.jsx              # 404 page
│   │   ├── Home.jsx               # Main booking page
│   │   ├── Riding.jsx             # User ride view
│   │   ├── Start.jsx              # Landing page
│   │   ├── Support.jsx            # Support page
│   │   ├── UserLogin.jsx          # User login
│   │   ├── UserProtectWrapper.jsx # Auth guard
│   │   └── UserSignup.jsx         # User registration
│   │
│   ├── App.jsx                    # Main app component
│   ├── App.css                    # App styles
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Entry point
│
├── 📄 index.html                  # HTML template
├── 📄 package.json                # Dependencies
├── 📄 tailwind.config.js          # Tailwind configuration
├── 📄 postcss.config.js           # PostCSS configuration
├── 📄 vite.config.js              # Vite configuration
├── 📄 eslint.config.js            # ESLint configuration
└── 📄 vercel.json                 # Vercel deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** or **yarn**

### Installation

1. **Navigate to Frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   
   Create a `.env` file in the Frontend directory:
   ```env
   VITE_BASE_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

---

## 📱 Application Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Start` | Landing page with login options |
| `/login` | `UserLogin` | User login page |
| `/signup` | `UserSignup` | User registration |
| `/captain-login` | `CaptainLogin` | Captain login page |
| `/captain-signup` | `CaptainSignup` | Captain registration |
| `/support` | `Support` | Customer support |
| `/aboutus` | `AboutUs` | About the app |
| `/chat` | `ChatComponent` | Live chat support |
| `/terms-of-service` | `TermsOfService` | Terms & conditions |
| `/privacy-policy` | `PrivacyPolicy` | Privacy policy |

### Protected User Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/home` | `Home` | Main booking page |
| `/riding` | `Riding` | Active ride view |
| `/user-profile` | `UserProfile` | Profile management |
| `/user-rideHistory` | `RideHistory` | Past rides |
| `/user-feedback` | `Feedback` | Submit feedback |
| `/user-scratch-card` | `ScratchCard` | Scratch card rewards |

### Protected Captain Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/captain-home` | `CaptainHome` | Captain dashboard |
| `/captain-riding` | `CaptainRiding` | Active ride view |
| `/captain-profile` | `CaptainProfile` | Profile management |
| `/captain-ride-history` | `CaptainRideHistory` | Past rides |
| `/captain-dashboard` | `CaptainDashboard` | Earnings & analytics |

---

## 🔌 Context Providers

### UserContext
Manages user authentication state and profile data.

```jsx
import { useContext } from 'react';
import { UserDataContext } from './context/UserContext';

const { user, setUser } = useContext(UserDataContext);
```

### CaptainContext
Manages captain authentication state and profile data.

```jsx
import { useContext } from 'react';
import { CaptainDataContext } from './context/CapatainContext';

const { captain, setCaptain } = useContext(CaptainDataContext);
```

### SocketContext
Provides Socket.io connection throughout the app.

```jsx
import { useContext } from 'react';
import { SocketContext } from './context/SocketContext';

const { socket } = useContext(SocketContext);
```

---

## 🗺️ Map Integration

The app uses **Leaflet** with **React-Leaflet** for interactive maps:

```jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

<MapContainer center={[lat, lng]} zoom={13}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <Marker position={[lat, lng]}>
    <Popup>Your location</Popup>
  </Marker>
</MapContainer>
```

### Features:
- Custom markers for pickup/destination
- Route visualization with Leaflet Routing Machine
- Real-time marker updates
- Responsive map controls

---

## 🔌 Socket.io Events

### Client Events (Emit)
| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `{ userId, userType }` | Join user/captain room |
| `update-location-user` | `{ userId, location }` | Update user location |
| `update-location-captain` | `{ captainId, location }` | Update captain location |

### Server Events (Listen)
| Event | Payload | Description |
|-------|---------|-------------|
| `new-ride` | `{ ride }` | New ride request (captain) |
| `ride-confirmed` | `{ ride }` | Ride accepted (user) |
| `ride-started` | `{ ride }` | Ride started (user) |
| `ride-ended` | `{ ride }` | Ride completed (both) |

---

## 🎨 Styling Guidelines

### Tailwind CSS
- Uses Tailwind CSS v3.4 for utility-first styling
- Custom configuration in `tailwind.config.js`
- Dark theme optimized

### Framer Motion
- Used for page transitions and micro-interactions
- Slide-up panels with gesture support
- Smooth fade/scale animations

### Color Palette
```css
/* Primary Colors */
--primary: #f59e0b;      /* Amber/Orange */
--primary-dark: #d97706;
--background: #1a1a1a;   /* Dark background */
--surface: #2a2a2a;      /* Card surfaces */
--text: #ffffff;         /* Primary text */
--text-muted: #9ca3af;   /* Secondary text */
```

---

## 📦 Build Configuration

### Vite Config
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### Tailwind Config
```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## 🚀 Deployment

### Vercel (Recommended)
The project includes `vercel.json` for easy deployment:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Deploy with:
```bash
vercel deploy
```

### Other Platforms
For other platforms, ensure:
1. Build the project: `npm run build`
2. Serve the `dist` folder
3. Configure SPA redirects (all routes → index.html)

---

## 🧪 Development Tips

### Hot Module Replacement
Vite provides instant HMR for React components.

### ESLint
Run linting to catch issues:
```bash
npm run lint
```

### Debugging
- Use React DevTools for component inspection
- Socket.io debugging: Enable debug logs in browser console
- Network tab for API debugging

---

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_BASE_URL` | ✅ | Backend API URL |

> **Note**: Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**Thakur Rudraksha Singh**

---

<p align="center">
  Made with ❤️ and React
</p>
