# 🚀 Guía Rápida de Desarrollo

## Iniciando el Proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/xavier-fabregat/inmoassistant-landing.git
cd inmoassistant-landing
```

### 2. Iniciar servidor local
```bash
# Opción 1: Python (recomendado)
python -m http.server 8000

# Opción 2: Node.js
http-server

# Opción 3: npm script
npm start
```

### 3. Abrir en navegador
```
http://localhost:8000
```

## 📁 Estructura del Proyecto

```
├── index.html          # Estructura principal (8 secciones)
├── styles.css          # Estilos responsivos y animaciones
├── script.js           # Funcionalidad interactiva
├── package.json        # Metadatos del proyecto
├── README_NEW.md       # Documentación completa
├── TECHNICAL_SPECS.md  # Especificaciones técnicas
├── QUICK_START.md      # Este archivo
└── .gitignore          # Archivos ignorados por git
```

## 🎨 Personalización Rápida

### Cambiar Colores Primarios
Edita `/styles.css` línea 1-10:
```css
:root {
    --primary-blue: #0066cc;        /* Cambiar aquí */
    --secondary-blue: #0052a3;      /* O aquí */
    --accent-blue: #3399ff;         /* O aquí */
}
```

### Cambiar Textos
Edita `/index.html` en las secciones que necesites:
- Títulos: `<h1>`, `<h2>`, `<h3>`
- Descripciones: `<p>`
- Botones: `<button>`, `<a>`

### Cambiar Logo/Branding
En `/index.html` sección navbar (línea ~30):
```html
<div class="logo">
    <i class="fas fa-home"></i>  <!-- Cambiar icono aquí -->
    <span>InmoAssistant</span>    <!-- O nombre aquí -->
</div>
```

## ⚡ Características Implementadas

### JavaScript
- ✅ Smooth scroll navigation
- ✅ Menú móvil responsivo
- ✅ Animación de números
- ✅ Lazy loading de imágenes
- ✅ Scroll animations
- ✅ Parallax effects

### CSS
- ✅ Gradientes modernos
- ✅ Animaciones suaves
- ✅ Grid y Flexbox
- ✅ Media queries responsivas
- ✅ Variables CSS
- ✅ Efectos hover

## 📱 Testing Responsivo

### Breakpoints
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px  
- **Móvil**: < 768px

### Cómo testear
1. Chrome DevTools: F12 → Ctrl+Shift+M
2. Firefox: Ctrl+Shift+M
3. Safari: Cmd+Opt+U

## 🔍 Validación

### HTML
```bash
# Validar HTML online
https://validator.w3.org/
```

### CSS
```bash
# Validar CSS online
https://jigsaw.w3.org/css-validator/
```

### Lighthouse (Performance)
```bash
# En Chrome DevTools: F12 → Lighthouse → Analizar
```

## 🚀 Deployment

### GitHub Pages
```bash
# 1. Sube los archivos a GitHub
# 2. Ve a Settings → Pages
# 3. Selecciona rama 'main' como source
# 4. Tu sitio estará en: username.github.io/repo-name
```

### Netlify
```bash
# 1. Conecta tu repositorio GitHub
# 2. Deploy automático en cada push
# 3. URL automática: xxxx.netlify.app
```

### Servidor Propio
```bash
# 1. Sube los archivos via FTP
# 2. Configura HTTPS
# 3. Apunta tu dominio
```

## 🛠️ Modificaciones Comunes

### Agregar Nueva Sección
1. Copia una sección existente en `index.html`
2. Modifica el contenido
3. Agrega estilos en `styles.css` si necesita
4. Agrega funcionalidad en `script.js` si necesita

### Cambiar Fuentes
Edita en `styles.css` línea 19:
```css
body {
    font-family: 'Tu Fuente Aquí', sans-serif;
}
```

### Agregar Analytics
En `index.html` antes de `</body>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 📊 Performance Checklist

- [ ] Comprimir imágenes
- [ ] Minificar CSS/JS
- [ ] Configurar caché
- [ ] Habilitar GZIP
- [ ] Optimizar fonts
- [ ] Lazy load images

## 🐛 Debugging

### Problema: Estilos no aplican
```
1. Limpiar caché: Ctrl+Shift+R
2. Verificar ruta: Debe ser ./styles.css
3. Verificar sintaxis CSS
```

### Problema: JavaScript no funciona
```
1. Abrir consola: F12
2. Buscar errores (rojo)
3. Verificar rutas de archivos
4. Verificar sintaxis JavaScript
```

### Problema: Responsive no funciona
```
1. Verificar viewport meta tag
2. Limpiar caché del navegador
3. Testear en navegador diferente
4. Verificar media queries
```

## 📚 Recursos Útiles

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS-Tricks](https://css-tricks.com/)
- [Can I Use](https://caniuse.com/)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [WebAIM WCAG](https://webaim.org/articles/wcag/)

## 📞 Soporte

Para preguntas técnicas:
1. Revisa README_NEW.md
2. Revisa TECHNICAL_SPECS.md
3. Consulta los comentarios en el código
4. Abre un issue en GitHub

## 📝 Changelog

### v1.0.0 (Diciembre 2025)
- ✅ Landing page completa
- ✅ Diseño responsivo
- ✅ 8 secciones principales
- ✅ Animaciones y efectos
- ✅ Documentación completa

## ✨ Tips de Productividad

1. **Usar Emmet**: Escribe `div.class>p*3` en HTML
2. **Live Server**: Instala extensión para reload automático
3. **Prettier**: Formatea código automáticamente
4. **SCSS**: Considera usar preprocesador para estilos
5. **Git**: Commit frecuente con mensajes claros

---

**¡Happy coding! 🎉**
