<h1 align="center">⚙️ DriveSphere Backend</h1>

<p align="center">
  <strong>RESTful API Server for Ride-Sharing Platform</strong>
  <br/>
  <em>Built with Node.js, Express, MongoDB & Socket.io</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io"/>
  <img src="https://img.shields.io/badge/Cashfree-Payments-6772E5?style=for-the-badge" alt="Cashfree"/>
</p>

---

## 📖 Overview

The DriveSphere Backend is a robust, scalable RESTful API server that powers the ride-sharing platform. Built with Express.js and MongoDB, it handles user authentication, ride management, real-time communication, payment processing, and maps integration.

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT-Based Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt encryption
- **Token Blacklisting** - Secure logout mechanism
- **Protected Routes** - Middleware-based access control
- **Input Validation** - Express-validator integration

### 🚗 Ride Management
- **Create Rides** - Full ride lifecycle management
- **Fare Calculation** - Distance-based pricing
- **OTP Verification** - Secure ride start
- **Status Tracking** - Pending → Accepted → Ongoing → Completed
- **Ride History** - Complete ride records

### 👤 User Management
- **User Registration & Login**
- **Profile Management** - Photo uploads via Cloudinary
- **Ride Statistics** - Total rides, distance, spending
- **Coupon System** - Discount code validation

### 🎯 Captain Management
- **Captain Registration** - With vehicle details
- **Location Updates** - Real-time position tracking
- **Earnings Dashboard** - Track income and stats
- **Availability Status** - Online/Offline toggle
- **Performance Metrics** - Rides, earnings, ratings

### 💳 Payment Integration
- **Cashfree Gateway** - Secure payment processing
- **Order Creation** - Payment link generation
- **Status Verification** - Payment confirmation
- **Transaction Records** - Payment history

### 🗺️ Maps & Geolocation
- **Address Geocoding** - Convert addresses to coordinates
- **Autocomplete** - Smart address suggestions
- **Distance Matrix** - Calculate distance & time
- **Captain Matching** - Find nearby available drivers
- **Haversine Formula** - Accurate distance calculation

### 💬 Real-Time Communication
- **Socket.io Integration** - WebSocket connections
- **Live Ride Updates** - Instant status changes
- **Location Broadcasting** - Real-time position updates
- **Event-Based Architecture** - Scalable messaging

### 📝 Additional Features
- **Feedback System** - Ride ratings and reviews
- **Support Tickets** - Customer support integration
- **Message Storage** - Chat history
- **Coupon Management** - Discount validation

---

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Runtime** | Node.js | - | JavaScript Runtime |
| **Framework** | Express.js | 4.21.2 | Web Framework |
| **Database** | MongoDB | - | NoSQL Database |
| **ODM** | Mongoose | 8.9.5 | MongoDB ODM |
| **Real-Time** | Socket.io | 4.8.1 | WebSocket Server |
| **Auth** | JWT | 9.0.2 | Token Authentication |
| **Security** | Bcrypt | 5.1.1 | Password Hashing |
| **Validation** | Express Validator | 7.2.1 | Input Validation |
| **File Upload** | Multer | 1.4.5 | Multipart Form Data |
| **Image Storage** | Cloudinary | 2.5.1 | Cloud Image Storage |
| **Payments** | Cashfree PG | 4.3.10 | Payment Gateway |
| **HTTP Client** | Axios | 1.7.9 | External API Calls |
| **Dev Server** | Nodemon | 3.1.10 | Hot Reload |

---

## 📁 Project Structure

