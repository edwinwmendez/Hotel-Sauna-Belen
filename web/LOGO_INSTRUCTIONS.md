# Instrucciones para Agregar Logo y Favicon

## 📍 Ubicación de Archivos

### 1. Favicon
**Ubicación:** `web/app/favicon.ico`

**Opciones (Next.js 13+ detecta automáticamente):**
- `web/app/favicon.ico` (formato ICO tradicional)
- `web/app/icon.png` (32x32 o 64x64 px)
- `web/app/icon.svg` (recomendado, escalable)

**Nota:** Next.js detecta automáticamente estos archivos y los usa como favicon. No necesitas configuración adicional.

---

### 2. Logotipo
**Ubicación:** `web/public/logo.png` o `web/public/logo.svg`

**Formatos recomendados:**
- **SVG** (recomendado): Escalable, mejor calidad
- **PNG**: Con fondo transparente
- **Tamaño sugerido**: 200x50 px o proporción similar

**Archivos a crear:**
- `web/public/logo.png` (o `logo.svg`)

---

## ✅ Cambios Realizados

El código ya está preparado para usar tu logo:

1. **Header público** (`components/layout/header.tsx`):
   - Muestra el logo desde `/public/logo.png`
   - Si el logo no existe, muestra solo el texto como fallback
   - El logo es responsive (h-8 en móvil, h-10 en desktop)

2. **Favicon**:
   - Reemplaza `web/app/favicon.ico` con tu archivo
   - O crea `web/app/icon.png` o `web/app/icon.svg`

---

## 📝 Pasos a Seguir

1. **Coloca tu favicon:**
   ```
   web/app/favicon.ico
   ```
   O alternativamente:
   ```
   web/app/icon.png
   web/app/icon.svg
   ```

2. **Coloca tu logo:**
   ```
   web/public/logo.png
   ```
   O si prefieres SVG:
   ```
   web/public/logo.svg
   ```

3. **Si usas SVG en lugar de PNG**, actualiza el Header:
   - Abre `web/components/layout/header.tsx`
   - Cambia `/logo.png` por `/logo.svg` en la línea del Image

---

## 🎨 Recomendaciones de Diseño

### Favicon:
- Tamaño: 32x32 px o 64x64 px
- Formato: ICO, PNG o SVG
- Debe ser reconocible en tamaños pequeños

### Logo:
- Ancho recomendado: 120-200 px
- Alto recomendado: 30-50 px (proporción ~4:1)
- Fondo transparente (PNG) o sin fondo (SVG)
- Colores que contrasten con el fondo del header

---

## 🔍 Verificación

Después de agregar los archivos:

1. **Favicon**: Recarga la página y verifica en la pestaña del navegador
2. **Logo**: Debe aparecer en el header junto al texto "Hotel Sauna Belén"

Si el logo no aparece:
- Verifica que el archivo esté en `web/public/`
- Verifica el nombre del archivo (debe ser exactamente `logo.png` o `logo.svg`)
- Verifica que el archivo no esté corrupto

