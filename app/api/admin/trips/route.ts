import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticateRequest, isAdmin } from '@/lib/auth/middleware';

/**
 * POST /api/admin/trips - Create new trip (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);
    
    if (error || !user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      routeId,
      busId,
      departureDate,
      departureTime,
      arrivalTime,
      price,
      status,
    } = body;

    // Validate required fields
    if (!routeId || !busId || !departureDate || !departureTime) {
      return NextResponse.json(
        { error: 'Route, bus, departure date, and departure time are required' },
        { status: 400 }
      );
    }

    // Get bus capacity for available seats
    const bus = await prisma.bus.findUnique({
      where: { id: busId },
    });

    if (!bus) {
      return NextResponse.json(
        { error: 'Bus not found' },
        { status: 404 }
      );
    }

    // Get route for price if not provided
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }

    // Create trip
    const trip = await prisma.trip.create({
      data: {
        routeId,
        busId,
        departureDate,
        departureTime,
        arrivalTime: arrivalTime || '23:59 PM',
        price: price ? parseFloat(price) : route.basePrice,
        availableSeats: bus.capacity,
        status: status || 'scheduled',
      },
      include: {
        route: true,
        bus: true,
      },
    });

    return NextResponse.json({
      success: true,
      trip,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    );
  }
}
