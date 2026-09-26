import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticateRequest, isAdmin } from '@/lib/auth/middleware';

/**
 * PUT /api/admin/buses/[id] - Update bus (Admin only)
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
    const { busNumber, model, capacity, status } = body;

    // Check if bus exists
    const existingBus = await prisma.bus.findUnique({
      where: { id },
    });

    if (!existingBus) {
      return NextResponse.json(
        { error: 'Bus not found' },
        { status: 404 }
      );
    }

    // If updating bus number, check for conflicts
    if (busNumber && busNumber !== existingBus.busNumber) {
      const conflict = await prisma.bus.findUnique({
        where: { busNumber },
      });

      if (conflict) {
        return NextResponse.json(
          { error: 'A bus with this number already exists' },
          { status: 409 }
        );
      }
    }

    // Build update data
    const updateData: any = {};
    if (busNumber) updateData.busNumber = busNumber;
    if (model) updateData.model = model;
    if (capacity) updateData.capacity = parseInt(capacity);
    if (status) updateData.status = status;

    // Update bus
    const updatedBus = await prisma.bus.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      bus: updatedBus,
    });
  } catch (error) {
    console.error('Error updating bus:', error);
    return NextResponse.json(
      { error: 'Failed to update bus' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/buses/[id] - Delete bus (Admin only)
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

    // Check if bus has trips
    const tripsCount = await prisma.trip.count({
      where: { busId: id },
    });

    if (tripsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete bus with existing trips. Set status to inactive instead.' },
        { status: 400 }
      );
    }

    // Delete bus
    await prisma.bus.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Bus deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting bus:', error);
    return NextResponse.json(
      { error: 'Failed to delete bus' },
      { status: 500 }
    );
  }
}
