import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticateRequest } from '@/lib/auth/middleware';

/**
 * GET /api/bookings - Get user's bookings
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { user, error } = await authenticateRequest(request);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {
      userId: user.userId,
    };

    if (status) {
      where.status = status;
    }

    // Fetch bookings with related data
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        trip: {
          include: {
            route: true,
            bus: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format bookings
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      tripId: booking.tripId,
      seatNumber: booking.seatNumber,
      passengerName: booking.passengerName,
      passengerEmail: booking.passengerEmail,
      passengerPhone: booking.passengerPhone,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      totalAmount: booking.totalAmount,
      bookingDate: booking.bookingDate,
      route: booking.trip.route.name,
      from: booking.trip.route.fromCity,
      to: booking.trip.route.toCity,
      date: booking.trip.departureDate,
      time: booking.trip.departureTime,
      busNumber: booking.trip.bus.busNumber,
    }));

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bookings - Create a new booking
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { user, error } = await authenticateRequest(request);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      tripId,
      seatNumber,
      passengerName,
      passengerEmail,
      passengerPhone,
      paymentMethod,
    } = body;

    // Validate required fields
    if (!tripId || !seatNumber || !passengerName || !passengerEmail || !passengerPhone) {
      return NextResponse.json(
        { error: 'All passenger details are required' },
        { status: 400 }
      );
    }

    // Get trip details
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { route: true },
    });

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Check if trip is available
    if (trip.status !== 'scheduled') {
      return NextResponse.json(
        { error: 'Trip is not available for booking' },
        { status: 400 }
      );
    }

    // Check if seats are available
    if (trip.availableSeats <= 0) {
      return NextResponse.json(
        { error: 'No seats available for this trip' },
        { status: 400 }
      );
    }

    // Check if seat is already booked
    const existingBooking = await prisma.booking.findFirst({
      where: {
        tripId,
        seatNumber,
        status: { not: 'cancelled' },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'This seat is already booked' },
        { status: 400 }
      );
    }

    // Create booking in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Create the booking
      const newBooking = await tx.booking.create({
        data: {
          userId: user.userId,
          tripId,
          seatNumber,
          passengerName,
          passengerEmail,
          passengerPhone,
          totalAmount: trip.price,
          paymentMethod: paymentMethod || null,
          status: 'confirmed',
          paymentStatus: paymentMethod ? 'paid' : 'unpaid',
        },
      });

      // Update trip's available seats
      await tx.trip.update({
        where: { id: tripId },
        data: {
          availableSeats: trip.availableSeats - 1,
        },
      });

      return newBooking;
    });

    // Fetch complete booking with trip details
    const completeBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        trip: {
          include: {
            route: true,
            bus: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: completeBooking!.id,
        tripId: completeBooking!.tripId,
        seatNumber: completeBooking!.seatNumber,
        passengerName: completeBooking!.passengerName,
        passengerEmail: completeBooking!.passengerEmail,
        passengerPhone: completeBooking!.passengerPhone,
        status: completeBooking!.status,
        paymentStatus: completeBooking!.paymentStatus,
        paymentMethod: completeBooking!.paymentMethod,
        totalAmount: completeBooking!.totalAmount,
        bookingDate: completeBooking!.bookingDate,
        route: completeBooking!.trip.route.name,
        from: completeBooking!.trip.route.fromCity,
        to: completeBooking!.trip.route.toCity,
        date: completeBooking!.trip.departureDate,
        time: completeBooking!.trip.departureTime,
        busNumber: completeBooking!.trip.bus.busNumber,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
