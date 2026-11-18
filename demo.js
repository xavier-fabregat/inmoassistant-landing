// Demostración animada de la portada. Datos ficticios, sin sonido.
// Una sola escena en bucle con dos casos seguidos en el mismo chat y el mismo
// embudo: un comprador con cartera y un vendedor con videoguía. Cada mensaje
// mueve o actualiza su tarjeta en ese momento.
// Todo se dibuja a partir del segundo actual (t), así que pausar es parar el
// reloj. Con «reducir movimiento» se muestra fija, en su estado final.
(function () {
    const root = document.getElementById('demo');
    if (!root) return;
    const canvas = root.querySelector('.hx-canvas');
    const toggleBtn = root.querySelector('[data-action="toggle"]');
    // Si el navegador aún guarda el HTML anterior, la demo sigue funcionando sin barra.
    const stepsEl = root.querySelector('.hx-steps') || document.createElement('ol');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = window.matchMedia('(max-width: 640px)');
    const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const nb = t => esc(t).replace(/(\d) (€|m²|hab\.|habitaciones)/g, '$1&nbsp;$2');

    /* ---------- Guion ---------- */
    // Cada mensaje puede crear la tarjeta (contact) o aportarle datos (c); los
    // datos llegan a la tarjeta 0,5 s después. «chip» es el dato que salta.

    const hada = '<img src="/assets/hada.webp" width="640" height="888" alt="" decoding="async">';
    const cartera = [
        { ref: 'EJ-101', what: 'Piso · 2 hab.', price: '185.000 €', cls: 'is-a' },
        { ref: 'EJ-102', what: 'Piso · 3 hab.', price: '239.000 €', cls: 'is-b' },
        { ref: 'EJ-103', what: 'Ático · 3 hab.', price: '265.000 €', cls: 'is-c' }
    ];
    const rich = {
        lista: `
            <p class="hx-rich-title"><i class="fas fa-list"></i> Lista de inmuebles · Costa Ejemplo</p>
            ${cartera.map(p => `<div class="hx-item"><span class="hx-thumb ${p.cls}"><i class="fas fa-home"></i></span>
                <div><b>${p.ref}</b> ${nb(p.what)}<br><strong>${nb(p.price)}</strong> <span class="hx-link">Ver inmueble</span></div></div>`).join('')}`,
        ficha: `
            <div class="hx-photo-big is-b"><i class="fas fa-couch"></i><span>Salón</span></div>
            <p class="hx-rich-title"><i class="fas fa-file-alt"></i> Ficha EJ-102</p>
            <p>Piso · 3&nbsp;hab. · 95&nbsp;m² · Costa Ejemplo</p>
            <p><strong>239.000&nbsp;€</strong> <span class="hx-link">Ver ficha</span></p>`,
        video: `
            <div class="hx-vthumb">${hada}<span class="hx-ai">Avatar generado con IA</span><span class="hx-play"><i class="fas fa-play"></i></span></div>
            <p class="hx-rich-title"><i class="fas fa-video"></i> Videoguía del vendedor</p>
            <p>¿En qué población está tu piso?</p>`,
        resumen: `
            <p class="hx-rich-title"><i class="fas fa-clipboard-check"></i> Resumen</p>
            <p>Piso en Villa Ejemplo · 3&nbsp;hab. · 90&nbsp;m² · Para entrar a vivir</p>
            <p class="hx-linkcard"><i class="fas fa-calculator"></i> Valorador de Fincas Ejemplo <span class="hx-link">Abrir</span></p>`
    };

    const CASE2 = 15;   // empieza el vendedor
    const cases = [
        {
            role: 'Comprador',
            msgs: [
                { at: 0.4, from: 'in', text: 'Hola, busco un piso para comprar', contact: true, c: { name: 'Pablo' } },
                { at: 1.5, from: 'out', text: '¡Hola! ¿En qué población buscas?', c: { inFlow: true, intent: 'Comprar', type: 'Piso' }, chip: 'Comprar · Piso' },
                { at: 2.9, from: 'in', text: 'En Costa Ejemplo', c: { zone: 'Costa Ejemplo' }, chip: 'Costa Ejemplo' },
                { at: 4.0, from: 'out', html: rich.lista },
                { at: 6.3, from: 'in', text: 'Me interesa el EJ-102', c: { ref: 'EJ-102' }, chip: 'EJ-102' },
                { at: 7.4, from: 'out', html: rich.ficha },
                { at: 9.2, from: 'out', text: '¿Quieres hacer una visita?' },
                { at: 10.3, from: 'in', text: 'Sí, el jueves por la tarde', c: { done: true, next: 'Coordinar visita ref. EJ-102' } },
                { at: 11.7, from: 'agent', who: 'Ana · asesora', text: 'Hola, soy Ana. Visita confirmada: jueves a las 18:00.' }
            ]
        },
        {
            role: 'Vendedor',
            msgs: [
                { at: CASE2 + 0.3, from: 'in', text: 'Hola, quiero vender mi piso', contact: true },
                { at: CASE2 + 1.4, from: 'out', html: rich.video, c: { inFlow: true, intent: 'Vender', operation: 'Vender' }, chip: 'Vender' },
                { at: CASE2 + 3.2, from: 'in', text: 'En Villa Ejemplo', c: { zone: 'Villa Ejemplo' }, chip: 'Villa Ejemplo' },
                { at: CASE2 + 4.2, from: 'out', text: '¿Cómo te llamas?' },
                { at: CASE2 + 5.2, from: 'in', text: 'Carmen', c: { name: 'Carmen' }, chip: 'Carmen' },
                { at: CASE2 + 6.2, from: 'out', text: '¿Cuántas habitaciones y metros tiene?' },
                { at: CASE2 + 7.3, from: 'in', text: '3 habitaciones, 90 m²', c: { rooms: '3 hab.', size: '90 m²' }, chip: '3 hab. · 90 m²' },
                { at: CASE2 + 8.3, from: 'out', text: '¿En qué estado está?' },
                { at: CASE2 + 9.3, from: 'in', text: 'Para entrar a vivir', c: { state: 'Para entrar a vivir' } },
                { at: CASE2 + 10.4, from: 'out', html: rich.resumen },
                { at: CASE2 + 12.0, from: 'out', text: 'Gracias, Carmen. Paso tu consulta a un asesor.', c: { done: true, next: 'Pasa a un asesor' } }
            ]
        }
    ];
    // Barra de pasos: «at» marca dónde empieza cada paso en el guion y «jump» el
    // momento al que salta, con su mensaje en el chat y la tarjeta ya colocada.
    const steps = [
        { label: 'Consulta', at: 0, jump: 0.75 },
        { label: 'Búsqueda en cartera', at: 2.9, jump: 2.95 },
        { label: 'Lista de inmuebles', at: 4.0, jump: 4.25 },
        { label: 'Contacto en el embudo', at: 10.3, jump: 11.75 },
        { label: 'Captación', at: CASE2, jump: CASE2 + 0.65 }
    ];
    const LAND = 0.5;        // del mensaje a la tarjeta
    const TYPING = 0.6;      // «escribiendo…» antes de cada respuesta del asistente
    const SWAP = 0.5;        // el chat del primer caso se desvanece
    const FADE_FROM = 32;
    const LOOP = 33;

    /* ---------- Reglas del embudo (las mismas que el asistente) ---------- */

    const stages = ['Nuevos leads', 'Contacto iniciado', 'Datos básicos', 'Cualificados', 'Oportunidad activa'];
    const temps = { frio: 'Frío', tibio: 'Tibio', caliente: 'Caliente' };
    const NUEVOS = 0, DATOS = 2, CUALIFICADOS = 3, OPORTUNIDAD = 4;
    // Cuentan intención, operación, zona, presupuesto, tipo de vivienda y plazo. El nombre no.
    const datosCapturados = c => ['intent', 'operation', 'zone', 'budget', 'type', 'term'].filter(f => c[f]).length;
    const puntuacion = c => !c.inFlow ? null : c.done ? 85 : Math.min(65, 35 + 10 * datosCapturados(c));
    const temperatura = p => p === null ? null : p >= 70 ? 'caliente' : p >= 35 ? 'tibio' : 'frio';
    function etapa(c, tmp) {
        if (c.done && tmp === 'caliente') return OPORTUNIDAD;
        if (c.intent && c.zone && (c.budget || c.type)) return CUALIFICADOS;
        if (c.inFlow || datosCapturados(c) > 0) return DATOS;
        return NUEVOS;
    }
    function estado(c, prevStage) {
        const score = puntuacion(c);
        const temp = temperatura(score);
        // El asistente nunca hace retroceder una tarjeta.
        return { c, score, temp, stage: Math.max(prevStage, etapa(c, temp)) };
    }

    // Estados de cada tarjeta, en el momento en que cambian.
    cases.forEach(cs => {
        cs.states = [];
        cs.msgs.forEach(m => {
            if (!m.contact && !m.c) return;
            const prev = cs.states[cs.states.length - 1];
            const c = Object.assign({}, prev ? prev.c : {}, m.c || {});
            cs.states.push(Object.assign({ at: m.at + (m.contact ? 0.3 : LAND) }, estado(c, prev ? prev.stage : NUEVOS)));
        });
    });
    const allMsgs = cases.flatMap((cs, k) => cs.msgs.map(m => Object.assign({ caseIdx: k }, m)));

    // Otros contactos ficticios del tablero, con las mismas reglas.
    const others = [
        { name: 'Sin nombre', c: {} },
        null,
        { name: 'Marcos', c: { inFlow: true, intent: 'Alquilar', zone: 'Ciudad Ejemplo' } },
        { name: 'Sofía', c: { inFlow: true, intent: 'Comprar', zone: 'Villa Ejemplo', type: 'Casa' } },
        null
    ].map(o => o && Object.assign({ name: o.name }, estado(o.c, NUEVOS)));

    /* ---------- Lienzo ---------- */

    const chipList = c => ['intent', 'type', 'zone', 'budget', 'ref', 'rooms', 'size'].filter(f => c[f])
        .map(f => `<span class="hx-chip">${nb(c[f])}</span>`).join('');
    const tempBadge = s => s.temp ? `<span class="temp temp-${s.temp}">${temps[s.temp]}</span>` : '<span>—</span>';
    const bubble = m => {
        const cls = m.from === 'agent' ? 'out hx-msg-agent' : m.from;
        const who = m.who ? `<span class="hx-who"><i class="fas fa-user"></i> ${esc(m.who)}</span>` : '';
        const body = m.html || nb(m.text);
        return `<div class="hx-msg hx-msg-${cls}${m.html ? ' hx-rich' : ''}">${who}${body}</div>`;
    };

    canvas.innerHTML = `
        <div class="hx-app">
            <div class="hx-chat">
                <div class="hx-phone-bar"><i class="fab fa-whatsapp"></i><div><strong>Fincas Ejemplo</strong><small>Asistente de la agencia</small></div><span class="hx-role"></span></div>
                <div class="hx-view">
                    <div class="hx-msgs">
                        ${cases.map((cs, k) => `<div class="hx-group" data-case="${k}">${cs.msgs.map(bubble).join('')}</div>`).join('')}
                        <div class="hx-msg hx-msg-out hx-typing"><i></i><i></i><i></i></div>
                    </div>
                </div>
            </div>
            <div class="hx-board">
                <div class="hx-track">
                    ${stages.map((s, i) => `
                        <div class="hx-col" data-col="${i}">
                            <h4>${s}</h4>
                            ${others[i] ? `<div class="hx-bg-card">
                                <strong>${others[i].name}</strong>
                                <div class="hx-chips">${chipList(others[i].c)}</div>
                                <div class="hx-meter">${tempBadge(others[i])}<b>${others[i].score === null ? '—' : others[i].score}</b></div>
                            </div>` : ''}
                        </div>`).join('')}
                    ${cases.map(cs => `
                        <div class="hx-card">
                            <span class="hx-card-role">${cs.role}</span>
                            <strong class="hx-name">Sin nombre</strong>
                            <div class="hx-chips"></div>
                            <div class="hx-meter"><span class="hx-temp">—</span><b class="hx-score">—</b></div>
                            <div class="hx-bar"><span></span></div>
                            <p class="hx-next"><i class="fas fa-user"></i> <span></span></p>
                        </div>`).join('')}
                </div>
            </div>
            <div class="hx-fly">${allMsgs.map(m => m.chip ? `<span class="hx-chip">${nb(m.chip)}</span>` : '<span></span>').join('')}</div>
        </div>`;

    const q = s => canvas.querySelector(s);
    const qa = s => Array.from(canvas.querySelectorAll(s));
    const app = q('.hx-app');
    const view = q('.hx-view');
    const list = q('.hx-msgs');
    const groups = qa('.hx-group');
    const msgEls = qa('.hx-group .hx-msg');
    const typing = q('.hx-typing');
    const roleEl = q('.hx-role');
    const flyEls = qa('.hx-fly > span');
    const board = q('.hx-board');
    const track = q('.hx-track');
    const cols = qa('.hx-col');
    const cards = qa('.hx-card').map(el => ({
        el, name: el.querySelector('.hx-name'), chips: el.querySelector('.hx-chips'),
        temp: el.querySelector('.hx-temp'), score: el.querySelector('.hx-score'),
        bar: el.querySelector('.hx-bar span'), next: el.querySelector('.hx-next'), nextText: el.querySelector('.hx-next span')
    }));

    const clamp01 = x => Math.max(0, Math.min(1, x));
    const ease = x => 1 - Math.pow(1 - clamp01(x), 3);
    const lerp = (a, b, p) => a + (b - a) * p;
    const on = (el, cls, v) => { if (el.classList.contains(cls) !== v) el.classList.toggle(cls, v); };
    const set = (el, key, v) => { if (el[key] !== v) el[key] = v; };

    function stateAt(states, t) {
        let i = -1;
        while (i + 1 < states.length && states[i + 1].at <= t) i++;
        return { cur: states[i] || null, prev: states[i - 1] || null };
    }

    function relRect(el) {
        const a = app.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return { x: r.left - a.left, y: r.top - a.top, w: r.width, h: r.height };
    }

    stepsEl.innerHTML = steps.map(s => `<li><button type="button">${s.label}</button></li>`).join('');
    const stepEls = Array.from(stepsEl.querySelectorAll('li'));
    let shownStep = -1;

    function drawSteps(t) {
        let current = 0;
        steps.forEach((s, i) => { if (t >= s.at) current = i; });
        stepEls.forEach((li, i) => {
            on(li, 'is-current', i === current);
            on(li, 'is-done', i < current);
            if (i === current) li.firstChild.setAttribute('aria-current', 'step');
            else li.firstChild.removeAttribute('aria-current');
        });
        // Si la barra no cabe, se desplaza ella sola hasta el paso actual.
        if (current !== shownStep) {
            shownStep = current;
            const li = stepEls[current];
            stepsEl.scrollLeft = li.offsetLeft - (stepsEl.clientWidth - li.offsetWidth) / 2;
        }
    }

    let scroll = 0;     // desplazamiento del chat, suavizado entre fotogramas
    let shownCase = -1;

    // dt: segundos desde el fotograma anterior; null para colocar sin animar.
    function draw(t, dt) {
        drawSteps(t);
        app.style.opacity = t > FADE_FROM ? String(1 - clamp01((t - FADE_FROM) / (LOOP - FADE_FROM))) : '';

        // Chat: un caso cada vez; el primero se desvanece antes del segundo.
        const caseIdx = t >= CASE2 ? 1 : 0;
        set(roleEl, 'textContent', cases[caseIdx].role);
        groups.forEach((g, k) => {
            on(g, 'is-hidden', k !== caseIdx);
            on(g, 'is-leaving', k === 0 && t >= CASE2 - SWAP && t < CASE2);
        });
        if (shownCase !== caseIdx) { shownCase = caseIdx; dt = null; }
        allMsgs.forEach((m, i) => on(msgEls[i], 'is-on', t >= m.at));
        const next = allMsgs.find(m => m.at > t);
        on(typing, 'is-on', !!next && next.from === 'out' && next.caseIdx === caseIdx && next.at - t <= TYPING);
        const goal = Math.max(0, list.offsetHeight - view.clientHeight);
        scroll = dt === null ? goal : lerp(scroll, goal, clamp01(dt * 9));
        if (Math.abs(scroll - goal) < 0.5) scroll = goal;
        list.style.transform = scroll ? `translateY(${-scroll}px)` : '';

        // Tarjetas
        const colW = cols[0].offsetWidth;
        const pad = parseFloat(getComputedStyle(board).paddingLeft) || 0;
        const h4 = cols[0].querySelector('h4');
        const headH = h4.offsetTop + h4.offsetHeight + 8;
        const placed = [];
        let follow = null;
        const now = cases.map(cs => stateAt(cs.states, t).cur);
        cases.forEach((cs, k) => {
            const card = cards[k];
            const { cur, prev } = stateAt(cs.states, t);
            on(card.el, 'is-on', !!cur);
            // Si la tarjeta del caso siguiente llega a su columna, esta se compacta;
            // en pantallas estrechas se compactan las dos para que quepan.
            on(card.el, 'is-compact', !!cur && cases.some((o, j) => (narrow.matches ? j !== k : j > k) && now[j] && now[j].stage === cur.stage));
            card.el.style.width = `${colW}px`;
            // Antes de crearse, la tarjeta vuelve a estar vacía (al reiniciar el bucle).
            const s = cur || { c: {}, score: null, temp: null, stage: NUEVOS };
            const p = cur ? ease((t - cur.at) / 0.6) : 1;
            set(card.name, 'textContent', s.c.name || 'Sin nombre');
            const chips = chipList(s.c);
            if (card.chips.dataset.html !== chips) { card.chips.innerHTML = chips; card.chips.dataset.html = chips; }
            const from = prev && prev.score !== null ? prev.score : 0;
            const score = s.score === null ? null : Math.round(lerp(from, s.score, p));
            set(card.score, 'textContent', score === null ? '—' : String(score));
            card.bar.style.width = `${score === null ? 0 : score}%`;
            set(card.temp, 'textContent', s.temp ? temps[s.temp] : '—');
            set(card.temp, 'className', `hx-temp${s.temp ? ` temp temp-${s.temp}` : ''}`);
            on(card.el, 'is-bump', !!prev && t - cur.at < 0.6);
            on(card.el, 'is-hot', s.temp === 'caliente');
            set(card.nextText, 'textContent', s.c.next || '');
            on(card.next, 'is-on', !!s.c.next);

            // Se desliza de la columna anterior a la nueva.
            const fromCol = cur && prev ? prev.stage : s.stage;
            const x = lerp(cols[fromCol].offsetLeft, cols[s.stage].offsetLeft, cur ? ease((t - cur.at) / 0.8) : 1);
            // Si ya hay otra tarjeta en esa columna, se coloca debajo.
            const below = placed.find(o => o.stage === s.stage && cur);
            // Nunca se solapan: la segunda va siempre debajo de la primera.
            const top = below ? below.top + below.h + 10 : headH;
            card.el.style.left = `${x}px`;
            card.el.style.top = `${top}px`;
            if (cur) {
                placed.push({ stage: s.stage, top, h: card.el.offsetHeight });
                if (k === caseIdx) follow = x;
            }
        });
        cols.forEach((col, i) => on(col, 'is-active', cases.some((cs, k) => {
            const { cur } = stateAt(cs.states, t);
            return k === caseIdx && cur && cur.stage === i;
        })));

        // Si el tablero no cabe, la cámara sigue a la tarjeta del caso actual.
        const w = board.clientWidth - 2 * pad;
        const max = Math.max(0, track.scrollWidth - w);
        const cam = follow === null ? 0 : Math.max(0, Math.min(max, follow + colW / 2 - w / 2));
        track.style.transform = max ? `translateX(${-cam}px)` : '';

        // Cada dato salta del mensaje a su tarjeta.
        allMsgs.forEach((m, i) => {
            if (!m.chip) return;
            const el = flyEls[i];
            const k = (t - m.at) / LAND;
            if (k < 0 || k > 1 || reduce.matches) { el.style.opacity = '0'; return; }
            const a = relRect(msgEls[i]);
            const b = relRect(cards[m.caseIdx].el);
            const e = ease(k);
            const fx = lerp(a.x + 14, b.x + 14, e);
            const fy = lerp(a.y + Math.min(a.h / 2, 40) - 10, b.y + 60, e) - Math.sin(Math.PI * e) * (narrow.matches ? 20 : 60);
            el.style.opacity = String(k < 0.8 ? 1 : (1 - k) / 0.2);
            el.style.transform = `translate(${fx}px, ${fy}px) scale(${lerp(1.15, 0.9, e)})`;
        });
    }

    /* ---------- Reloj ---------- */

    let t = 0;
    let last = null;
    let raf = null;
    let userPaused = false;
    let inView = false;
    const STILL = FADE_FROM - 0.1; // estado final para «reducir movimiento»

    function frame(now) {
        const dt = last === null ? 0 : (now - last) / 1000;
        last = now;
        const prevT = t;
        t = (t + dt) % LOOP;
        draw(t, t < prevT ? null : dt);
        raf = requestAnimationFrame(frame);
    }

    function shouldPlay() { return inView && !userPaused && !reduce.matches && !document.hidden; }

    function sync() {
        if (shouldPlay() && raf === null) {
            last = null;
            raf = requestAnimationFrame(frame);
        } else if (!shouldPlay() && raf !== null) {
            cancelAnimationFrame(raf);
            raf = null;
        }
        const paused = raf === null;
        toggleBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
        toggleBtn.setAttribute('aria-label', paused ? 'Reproducir la demostración' : 'Pausar la demostración');
        toggleBtn.innerHTML = `<i class="fas fa-${paused ? 'play' : 'pause'}" aria-hidden="true"></i>`;
    }

    function applyReduce() {
        root.classList.toggle('is-reduced', reduce.matches);
        if (reduce.matches) t = STILL;
        draw(t, null);
        sync();
    }

    toggleBtn.addEventListener('click', () => { userPaused = !userPaused; sync(); });
    stepEls.forEach((li, i) => li.firstChild.addEventListener('click', () => {
        t = steps[i].jump;
        draw(t, null);
    }));
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('resize', () => draw(t, null));
    reduce.addEventListener && reduce.addEventListener('change', applyReduce);

    // Arranca al entrar en pantalla y se detiene al salir.
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            inView = entries[0].isIntersecting;
            sync();
        }, { threshold: 0.2 }).observe(root);
    } else {
        inView = true;
    }

    applyReduce();
})();
