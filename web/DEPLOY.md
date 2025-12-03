# 🚀 Guía de Despliegue - Hotel Sauna Belén

Esta guía te ayudará a desplegar el proyecto en Vercel paso a paso.

## 📋 Checklist Pre-Despliegue

Antes de comenzar, asegúrate de tener:

- [ ] Código commiteado y pusheado a GitHub
- [ ] Cuenta de Vercel creada
- [ ] ~~Proyecto de Supabase configurado~~ **NO necesario para prototipo**
- [ ] ~~Variables de entorno listas~~ **NO necesario para prototipo**

**✅ Para el prototipo con mocks, solo necesitas GitHub y Vercel. ¡Eso es todo!**

## 🔧 Paso 1: Preparar el Repositorio

```bash
# Navegar a la carpeta del proyecto
cd web

# Verificar que estás en la rama main
git checkout main

# Verificar estado
git status

# Si hay cambios sin commitear:
git add .
git commit -m "Preparar proyecto para despliegue en Vercel"
git push origin main
```

## 🌐 Paso 2: Crear Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión (puedes usar tu cuenta de GitHub)

2. Haz clic en **"Add New..."** → **"Project"**

3. Importa tu repositorio de GitHub:
   - Si es la primera vez, autoriza a Vercel a acceder a tus repositorios
   - Busca y selecciona tu repositorio

## ⚙️ Paso 3: Configurar el Proyecto

### Configuración Básica

Vercel detectará automáticamente que es un proyecto Next.js. Verifica:

- **Framework Preset**: Next.js ✅
- **Root Directory**: Si tu proyecto está en la carpeta `web`, selecciona `web`
- **Build Command**: `pnpm build` (o `npm run build` si usas npm)
- **Output Directory**: `.next` (por defecto, no cambiar)
- **Install Command**: `pnpm install` (o `npm install`)

### Variables de Entorno

⚠️ **IMPORTANTE PARA PROTOTIPO:** 

**NO necesitas configurar variables de entorno para el prototipo.** El sistema detecta automáticamente si hay configuración de Supabase y, si no la hay, funciona en modo mock con datos de ejemplo.

**Puedes hacer el deploy directamente sin configurar nada más.**

---

**Solo si más adelante quieres conectar Supabase** (opcional):

En la sección **"Environment Variables"**, agrega:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://tu-proyecto.supabase.co` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `tu-publishable-key` | Clave pública de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `tu-service-role-key` | Clave de servicio (solo servidor) |
| `NEXT_PUBLIC_APP_URL` | `https://tu-proyecto.vercel.app` | URL de producción |

**Notas importantes:**
- Las variables con `NEXT_PUBLIC_` son accesibles en el cliente
- `SUPABASE_SERVICE_ROLE_KEY` es solo para el servidor (nunca se expone)
- Puedes configurar diferentes valores para Production, Preview y Development

### Obtener Credenciales de Supabase (Solo cuando lo implementes)

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. En **Settings** → **API**, encontrarás:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **service_role key**: `SUPABASE_SERVICE_ROLE_KEY` (¡mantener secreto!)

## 🚀 Paso 4: Desplegar

1. Haz clic en **"Deploy"** (sin configurar variables de entorno)
2. Espera a que Vercel construya tu aplicación (2-5 minutos)
3. Una vez completado, verás:
   - ✅ URL de producción: `https://tu-proyecto.vercel.app`
   - ✅ Estado del deploy
   - ✅ Logs del build
4. **¡Listo!** Tu aplicación funcionará automáticamente con datos mock

**Nota:** No necesitas configurar nada más. El sistema detectará que no hay Supabase y usará mocks automáticamente.

## 🔄 Paso 5: Actualizar URL de Producción (Solo si usas Supabase)

Si más adelante conectas Supabase, después del primer deploy:

1. Ve a **Settings** → **Environment Variables**
2. Actualiza `NEXT_PUBLIC_APP_URL` con la URL real de Vercel
3. Haz un nuevo deploy (o espera al siguiente push)

