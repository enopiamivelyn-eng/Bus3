export interface Route {
  id: number;
  name: string;
  from: string;
  to: string;
  price: number;
  duration: string;
}

/**
 * Single source of truth for the routes the app sells tickets for.
 * Previously this list was copy-pasted into page.tsx, dashboard/page.tsx and
 * book-details/page.tsx, which is how the homepage ended up showing
 * "Cebu-Bato" four times.
 */
export const routes: Route[] = [
  { id: 1, name: 'Cebu-Bato', from: 'Cebu City', to: 'Bato', price: 300, duration: '5 hours' },
  { id: 2, name: 'Cebu-Oslob', from: 'Cebu City', to: 'Oslob', price: 200, duration: '5 hours' },
  { id: 3, name: 'Cebu-Boljoon', from: 'Cebu City', to: 'Boljoon', price: 300, duration: '5 hours' },
  { id: 4, name: 'Cebu-Dalaguete', from: 'Cebu City', to: 'Dalaguete', price: 300, duration: '5 hours' },
  { id: 5, name: 'Cebu-Moalboal', from: 'Cebu City', to: 'Moalboal', price: 250, duration: '4 hours' },
  { id: 6, name: 'Cebu-Argao', from: 'Cebu City', to: 'Argao', price: 280, duration: '4.5 hours' },
];

/** The four highlighted on the homepage and dashboard. */
export const popularRoutes: Route[] = routes.slice(0, 4);

export const timeSlots = [
  '06:00 AM', '08:00 AM', '10:00 AM', '12:00 PM',
  '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM',
];

/** Formats a peso amount consistently, e.g. 300 -> "₱300". */
export function formatPrice(amount: number): string {
  return `₱${amount.toLocaleString('en-PH')}`;
}
