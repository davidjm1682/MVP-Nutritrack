'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sparkles, LogOut, Upload, Camera, Loader2 } from 'lucide-react';
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
  fiber: number;
}

export default function PatientDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [mealType, setMealType] = useState('lunch');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/patient/login');
    } else if (status === 'authenticated') {
      fetchMeals();
    }
  }, [status, router]);

  const fetchMeals = async () => {
    try {
      const response = await fetch('/api/patient/meals');
      const data = await response.json();
      setMeals(data.meals || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('mealType', mealType);

      const response = await fetch('/api/meals/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir imagen');
      }

      // Refresh meals list
      await fetchMeals();
    } catch (error: any) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  }, [mealType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

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

  const todayMeals = meals.filter(
    m => new Date(m.createdAt).toDateString() === new Date().toDateString()
  );
  const todayCalories = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);

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
            Hola, {session?.user?.name}
          </h1>
          <p className="text-gray-600">
            Registra tus comidas y mantén un seguimiento de tu nutrición
          </p>
        </div>

        {/* Today's Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comidas Hoy</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayMeals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calorías Hoy</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(todayCalories)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comidas</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meals.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Subir Nueva Comida</CardTitle>
            <CardDescription>
              Fotografía tu comida y obtén análisis nutricional automático
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Comida</Label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={uploading}
                >
                  <option value="breakfast">Desayuno</option>
                  <option value="lunch">Almuerzo</option>
                  <option value="dinner">Cena</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary'
                } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} />
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-gray-600">Analizando imagen con IA...</p>
                    <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="w-12 h-12 text-gray-400 mb-4" />
                    {isDragActive ? (
                      <p className="text-gray-600">Suelta la imagen aquí...</p>
                    ) : (
                      <>
                        <p className="text-gray-600 mb-2">
                          Arrastra una foto aquí o haz clic para seleccionar
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, JPEG hasta 10MB
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {uploadError}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meals History */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Comidas</CardTitle>
            <CardDescription>
              Todas tus comidas registradas con análisis nutricional
            </CardDescription>
          </CardHeader>
          <CardContent>
            {meals.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No has registrado comidas aún</p>
                <p className="text-sm text-gray-500">
                  Sube tu primera foto para comenzar
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((meal) => (
                  <div key={meal.id} className="border rounded-lg overflow-hidden bg-white">
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={meal.imageUrl}
                        alt={meal.description || 'Comida'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-semibold text-primary capitalize">
                          {meal.mealType === 'breakfast' && 'Desayuno'}
                          {meal.mealType === 'lunch' && 'Almuerzo'}
                          {meal.mealType === 'dinner' && 'Cena'}
                          {meal.mealType === 'snack' && 'Snack'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(meal.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mb-3 line-clamp-2">
                        {meal.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Calorías</span>
                          <span className="font-semibold text-primary">
                            {formatCalories(meal.calories)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-gray-600">Proteína</div>
                            <div className="font-semibold">{formatMacros(meal.protein)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600">Carbos</div>
                            <div className="font-semibold">{formatMacros(meal.carbs)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-600">Grasas</div>
                            <div className="font-semibold">{formatMacros(meal.fats)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
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