**Para el prototipo, puedes saltarte este paso.**

## ✅ Paso 6: Verificar el Deploy

Visita tu URL de producción y verifica:

- [ ] La página principal carga correctamente
- [ ] Las rutas públicas funcionan
- [ ] El sistema de autenticación funciona (si está configurado)
- [ ] Las imágenes se cargan correctamente
- [ ] No hay errores en la consola del navegador

## 🔄 Deploy Automático

Vercel configurará automáticamente:

- **Deploy en cada push a `main`**: Cada vez que hagas push a la rama main, se desplegará automáticamente
- **Preview Deployments**: Cada Pull Request obtendrá su propia URL de preview
- **Rollback automático**: Si un deploy falla, se mantiene la versión anterior

## 🌍 Dominio Personalizado (Opcional)

Para usar tu propio dominio:

1. Ve a **Settings** → **Domains**
2. Agrega tu dominio (ej: `hotelsaunabelen.com`)
3. Sigue las instrucciones para configurar los registros DNS:
   - Agrega un registro CNAME apuntando a `cname.vercel-dns.com`
   - O agrega un registro A con la IP proporcionada
4. Vercel verificará automáticamente y configurará SSL

## 🐛 Troubleshooting

### Error: "Build Failed"

**Causas comunes:**
- Dependencias faltantes en `package.json`
- Errores de TypeScript
- Variables de entorno faltantes

**Solución:**
1. Revisa los logs de build en Vercel
2. Ejecuta `pnpm build` localmente para reproducir el error
3. Verifica que `pnpm-lock.yaml` esté commiteado

### Error: "Module not found"

**Solución:**
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que `node_modules` esté en `.gitignore` (no debe committearse)
- Ejecuta `pnpm install` localmente y verifica que funcione

### Error: "Environment Variable Missing"

**Para prototipo:** Este error NO debería aparecer porque no necesitas variables de entorno.

**Solo si usas Supabase:**
1. Ve a **Settings** → **Environment Variables**
2. Verifica que todas las variables estén configuradas
3. Asegúrate de que estén marcadas para el entorno correcto (Production/Preview/Development)

### La aplicación carga pero hay errores de Supabase

**Para prototipo:** Si ves errores relacionados con Supabase, verifica que el código esté usando mocks correctamente. El sistema debería funcionar sin Supabase.

**Solo si usas Supabase:**
1. Verifica que las credenciales de Supabase sean correctas
2. Asegúrate de que el proyecto de Supabase esté activo
3. Revisa que las políticas RLS (Row Level Security) estén configuradas

## 📊 Monitoreo

Vercel proporciona:

- **Analytics**: Métricas de rendimiento y uso
- **Logs**: Logs de funciones y errores
- **Speed Insights**: Métricas de velocidad
- **Web Vitals**: Core Web Vitals de tu aplicación

Accede desde el dashboard de tu proyecto en Vercel.

## 🔐 Seguridad

**IMPORTANTE - Nunca commitees:**

- ❌ Archivos `.env` o `.env.local`
- ❌ `SUPABASE_SERVICE_ROLE_KEY` en el código
- ❌ Cualquier credencial o API key

**Verifica que `.gitignore` incluya:**
```
.env
.env.local
.env*.local
```

## 📝 Notas Adicionales

- **Modo Mock**: Si no configuras Supabase, el sistema funcionará en modo mock con datos de ejemplo
- **Regiones**: Vercel despliega automáticamente en la región más cercana a tus usuarios
- **SSL**: Vercel proporciona SSL automático para todos los dominios
- **Límites**: El plan gratuito de Vercel es suficiente para proyectos pequeños/medianos

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs en Vercel Dashboard
2. Verifica la documentación de [Next.js](https://nextjs.org/docs)
3. Consulta la [documentación de Vercel](https://vercel.com/docs)
4. Revisa los issues en GitHub del proyecto

---

**¡Listo!** Tu aplicación debería estar funcionando en producción. 🎉

