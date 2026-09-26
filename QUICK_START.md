# 🚀 Bus Ticketing System - Quick Start Guide

## 📋 What Your Instructor Will See

A **50% functional** bus ticketing system with:
- ✅ Real database with SQLite
- ✅ Working authentication (login/register)
- ✅ Functional booking system
- ✅ Admin panel with CRUD operations
- ✅ Real data persistence

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database & Seed Data
```bash
npm run db:setup
```
This creates the database and adds sample data automatically.

### Step 3: Run the Development Server
```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🔐 Test Accounts

### Admin Account
- **Email:** `admin@busticket.com`
- **Password:** `admin123`
- **Access:** Full admin dashboard

### Passenger Account
- **Email:** `user@test.com`
- **Password:** `test123`
- **Access:** User booking features

---

## ✨ What's Working (50% Functional)

### 🔒 Authentication System
- [x] User registration with validation
- [x] Login with email/password
- [x] JWT token-based sessions
- [x] Role-based access (admin/passenger)
- [x] Automatic redirects based on role

### 🎫 User Features
- [x] Browse available routes
- [x] Search trips by date and destination
- [x] Book tickets with passenger details
- [x] Select seats (validates availability)
- [x] Choose payment method (GCash/Maya)
- [x] View booking history
- [x] Cancel bookings
- [x] View e-tickets

### 👨‍💼 Admin Features
- [x] Manage buses (Add/Edit/Delete)
- [x] Manage routes (Add/Edit/Delete)
- [x] Manage trips (Add/Edit/Delete)
- [x] View all bookings
- [x] Dashboard statistics

### 💾 Database
- [x] Users table (authentication)
- [x] Buses table (fleet management)
- [x] Routes table (destinations)
- [x] Trips table (scheduled journeys)
- [x] Bookings table (ticket purchases)

---

## 📊 Sample Data Included

- **2 Users:** 1 admin, 1 passenger
- **4 Buses:** Various models and capacities
- **6 Routes:** Cebu to different destinations
- **84 Trips:** 7 days × 4 routes × 3 trips/day
- **1 Sample Booking:** For testing

---

## 🧪 Testing Flow for Your Instructor

### Test User Flow:
1. Go to http://localhost:3000
2. Click **"Sign up"** or login with `user@test.com` / `test123`
3. Click **"Book Now"** on home page
4. Select a route and date
5. Fill passenger details
6. Select payment method
7. View confirmation
8. Check **"My Bookings"** in sidebar
9. View e-ticket details

### Test Admin Flow:
1. Logout
2. Login with `admin@busticket.com` / `admin123`
3. Automatically redirected to **Admin Dashboard**
4. Click **"Buses"** in sidebar
5. Click **"Add Bus"**
6. Fill bus details and save
7. See new bus in the list
8. Try editing and deleting
9. Test **Routes** and **Trips** similarly

---

## 🛠️ Troubleshooting

### If you see "Database not found" error:
```bash
npm run db:setup
```

### If you see "Module not found" errors:
```bash
npm install
npm run db:generate
```

### To reset everything:
```bash
# Delete database
Remove-Item prisma\dev.db -Force

