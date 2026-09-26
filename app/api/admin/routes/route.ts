import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticateRequest, isAdmin } from '@/lib/auth/middleware';

/**
 * POST /api/admin/routes - Create new route (Admin only)
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
    const { name, fromCity, toCity, distance, basePrice, duration, status } = body;

    // Validate required fields
    if (!name || !fromCity || !toCity || !basePrice) {
      return NextResponse.json(
        { error: 'Name, from city, to city, and base price are required' },
        { status: 400 }
      );
    }

    // Create route
    const route = await prisma.route.create({
      data: {
        name,
        fromCity,
        toCity,
        distance: distance ? parseFloat(distance) : 0,
        basePrice: parseFloat(basePrice),
        duration: duration || '0 hours',
        status: status || 'active',
      },
    });

    return NextResponse.json({
      success: true,
      route,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating route:', error);
    return NextResponse.json(
      { error: 'Failed to create route' },
      { status: 500 }
    );
  }
}
