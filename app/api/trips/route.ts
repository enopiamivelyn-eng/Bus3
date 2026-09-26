import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/trips - Search for available trips
 * Query params: from, to, date, routeId
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date');
    const routeId = searchParams.get('routeId');

    // Build query conditions
    const where: any = {
      status: 'scheduled',
      availableSeats: { gt: 0 },
    };

    // Filter by route ID if provided
    if (routeId) {
      where.routeId = routeId;
    }

    // Filter by date if provided
    if (date) {
      where.departureDate = date;
    }

    // Filter by route cities if provided
    if (from || to) {
      where.route = {};
      if (from) {
        where.route.fromCity = { contains: from, mode: 'insensitive' };
      }
      if (to) {
        where.route.toCity = { contains: to, mode: 'insensitive' };
      }
    }

    // Fetch trips with route and bus details
    const trips = await prisma.trip.findMany({
      where,
      include: {
        route: true,
        bus: true,
      },
      orderBy: [
        { departureDate: 'asc' },
        { departureTime: 'asc' },
      ],
    });

    // Format response
    const formattedTrips = trips.map(trip => ({
      id: trip.id,
      routeId: trip.routeId,
      busId: trip.busId,
      departureDate: trip.departureDate,
      routeName: trip.route.name,
      from: trip.route.fromCity,
      to: trip.route.toCity,
      route: {
        name: trip.route.name,
        fromCity: trip.route.fromCity,
        toCity: trip.route.toCity,
      },
      date: trip.departureDate,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      price: trip.price,
      availableSeats: trip.availableSeats,
      busNumber: trip.bus.busNumber,
      busModel: trip.bus.model,
      capacity: trip.bus.capacity,
      bus: {
        busNumber: trip.bus.busNumber,
        model: trip.bus.model,
        capacity: trip.bus.capacity,
      },
      duration: trip.route.duration,
      status: trip.status,
    }));

    return NextResponse.json({
      success: true,
      trips: formattedTrips,
      count: formattedTrips.length,
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}
