import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, specialty, phone } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Check if nutritionist already exists
    const existingNutritionist = await prisma.nutritionist.findUnique({
      where: { email },
    });

    if (existingNutritionist) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create nutritionist with unique invite code
    const nutritionist = await prisma.nutritionist.create({
      data: {
        email,
        password: hashedPassword,
        name,
        specialty: specialty || null,
        phone: phone || null,
        inviteCode: nanoid(10),
      },
    });

    return NextResponse.json(
      {
        message: 'Nutricionista registrado exitosamente',
        nutritionist: {
          id: nutritionist.id,
          email: nutritionist.email,
          name: nutritionist.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error al registrar nutricionista' },
      { status: 500 }
    );
  }
}
