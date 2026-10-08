# Generador de Menús Semanales 🍽️

Aplicación PWA para generar menús semanales de forma automática con restricciones personalizadas.

## 🌐 Aplicación en Línea

La aplicación está desplegada en GitHub Pages y disponible como PWA:

**URL:** https://aadriiaanaa28.github.io/comidas/

### Instalar como PWA

1. Abre la URL en tu navegador móvil (Chrome, Safari, Edge)
2. Busca la opción "Agregar a pantalla de inicio" o "Instalar aplicación"
3. La app se instalará como una aplicación nativa en tu dispositivo

En **iOS Safari**:
- Toca el ícono de compartir (cuadrado con flecha hacia arriba)
- Selecciona "Agregar a pantalla de inicio"

En **Android Chrome**:
- Toca el menú (tres puntos)
- Selecciona "Instalar aplicación" o "Agregar a pantalla de inicio"

## ✨ Características

- ✅ Generación automática de menús semanales
- ✅ Restricciones por categoría (Pasta, Pescado, Verduras, Carne)
- ✅ Gestión de guarniciones automáticas
- ✅ Menús alternativos para preferencias especiales
- ✅ Interfaz responsive y moderna
- ✅ PWA instalable (funciona offline)
- ✅ Sin repetición de platos en la misma generación

## 🚀 Desarrollo Local

### Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ionic serve

# La aplicación estará disponible en http://localhost:8100
```

### Compilar para producción

```bash
# Compilar
npm run build

# Desplegar en GitHub Pages
npx angular-cli-ghpages --dir=www
```

## 📋 Reglas de Generación de Menús

### Categorías Obligatorias
- Mínimo 1 menú de categoría **Pasta**
- Mínimo 1 menú de categoría **Pescado**
- Mínimo 1 menú de categoría **Verduras**
- Mínimo 1 menú de categoría **Carne**

### Guarniciones
Los platos con `Lleva Guarnición = "S"` se acompañan automáticamente con un plato de orden "Guarnición"

### Menús Alternativos
Si un menú contiene un plato con `Especial juanvi = "Juanvi"`, se genera automáticamente un menú alternativo para Adri y Ale con platos regulares

### Sin Repeticiones
Los platos no se repiten dentro de la misma generación de menús

## 🗂️ Base de Datos

Los platos están definidos en `src/assets/database/comidas.json` con la siguiente estructura:

```json
{
  "Plato": "Nombre del plato",
  "Orden": "Primero | Principal | Guarnición",
  "Categoría": "Nombre de la categoría",
  "Lleva Guarnición": "S | null",
  "Especial juanvi": "Juanvi | null"
}
```

## 🛠️ Tecnologías

- **Ionic 8** - Framework mobile
- **Angular 22** - Framework web
- **TypeScript** - Lenguaje de programación
- **PWA** - Progressive Web App
- **GitHub Pages** - Hosting

## 📱 Compatibilidad

- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Desktop Chrome/Edge/Firefox
- ✅ Funciona offline después de la primera carga

## 📄 Licencia

Este proyecto es de uso personal.
