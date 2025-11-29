# NutriTrack - SaaS para Nutricionistas

![NutriTrack](https://img.shields.io/badge/NutriTrack-SaaS-green)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.14-purple)

Plataforma SaaS completa que permite a nutricionistas gestionar pacientes y analizar comidas automáticamente usando Inteligencia Artificial.

## 🚀 Características

### Para Nutricionistas
- ✅ Registro y autenticación segura
- ✅ Dashboard profesional con estadísticas
- ✅ Gestión completa de pacientes
- ✅ Link único de invitación para pacientes
- ✅ Visualización de todas las comidas y análisis nutricional
- ✅ Datos en tiempo real

### Para Pacientes
- ✅ Registro mediante código de invitación del nutricionista
- ✅ Upload de fotos de comidas (drag & drop)
- ✅ Análisis automático con IA (OpenAI GPT-4 Vision)
- ✅ Información nutricional detallada:
  - Calorías
  - Proteínas
  - Carbohidratos
  - Grasas
  - Fibra
- ✅ Historial completo de comidas
- ✅ Estadísticas diarias

### Landing Page
- ✅ Página de venta del servicio
- ✅ Secciones: Hero, Características, Cómo Funciona, Beneficios, CTA
- ✅ Diseño profesional y responsivo

## 🛠 Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos**: SQLite (fácilmente migrable a PostgreSQL)
- **ORM**: Prisma
- **Autenticación**: NextAuth.js
- **IA**: OpenAI GPT-4 Vision API
- **Upload de Imágenes**: React Dropzone
- **UI Components**: Componentes personalizados con Tailwind

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de OpenAI con acceso a GPT-4 Vision API

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd MVP-Nutritrack
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui-cambiar-en-produccion"

# OpenAI API Key
OPENAI_API_KEY="tu-api-key-de-openai"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Para obtener tu OpenAI API Key:
1. Visita https://platform.openai.com/api-keys
2. Crea una nueva API key
3. Copia y pega en el archivo `.env`

4. **Inicializar la base de datos**
```bash
npx prisma generate
npx prisma db push
```

5. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

## 📁 Estructura del Proyecto

```
MVP-Nutritrack/
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── public/
│   └── uploads/               # Imágenes subidas por pacientes
├── src/
│   ├── app/
│   │   ├── api/              # API Routes
│   │   │   ├── auth/         # NextAuth endpoints
│   │   │   ├── nutritionist/ # APIs de nutricionistas
│   │   │   ├── patient/      # APIs de pacientes
│   │   │   └── meals/        # API de comidas
│   │   ├── nutritionist/     # Páginas de nutricionistas
│   │   │   ├── register/
│   │   │   ├── login/
│   │   │   └── dashboard/
│   │   ├── patient/          # Páginas de pacientes
│   │   │   ├── register/
│   │   │   ├── login/
│   │   │   └── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Landing page
│   │   └── globals.css
│   ├── components/
│   │   └── ui/               # Componentes UI reutilizables
│   ├── lib/
│   │   ├── prisma.ts         # Cliente Prisma
│   │   ├── auth.ts           # Configuración NextAuth
│   │   ├── openai.ts         # Integración OpenAI
│   │   └── utils.ts          # Utilidades
│   └── types/
│       └── next-auth.d.ts    # Tipos TypeScript
├── .env                       # Variables de entorno
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🔐 Autenticación

El sistema implementa dos tipos de usuarios independientes:

1. **Nutricionistas**: Acceso completo al dashboard de gestión
2. **Pacientes**: Acceso al portal de upload de comidas

Ambos tienen sistemas de autenticación separados usando NextAuth.js con Credentials Provider.

## 🔄 Flujo de Usuario

### Nutricionista
1. Registrarse en `/nutritionist/register`
2. Iniciar sesión en `/nutritionist/login`
3. Acceder al dashboard en `/nutritionist/dashboard`
4. Obtener link de invitación único
5. Compartir link con pacientes
6. Ver datos de pacientes y sus comidas en tiempo real

### Paciente
1. Recibir link de invitación del nutricionista
2. Registrarse usando el código en `/patient/register?code=XXXXX`
3. Iniciar sesión en `/patient/login`
4. Subir fotos de comidas en `/patient/dashboard`
5. Ver análisis nutricional automático
6. Consultar historial de comidas

## 🤖 Análisis con IA

El sistema utiliza GPT-4 Vision de OpenAI para analizar automáticamente las fotos de comidas:

- Identifica ingredientes
- Calcula calorías estimadas
- Determina macronutrientes (proteínas, carbohidratos, grasas, fibra)
- Genera descripción del plato

## 🚀 Despliegue a Producción

### Vercel (Recomendado)

1. Sube tu código a GitHub
2. Conecta con Vercel
3. Configura las variables de entorno en Vercel
4. Cambia `DATABASE_URL` a PostgreSQL (recomendado para producción)
5. Despliega

### Variables de entorno para producción:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="secret-seguro-aleatorio-aqui"
OPENAI_API_KEY="tu-api-key"
NEXT_PUBLIC_APP_URL="https://tu-dominio.com"
```

## 🗄 Migrar de SQLite a PostgreSQL

1. Actualiza el `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Actualiza `DATABASE_URL` en `.env`:
```env
DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db"
```

3. Ejecuta las migraciones:
```bash
npx prisma migrate dev
```

## 📝 Scripts Disponibles

```bash
npm run dev      # Ejecutar en desarrollo
npm run build    # Build para producción
npm run start    # Ejecutar build de producción
npm run lint     # Ejecutar ESLint
```

## 🎨 Personalización

### Colores
Edita `tailwind.config.ts` para cambiar los colores primarios y secundarios.

### Logo
Reemplaza el componente `Sparkles` en los headers con tu logo personalizado.

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT con NextAuth.js
- ✅ Validación de datos en backend
- ✅ Protección de rutas con middleware
- ✅ CORS configurado
- ✅ Variables de entorno para secretos

## 🐛 Solución de Problemas

### Error: "OpenAI API key not found"
- Verifica que `OPENAI_API_KEY` esté configurado en `.env`
- Reinicia el servidor de desarrollo

### Error: "Database not found"
- Ejecuta `npx prisma db push`
- Verifica que `DATABASE_URL` esté configurado

### Error en upload de imágenes
- Verifica que la carpeta `public/uploads` tenga permisos de escritura
- Comprueba que el tamaño de la imagen no exceda 10MB

## 📄 Licencia

Este proyecto es de código abierto.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue primero para discutir cambios mayores.

## 📧 Soporte

Para soporte y consultas, abre un issue en el repositorio.

---

Desarrollado con ❤️ usando Next.js, TypeScript y OpenAI
