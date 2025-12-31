/* ===================================
   FUNCIONALIDAD JAVASCRIPT
   =================================== */

// ===== AUTENTICACIÓN DELEGADA A APP =====
// La autenticación es gestionada por https://app.inmoassistant.es
// La landing redirige al login sin gestionar estado local

// Smooth scroll para los links de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Cerrar menú móvil si está abierto
            navLinks.style.display = 'none';
            toggleBtn.classList.remove('active');
        }
    });
});

// Variables para el menú móvil
const toggleBtn = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Menú móvil responsive
if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
            toggleBtn.classList.remove('active');
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.flexDirection = 'column';
            navLinks.style.gap = '0';
            navLinks.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)';
            navLinks.style.padding = '1rem 0';
            navLinks.style.boxShadow = '0 10px 20px rgba(0, 102, 204, 0.1)';
            navLinks.style.zIndex = '999';
            toggleBtn.classList.add('active');
        }
    });
}

// Animación de números en las estadísticas
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            animateStats();
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

function animateStats() {
    const stats = document.querySelectorAll('.stat h3');
    stats.forEach(stat => {
        const finalValue = parseInt(stat.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const start = Date.now();
        const prefix = stat.textContent.match(/^\D+/)?.[0] || '';
        const suffix = stat.textContent.match(/\D+$/)?.[0] || '';

        const animate = () => {
            const progress = Math.min((Date.now() - start) / duration, 1);
            const currentValue = Math.floor(finalValue * progress);
            
            if (stat.textContent.includes('+')) {
                stat.textContent = '+' + currentValue.toLocaleString();
            } else if (stat.textContent.includes('$')) {
                stat.textContent = '$' + (currentValue / 1000).toFixed(1) + 'B';
            } else if (stat.textContent.includes('%')) {
                stat.textContent = currentValue + '%';
            } else {
                stat.textContent = currentValue.toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    });
}

// Efecto de scroll en la navbar
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 102, 204, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 102, 204, 0.08)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Animación de aparición de elementos al hacer scroll
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeInObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Aplicar animación a tarjetas de características y beneficios
document.querySelectorAll('.feature-card, .benefit-item, .testimonial-card, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// Event listeners para los botones
const ctaButtons = document.querySelectorAll('.btn');
ctaButtons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.letterSpacing = '0.5px';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.letterSpacing = '0';
    });
});

// Validación y manejo básico de formularios (si se agregan)
function initForm() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Formulario enviado');
            // Aquí iría la lógica de envío del formulario
        });
    }
}

initForm();

// Efecto parallax para secciones con fondo
window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero');
    const benefitsSection = document.querySelector('.benefits');
    
    if (heroSection) {
        heroSection.style.backgroundPosition = `0 ${window.pageYOffset * 0.5}px`;
    }
});

// Inicialización de tooltip (opcional)
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.textContent = this.dataset.tooltip;
            tooltip.className = 'tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: var(--primary-blue);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.85rem;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
            `;
            this.appendChild(tooltip);
        });
        
        el.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

initTooltips();

// Contador de usuarios online simulado (opcional)
function updateStats() {
    const onlineCount = document.querySelector('[data-online-count]');
    if (onlineCount) {
        const random = Math.floor(Math.random() * 50) + 150;
        onlineCount.textContent = random;
    }
}

// Actualizar stats cada 5 segundos
setInterval(updateStats, 5000);

// Función para cargar contenido dinámico
async function loadDynamicContent(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Error en la solicitud');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al cargar contenido:', error);
    }
}

// Inicialización al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    console.log('Landing page de InmoAssistant cargada');
    
    // Aquí pueden agregarse más inicializaciones
    // initSliders();
    // initCarousels();
    // loadAnalytics();
});

// Manejo de errores global
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

// Performance: Lazy loading de imágenes
if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}
