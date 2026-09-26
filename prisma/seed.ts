import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

/**
 * Passwords must be stored in the exact format lib/auth/password.ts verifies:
 * a SHA-256 of `password + 'SALT_KEY_CHANGE_IN_PRODUCTION'`, hex encoded.
 * These were previously hardcoded bcrypt hashes, which the SHA-256 verifier can
 * never match — so no seeded account could sign in.
 */
function hashPassword(password: string): string {
  return createHash('sha256')
    .update(password + 'SALT_KEY_CHANGE_IN_PRODUCTION')
    .digest('hex');
}

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@busticket.com' },
    update: { password: hashPassword('admin123') },
    create: {
      email: 'admin@busticket.com',
      password: hashPassword('admin123'), // password: admin123
      name: 'Admin User',
      role: 'admin',
    },
  });

  // Create passenger user
  const passenger = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: { password: hashPassword('test123') },
    create: {
      email: 'user@test.com',
      password: hashPassword('test123'), // password: test123
      name: 'Test User',
      role: 'passenger',
    },
  });

  console.log('✅ Created users:', { admin, passenger });

  // Create buses
  const buses = await Promise.all([
    prisma.bus.upsert({
      where: { busNumber: 'BUS-001' },
      update: {},
      create: {
        busNumber: 'BUS-001',
        model: 'Hino Grand Cruiser',
        capacity: 45,
        status: 'active',
      },
    }),
    prisma.bus.upsert({
      where: { busNumber: 'BUS-002' },
      update: {},
      create: {
        busNumber: 'BUS-002',
        model: 'Hyundai Universe',
        capacity: 50,
        status: 'active',
      },
    }),
    prisma.bus.upsert({
      where: { busNumber: 'BUS-003' },
      update: {},
      create: {
        busNumber: 'BUS-003',
        model: 'Daewoo GDW6117',
        capacity: 40,
        status: 'active',
      },
    }),
    prisma.bus.upsert({
      where: { busNumber: 'BUS-004' },
      update: {},
      create: {
        busNumber: 'BUS-004',
        model: 'Yutong ZK6127',
        capacity: 48,
        status: 'maintenance',
      },
    }),
  ]);

  console.log('✅ Created buses:', buses.length);

  // Re-running the seed must not pile up duplicate routes and trips.
  // Route.name is not unique in the schema, so clear the previous generated
  // data first — bookings and trips reference routes, so they go first.
  await prisma.booking.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.route.deleteMany({});

  // Create routes
  const routes = await Promise.all([
    prisma.route.create({
      data: {
        name: 'Cebu-Bato',
        fromCity: 'Cebu City',
        toCity: 'Bato',
        distance: 120.5,
        basePrice: 300,
        duration: '5 hours',
      },
    }),
    prisma.route.create({
      data: {
        name: 'Cebu-Oslob',
        fromCity: 'Cebu City',
        toCity: 'Oslob',
        distance: 115.0,
        basePrice: 200,
        duration: '5 hours',
      },
    }),
    prisma.route.create({
      data: {
        name: 'Cebu-Boljoon',
        fromCity: 'Cebu City',
        toCity: 'Boljoon',
        distance: 105.0,
        basePrice: 300,
        duration: '5 hours',
      },
    }),
    prisma.route.create({
      data: {
        name: 'Cebu-Dalaguete',
        fromCity: 'Cebu City',
        toCity: 'Dalaguete',
        distance: 85.0,
        basePrice: 300,
        duration: '5 hours',
      },
    }),
    prisma.route.create({
      data: {
        name: 'Cebu-Moalboal',
        fromCity: 'Cebu City',
        toCity: 'Moalboal',
        distance: 89.0,
        basePrice: 250,
        duration: '4 hours',
      },
    }),
    prisma.route.create({
      data: {
        name: 'Cebu-Argao',
        fromCity: 'Cebu City',
        toCity: 'Argao',
        distance: 67.0,
        basePrice: 280,
        duration: '4.5 hours',
      },
    }),
  ]);

  console.log('✅ Created routes:', routes.length);

  // Create trips for the next 7 days
  const today = new Date();
  const trips = [];

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const tripDate = new Date(today);
    tripDate.setDate(today.getDate() + dayOffset);
    const dateString = tripDate.toISOString().split('T')[0];

    // Create multiple trips per day for each route
    const times = ['06:00 AM', '08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'];

    for (const route of routes.slice(0, 4)) { // Only first 4 routes
      for (const time of times.slice(0, 3)) { // 3 trips per day per route
        const bus = buses[Math.floor(Math.random() * buses.length)];
        const trip = await prisma.trip.create({
          data: {
            routeId: route.id,
            busId: bus.id,
            departureDate: dateString,
            departureTime: time,
            arrivalTime: '10:00 PM', // Simplified
            price: route.basePrice,
            availableSeats: bus.capacity,
            status: 'scheduled',
          },
        });
        trips.push(trip);
      }
    }
  }

  console.log('✅ Created trips:', trips.length);

  // Create a sample booking
  const sampleTrip = trips[0];
  const booking = await prisma.booking.create({
    data: {
      userId: passenger.id,
      tripId: sampleTrip.id,
      seatNumber: 'A12',
      passengerName: 'Test User',
      passengerEmail: 'user@test.com',
      passengerPhone: '+63 912 345 6789',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'GCash',
      totalAmount: sampleTrip.price,
    },
  });

  // Update trip available seats
  await prisma.trip.update({
    where: { id: sampleTrip.id },
    data: { availableSeats: sampleTrip.availableSeats - 1 },
  });

  console.log('✅ Created sample booking:', booking.id);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
