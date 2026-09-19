# Bus Ticketing System

A bus ticketing **front-end** built with Next.js 16, featuring sidebar
navigation, authentication screens, and booking/reservation flows.

> **Status: UI prototype.** Every screen renders and the flows are navigable,
> but there is no server, database or session layer yet. See
> [Still Not Implemented](#still-not-implemented).

## Features

### 🎨 Pages Implemented

1. **Homepage (`/`)**
   - Hero section with large bus illustration
   - Popular routes display (4 route cards)
   - Search functionality
   - Sign in / Log in buttons
   - "Reserve Now" call-to-action

2. **Login Page (`/login`)**
   - Clean login form
   - Email and password inputs
   - "Remember me" checkbox
   - "Forgot Password" link
   - "Sign up" redirect link

3. **Authenticated Dashboard (`/dashboard`)**
   - Personalized greeting "Hello + Username!"
   - Logout button
   - Different route options (Cebu-Bato, Cebu-Oslob, Cebu-Boljoon, Cebu-Dalaguete)
   - "Book Now" button
   - User profile in sidebar

### 🎯 Design Features

- **Sidebar Navigation**: Fixed blue gradient sidebar with logo, navigation menu, and decorative bus graphic
- **Responsive Design**: Mobile, tablet, and desktop layouts
- **Color Scheme**:
  - Primary Blue: `#2563eb`
  - Dark Blue: `#1e40af`
  - Light Blue Background: `#e0f2fe` to `#bae6fd` gradient
- **Typography**: Courier New monospace font
- **Interactive Elements**: Hover effects, smooth transitions, and animations

### 📁 Project Structure
```
ticket/
├── app/
│   ├── components/
│   │   └── Sidebar.tsx          # Reusable sidebar component
│   ├── about/page.tsx           # About page
│   ├── book-details/page.tsx    # Booking form
│   ├── bookings/page.tsx        # My Bookings
│   ├── dashboard/page.tsx       # Authenticated user dashboard
│   ├── forgot-password/page.tsx # Password reset request
│   ├── login/page.tsx           # Login page
│   ├── profile/page.tsx         # Profile management
│   ├── reservation/page.tsx     # E-tickets / reservations
│   ├── reserve/page.tsx         # Pay-at-terminal reservation
│   ├── signin/page.tsx          # Sign in options
│   ├── signup/page.tsx          # Create account
│   ├── page.tsx                 # Homepage
│   ├── not-found.tsx            # Branded 404
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── lib/
│   └── routes.ts                # Shared route data (single source of truth)
├── public/                      # Static assets
├── package.json
└── next.config.ts
```

Route data lives in `lib/routes.ts`. Pages import from it rather than
redeclaring routes, so fares and destinations stay consistent.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Public homepage with popular routes |
| `/about` | About us |
| `/login` | Login form |
| `/signin` | Sign in options |
| `/signup` | Create account, with client-side validation |
| `/forgot-password` | Password reset request |
| `/dashboard` | Authenticated user dashboard |
| `/book-details` | Booking form with fare summary |
| `/bookings` | My Bookings |
| `/reservation` | E-tickets |
| `/reserve` | Reserve a seat, pay at terminal |
| `/profile` | Profile and preferences |

Any other URL renders the branded 404 at `app/not-found.tsx`.

## Components

### Sidebar Component
- **Props**:
  - `isAuthenticated?: boolean` - Shows user profile section if true
  - `username?: string` - Display username in sidebar and header
- **Features**: Logo, navigation menu, bus graphic, optional user profile

## Styling

The application uses custom CSS with a monospace font (Courier New) and a blue color scheme matching the provided design mockups. All styles are in `app/globals.css`.

### Key CSS Classes

- `.main-container` - Main layout container
- `.sidebar` - Fixed sidebar with gradient
- `.header` - Page header with logo and actions
- `.hero-section` - Main content area with bus illustration
- `.route-card` - Individual route display cards
- `.login-box` - Login form container

## Still Not Implemented
These are the honest gaps — the UI exists, the backend does not:

- **Authentication** — no session, no password hashing. Every authenticated
  page hardcodes `const username = 'Username'`. `admin`/`demo` accounts do not
  exist.
- **Persistence** — bookings, reservations and profile edits live in
  component state and are lost on refresh. There is no database.
- **Payment** — `Proceed to Payment` only alerts; no gateway is wired up.
- **Email/SMS** — signup, password reset and notification toggles do not send
  anything.
- **Route search** — the header search icon is not an input and does nothing.
- **Admin dashboard** — not started.

### Data flow
`lib/routes.ts` is the single source of truth for routes and fares. Bookings
(`app/bookings/page.tsx`) and reservations (`app/reservation/page.tsx`) still
use their own hardcoded sample arrays, so they not yet reflect that file.

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **CSS** - Custom styling
- **React Hooks** - State management

## Notes
- The sidebar is fixed position and responsive; the decorative bus graphic is
  hidden below 720px of viewport height so it cannot crowd the nav.
- All pages follow the same design language.
- SVG bus graphics are inline for customization.
- Signup and forgot-password forms validate client-side (required fields,
  email shape, password length and match, terms acceptance). The booking and
  profile forms rely on native HTML validation only.
- Authentication state still needs a real implementation (e.g. NextAuth.js or a
  custom session layer) before any of the above can be considered secure.

---

Built with ❤️ using Next.js
