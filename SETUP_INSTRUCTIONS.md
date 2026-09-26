# Bus Ticketing System - Setup Instructions

## Prerequisites
- Node.js 18+ installed
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
This will create the SQLite database and populate it with seed data:
```bash
npm run db:setup
```

Or run separately:
```bash
npm run db:push      # Create database tables
npm run db:seed      # Add sample data
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test Accounts

### Admin Account
- **Email**: admin@busticket.com
- **Password**: admin123
- Access: Admin dashboard with full CRUD operations

### Passenger Account
- **Email**: user@test.com
- **Password**: test123
- Access: User dashboard for booking tickets

## Features Working

✅ **Authentication**
- Login with email/password
- Role-based access (admin/passenger)
- Secure JWT tokens
- Session management

✅ **User Features**
- Search routes and trips
- Book tickets with passenger details
- View booking history
- Select payment method (GCash/Maya)
- View e-tickets

✅ **Admin Features**
- Manage buses (CRUD)
- Manage routes (CRUD)
- Manage trips (CRUD)
- View all bookings
- Dashboard statistics

## Database

Uses SQLite (file: `prisma/dev.db`) for simplicity.

**Tables:**
- users (authentication)
- buses (fleet management)
- routes (destinations)
- trips (scheduled journeys)
- bookings (ticket purchases)

## Sample Data Included

- 2 users (1 admin, 1 passenger)
- 4 buses
- 6 routes (Cebu to various destinations)
- 84 trips (7 days × 4 routes × 3 trips/day)
- 1 sample booking

## API Routes

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - Create account
- POST `/api/auth/logout` - Sign out
- GET `/api/auth/me` - Get current user

### Routes & Trips
- GET `/api/routes` - List all routes
- GET `/api/trips` - Search available trips
- GET `/api/trips/[id]` - Get trip details

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings` - Get user bookings
- GET `/api/bookings/[id]` - Get booking details
- PUT `/api/bookings/[id]` - Update booking status

### Admin
- GET/POST `/api/admin/buses` - Manage buses
- PUT/DELETE `/api/admin/buses/[id]` - Update/delete bus
- GET/POST `/api/admin/routes` - Manage routes
- PUT/DELETE `/api/admin/routes/[id]` - Update/delete route
- GET/POST `/api/admin/trips` - Manage trips
- PUT/DELETE `/api/admin/trips/[id]` - Update/delete trip

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:generate  # Regenerate Prisma client
```

## Troubleshooting

### Database issues
```bash
# Reset database
rm prisma/dev.db
npm run db:setup
```

### Module not found errors
```bash
npm install
npm run db:generate
```

## Next Steps for Production

1. Switch from SQLite to PostgreSQL/MySQL
2. Add email service (SendGrid/Resend) for confirmations
3. Integrate real payment gateway (PayMongo/PayPal)
4. Add SMS notifications (Twilio/Semaphore)
5. Implement proper password hashing with bcrypt
6. Add rate limiting and security headers
7. Set up proper environment variables
8. Deploy to Vercel/Railway/AWS

## Support

For issues or questions, check the code comments or contact the development team.
