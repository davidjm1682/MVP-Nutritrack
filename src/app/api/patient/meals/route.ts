import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.userType !== 'patient') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const meals = await prisma.meal.findMany({
      where: {
        patientId: (session.user as any).id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ meals });
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json(
      { error: 'Error al obtener comidas' },
      { status: 500 }
    );
  }
}