```
Backend/
├── 📂 controllers/              # Request handlers
│   ├── captain.controller.js   # Captain operations
│   ├── extra.controller.js     # Coupons, feedback
│   ├── map.controller.js       # Maps operations
│   ├── payment.controller.js   # Payment processing
│   ├── ride.controller.js      # Ride management
│   └── user.controller.js      # User operations
│
├── 📂 db/                       # Database configuration
│   └── db.js                   # MongoDB connection
│
├── 📂 middlewares/              # Express middlewares
│   ├── auth.middleware.js      # JWT verification
│   ├── errorHandler.js         # Error handling
│   └── multer.middleware.js    # File upload config
│
├── 📂 models/                   # Mongoose schemas
│   ├── blackListToken.model.js # Token blacklist
│   ├── captain.model.js        # Captain schema
│   ├── coupon.model.js         # Coupon schema
│   ├── feedback.model.js       # Feedback schema
│   ├── message.model.js        # Chat messages
│   ├── ride.model.js           # Ride schema
│   ├── support.model.js        # Support tickets
│   └── user.model.js           # User schema
│
├── 📂 routes/                   # API routes
│   ├── captain.routes.js       # /captains/*
│   ├── extra.routes.js         # /extra/*
│   ├── maps.routes.js          # /maps/*
│   ├── payment.routes.js       # /payment/*
│   ├── ride.routes.js          # /rides/*
│   └── user.routes.js          # /users/*
│
├── 📂 services/                 # Business logic
│   ├── captain.service.js      # Captain logic
│   ├── maps.service.js         # Maps API integration
│   ├── payment.service.js      # Payment processing
│   ├── ride.service.js         # Ride logic
│   └── user.service.js         # User logic
│
├── 📂 utils/                    # Utility functions
│   ├── ApiError.js             # Error class
│   ├── ApiResponse.js          # Response formatter
│   ├── AsyncHandler.js         # Async wrapper
│   └── Cloudinary.js           # Image upload
│
├── 📂 public/                   # Static files (temp uploads)
│
├── 📄 app.js                    # Express app setup
├── 📄 server.js                 # Entry point
├── 📄 socket.js                 # Socket.io config
└── 📄 package.json              # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Installation

1. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   
   Create a `.env` file:
   ```env
   # Server Configuration
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   
   # Database
   MONGODB_URL=mongodb://localhost:27017/drivesphere
   
   # Authentication
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Cloudinary (Image Uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # OpenRouteService (Maps & Geocoding)
   OPEN_ROUTE_SERVICE_API_KEY=your_ors_api_key
   
   # Cashfree Payments
   CASHFREE_APP_ID=your_cashfree_app_id
   CASHFREE_SECRET_KEY=your_cashfree_secret_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Server running**
   
   API available at `http://localhost:5000`

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000
```

---

## 👤 User Endpoints

### Register User
```http
POST /users/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Success Response (201)**
```json
{
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

---

### Login User
```http
POST /users/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Success Response (200)**
```json
{
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

---

### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

**Success Response (200)**
```json
{
  "_id": "user_id",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "ridesCompleted": 10,
  "totalMoneySpend": 5000,
  "totalDistance": 150.5,
  "totalTime": 300
}
```

---

### Logout User
```http
GET /users/logout
Authorization: Bearer <token>
```

**Success Response (200)**
```json
{
  "message": "Logged out successfully"
}
```

---

## 🎯 Captain Endpoints

### Register Captain
```http
POST /captains/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Driver"
  },
  "email": "jane.driver@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

**Vehicle Types**: `car`, `motorcycle`, `bus`, `auto`

**Success Response (201)**
```json
{
  "token": "jwt_token",
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Driver"
    },
    "email": "jane.driver@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

---

### Login Captain
```http
POST /captains/login
Content-Type: application/json

{
  "email": "jane.driver@example.com",
  "password": "password123"
}
```

---

### Get Captain Profile
```http
GET /captains/profile
Authorization: Bearer <token>
```

---

### Update Captain Location
```http
PUT /captains/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

**Success Response (200)**
```json
{
  "_id": "captain_id",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  ...
}
```

---

### Logout Captain
```http
GET /captains/logout
Authorization: Bearer <token>
```

---

## 🚗 Ride Endpoints

### Create Ride
```http
POST /rides/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "origin": [77.2090, 28.6139],
  "destination": [77.2167, 28.6448],
  "vehicleType": "car",
  "originText": "Connaught Place, Delhi",
  "destinationText": "India Gate, Delhi",
  "couponResponse": null
}
```

**Success Response (201)**
```json
{
  "status": 201,
  "message": "Ride created successfully",
  "data": {
    "_id": "ride_id",
    "user": "user_id",
    "origin": [77.2090, 28.6139],
    "destination": [77.2167, 28.6448],
    "fare": "150",
    "status": "pending",
    "vehicleType": "car",
    "duration": "15",
    "distance": "5.5"
  }
}
```

---

### Get Fare Estimate
```http
GET /rides/fare?originLatitute=28.6139&originLongitude=77.2090&destinationLatitude=28.6448&destinationLongitude=77.2167
Authorization: Bearer <token>
```

**Success Response (200)**
```json
{
  "status": 200,
  "message": "Fare fetched successfully",
  "data": {
    "car": 150,
    "motorcycle": 80,
    "auto": 100,
    "bus": 50,
    "distance": "5.5",
    "duration": "15"
  }
}
```

---

### Confirm Ride (Captain)
```http
POST /rides/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "rideId": "ride_id"
}
```

---

### Start Ride (Captain)
```http
GET /rides/start-ride?rideId=ride_id&otp=1234
Authorization: Bearer <token>
```

---

### End Ride (Captain)
```http
POST /rides/end-ride
Authorization: Bearer <token>
Content-Type: application/json

{
  "rideId": "ride_id",
  "discountAmount": 130
}
```

