'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users, Link2, Copy, Check, LogOut, Camera, TrendingUp } from 'lucide-react';
import { formatDate, formatCalories, formatMacros } from '@/lib/utils';

interface Meal {
  id: string;
  imageUrl: string;
  mealType: string;
  description: string;
  createdAt: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  meals: Meal[];
  _count: {
    meals: number;
  };
}

export default function NutritionistDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [inviteUrl, setInviteUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/nutritionist/login');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const [patientsRes, inviteRes] = await Promise.all([
        fetch('/api/nutritionist/patients'),
        fetch('/api/nutritionist/invite-code'),
      ]);

      const patientsData = await patientsRes.json();
      const inviteData = await inviteRes.json();

      setPatients(patientsData.patients || []);
      setInviteUrl(inviteData.inviteUrl || '');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const totalMeals = patients.reduce((sum, patient) => sum + patient._count.meals, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary">NutriTrack</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session?.user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenido, {session?.user?.name}
          </h1>
          <p className="text-gray-600">
            Gestiona a tus pacientes y monitorea su progreso nutricional
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comidas</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMeals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos Hoy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {patients.filter(p => {
                  const today = new Date().toDateString();
                  return p.meals.some(m => new Date(m.createdAt).toDateString() === today);
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invite Link Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Link de Invitación para Pacientes
            </CardTitle>
            <CardDescription>
              Comparte este enlace con tus pacientes para que se registren
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-white border rounded-md text-sm"
              />
              <Button onClick={copyToClipboard} variant="default">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <Card>
          <CardHeader>
            <CardTitle>Tus Pacientes</CardTitle>
            <CardDescription>
              Vista general de todos tus pacientes y sus últimas comidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No tienes pacientes aún</p>
                <p className="text-sm text-gray-500">
                  Comparte tu link de invitación para que tus pacientes se registren
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {patients.map((patient) => (
                  <div key={patient.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{patient.name}</h3>
                        <p className="text-sm text-gray-600">{patient.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Registrado: {formatDate(patient.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {patient._count.meals}
                        </div>
                        <div className="text-xs text-gray-600">comidas</div>
                      </div>
                    </div>

                    {patient.meals.length > 0 ? (
                      <div>
                        <h4 className="text-sm font-semibold mb-3">Últimas Comidas</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {patient.meals.map((meal) => (
                            <div key={meal.id} className="border rounded-lg overflow-hidden bg-white">
                              <div className="relative h-40 bg-gray-100">
                                <Image
                                  src={meal.imageUrl}
                                  alt={meal.description || 'Comida'}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-xs font-semibold text-primary capitalize">
                                    {meal.mealType}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(meal.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm mb-2 line-clamp-2">
                                  {meal.description}
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-600">Calorías:</span>
                                    <span className="font-semibold ml-1">
                                      {formatCalories(meal.calories)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Proteína:</span>
                                    <span className="font-semibold ml-1">
                                      {formatMacros(meal.protein)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Carbos:</span>
                                    <span className="font-semibold ml-1">
                                      {formatMacros(meal.carbs)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Grasas:</span>
                                    <span className="font-semibold ml-1">
                                      {formatMacros(meal.fats)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Este paciente aún no ha registrado comidas
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
