#!/bin/bash

# InmoAssistant Landing Page - Setup Script
# Este script ayuda a iniciar el proyecto de forma rápida

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     InmoAssistant Landing Page - Setup Script              ║"
echo "║     Versión 1.0.0 - Diciembre 2025                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Detectar el sistema operativo
OS=$(uname -s)

# Función para mostrar instrucciones
show_instructions() {
    echo "📋 INSTRUCCIONES DE USO"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "1️⃣  INICIAR SERVIDOR LOCAL"
    echo "   Option A (Python 3 - Recomendado):"
    echo "   $ python -m http.server 8000"
    echo ""
    echo "   Option B (Python 2):"
    echo "   $ python -m SimpleHTTPServer 8000"
    echo ""
    echo "   Option C (Node.js):"
    echo "   $ http-server"
    echo ""
    echo "2️⃣  ABRIR EN NAVEGADOR"
    echo "   $ http://localhost:8000"
    echo ""
    echo "3️⃣  VISUALIZAR ARCHIVOS"
    echo "   • index.html          - Landing page principal (15K)"
    echo "   • styles.css          - Estilos y animaciones (16K)"
    echo "   • script.js           - Funcionalidad JavaScript (8.5K)"
    echo "   • test-validation.html - Panel de pruebas y validación"
    echo ""
    echo "4️⃣  CONSULTAR DOCUMENTACIÓN"
    echo "   • README_NEW.md       - Documentación general"
    echo "   • TECHNICAL_SPECS.md  - Especificaciones técnicas"
    echo "   • QUICK_START.md      - Guía rápida"
    echo "   • PROJECT_SUMMARY.md  - Resumen del proyecto"
    echo ""
    echo "════════════════════════════════════════════════════════════"
}

# Función para verificar dependencias
check_dependencies() {
    echo "🔍 VERIFICANDO DEPENDENCIAS"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    if command -v python3 &> /dev/null; then
        echo "✅ Python 3: $(python3 --version)"
    elif command -v python &> /dev/null; then
        echo "✅ Python 2: $(python --version)"
    else
        echo "⚠️  Python no encontrado. Instálalo para usar el servidor local."
    fi
    
    if command -v node &> /dev/null; then
        echo "✅ Node.js: $(node --version)"
    else
        echo "ℹ️  Node.js no encontrado (opcional)."
    fi
    
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo ""
}

# Función para mostrar resumen del proyecto
show_summary() {
    echo "📊 RESUMEN DEL PROYECTO"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "📁 Archivos Generados:"
    echo "   • index.html               (331 líneas)"
    echo "   • styles.css               (824 líneas)"
    echo "   • script.js                (267 líneas)"
    echo "   • Total: 1,422 líneas de código"
    echo ""
    echo "🎨 Características de Diseño:"
    echo "   • Paleta de 5 tonos azules profesionales"
    echo "   • 100% responsive (4 breakpoints)"
    echo "   • 50+ animaciones y transiciones"
    echo "   • Gradientes modernos"
    echo ""
    echo "📄 Secciones Principales:"
    echo "   1. Navegación sticky"
    echo "   2. Sección Hero"
    echo "   3. 6 Características"
    echo "   4. 4 Beneficios"
    echo "   5. 3 Planes de Precios"
    echo "   6. 3 Testimonios"
    echo "   7. Call To Action"
    echo "   8. Footer"
    echo ""
    echo "⚡ Funcionalidad:"
    echo "   • Smooth scroll navigation"
    echo "   • Menú móvil responsivo"
    echo "   • Animación de números"
    echo "   • Efecto parallax"
    echo "   • Lazy loading"
    echo ""
    echo "📚 Documentación:"
    echo "   • README_NEW.md (4.6K)"
    echo "   • TECHNICAL_SPECS.md (5.6K)"
    echo "   • QUICK_START.md (5.1K)"
    echo "   • PROJECT_SUMMARY.md (7.3K)"
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo ""
}

# Función para mostrar próximos pasos
show_next_steps() {
    echo "🚀 PRÓXIMOS PASOS"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "1. PERSONALIZAR:"
    echo "   □ Cambiar textos en index.html"
    echo "   □ Ajustar colores en styles.css"
    echo "   □ Modificar funcionalidad en script.js"
    echo ""
    echo "2. AGREGAR BACKEND:"
    echo "   □ Crear API para formularios"
    echo "   □ Integrar base de datos"
    echo "   □ Configurar email notifications"
    echo ""
    echo "3. ANALYTICS:"
    echo "   □ Agregar Google Analytics"
    echo "   □ Configurar conversion tracking"
    echo "   □ Setup de heatmaps"
    echo ""
    echo "4. DEPLOYMENT:"
    echo "   □ GitHub Pages"
    echo "   □ Netlify"
    echo "   □ Servidor propio"
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo ""
}

# Función principal
main() {
    show_summary
    check_dependencies
    show_instructions
    show_next_steps
    
    echo "✨ ¡Tu landing page de InmoAssistant está lista!"
    echo ""
    echo "Para iniciar el servidor local, ejecuta:"
    echo "$ python -m http.server 8000"
    echo ""
    echo "Luego abre: http://localhost:8000"
    echo ""
}

# Ejecutar la función principal
main
