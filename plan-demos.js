// «Mira cada plan en acción»: una demostración por plan, una cada vez, en la
// portada y en /precios. Datos ficticios, sin sonido. Cada demo es una escena
// en bucle que se dibuja a partir del segundo actual (t): pausar es parar el
// reloj. Con «reducir movimiento» se muestra fija, en su estado final.
(function () {
    const root = document.getElementById('planes-en-accion');
    if (!root) return;
    const canvas = root.querySelector('.pd-canvas');
    const toggleBtn = root.querySelector('[data-action="toggle"]');
    const picks = Array.from(root.querySelectorAll('[data-plan]'));
    const srEl = root.querySelector('.pd-sr');
    const noticeEl = root.querySelector('.demo-notice');
    const NOTICE = 'Demostración con datos ficticios';

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const nb = t => esc(t).replace(/(\d) (€|m²|hab\.|%)/g, '$1&nbsp;$2');
    const clamp01 = x => Math.max(0, Math.min(1, x));
    const ease = x => 1 - Math.pow(1 - clamp01(x), 3);
    const lerp = (a, b, p) => a + (b - a) * p;
    const on = (el, cls, v) => { if (el.classList.contains(cls) !== v) el.classList.toggle(cls, v); };
    const set = (el, key, v) => { if (el[key] !== v) el[key] = v; };
    const typed = (text, from, to, t) => text.slice(0, Math.round(text.length * clamp01((t - from) / (to - from))));
    const hada = '<img src="/assets/hada.webp" width="640" height="888" alt="" decoding="async">';

    /* ---------- Reglas del embudo (las mismas que el asistente y la portada) ---------- */

    const stages = ['Nuevos leads', 'Contacto iniciado', 'Datos básicos', 'Cualificados', 'Oportunidad activa'];
    const temps = { frio: 'Frío', tibio: 'Tibio', caliente: 'Caliente' };
    const NUEVOS = 0, DATOS = 2, CUALIFICADOS = 3, OPORTUNIDAD = 4;
    const datosCapturados = c => ['intent', 'operation', 'zone', 'budget', 'type', 'term'].filter(f => c[f]).length;
    const puntuacion = c => !c.inFlow ? null : c.done ? 85 : Math.min(65, 35 + 10 * datosCapturados(c));
    const temperatura = p => p === null ? null : p >= 70 ? 'caliente' : p >= 35 ? 'tibio' : 'frio';
    function etapa(c, tmp) {
        if (c.done && tmp === 'caliente') return OPORTUNIDAD;
        if (c.intent && c.zone && (c.budget || c.type)) return CUALIFICADOS;
        if (c.inFlow || datosCapturados(c) > 0) return DATOS;
        return NUEVOS;
    }

    /* ---------- Atención: comprador, cartera y embudo ---------- */

    function atencion(stage) {
        const cartera = [
            { ref: 'EJ-101', what: 'Piso · 2 hab.', zone: 'Costa Ejemplo', price: '185.000 €', venta: true, cls: 'is-a' },
            { ref: 'EJ-102', what: 'Piso · 3 hab.', zone: 'Costa Ejemplo', price: '239.000 €', venta: true, cls: 'is-b' },
            { ref: 'EJ-104', what: 'Casa · 4 hab.', zone: 'Villa Ejemplo', price: '320.000 €', venta: true, cls: 'is-d' },
            { ref: 'EJ-103', what: 'Ático · 3 hab.', zone: 'Costa Ejemplo', price: '265.000 €', venta: true, cls: 'is-c' },
            { ref: 'EJ-105', what: 'Piso · 2 hab.', zone: 'Ciudad Ejemplo', price: '210.000 €', venta: true, cls: 'is-a' },
            { ref: 'EJ-106', what: 'Piso · 2 hab.', zone: 'Costa Ejemplo', price: '900 €/mes', venta: false, cls: 'is-b' }
        ];
        const match = p => p.venta && p.zone === 'Costa Ejemplo';
        const found = cartera.filter(match);
        const lista = `
            <p class="hx-rich-title"><i class="fas fa-list"></i> Lista de inmuebles · Costa Ejemplo</p>
            ${found.map(p => `<div class="hx-item"><span class="hx-thumb ${p.cls}"><i class="fas fa-home"></i></span>
                <div><b>${p.ref}</b> ${nb(p.what)}<br><strong>${nb(p.price)}</strong> <span class="hx-link">Ver inmueble</span></div></div>`).join('')}`;
        const msgs = [
            { at: 0.4, from: 'in', text: 'Hola, busco un piso para comprar en Costa Ejemplo', contact: true },
            { at: 1.5, from: 'out', text: '¡Hola! Miro lo que tenemos en Costa Ejemplo.', c: { inFlow: true, intent: 'Comprar', type: 'Piso', zone: 'Costa Ejemplo' } },
            { at: 4.4, from: 'out', html: lista },
            { at: 6.6, from: 'in', text: 'Me interesa el EJ-102', c: { ref: 'EJ-102' } },
            { at: 7.7, from: 'out', text: '¿Cómo te llamas?' },
            { at: 8.7, from: 'in', text: 'Laura', c: { name: 'Laura' } },
            { at: 9.8, from: 'out', text: '¿Cuándo te iría bien visitarlo?' },
            { at: 10.9, from: 'in', text: 'El jueves por la tarde', c: { done: true, next: 'Coordinar visita ref. EJ-102' } },
            { at: 12.0, from: 'out', text: 'Gracias, Laura. Un asesor te confirma la visita.' }
        ];
        const SEARCH = [2.0, 2.4, 3.0]; // filtros y resultado de la búsqueda

        // Captación: la propietaria entra en el mismo chat y el mismo embudo.
        const videoguia = `
            <div class="hx-vthumb">${hada}<span class="hx-ai">Avatar generado con IA</span><span class="hx-play"><i class="fas fa-play"></i></span></div>
            <p class="hx-rich-title"><i class="fas fa-video"></i> Videoguía del vendedor</p>`;
        const resumen = `
            <p class="hx-rich-title"><i class="fas fa-clipboard-check"></i> Resumen</p>
            <p>Piso en Villa Ejemplo · 3&nbsp;hab. · 90&nbsp;m² · Para entrar a vivir</p>
            <p class="hx-linkcard"><i class="fas fa-calculator"></i> Valorador de Fincas Ejemplo <span class="hx-link">Abrir</span></p>`;
        const owner = [
            { at: 15.3, from: 'in', text: 'Estoy interesada en vender un piso', contact: true },
            { at: 16.0, from: 'out', html: videoguia, big: true, c: { inFlow: true, intent: 'Vender', operation: 'Vender' } },
            { at: 19.4, from: 'out', text: '¿En qué población está el piso?' },
            { at: 20.4, from: 'in', text: 'En Villa Ejemplo', c: { zone: 'Villa Ejemplo' } },
            { at: 21.3, from: 'out', text: '¿Cómo te llamas?' },
            { at: 22.2, from: 'in', text: 'Carmen', c: { name: 'Carmen' } },
            { at: 23.1, from: 'out', text: '¿Cuántas habitaciones y metros tiene?' },
            { at: 24.1, from: 'in', text: '3 habitaciones, 90 m²', c: { rooms: '3 hab.', size: '90 m²' } },
            { at: 25.0, from: 'out', text: '¿En qué estado está?' },
            { at: 25.9, from: 'in', text: 'Para entrar a vivir' },
            { at: 26.8, from: 'out', html: resumen },
            { at: 28.4, from: 'out', text: 'Gracias, Carmen. Paso tu consulta a un asesor.', c: { done: true, next: 'Pasa a un asesor' } }
        ];
        const CAPTACION = 15, LEAVING = 14.5;
        const allMsgs = msgs.concat(owner);

        const statesOf = list => {
            const states = [];
            list.forEach(m => {
                if (!m.contact && !m.c) return;
                const prev = states[states.length - 1];
                const c = Object.assign({}, prev ? prev.c : {}, m.c || {});
                const score = puntuacion(c);
                const temp = temperatura(score);
                states.push({ at: m.at + (m.contact ? 0.3 : 0.5), c, score, temp, stage: Math.max(prev ? prev.stage : NUEVOS, etapa(c, temp)) });
            });
            return states;
        };
        const bubble = m => `<div class="hx-msg hx-msg-${m.from}${m.html ? ' hx-rich' : ''}${m.big ? ' pd-vguide' : ''}">${m.html || nb(m.text)}</div>`;
        const cardHtml = role => `
            <div class="hx-card">
                ${role ? `<span class="hx-card-role">${role}</span>` : ''}
                <strong class="hx-name">Sin nombre</strong>
                <div class="hx-chips"></div>
                <div class="hx-meter"><span class="hx-temp">—</span><b class="hx-score">—</b></div>
                <p class="hx-next"><i class="fas fa-user"></i> <span></span></p>
            </div>`;

        stage.innerHTML = `
            <div class="pd-atencion">
                <div class="hx-chat pd-chat">
                    <div class="hx-phone-bar"><i class="fab fa-whatsapp"></i><div><strong>Fincas Ejemplo</strong><small>Asistente de la agencia</small></div><span class="hx-role pd-capt-label">Captación de propietarios</span></div>
                    <div class="hx-view"><div class="hx-msgs">
                        <div class="hx-group">${msgs.map(bubble).join('')}</div>
                        <div class="hx-group">${owner.map(bubble).join('')}</div>
                        <div class="hx-msg hx-msg-out hx-typing"><i></i><i></i><i></i></div>
                    </div></div>
                </div>
                <div class="pd-panel pd-cartera">
                    <p class="pd-panel-title"><i class="fas fa-search"></i> Cartera <span class="pd-count">6 inmuebles</span></p>
                    <div class="pd-filters"><span class="hx-chip">Venta</span><span class="hx-chip">Costa Ejemplo</span></div>
                    <div class="pd-props">${cartera.map(p => `
                        <div class="pd-prop" data-match="${match(p)}"><span class="hx-thumb ${p.cls}"><i class="fas fa-home"></i></span>
                            <div><b>${p.ref}</b> <small>${nb(p.what)}</small><br><small>${esc(p.zone)}</small> · <strong>${nb(p.price)}</strong></div></div>`).join('')}
                    </div>
                </div>
                <div class="pd-panel pd-funnel">
                    <div class="pd-track">
                        ${stages.map(s => `<div class="hx-col"><h4>${s}</h4></div>`).join('')}
                        ${cardHtml('')}${cardHtml('Captación de propietarios')}
                    </div>
                </div>
            </div>`;

        const q = s => stage.querySelector(s);
        const scene = q('.pd-atencion'), label = q('.pd-capt-label');
        const groups = Array.from(stage.querySelectorAll('.hx-group'));
        const msgEls = Array.from(stage.querySelectorAll('.hx-group .hx-msg'));
        const typing = q('.hx-typing'), view = q('.hx-view'), list = q('.hx-msgs');
        const filters = Array.from(stage.querySelectorAll('.pd-filters .hx-chip'));
        const props = Array.from(stage.querySelectorAll('.pd-prop'));
        const count = q('.pd-count');
        const funnel = q('.pd-funnel'), track = q('.pd-track');
        const cols = Array.from(stage.querySelectorAll('.pd-track .hx-col'));
        const cards = Array.from(stage.querySelectorAll('.hx-card')).map((card, k) => ({
            card, states: statesOf(k ? owner : msgs),
            name: card.querySelector('.hx-name'), chips: card.querySelector('.hx-chips'), temp: card.querySelector('.hx-temp'),
            score: card.querySelector('.hx-score'), next: card.querySelector('.hx-next'), nextText: card.querySelector('.hx-next span')
        }));
        const stateAt = (states, t) => {
            let i = -1;
            while (i + 1 < states.length && states[i + 1].at <= t) i++;
            return { cur: states[i] || null, prev: states[i - 1] || null };
        };
        let scroll = 0, shownGroup = -1;

        return function draw(t, dt) {
            // Chat: la conversación del comprador da paso a la de la propietaria.
            const inCapt = t >= CAPTACION;
            const group = inCapt ? 1 : 0;
            on(scene, 'is-captacion', inCapt);
            on(label, 'is-on', inCapt);
            groups.forEach((g, k) => {
                on(g, 'is-hidden', k !== group);
                on(g, 'is-leaving', k === 0 && t >= LEAVING && !inCapt);
            });
            if (shownGroup !== group) { shownGroup = group; dt = null; }
            msgEls.forEach((e, i) => on(e, 'is-on', t >= allMsgs[i].at));
            const nx = allMsgs.find(m => m.at > t);
            on(typing, 'is-on', !!nx && nx.from === 'out' && nx.at - t <= 0.6);
            const goal = Math.max(0, list.offsetHeight - view.clientHeight);
            scroll = dt === null ? goal : lerp(scroll, goal, clamp01(dt * 9));
            list.style.transform = scroll > 0.5 ? `translateY(${-scroll}px)` : '';

            // Búsqueda en cartera
            filters.forEach((f, i) => on(f, 'is-on', t >= SEARCH[i]));
            const searched = t >= SEARCH[2];
            set(count, 'textContent', searched ? `${found.length} de ${cartera.length} en Costa Ejemplo` : `${cartera.length} inmuebles`);
            props.forEach((p, i) => {
                on(p, 'is-out', searched && p.dataset.match !== 'true');
                on(p, 'is-pick', t >= msgs[3].at && cartera[i].ref === 'EJ-102');
            });

            // Tarjetas en el embudo
            const colW = cols[0].offsetWidth;
            // Debajo del título más alto, para no tapar los de dos líneas.
            const headH = Math.max(...cols.map(c => { const h = c.querySelector('h4'); return h.offsetTop + h.offsetHeight; })) + 8;
            const now = cards.map(k => stateAt(k.states, t).cur);
            let above = null, follow = null, activeCol = -1;
            cards.forEach((k, n) => {
                const { cur, prev } = stateAt(k.states, t);
                const s = cur || { c: {}, score: null, temp: null, stage: NUEVOS };
                on(k.card, 'is-on', !!cur);
                // Si la tarjeta siguiente llega a su columna, esta se compacta.
                on(k.card, 'is-compact', !!cur && n === 0 && !!now[1] && now[1].stage === cur.stage);
                k.card.style.width = `${colW}px`;
                set(k.name, 'textContent', s.c.name || 'Sin nombre');
                const chips = ['intent', 'type', 'zone', 'ref', 'rooms', 'size'].filter(f => s.c[f]).map(f => `<span class="hx-chip">${nb(s.c[f])}</span>`).join('');
                if (k.chips.dataset.html !== chips) { k.chips.innerHTML = chips; k.chips.dataset.html = chips; }
                const from = prev && prev.score !== null ? prev.score : 0;
                const score = s.score === null ? null : Math.round(lerp(from, s.score, cur ? ease((t - cur.at) / 0.6) : 1));
                set(k.score, 'textContent', score === null ? '—' : String(score));
                set(k.temp, 'textContent', s.temp ? temps[s.temp] : '—');
                set(k.temp, 'className', `hx-temp${s.temp ? ` temp temp-${s.temp}` : ''}`);
                on(k.card, 'is-bump', !!prev && t - cur.at < 0.6);
                set(k.nextText, 'textContent', s.c.next || '');
                on(k.next, 'is-on', !!s.c.next);
                const fromCol = cur && prev ? prev.stage : s.stage;
                const x = lerp(cols[fromCol].offsetLeft, cols[s.stage].offsetLeft, cur ? ease((t - cur.at) / 0.8) : 1);
                k.card.style.left = `${x}px`;
                // Nunca se solapan: en la misma columna, una debajo de otra.
                const stacked = above && cur && above.stage === s.stage;
                const top = stacked ? above.top + above.h + 10 : headH;
                k.card.style.top = `${top}px`;
                if (cur) {
                    above = { stage: s.stage, top, h: k.card.offsetHeight };
                    follow = x;
                    activeCol = s.stage;
                }
            });
            cols.forEach((c, k) => on(c, 'is-active', k === activeCol));
            const pad = parseFloat(getComputedStyle(funnel).paddingLeft) || 0;
            const w = funnel.clientWidth - 2 * pad;
            const max = Math.max(0, track.scrollWidth - w);
            const cam = follow === null ? 0 : Math.max(0, Math.min(max, follow + colW / 2 - w / 2));
            track.style.transform = max ? `translateX(${-cam}px)` : '';
        };
    }

    /* ---------- Atención + Vídeo: de las fotos a la descarga ---------- */

    function video(stage) {
        // Fotos de prueba (solo ajustes de luz y encuadre), sin metadatos ni
        // datos del inmueble real. Ver assets/demo-inmueble/.
        const photos = [
            { at: 0.3, file: 'salon', label: 'Salón' },
            { at: 0.7, file: 'comedor', label: 'Comedor' },
            { at: 1.1, file: 'cocina', label: 'Cocina' },
            { at: 1.5, file: 'dormitorio', label: 'Dormitorio' },
            { at: 1.9, file: 'dormitorio-2', label: 'Dormitorio 2' },
            { at: 2.3, file: 'bano', label: 'Baño' }
        ];
        const scenes = [
            { title: 'Escena 1 · Salón', text: 'Bienvenidos a este piso de 3 habitaciones en Costa Ejemplo. Empezamos por el salón, lleno de luz.', from: 4.8, to: 6.2 },
            { title: 'Escena 2 · Cocina', text: 'La cocina está equipada.', from: 6.4, to: 7.1, edited: 'La cocina, equipada y con mucha luz, se abre al comedor.' },
            { title: 'Escena 3 · Dormitorio', text: 'Terminamos en el dormitorio principal, tranquilo y luminoso.', from: 7.3, to: 8.4 }
        ];
        const EDIT = { select: 9.2, erase: [9.7, 10.1], type: [10.2, 11.4], chip: 11.5 };
        const GEN = { btn: 11.9, press: 12.3, from: 12.6, to: 16.2 };
        const READY = 16.4;
        const DL = { btn: 16.8, press: 17.5, file: 17.9 };
        // Tu campaña: la agencia usa el vídeo descargado en sus propios canales.
        const CAMPAIGN = 19.2;
        const channels = [
            { at: 19.6, cls: 'is-ad', icon: 'fa-bullhorn', label: 'Anuncio de ejemplo',
              body: '<p><b>Piso de 3&nbsp;hab. en Costa Ejemplo</b><br>239.000&nbsp;€</p><span class="pd-cta">Más información</span>' },
            { at: 20.9, cls: 'is-web', icon: 'fa-globe', label: 'Web de la agencia',
              body: '<p class="pd-url">Fincas Ejemplo · Inmuebles</p><p><b>Ficha EJ-102</b> · Ver videovisita</p>' },
            { at: 22.2, cls: 'is-wa', icon: 'fab fa-whatsapp', label: 'WhatsApp · contactos que lo han pedido',
              body: '<p class="pd-bubble">Aquí tienes la videovisita del EJ-102.</p>' }
        ];
        const CLAIM = 23.6;

        stage.innerHTML = `
            <div class="pd-video">
                <div class="pd-panel pd-ficha">
                    <p class="pd-panel-title"><i class="fas fa-home"></i> Ficha EJ-102 <span class="pd-count">Piso · 3&nbsp;hab. · Costa Ejemplo</span></p>
                    <div class="pd-photos">${photos.map(p => `<div class="pd-photo"><div class="pd-img">
                        <img src="/assets/demo-inmueble/${p.file}.webp" width="960" height="640" alt="" loading="lazy" decoding="async">
                        <span>${p.label}</span></div></div>`).join('')}</div>
                </div>
                <div class="pd-panel pd-script">
                    <p class="pd-panel-title"><i class="fas fa-align-left"></i> Guion por escenas</p>
                    ${scenes.map(s => `<div class="pd-scene"><h5>${s.title} <span class="pd-edited">Editado</span></h5><p><span class="pd-typed"></span><span class="pd-caret"></span></p></div>`).join('')}
                </div>
                <div class="pd-panel pd-render">
                    <div class="pd-vphone">
                        <div class="pd-avatar">${hada}<span class="pd-ai">Avatar generado con IA</span></div>
                        <div class="pd-gen"><span></span></div>
                        <p class="pd-ready"><i class="fas fa-check-circle"></i> Vídeo listo</p>
                    </div>
                    <span class="pd-btn pd-btn-gen"><i class="fas fa-magic"></i> Generar vídeo</span>
                    <span class="pd-btn pd-btn-dl"><i class="fas fa-download"></i> Descargar</span>
                    <p class="pd-file"><i class="fas fa-file-video"></i> Videovisita EJ-102 <b><i class="fas fa-check"></i> Descargada</b></p>
                </div>
                <div class="pd-panel pd-campaign">
                    <p class="pd-panel-title"><i class="fas fa-route"></i> Tu campaña <span class="pd-count">Con el vídeo descargado, en tus canales</span></p>
                    <div class="pd-channels">${channels.map(c => `
                        <div class="pd-channel ${c.cls}">
                            <p class="pd-channel-label"><i class="${c.icon.startsWith('fab') ? c.icon : `fas ${c.icon}`}"></i> ${c.label}</p>
                            <div class="pd-thumb"><img src="/assets/demo-inmueble/salon.webp" width="960" height="640" alt="" loading="lazy" decoding="async"><span><i class="fas fa-play"></i></span></div>
                            ${c.body}
                        </div>`).join('')}
                    </div>
                    <p class="pd-claim">Tu inmueble, tu vídeo y tu campaña. Depende menos de los portales.</p>
                </div>
            </div>`;

        const q = s => stage.querySelector(s);
        const photoEls = Array.from(stage.querySelectorAll('.pd-photo'));
        const sceneEls = Array.from(stage.querySelectorAll('.pd-scene'));
        const typedEls = sceneEls.map(s => s.querySelector('.pd-typed'));
        const carets = sceneEls.map(s => s.querySelector('.pd-caret'));
        const avatar = q('.pd-avatar'), gen = q('.pd-gen'), genBar = q('.pd-gen span'), ready = q('.pd-ready');
        const btnGen = q('.pd-btn-gen'), btnDl = q('.pd-btn-dl'), file = q('.pd-file');
        const root = q('.pd-video'), channelEls = Array.from(stage.querySelectorAll('.pd-channel')), claim = q('.pd-claim');

        return function draw(t) {
            photoEls.forEach((e, i) => on(e, 'is-on', t >= photos[i].at));
            scenes.forEach((s, i) => {
                let text = typed(s.text, s.from, s.to, t);
                let typing = t >= s.from && t < s.to + 0.3;
                if (s.edited && t >= EDIT.erase[0]) {
                    // Revisión: se borra el texto y se escribe el nuevo.
                    text = t < EDIT.type[0]
                        ? s.text.slice(0, Math.round(s.text.length * (1 - clamp01((t - EDIT.erase[0]) / (EDIT.erase[1] - EDIT.erase[0])))))
                        : typed(s.edited, EDIT.type[0], EDIT.type[1], t);
                    typing = t < EDIT.type[1] + 0.3;
                }
                on(sceneEls[i], 'is-on', t >= s.from - 0.2);
                set(typedEls[i], 'textContent', text);
                on(carets[i], 'is-on', typing);
                on(sceneEls[i], 'is-select', !!s.edited && t >= EDIT.select && t < EDIT.chip + 0.6);
                on(sceneEls[i], 'is-edited', !!s.edited && t >= EDIT.chip);
            });
            on(btnGen, 'is-on', t >= GEN.btn && t < READY);
            on(btnGen, 'is-press', t >= GEN.press && t < GEN.press + 0.3);
            on(btnGen, 'is-busy', t >= GEN.press);
            on(avatar, 'is-on', t >= GEN.from);
            on(avatar, 'is-done', t >= READY);
            on(gen, 'is-on', t >= GEN.from && t < READY);
            genBar.style.width = `${clamp01((t - GEN.from) / (GEN.to - GEN.from)) * 100}%`;
            on(ready, 'is-on', t >= READY);
            on(btnDl, 'is-on', t >= DL.btn);
            on(btnDl, 'is-press', t >= DL.press && t < DL.press + 0.3);
            on(file, 'is-on', t >= DL.file);
            on(root, 'is-campaign', t >= CAMPAIGN);
            channelEls.forEach((e, i) => on(e, 'is-on', t >= channels[i].at));
            on(claim, 'is-on', t >= CLAIM);
        };
    }

    /* ---------- Completo: diagnóstico, estrategia, plan, revisión y publicación ---------- */

    function completo(stage) {
        const metrics = [
            { at: 0.6, label: 'Seguidores', value: 640, fmt: v => String(Math.round(v)) },
            { at: 1.4, label: 'Interacción media', value: 2.4, fmt: v => `${v.toFixed(1).replace('.', ',')}&nbsp;%` },
            { at: 2.2, label: 'Mejor franja', text: 'Mar y jue · 19–21&nbsp;h' }
        ];
        const pillars = [
            { label: 'Inmuebles', value: 40 },
            { label: 'Conocimiento de la zona', value: 35 },
            { label: 'Compromiso de la agencia', value: 25 }
        ];
        const days = [
            { day: 'Mar', kind: 'Reel', what: 'Inmueble', icon: 'fa-film' },
            { day: 'Jue', kind: 'Carrusel', what: 'Datos de tu municipio', icon: 'fa-images' },
            { day: 'Sáb', kind: 'Reel', what: 'Agencia', icon: 'fa-film' }
        ];
        const CELL0 = 8.4, CELL = 0.33;
        const REVIEW = { piece: 13.0, press: 15.2, ok: 15.6 };
        const PUBLISH = 17.2;

        stage.innerHTML = `
            <div class="pd-completo">
                <div class="pd-col">
                    <div class="pd-panel pd-diag">
                        <p class="pd-panel-title"><i class="fas fa-stethoscope"></i> Diagnóstico <span class="pd-count">Análisis guiado</span></p>
                        ${metrics.map(m => `<div class="pd-metric"><span>${m.label}</span><b></b></div>`).join('')}
                    </div>
                    <div class="pd-panel pd-strategy">
                        <p class="pd-panel-title"><i class="fas fa-bullseye"></i> Estrategia</p>
                        ${pillars.map(p => `<div class="pd-pillar"><span>${p.label}</span><b>${p.value}&nbsp;%</b><i><s></s></i></div>`).join('')}
                        <div class="hx-chips pd-zones"><span class="hx-chip">Costa Ejemplo</span><span class="hx-chip">Villa Ejemplo</span></div>
                    </div>
                </div>
                <div class="pd-panel pd-plan">
                    <p class="pd-panel-title"><i class="fas fa-calendar-alt"></i> Plan de 4 semanas</p>
                    <div class="pd-grid">
                        <span></span>${days.map(d => `<span class="pd-day">${d.day}</span>`).join('')}
                        ${[1, 2, 3, 4].map(w => `<span class="pd-week">Sem ${w}</span>${days.map(d =>
                            `<div class="pd-cell"><i class="fas ${d.icon}"></i><b>${d.kind}</b><small>${esc(d.what)}</small></div>`).join('')}`).join('')}
                    </div>
                </div>
                <div class="pd-panel pd-review">
                    <p class="pd-panel-title"><i class="fas fa-check-double"></i> Revisión</p>
                    <div class="pd-piece">
                        <div class="pd-reel">${hada}<span class="pd-ai">Avatar generado con IA</span></div>
                        <div class="pd-piece-meta">
                            <b>Reel · Inmueble</b>
                            <small>Semana 1 · Martes</small>
                            <span class="pd-btn pd-btn-ok"><i class="fas fa-check"></i> Aprobar</span>
                            <p class="pd-approved"><i class="fas fa-user-check"></i> Aprobada por Ana, administradora</p>
                        </div>
                    </div>
                    <div class="pd-publish">
                        <p><i class="fas fa-clock"></i> <b>Programada</b> · Martes 19:00</p>
                    </div>
                </div>
            </div>`;

        const metricEls = Array.from(stage.querySelectorAll('.pd-metric'));
        const pillarEls = Array.from(stage.querySelectorAll('.pd-pillar'));
        const zoneEls = Array.from(stage.querySelectorAll('.pd-zones .hx-chip'));
        const cells = Array.from(stage.querySelectorAll('.pd-cell'));
        const q = s => stage.querySelector(s);
        const piece = q('.pd-piece'), ok = q('.pd-btn-ok'), approved = q('.pd-approved'), publish = q('.pd-publish');

        return function draw(t) {
            metricEls.forEach((e, i) => {
                const m = metrics[i];
                on(e, 'is-on', t >= m.at);
                const b = e.querySelector('b');
                const html = m.text || m.fmt(m.value * ease((t - m.at) / 0.9));
                if (b.innerHTML !== html) b.innerHTML = html;
            });
            pillarEls.forEach((e, i) => {
                const from = 4.6 + i * 0.4;
                on(e, 'is-on', t >= from);
                e.querySelector('s').style.width = `${pillars[i].value * 2 * ease((t - from) / 0.8)}%`;
            });
            zoneEls.forEach((e, i) => on(e, 'is-on', t >= 6.6 + i * 0.4));
            cells.forEach((e, i) => on(e, 'is-on', t >= CELL0 + i * CELL));
            on(piece, 'is-on', t >= REVIEW.piece);
            on(ok, 'is-press', t >= REVIEW.press && t < REVIEW.press + 0.3);
            on(ok, 'is-gone', t >= REVIEW.ok);
            on(approved, 'is-on', t >= REVIEW.ok);
            on(publish, 'is-on', t >= PUBLISH);
        };
    }

    /* ---------- Planes ---------- */

    const plans = {
        atencion: {
            build: atencion, loop: 32, steps: [['Consulta', 0, 'pd-chat'], ['Búsqueda en cartera', 2, 'pd-cartera'], ['Lista de inmuebles', 4.4, 'pd-chat'], ['Contacto en el embudo', 8.7, 'pd-funnel'], ['Captación', 15, 'pd-chat']],
            // En pantallas estrechas, Captación termina mostrando la tarjeta en el embudo.
            panelAt: t => t >= 28.8 ? 'pd-funnel' : null,
            sr: 'Un comprador pide un piso en Costa Ejemplo por WhatsApp. El asistente busca en la cartera de la agencia, filtra por venta y población, y le envía la lista de inmuebles. El cliente elige el EJ-102, deja su nombre e indica cuándo quiere visitarlo; su tarjeta pasa de «Cualificados», con 65 puntos, a «Oportunidad activa», con 85, caliente y la siguiente acción «Coordinar visita ref. EJ-102». Después, en captación de propietarios, una propietaria escribe que está interesada en vender un piso y el asistente le envía la videoguía del vendedor, con Hada, un avatar generado con IA. Responde población, nombre, habitaciones, metros y estado, recibe el resumen y el enlace al valorador, y su tarjeta llega a «Oportunidad activa», con 85, caliente y «Pasa a un asesor».'
        },
        video: {
            build: video, loop: 27, notice: 'Fotos de un inmueble real. Datos, precio y referencia ficticios', steps: [['Fotos', 0, 'pd-ficha'], ['Guion', 4.6, 'pd-script'], ['Revisión', 9.2, 'pd-script'], ['Generación', 11.9, 'pd-render'], ['Descarga', 16.8, 'pd-render'], ['Tu campaña', 19.2, 'pd-campaign']],
            sr: 'En la ficha del inmueble aparecen seis fotos y se escribe un guion por escenas. En la revisión se cambia el texto de la cocina. Después se genera la videovisita, presentada por Hada, un avatar generado con IA, y se descarga. Con el vídeo descargado, la agencia lo usa en sus canales: un anuncio de ejemplo, la web de la agencia y un mensaje de WhatsApp para los contactos que lo han pedido. Tu inmueble, tu vídeo y tu campaña. Depende menos de los portales.'
        },
        completo: {
            build: completo, loop: 22,
            steps: [['Diagnóstico', 0, 'pd-diag'], ['Estrategia', 4.3, 'pd-strategy'], ['Plan de 4 semanas', 8.2, 'pd-plan'], ['Revisión', 12.8, 'pd-review'], ['Publicación', 17, 'pd-review']],
            sr: 'Un análisis guiado de las redes de la agencia muestra seguidores, interacción y la mejor franja. Se define la estrategia por pilares y zonas, se llena un plan de 4 semanas con reels y carruseles con datos del municipio, la administradora aprueba una pieza y queda programada.'
        }
    };

    let plan = null, drawScene = null, stepEls = [], panelEls = new Map(), app = null;
    let t = 0, last = null, raf = null, userPaused = false, inView = false;
    const stillOf = p => p.loop - 1.1; // estado final para «reducir movimiento»

    function drawAll(dt) {
        const p = plans[plan];
        const fade = p.loop - 1;
        app.style.opacity = t > fade ? String(1 - clamp01((t - fade) / 1)) : '';
        let current = 0;
        stepEls.forEach((e, i) => {
            const next = p.steps[i + 1];
            const isCurrent = t >= p.steps[i][1] && (!next || t < next[1]);
            if (isCurrent) current = i;
            on(e, 'is-current', isCurrent);
            on(e, 'is-done', !!next && t >= next[1]);
        });
        // En pantallas estrechas solo se ve el panel de la fase actual (ver CSS).
        const shown = (p.panelAt && p.panelAt(t)) || p.steps[current][2];
        panelEls.forEach((el, cls) => on(el, 'is-shown', cls === shown));
        drawScene(t, dt);
    }

    function select(name) {
        plan = name;
        const p = plans[name];
        picks.forEach(b => b.setAttribute('aria-pressed', b.dataset.plan === name ? 'true' : 'false'));
        canvas.innerHTML = `
            <div class="pd-app">
                <ol class="pd-steps">${p.steps.map(s => `<li>${s[0]}</li>`).join('')}</ol>
                <div class="pd-stage"></div>
            </div>`;
        app = canvas.querySelector('.pd-app');
        stepEls = Array.from(canvas.querySelectorAll('.pd-steps li'));
        const stageEl = canvas.querySelector('.pd-stage');
        drawScene = p.build(stageEl);
        panelEls = new Map(p.steps.map(s => [s[2], stageEl.querySelector(`.${s[2]}`)]));
        srEl.textContent = p.sr;
        noticeEl.innerHTML = `<i class="fas fa-info-circle"></i> ${esc(p.notice || NOTICE)}`;
        t = reduce.matches ? stillOf(p) : 0;
        drawAll(null);
    }

    function frame(now) {
        const dt = last === null ? 0 : (now - last) / 1000;
        last = now;
        const prevT = t;
        t = (t + dt) % plans[plan].loop;
        drawAll(t < prevT ? null : dt);
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

    picks.forEach(b => b.addEventListener('click', () => select(b.dataset.plan)));
    toggleBtn.addEventListener('click', () => { userPaused = !userPaused; sync(); });

    // Los enlaces «Ver en acción» de las tarjetas de planes abren su demostración.
    document.querySelectorAll('[data-plan-open]').forEach(a => a.addEventListener('click', () => select(a.dataset.planOpen)));

    document.addEventListener('visibilitychange', sync);
    window.addEventListener('resize', () => drawAll(null));
    reduce.addEventListener && reduce.addEventListener('change', () => {
        root.classList.toggle('is-reduced', reduce.matches);
        if (reduce.matches) t = stillOf(plans[plan]);
        drawAll(null);
        sync();
    });

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            inView = entries[0].isIntersecting;
            sync();
        }, { threshold: 0.2 }).observe(canvas);
    } else {
        inView = true;
    }

    root.classList.toggle('is-reduced', reduce.matches);
    select('atencion');
    sync();
})();
