import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Users, BarChart3, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">NutriTrack</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/nutritionist/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/nutritionist/register">
              <Button>Registrarse</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Transforma tu Práctica Nutricional
          <span className="text-primary block mt-2">con Inteligencia Artificial</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          La plataforma SaaS que permite a nutricionistas gestionar pacientes y analizar
          comidas automáticamente con IA. Tus pacientes suben fotos, tú obtienes datos precisos.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/nutritionist/register">
            <Button size="lg" className="text-lg px-8">
              Comenzar Gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Ver Características
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">
          Todo lo que necesitas en un solo lugar
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12">
          Simplifica tu trabajo y ofrece un mejor servicio a tus pacientes
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Análisis con IA</CardTitle>
              <CardDescription>
                Tus pacientes solo suben una foto de su comida y nuestra IA analiza
                automáticamente calorías, proteínas, carbohidratos y más.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Gestión de Pacientes</CardTitle>
              <CardDescription>
                Dashboard completo donde ves todos tus pacientes, su progreso y
                el historial completo de sus comidas en tiempo real.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Reportes Detallados</CardTitle>
              <CardDescription>
                Visualiza patrones alimenticios, tendencias y estadísticas de
                cada paciente para tomar mejores decisiones.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Cómo Funciona
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Regístrate como Nutricionista</h3>
                <p className="text-gray-600">
                  Crea tu cuenta en minutos y obtén acceso inmediato a tu dashboard profesional.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Invita a tus Pacientes</h3>
                <p className="text-gray-600">
                  Obtén un link único para cada nutricionista. Compártelo con tus pacientes
                  para que se registren automáticamente bajo tu cuenta.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Pacientes Suben Fotos</h3>
                <p className="text-gray-600">
                  Tus pacientes usan la app para fotografiar sus comidas. Simple y rápido.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Recibe Datos en Tiempo Real</h3>
                <p className="text-gray-600">
                  Visualiza automáticamente en tu dashboard toda la información nutricional
                  analizada por IA de cada comida.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Beneficios para Nutricionistas
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            'Ahorra tiempo en el análisis manual de comidas',
            'Mejora la adherencia de tus pacientes',
            'Datos precisos y objetivos para tus consultas',
            'Acceso desde cualquier dispositivo',
            'Historial completo de cada paciente',
            'Interfaz intuitiva y fácil de usar',
          ].map((benefit, index) => (
            <div key={index} className="flex gap-3 items-start">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <span className="text-lg">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Comienza a Transformar tu Práctica Hoy
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Únete a los nutricionistas que ya están usando NutriTrack
            para ofrecer un mejor servicio a sus pacientes.
          </p>
          <Link href="/nutritionist/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Crear Cuenta Gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">NutriTrack</span>
          </div>
          <p>&copy; 2024 NutriTrack. Todos los derechos reservados.</p>
          <div className="mt-4 flex gap-6 justify-center">
            <Link href="#" className="hover:text-primary">Términos</Link>
            <Link href="#" className="hover:text-primary">Privacidad</Link>
            <Link href="#" className="hover:text-primary">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
