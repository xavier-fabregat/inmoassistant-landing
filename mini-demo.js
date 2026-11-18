// Demostraciones cortas de /whatsapp y /calculadora. Datos ficticios.
// Se reproducen al entrar en pantalla, sin sonido. Con «reducir movimiento»
// no arrancan solas y muestran el último paso.
(function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const nb = t => esc(t).replace(/(\d) (€|%)/g, '$1&nbsp;$2');
    const num = (n, d = 2) => new Intl.NumberFormat('es-ES', { maximumFractionDigits: d }).format(n);
    const eur = (n, d = 0) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: d, maximumFractionDigits: d }).format(n);

    function phone(day, msgs, newest) {
        const items = msgs.map((m, i) => m.sep
            ? `<p class="demo-day">${esc(m.sep)}</p>`
            : `<div class="msg msg-${m.from}${i === newest ? ' is-new' : ''}">${nb(m.text)}<time>${m.t}</time></div>`).join('');
        return `
            <div class="demo-phone mini-phone">
                <div class="demo-phone-bar">
                    <i class="fab fa-whatsapp" aria-hidden="true"></i>
                    <div><strong>Fincas Ejemplo</strong><small>Asistente de la agencia</small></div>
                </div>
                <div class="demo-chat"><p class="demo-day">${esc(day)}</p>${items}</div>
            </div>`;
    }

    /* ---------- /whatsapp: traspaso a una persona y seguimiento ---------- */

    // Mismas reglas que la demo de la portada.
    const STAGES = ['Nuevos leads', 'Contacto iniciado', 'Datos básicos', 'Cualificados', 'Oportunidad activa'];
    const datos = c => ['intent', 'zone', 'budget', 'type', 'term'].filter(f => c[f]).length;
    const score = c => !c.inFlow ? null : c.done ? 85 : Math.min(65, 35 + 10 * datos(c));
    const temp = p => p === null ? null : p >= 70 ? 'caliente' : p >= 35 ? 'tibio' : 'frio';
    const stageOf = (c, t) => c.done && t === 'caliente' ? 4 : (c.intent && c.zone && (c.budget || c.type)) ? 3 : (c.inFlow || datos(c)) ? 2 : 0;
    const TEMPS = { frio: 'Frío', tibio: 'Tibio', caliente: 'Caliente' };

    const chatA = [
        { from: 'in', t: '18:05', text: 'Hola, busco un piso de alquiler en Costa Ejemplo.' },
        { from: 'out', t: '18:05', text: 'Hola, gracias por escribir a Fincas Ejemplo. ¿Cómo te llamas?' },
        { from: 'in', t: '18:06', text: 'Marcos.' },
        { from: 'out', t: '18:06', text: 'Gracias, Marcos. ¿Qué presupuesto mensual tienes?' },
        { from: 'in', t: '18:07', text: 'Unos 900 € al mes. ¿Puedo hablar con alguien de la agencia?' },
        { from: 'out', t: '18:07', text: 'Claro, Marcos. Paso tu conversación a una persona del equipo para que te contacte.' }
    ];
    const contactA = [
        {},
        { inFlow: true, intent: 'Alquilar', type: 'Piso', zone: 'Costa Ejemplo' },
        { name: 'Marcos' },
        {},
        { budget: '900 €/mes' },
        { done: true }
    ];
    const chatB = [
        { from: 'in', t: '10:02', text: 'Hola, ¿tenéis pisos de dos habitaciones?' },
        { from: 'out', t: '10:02', text: 'Hola, gracias por escribir a Fincas Ejemplo. ¿En qué población buscas?' },
        { sep: 'Martes · sin respuesta desde ayer' },
        { from: 'out', t: '09:30', text: 'Hola de nuevo. ¿Sigues buscando piso? Si te viene mejor, te paso con alguien del equipo.' }
    ];

    // Estado del contacto en cada paso, sin retroceder de etapa.
    const statesA = [];
    contactA.reduce((acc, delta) => {
        const c = Object.assign({}, acc.c, delta);
        const p = score(c), t = temp(p);
        const st = Math.max(acc.st, stageOf(c, t));
        statesA.push({ c, p, t, st });
        return { c, st };
    }, { c: {}, st: 0 });

    function contactCard(s, handoff) {
        const v = x => x ? nb(x) : '—';
        return `
            <div class="mini-panel">
                <p class="mini-panel-title">Tarjeta en el embudo</p>
                <p class="mini-stage-name">${STAGES[s.st]}</p>
                <div class="demo-card">
                    <strong>${s.c.name ? esc(s.c.name) : 'Sin nombre'}</strong>
                    <dl>
                        <div><dt>Intención</dt><dd>${v(s.c.intent)}</dd></div>
                        <div><dt>Zona</dt><dd>${v(s.c.zone)}</dd></div>
                        <div><dt>Presupuesto</dt><dd>${v(s.c.budget)}</dd></div>
                        <div><dt>Temperatura</dt><dd>${s.t ? `<span class="temp temp-${s.t}">${TEMPS[s.t]}</span>` : '—'}</dd></div>
                        <div><dt>Puntuación</dt><dd>${s.p === null ? '—' : s.p}</dd></div>
                    </dl>
                    ${handoff ? '<p class="demo-next-action"><i class="fas fa-user" aria-hidden="true"></i> Pasada a una persona del equipo</p>' : ''}
                </div>
            </div>`;
    }

    const whatsapp = {
        ms: 1700,
        captions: [
            'Durante una visita, 18:05. Llega una consulta con la población ya dicha.',
            'El asistente contesta y pregunta el nombre.',
            'Ya sabe cómo se llama.',
            'Pregunta el presupuesto.',
            'El contacto pide hablar con alguien de la agencia.',
            'El asistente pasa la conversación a una persona del equipo.',
            'Otro contacto deja de responder a mitad de conversación.',
            'Seguimiento: el asistente vuelve a escribir dentro de la ventana de WhatsApp.'
        ],
        render(stage, k) {
            if (k <= 5) {
                stage.innerHTML = `<div class="mini-grid">${phone('Durante una visita', chatA.slice(0, k + 1), k)}${contactCard(statesA[k], k === 5)}</div>`;
            } else {
                const shown = k === 6 ? chatB.slice(0, 3) : chatB;
                stage.innerHTML = `<div class="mini-grid">${phone('Lunes', shown, k === 6 ? 1 : 3)}
                    <div class="mini-panel">
                        <p class="mini-panel-title">Seguimiento</p>
                        <p class="mini-text">Si un contacto deja de responder, el asistente vuelve a escribirle con un seguimiento programado.</p>
                        <p class="mini-text mini-muted">Solo dentro de la ventana de conversación que permite WhatsApp.</p>
                    </div></div>`;
            }
            const box = stage.querySelector('.demo-chat');
            if (box) box.scrollTop = box.scrollHeight;
        }
    };

    /* ---------- /calculadora: un ejemplo paso a paso ---------- */

    const ej = { gasto: 350, leads: 30, riesgo: 35, comision: 12500, coste: 79, tasa: 1 };
    const cpl = ej.gasto / ej.leads;
    const enRiesgo = ej.leads * ej.riesgo / 100;
    const ops = ej.coste * 12 / ej.comision;
    const recuperadas = enRiesgo * 12 * ej.tasa / 100;

    const rows = [
        ['Gasto en portales', `${eur(ej.gasto)}/mes`],
        ['Contactos de portales', `${ej.leads} al mes`],
        ['Fuera de horario o sin respuesta en una hora', `${ej.riesgo} %`],
        ['Comisión media', eur(ej.comision)],
        ['Coste de la herramienta (plan Atención)', `${eur(ej.coste)}/mes`]
    ];
    const results = [
        null,
        ['Coste por contacto', eur(cpl, 2)],
        ['En riesgo', `${num(enRiesgo, 1)} contactos y ${eur(cpl * enRiesgo)} al mes`],
        ['Punto de equilibrio', `${num(ops)} operaciones al año`],
        ['Escenario, no previsión', `Con un ${ej.tasa} % de ${num(enRiesgo * 12, 0)} contactos al año: ${num(recuperadas)} operaciones, ${eur(recuperadas * ej.comision)} en comisiones`]
    ];
    const rowsShown = [1, 2, 3, 5, 5];

    const calculadora = {
        ms: 2100,
        captions: [
            'Empieza por lo que pagas al mes en portales.',
            'Con los contactos que recibes, sale el coste real de cada uno.',
            'Con los que llegan fuera de horario, sale lo que está en riesgo.',
            'Con tu comisión y el coste de la herramienta, sale el punto de equilibrio.',
            'El escenario depende de la tasa que pongas. Es una hipótesis, no una previsión.'
        ],
        render(stage, k) {
            const r = rows.slice(0, rowsShown[k]).map((x, i) =>
                `<div class="mini-row${i === rowsShown[k] - 1 && k < 4 ? ' is-new' : ''}"><dt>${esc(x[0])}</dt><dd>${nb(x[1])}</dd></div>`).join('');
            const out = results.slice(1, k + 1).map((x, i) =>
                `<div class="mini-result${i === k - 1 ? ' is-new' : ''}${x[0].startsWith('Escenario') ? ' is-scenario' : ''}"><span>${esc(x[0])}</span><strong>${nb(x[1])}</strong></div>`).join('');
            stage.innerHTML = `
                <div class="mini-calc">
                    <p class="mini-panel-title">Ejemplo <span class="mini-muted">· valores ficticios</span></p>
                    <dl class="mini-rows">${r}</dl>
                    <div class="mini-results">${out}</div>
                    ${k === 4 ? '<a href="#calculadora" class="p-link mini-cta">Prueba con tus datos <i class="fas fa-arrow-down" aria-hidden="true"></i></a>' : ''}
                </div>`;
        }
    };

    const CONFIGS = { whatsapp, calculadora };

    /* ---------- Motor ---------- */

    document.querySelectorAll('[data-mini-demo]').forEach(root => {
        const cfg = CONFIGS[root.dataset.miniDemo];
        if (!cfg) return;
        const stage = root.querySelector('.mini-stage');
        const dots = root.querySelector('.demo-dots');
        const caption = root.querySelector('.demo-caption');
        const bar = root.querySelector('.demo-progress span');
        const toggle = root.querySelector('[data-action="toggle"]');
        const replay = root.querySelector('[data-action="replay"]');
        const total = cfg.captions.length;
        let step = 0, timer = null, userPaused = false, inView = false, finished = false;

        function draw() {
            cfg.render(stage, step);
            caption.textContent = cfg.captions[step];
            bar.style.width = `${((step + 1) / total) * 100}%`;
            dots.innerHTML = Array.from({ length: total }, (_, i) =>
                `<button type="button" class="demo-dot${i === step ? ' is-active' : ''}" data-step="${i}" aria-label="Paso ${i + 1} de ${total}"${i === step ? ' aria-current="step"' : ''}></button>`).join('');
        }
        const playing = () => timer !== null;
        function setToggle() {
            const paused = !playing();
            toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
            toggle.innerHTML = paused ? '<i class="fas fa-play"></i> <span>Reproducir</span>' : '<i class="fas fa-pause"></i> <span>Pausar</span>';
        }
        function stop() { clearTimeout(timer); timer = null; setToggle(); }
        function schedule() { clearTimeout(timer); timer = setTimeout(advance, cfg.ms); setToggle(); }
        function advance() {
            if (step < total - 1) { step++; draw(); schedule(); } else { finished = true; stop(); }
        }
        const canAutoplay = () => inView && !userPaused && !reduce.matches && !finished;
        function go(k) { step = k; finished = false; draw(); if (canAutoplay()) schedule(); else stop(); }

        dots.addEventListener('click', e => { const d = e.target.closest('.demo-dot'); if (d) go(Number(d.dataset.step)); });
        toggle.addEventListener('click', () => {
            if (playing()) { userPaused = true; stop(); }
            else { userPaused = false; if (finished) { go(0); return; } schedule(); }
        });
        replay.addEventListener('click', () => { userPaused = false; finished = false; step = 0; draw(); if (inView) schedule(); else stop(); });

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                inView = entries[0].isIntersecting;
                if (canAutoplay() && !playing()) schedule();
                if (!inView && playing()) stop();
            }, { threshold: 0.2 }).observe(root);
        }
        go(reduce.matches ? total - 1 : 0);
    });
})();
