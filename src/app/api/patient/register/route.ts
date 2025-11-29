import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, inviteCode, age, weight, height, gender } = body;

    // Validate input
    if (!email || !password || !name || !inviteCode) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Find nutritionist by invite code
    const nutritionist = await prisma.nutritionist.findUnique({
      where: { inviteCode },
    });

    if (!nutritionist) {
      return NextResponse.json(
        { error: 'Código de invitación inválido' },
        { status: 400 }
      );
    }

    // Check if patient already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { email },
    });

    if (existingPatient) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create patient
    const patient = await prisma.patient.create({
      data: {
        email,
        password: hashedPassword,
        name,
        nutritionistId: nutritionist.id,
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        gender: gender || null,
      },
    });

    return NextResponse.json(
      {
        message: 'Paciente registrado exitosamente',
        patient: {
          id: patient.id,
          email: patient.email,
          name: patient.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error al registrar paciente' },
      { status: 500 }
    );
  }
}
