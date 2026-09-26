import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticateRequest, isAdmin } from '@/lib/auth/middleware';

/**
 * PUT /api/admin/trips/[id] - Update trip (Admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await authenticateRequest(request);
    
    if (error || !user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
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

    // Check if trip exists
    const existingTrip = await prisma.trip.findUnique({
      where: { id },
      include: {
        bookings: true,
      },
    });

    if (!existingTrip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Don't allow changing bus if there are bookings
    if (busId && busId !== existingTrip.busId && existingTrip.bookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot change bus for trip with existing bookings' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (routeId) updateData.routeId = routeId;
    if (busId) updateData.busId = busId;
    if (departureDate) updateData.departureDate = departureDate;
    if (departureTime) updateData.departureTime = departureTime;
    if (arrivalTime) updateData.arrivalTime = arrivalTime;
    if (price) updateData.price = parseFloat(price);
    if (status) updateData.status = status;

    // Update trip
    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: updateData,
      include: {
        route: true,
        bus: true,
      },
    });

    return NextResponse.json({
      success: true,
      trip: updatedTrip,
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/trips/[id] - Delete trip (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await authenticateRequest(request);
    
    if (error || !user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if trip has bookings
    const bookingsCount = await prisma.booking.count({
      where: {
        tripId: id,
        status: { not: 'cancelled' },
      },
    });

    if (bookingsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete trip with confirmed bookings. Cancel the trip instead.' },
        { status: 400 }
      );
    }

    // Delete trip
    await prisma.trip.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json(
      { error: 'Failed to delete trip' },
      { status: 500 }
    );
  }
}
