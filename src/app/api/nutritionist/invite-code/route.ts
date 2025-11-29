import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.userType !== 'nutritionist') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const nutritionist = await prisma.nutritionist.findUnique({
      where: { id: (session.user as any).id },
      select: { inviteCode: true },
    });

    if (!nutritionist) {
      return NextResponse.json(
        { error: 'Nutricionista no encontrado' },
        { status: 404 }
      );
    }

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/patient/register?code=${nutritionist.inviteCode}`;

    return NextResponse.json({
      inviteCode: nutritionist.inviteCode,
      inviteUrl,
    });
  } catch (error) {
    console.error('Error fetching invite code:', error);
    return NextResponse.json(
      { error: 'Error al obtener código de invitación' },
      { status: 500 }
    );
  }
}
