# Bus Ticketing System

A complete bus ticketing system built with Next.js 15, featuring a modern UI with sidebar navigation, authentication pages, and booking functionality.

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
│   ├── dashboard/
│   │   └── page.tsx             # Authenticated user dashboard
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── public/                      # Static assets
├── package.json
└── next.config.ts
```

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
| `/login` | Login page |
| `/dashboard` | Authenticated user dashboard |
| `/signin` | Sign in page (to be implemented) |
| `/signup` | Sign up page (to be implemented) |

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

## Future Enhancements

- Implement authentication logic (session management)
- Add booking flow pages
- Create "My Bookings" page
- Add profile management
- Implement route search functionality
- Add payment integration
- Create admin dashboard

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **CSS** - Custom styling
- **React Hooks** - State management

## Notes

- The sidebar is fixed position and responsive
- All pages follow the same design language
- SVG bus graphics are inline for customization
- Form validation can be added for production use
- Authentication state management needs to be implemented (e.g., with NextAuth.js or custom solution)

---

Built with ❤️ using Next.js
