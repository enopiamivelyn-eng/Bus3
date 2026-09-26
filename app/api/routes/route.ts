import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/routes - Get all available routes
 */
export async function GET() {
  try {
    const routes = await prisma.route.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: { trips: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      routes: routes.map(route => ({
        id: route.id,
        name: route.name,
        from: route.fromCity,
        to: route.toCity,
        distance: route.distance,
        price: route.basePrice,
        duration: route.duration,
        tripsCount: route._count.trips,
      })),
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routes' },
      { status: 500 }
    );
  }
}
