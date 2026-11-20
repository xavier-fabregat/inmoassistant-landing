/* ===================================
   FUNCIONALIDAD JAVASCRIPT
   =================================== */

// ===== AUTENTICACIÓN DELEGADA A APP =====
// La autenticación es gestionada por https://app.inmoassistant.es
// La landing redirige al login sin gestionar estado local

// ===== CONTACTO Y CONTRATACIÓN: CONFIGURACIÓN =====
// ALTA_URL: alta online de la app. Cada botón «Contratar» la abre con
//   ?plan=atencion | atencion-video | completo.
//   Vacía: el botón abre un correo a CONTACTO_EMAIL con el asunto
//   «Contratar plan <nombre>».
// CONTACTO_ENDPOINT: URL que recibe el formulario de /contacto por POST (JSON).
//   Vacía: el formulario abre un correo a CONTACTO_EMAIL con los campos
//   escritos en el cuerpo.
// CONDICIONES_URL: condiciones de contratación.
//   Vacía: no se muestra el enlace.
const ALTA_URL = '';
const CONTACTO_ENDPOINT = '';
const CONDICIONES_URL = '';
const CONTACTO_EMAIL = 'info@inmoassistant.es';

function mailtoHref(subject, body) {
    let href = 'mailto:' + CONTACTO_EMAIL + '?subject=' + encodeURIComponent(subject);
    if (body) href += '&body=' + encodeURIComponent(body);
    return href;
}

// Botones «Contratar» de /contacto
document.querySelectorAll('a.c-hire[data-plan]').forEach(btn => {
    if (ALTA_URL) {
        const url = new URL(ALTA_URL);
        url.searchParams.set('plan', btn.dataset.plan);
        btn.href = url.toString();
    } else {
        btn.href = mailtoHref('Contratar plan ' + btn.dataset.planNombre);
    }
});

// Enlace a las condiciones de contratación
if (CONDICIONES_URL) {
    document.querySelectorAll('[data-condiciones]').forEach(p => {
        const link = p.querySelector('[data-condiciones-link]');
        if (link) link.href = CONDICIONES_URL;
        p.hidden = false;
    });
}

// Formulario de contacto. La validación es la nativa del navegador:
// el evento submit solo llega cuando todos los campos son válidos.
const contactForm = document.getElementById('contacto-form');
if (contactForm) {
    const statusEl = contactForm.querySelector('.c-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    const setStatus = (state, html) => {
        statusEl.dataset.state = state;
        statusEl.innerHTML = html;
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(contactForm));

        // Campo trampa relleno: no se envía nada ni se muestra ningún estado
        if (data.web) return;
        delete data.web;

        if (!CONTACTO_ENDPOINT) {
            const body = [
                'Nombre: ' + data.nombre,
                'Agencia: ' + data.agencia,
                'Correo: ' + data.correo,
                'Teléfono: ' + (data.telefono || '—'),
                'Plan que interesa: ' + data.plan,
                '',
                'Mensaje:',
                data.mensaje
            ].join('\n');
            window.location.href = mailtoHref('Consulta desde la web: ' + data.agencia, body);
            setStatus('mail', 'Tu programa de correo debería abrirse con el mensaje ya escrito. No nos llega hasta que lo envíes desde allí. Si no se abre, escríbenos a <a href="mailto:' + CONTACTO_EMAIL + '">' + CONTACTO_EMAIL + '</a>.');
            return;
        }

        submitBtn.disabled = true;
        setStatus('sending', 'Enviando…');
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        try {
            const res = await fetch(CONTACTO_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                signal: controller.signal
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            contactForm.reset();
            setStatus('sent', 'Mensaje enviado. Te responderemos por correo.');
        } catch (err) {
            setStatus('error', 'No se ha podido enviar el mensaje. Inténtalo de nuevo o escríbenos a <a href="mailto:' + CONTACTO_EMAIL + '">' + CONTACTO_EMAIL + '</a>.');
        } finally {
            clearTimeout(timer);
            submitBtn.disabled = false;
        }
    });
}

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