---

## 🗺️ Maps Endpoints

### Get Address Suggestions
```http
GET /maps/suggestions?address=Connaught
Authorization: Bearer <token>
```

**Success Response (200)**
```json
{
  "status": 200,
  "data": [
    "Connaught Place",
    "Connaught Circus",
    "Connaught Lane"
  ]
}
```

---

### Get Coordinates
```http
GET /maps/coordinates?address=Connaught Place, Delhi
Authorization: Bearer <token>
```

**Success Response (200)**
```json
{
  "status": 200,
  "data": {
    "latitude": 28.6315,
    "longitude": 77.2167
  }
}
```

---

### Get Distance & Time
```http
GET /maps/distance-time?originLongitude=77.2090&originLatitude=28.6139&destinationLongitude=77.2167&destinationLatitude=28.6448
Authorization: Bearer <token>
```

**Success Response (200)**
```json
{
  "status": 200,
  "data": {
    "distance": "5.5",
    "duration": "15.00"
  }
}
```

---

## 💳 Payment Endpoints

### Create Payment Order
```http
POST /payment/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "rideId": "ride_id",
  "amount": 150
}
```

---

### Verify Payment
```http
POST /payment/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_id"
}
```

---

## 📦 Extra Endpoints

### Validate Coupon
```http
POST /extra/validate-coupon
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "DISCOUNT50"
}
```

---

### Submit Feedback
```http
POST /extra/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "rideId": "ride_id",
  "rating": 5,
  "comment": "Great ride!"
}
```

---

## 🔌 Socket.io Events

### Connection Setup
```javascript
const socket = io('http://localhost:5000');
```

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `{ userId, userType }` | Register user/captain |
| `update-location-user` | `{ userId, location }` | Update user location |
| `update-location-captain` | `{ captainId, location }` | Update captain location |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `new-ride` | `{ ride }` | New ride request (captains) |
| `ride-confirmed` | `{ ride }` | Ride accepted (user) |
| `ride-started` | `{ ride }` | Ride started (user) |
| `ride-ended` | `{ ride }` | Ride completed (both) |

---

## 🔐 Authentication Flow

1. **Registration/Login** → Returns JWT token
2. **Token Storage** → Client stores token (cookie/localStorage)
3. **Protected Requests** → Include `Authorization: Bearer <token>` header
4. **Middleware Verification** → `auth.middleware.js` validates token
5. **Logout** → Token added to blacklist

---

## 📊 Database Models

### User Model
```javascript
{
  fullname: { firstname, lastname },
  email: String,
  password: String (hashed),
  socketId: String,
  profilePhoto: String (URL),
  ridesCompleted: Number,
  totalMoneySpend: Number,
  totalDistance: Number,
  totalTime: Number
}
```

### Captain Model
```javascript
{
  fullname: { firstname, lastname },
  email: String,
  password: String (hashed),
  socketId: String,
  status: "active" | "inactive",
  vehicle: { color, plate, capacity, vehicleType },
  location: { latitude, longitude },
  RideDone: Number,
  TotalEarnings: Number,
  distanceTravelled: Number,
  minutesWorked: Number
}
```

### Ride Model
```javascript
{
  user: ObjectId (ref: User),
  captain: ObjectId (ref: Captain),
  origin: [longitude, latitude],
  destination: [longitude, latitude],
  originText: String,
  destinationText: String,
  fare: String,
  status: "pending" | "accepted" | "ongoing" | "completed" | "cancelled",
  duration: String,
  distance: String,
  payment: { orderId, transactionId, date, amount, paymentMethod },
  otp: String (hidden)
}
```

---

## 🔧 Utility Classes

### ApiError
Custom error class for consistent error handling.
```javascript
throw new ApiError(400, "Invalid input", errors);
```

### ApiResponse
Standard response format.
```javascript
return res.status(200).json(new ApiResponse(200, "Success", data));
```

### AsyncHandler
Wraps async functions for error handling.
```javascript
module.exports.myController = asyncHandler(async (req, res) => {
  // controller logic
});
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | ✅ | Server port (default: 5000) |
| `FRONTEND_URL` | ✅ | Frontend URL for CORS |
| `MONGODB_URL` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `OPEN_ROUTE_SERVICE_API_KEY` | ✅ | ORS API key |
| `CASHFREE_APP_ID` | ✅ | Cashfree app ID |
| `CASHFREE_SECRET_KEY` | ✅ | Cashfree secret key |

---

## 🚀 Deployment

### Railway/Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**Thakur Rudraksha Singh**

---

<p align="center">
  Made with ❤️ and Node.js
</p>