# Recreate with fresh data
npm run db:setup
```

### To view database directly:
```bash
npm run db:studio
```
Opens Prisma Studio at http://localhost:5555

---

## 📁 Project Structure

```
ticket/
├── app/
│   ├── api/              # All backend API routes
│   │   ├── auth/         # Login, register, logout
│   │   ├── routes/       # Get available routes
│   │   ├── trips/        # Search and view trips
│   │   ├── bookings/     # Create and manage bookings
│   │   └── admin/        # Admin CRUD operations
│   ├── components/       # Reusable React components
│   ├── login/            # Login page
│   ├── signup/           # Registration page
│   ├── home/             # User dashboard
│   ├── bookings/         # My bookings page
│   ├── buses/            # Admin buses page
│   └── ...               # Other pages
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Sample data generator
│   └── dev.db            # SQLite database file
├── lib/
│   ├── auth/             # Authentication utilities
│   └── db/               # Database connection
└── package.json          # Dependencies and scripts
```

---

## 🎯 What's NOT Implemented (The other 50%)

These features are UI/mockup only:
- ❌ Real payment gateway integration
- ❌ Email notifications
- ❌ SMS notifications
- ❌ QR code generation with real data
- ❌ PDF ticket download
- ❌ Advanced reporting/analytics
- ❌ Seat map visualization
- ❌ Real-time seat updates

---

## 💡 Key Features to Demonstrate

### 1. **Data Persistence**
- Create a booking → Close browser → Reopen → Booking still there!
- Add a bus as admin → Refresh page → Bus still there!

### 2. **Authentication & Authorization**
- Try accessing admin pages as passenger → Blocked!
- Try booking without login → Redirected to login!

### 3. **Business Logic**
- Try booking same seat twice → Prevented!
- Try deleting bus with trips → Blocked with error message!
- Cancel booking → Seat becomes available again!

### 4. **User Experience**
- Clean, professional UI
- Responsive design (works on mobile)
- Loading states
- Error messages
- Success notifications

---

## 📞 API Endpoints Summary

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create account
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/me` - Get current user

### Public Routes
- `GET /api/routes` - List all routes
- `GET /api/trips` - Search trips
- `GET /api/trips/[id]` - Get trip details

### User Bookings
- `GET /api/bookings` - My bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/[id]` - Booking details
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking (admin)

### Admin (Requires admin role)
- `GET/POST /api/admin/buses` - Manage buses
- `PUT/DELETE /api/admin/buses/[id]` - Update/delete bus
- `POST /api/admin/routes` - Create route
- `PUT/DELETE /api/admin/routes/[id]` - Update/delete route
- `POST /api/admin/trips` - Create trip
- `PUT/DELETE /api/admin/trips/[id]` - Update/delete trip

---

## 🎓 Grading Points to Highlight

1. **Database Design (15%)** - Proper schema with relationships
2. **Authentication (15%)** - Secure login with JWT
3. **CRUD Operations (20%)** - Full admin functionality
4. **Business Logic (20%)** - Seat management, validation
5. **UI/UX (15%)** - Clean, professional interface
6. **Code Quality (15%)** - Organized, commented, TypeScript

---

## ⚠️ Important Notes

- This uses **SQLite** for simplicity (single file database)
- Passwords are hashed (basic SHA-256, not bcrypt)
- JWT tokens stored in HTTP-only cookies
- All API routes have authentication/authorization
- Database file: `prisma/dev.db`

---

## 🚀 Deployment Ready?

To prepare for production:
1. Switch to PostgreSQL/MySQL
2. Use bcrypt for password hashing
3. Add environment variables
4. Set up proper email service
5. Integrate real payment gateway
6. Add rate limiting
7. Set up monitoring

---

## 📝 Commands Cheat Sheet

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:push          # Create/update database
npm run db:seed          # Add sample data
npm run db:setup         # Do both at once
npm run db:studio        # Open database GUI
npm run db:generate      # Regenerate Prisma client

# Production
npm run build            # Build for production
npm start                # Start production server
```

---

## ✅ Pre-Presentation Checklist

- [ ] Run `npm install`
- [ ] Run `npm run db:setup`
- [ ] Run `npm run dev`
- [ ] Test login with both accounts
- [ ] Create a test booking
- [ ] Test admin CRUD operations
- [ ] Check that data persists after refresh
- [ ] Prepare to explain the architecture

---

**Good luck with your presentation!** 🎉

Your system demonstrates:
- Full-stack development skills
- Database design & management
- Authentication & authorization
- RESTful API design
- React & Next.js proficiency
- TypeScript usage
- Professional UI/UX design
