# 🚌 Bus Ticketing System

A modern, functional bus ticket booking system built with Next.js, TypeScript, and Prisma.

## 🎯 Project Status: 50% Functional

This system includes:
- ✅ Real database with data persistence
- ✅ Authentication & authorization
- ✅ Working booking system
- ✅ Admin management panel
- ✅ Professional UI/UX

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup database with sample data
npm run db:setup

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔐 Test Accounts

**Admin:** `admin@busticket.com` / `admin123`  
**User:** `user@test.com` / `test123`

## 📖 Full Documentation

See [QUICK_START.md](./QUICK_START.md) for complete setup instructions and testing guide.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Database:** SQLite with Prisma ORM
- **Authentication:** JWT with HTTP-only cookies
- **Styling:** Custom CSS with professional design

## 📊 Database Schema

- **Users** - Authentication and user management
- **Buses** - Fleet management
- **Routes** - Travel routes and destinations
- **Trips** - Scheduled bus trips
- **Bookings** - Ticket reservations

## 🎓 Features for Evaluation

### User Features
- Search and book tickets
- View booking history
- Select payment method
- Cancel bookings
- View e-tickets

### Admin Features
- Manage buses (CRUD)
- Manage routes (CRUD)
- Manage trips (CRUD)
- View all bookings
- Dashboard overview

## 📝 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:studio    # Open database GUI
npm run db:setup     # Reset database with seed data
```

## 📧 Contact

For questions or issues, refer to the setup documentation in QUICK_START.md

---

**Built for academic evaluation** - Demonstrates full-stack development, database design, authentication, and professional UI/UX skills.
