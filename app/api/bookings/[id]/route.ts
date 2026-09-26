import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticateRequest, isAdmin } from '@/lib/auth/middleware';

/**
 * GET /api/bookings/[id] - Get specific booking details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const { user, error } = await authenticateRequest(request);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        trip: {
          include: {
            route: true,
            bus: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if user owns this booking or is admin
    if (booking.userId !== user.userId && !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: {
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
        departureTime: booking.trip.departureTime,
        arrivalTime: booking.trip.arrivalTime,
        busNumber: booking.trip.bus.busNumber,
        busModel: booking.trip.bus.model,
        duration: booking.trip.route.duration,
        user: booking.user,
      },
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking details' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/bookings/[id] - Update booking status
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const { user, error } = await authenticateRequest(request);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, paymentMethod } = body;

    // Get existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: { trip: true },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if user owns this booking or is admin
    if (existingBooking.userId !== user.userId && !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;

    // If cancelling, restore seat availability
    if (status === 'cancelled' && existingBooking.status !== 'cancelled') {
      await prisma.$transaction([
        prisma.booking.update({
          where: { id },
          data: updateData,
        }),
        prisma.trip.update({
          where: { id: existingBooking.tripId },
          data: {
            availableSeats: existingBooking.trip.availableSeats + 1,
          },
        }),
      ]);
    } else {
      await prisma.booking.update({
        where: { id },
        data: updateData,
      });
    }

    // Fetch updated booking
    const updatedBooking = await prisma.booking.findUnique({
      where: { id },
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
        id: updatedBooking!.id,
        status: updatedBooking!.status,
        paymentStatus: updatedBooking!.paymentStatus,
        paymentMethod: updatedBooking!.paymentMethod,
      },
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/bookings/[id] - Cancel booking (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const { user, error } = await authenticateRequest(request);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admin can delete bookings
    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { trip: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Cancel booking and restore seat
    await prisma.$transaction([
      prisma.booking.update({
        where: { id },
        data: { status: 'cancelled' },
      }),
      prisma.trip.update({
        where: { id: booking.tripId },
        data: {
          availableSeats: booking.trip.availableSeats + 1,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
