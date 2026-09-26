# 🎤 Presentation Guide for Instructor Evaluation

## 🎯 Project Overview

**Project Name:** Bus Ticketing Management System  
**Status:** 50% Functional (Backend + Frontend Working)  
**Tech Stack:** Next.js 16, TypeScript, Prisma, SQLite  
**Development Time:** Implemented with modern best practices

---

## 📊 What to Demonstrate (In Order)

### 1. **System Architecture** (2 minutes)

**Key Points to Mention:**
- Full-stack application with Next.js App Router
- RESTful API design with proper HTTP methods
- Prisma ORM for type-safe database access
- JWT-based authentication with HTTP-only cookies
- Role-based access control (Admin/Passenger)

**Show:** Project structure in VS Code
```
ticket/
├── app/api/          → Backend API routes
├── app/components/   → Reusable UI components
├── app/login/        → Authentication pages
├── prisma/           → Database schema & migrations
└── lib/              → Shared utilities
```

---

### 2. **Database Design** (3 minutes)

**Show:** `prisma/schema.prisma`

**Explain:**
- 5 interconnected tables with proper relationships
- User → Bookings (one-to-many)
- Trip → Bookings (one-to-many)
- Bus → Trips (one-to-many)
- Route → Trips (one-to-many)

**Demonstrate:** Open Prisma Studio
```bash
npm run db:studio
```
- Show actual data in tables
- Highlight relationships
- Show seed data (2 users, 4 buses, 6 routes, 84 trips)

---

### 3. **Authentication System** (5 minutes)

**Test Flow:**

#### A. Registration
1. Go to http://localhost:3000
2. Click **"Sign up"**
3. Fill form: `john@test.com` / `password123` / `John Doe`
4. Submit → Auto-login → Redirected to dashboard
5. **Explain:** Password is hashed, JWT created, stored in HTTP-only cookie

#### B. Login with Admin
1. Logout
2. Login: `admin@busticket.com` / `admin123`
3. **Point out:** Redirected to `/buses` (admin dashboard)
4. **Explain:** Role-based redirect logic

#### C. Authorization
1. Try to access `/buses` while logged in as passenger
2. **Show:** Access denied or redirect
3. **Explain:** Middleware checks user role

---

### 4. **User Booking Flow** (7 minutes)

**Login as:** `user@test.com` / `test123`

#### Step-by-Step Demonstration:

**A. Search for Trips**
1. From sidebar, check current **"My Bookings"** (might have 1 sample)
2. Go to **"Home"**
3. **Point out:** 4 popular routes displayed (from database)
4. Note prices and durations

**B. Create Booking**
1. Click **"Book Now"** on any route
2. **Explain:** System searches for available trips
3. Select a trip (show available seats count)
4. Fill passenger details:
   - Name: Test Passenger
   - Email: test@passenger.com
   - Phone: +63 912 345 6789
5. Select seat number: A15
6. Choose payment method: GCash
7. Submit booking

**C. Verify Booking Created**
1. Go to **"My Bookings"** in sidebar
2. **Show:** New booking appears
3. **Explain:** 
   - Status: Confirmed
   - Payment Status: Paid
   - Seat is now reserved
4. Click **"View Ticket"** to see e-ticket

**D. Data Persistence Test**
1. Close browser completely
2. Reopen http://localhost:3000
3. Login again
4. Check **"My Bookings"**
5. **Point out:** Booking still there! (Database persistence)

---

### 5. **Admin CRUD Operations** (8 minutes)

**Login as:** `admin@busticket.com` / `admin123`

#### A. Manage Buses

**Create:**
1. Click **"Buses"** in sidebar
2. Click **"Add Bus"** button
3. Fill form:
   - Bus Number: BUS-999
   - Model: Mercedes-Benz O500
   - Capacity: 52
   - Status: Active
4. Save
5. **Show:** New bus appears in list
6. Refresh page
7. **Point out:** Still there (database)

**Edit:**
1. Click **"Edit"** on BUS-999
2. Change capacity to 48
3. Save
4. **Show:** Updated in list

**Delete (with validation):**
1. Try to delete a bus that has trips (BUS-001)
2. **Show:** Error message: "Cannot delete bus with existing trips"
3. Delete BUS-999 (no trips)
4. **Show:** Successfully deleted

#### B. Manage Routes

1. Click **"Routes"** in sidebar
2. Click **"Add Route"**
3. Fill details:
   - Name: Cebu-Samboan
   - From: Cebu City
   - To: Samboan
   - Distance: 135
   - Base Price: 350
   - Duration: 6 hours
4. Save
5. **Show:** New route in list
6. **Explain:** Can now create trips for this route

#### C. Manage Trips

1. Click **"Trips"** in sidebar
2. Click **"Add Trip"**
3. Select:
   - Route: Cebu-Bato
   - Bus: BUS-002
   - Date: (tomorrow's date)
   - Departure Time: 07:00 AM
   - Price: 300
4. Save
5. **Show:** New trip created with full bus capacity as available seats
6. **Explain:** This trip is now bookable by users

---

### 6. **Business Logic & Validation** (5 minutes)

**Demonstrate Real Business Rules:**

#### A. Seat Availability Management
1. As user, book a ticket (note the seat number)
2. Try to book the same seat again
3. **Show:** Error: "This seat is already booked"
4. **Explain:** Real-time seat tracking

#### B. Cancel Booking (Seat Restoration)
1. Go to booking details
2. Click **"Cancel"**
3. Check trip details
4. **Show:** Available seats increased by 1
5. **Explain:** Automatic seat restoration

#### C. Admin Protections
1. As admin, try to delete route with trips
2. **Show:** Blocked with message
3. Try to delete trip with bookings
4. **Show:** Blocked with message
5. **Explain:** Data integrity protection

---

### 7. **API Architecture** (3 minutes)

**Show in VS Code:** `app/api/` folder structure

**Explain Endpoints:**

**Authentication:**
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`

**Public:**
- `GET /api/routes`
- `GET /api/trips?from=Cebu&to=Bato&date=2026-09-27`

**Protected (User):**
- `GET /api/bookings` → My bookings
- `POST /api/bookings` → Create booking

**Protected (Admin):**
- `GET/POST /api/admin/buses`
- `PUT/DELETE /api/admin/buses/[id]`

**Show Example:** Open `app/api/bookings/route.ts`
- Point out authentication check
- Explain transaction for booking creation
- Show seat availability validation

---

### 8. **Code Quality Highlights** (2 minutes)

**Open and Show:**

1. **TypeScript Usage:**
   - `prisma/schema.prisma` → Type-safe database
   - `lib/auth/jwt.ts` → Typed interfaces
   - All API routes properly typed

2. **Error Handling:**
   - Try-catch blocks in all API routes
   - Proper HTTP status codes (401, 403, 404, 500)
   - User-friendly error messages

3. **Security:**
   - JWT tokens in HTTP-only cookies (not localStorage)
   - Password hashing before storage
   - Role-based authorization middleware
   - Input validation

4. **Code Organization:**
   - Separation of concerns (API/UI/Utils)
   - Reusable components
   - Single source of truth for data

---

## 🎯 Key Metrics to Emphasize

1. **50% Functional** = Core features work end-to-end
2. **5 Database Tables** with proper relationships
3. **15+ API Endpoints** with authentication
4. **2 User Roles** with different access levels
5. **Real Data Persistence** (not just mocks)
6. **Type Safety** with TypeScript throughout
7. **Professional UI** with responsive design

---

## 💡 Questions Your Instructor Might Ask

### Q: "Why SQLite instead of PostgreSQL?"
**A:** For simplicity and portability. SQLite is a single file database perfect for development and demonstration. In production, we'd switch to PostgreSQL or MySQL with minimal code changes thanks to Prisma's abstraction.

### Q: "Is the password hashing secure?"
**A:** Currently using SHA-256 for demonstration. In production, we'd use bcrypt with proper salt rounds. The implementation is modular and can be swapped easily.

### Q: "What about payment processing?"
**A:** The payment selection is stored in the database, but integration with actual payment gateways (PayMongo, PayPal) would be the next step. The architecture supports webhook handlers for payment confirmation.

### Q: "Can users see real-time seat availability?"
**A:** Yes! Seat availability is tracked in the database and updated atomically using Prisma transactions. Multiple users cannot book the same seat.

### Q: "What's the difference between this and the original HTML version?"
**A:** 
- Original: Static HTML with localStorage (no persistence)
- Current: Full-stack with real database, API, authentication, and persistence
- Data survives browser close/refresh
- Multi-user capable
- Admin panel is actually functional

### Q: "How would you deploy this?"
**A:** 
1. Deploy to Vercel (frontend + API routes)
2. Use Vercel Postgres or Railway for database
3. Add environment variables for secrets
4. Set up CI/CD pipeline
5. Add monitoring (Sentry)

---

## ⏰ Timing Guide (30-minute presentation)

- Introduction: 2 min
- Architecture Overview: 3 min
- Database Demo: 3 min
- Authentication: 5 min
- User Booking Flow: 7 min
- Admin CRUD: 8 min
- Business Logic: 3 min
- Code Quality: 2 min
- Q&A: 5 min
- **Buffer: 2 min**

---

## ✅ Pre-Presentation Checklist

**Day Before:**
- [ ] Run `npm install`
- [ ] Run `npm run db:setup`
- [ ] Run `npm run verify`
- [ ] Test all flows yourself

**30 Minutes Before:**
- [ ] Start dev server: `npm run dev`
- [ ] Clear browser cache
- [ ] Test both accounts work
- [ ] Have Prisma Studio ready: `npm run db:studio`
- [ ] Open VS Code with project
- [ ] Have both README and QUICK_START open

**During Setup:**
- [ ] Connect to projector
- [ ] Open browser to http://localhost:3000
- [ ] Have 2 browser windows (one for user, one for admin)
- [ ] Terminal window visible for commands

---

## 🎉 Closing Statement

"This project demonstrates a full-stack bus ticketing system at 50% completion. While features like real payment integration and email notifications are not implemented, the core functionality is production-ready:

- ✅ Real database with proper schema design
- ✅ Secure authentication and authorization
- ✅ Working booking system with business logic
- ✅ Full admin CRUD operations
- ✅ Data persistence and integrity
- ✅ Professional, responsive UI

The architecture is scalable and ready for the remaining features. Thank you!"

---

## 📝 Backup Plan

**If something breaks:**

1. **Database issue:**
   ```bash
   npm run db:setup
   ```

2. **Server won't start:**
   ```bash
   npm install
   npm run dev
   ```

3. **Can't login:**
   - Use: `admin@busticket.com` / `admin123`
   - Or: `user@test.com` / `test123`

4. **Module errors:**
   ```bash
   npm run db:generate
   npm run dev
   ```

---

**Good Luck! You've got this! 🚀**
