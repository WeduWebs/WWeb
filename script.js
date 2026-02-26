// --- ESTRELLAS DINÁMICAS ---
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
let W = window.innerWidth, H = window.innerHeight;
canvas.width = W; canvas.height = H;

const stars = Array.from({ length: 250 }, () => ({
    x: Math.random() * W - W / 2,
    y: Math.random() * H - H / 2,
    z: Math.random() * W,
    size: Math.random() * 1.2 + 0.2
}));

const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / W - 0.5) * 2;
    mouse.y = (e.clientY / H - 0.5) * 2;
});

window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
});

function drawStars() {
    ctx.fillStyle = "#020509";
    ctx.fillRect(0, 0, W, H);
    stars.forEach(s => {
        s.z -= 0.6;
        if (s.z <= 0) s.z = W;
        const sx = (s.x / s.z) * W + W / 2 + (mouse.x * 20);
        const sy = (s.y / s.z) * H + H / 2 + (mouse.y * 20);
        const r = (1 - s.z / W) * 2.5 * s.size;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0, r), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(157, 190, 240, ${1 - s.z / W})`;
        ctx.fill();
    });
    requestAnimationFrame(drawStars);
}
drawStars();

// --- DATOS ---
const webFeatures = [
    { icon: 'zap', title: "Pago Único", desc: "Sin suscripciones. Pagas una vez y el código es tuyo para siempre." },
    { icon: 'globe', title: "100% Personalizada", desc: "Diseño único adaptado a tu marca, sin usar plantillas genéricas." },
    { icon: 'code', title: "Revisiones Sin Límite", desc: "No paramos hasta que la web sea exactamente lo que soñaste." }
];

const botFeatures = [
    { icon: 'shield', title: "Moderación Avanzada", desc: "Automod, filtros y sanciones automáticas para tu servidor." },
    { icon: 'ticket', title: "Sistema de Tickets", desc: "Soporte organizado con categorías, logs y cierre integrado." },
    { icon: 'settings', title: "100% a medida", desc: "Cada comando y respuesta diseñada exclusivamente para ti." }
];

const reviewsData = [
    { name: "Carlos M.", text: "Espectacular. Muy rápido y el diseño es de otro planeta.", av: "CM" },
    { name: "Laura G.", text: "Wedu es un crack. El bot de Discord nos ahorra horas de trabajo.", av: "LG" },
    { name: "Dani R.", text: "La mejor inversión. Sin cuotas mensuales, una maravilla.", av: "DR" },
    { name: "Elena F.", text: "Atención 10/10. Cambió todo lo que le pedí al momento.", av: "EF" },
    { name: "Hugo S.", text: "Nuestra web de FiveM ahora es la más profesional del sector.", av: "HS" },
    { name: "Javier R.", text: "La mejor inversión que hice para mi comunidad. Transmite justo lo que quería.", av: "JR" },
    { name: "Andrea P.", text: "Contraté el bot de Discord y la web. Todo personalizado al 100%.", av: "AP" },
    { name: "Miguel Á.", text: "Pedimos varias revisiones y las hizo todas sin problema. El resultado es una pasada.", av: "MA" }
];

// --- CAROUSEL LOGIC ---
function initCarousel(id, items) {
    const viewport = document.querySelector(`#${id} .carousel-viewport`);
    const dots = document.querySelector(`#${id} .carousel-dots`);
    let idx = 0;

    items.forEach((item, i) => {
        const el = document.createElement('div');
        el.className = `carousel-item ${i === 0 ? 'active' : ''}`;
        el.innerHTML = `
            <div class="feature-card">
                <div class="icon-box"><i data-lucide="${item.icon}"></i></div>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            </div>`;
        viewport.appendChild(el);
        const dot = document.createElement('div');
        dot.className = `dot-btn ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => show(i);
        dots.appendChild(dot);
    });

    function show(newIdx) {
        const itemsEl = viewport.querySelectorAll('.carousel-item');
        const dotsEl = dots.querySelectorAll('.dot-btn');
        if (!itemsEl[idx]) return;
        itemsEl[idx].classList.remove('active');
        dotsEl[idx].classList.remove('active');
        idx = (newIdx + items.length) % items.length;
        itemsEl[idx].classList.add('active');
        dotsEl[idx].classList.add('active');
    }

    document.querySelector(`#${id} .next`).onclick = () => show(idx + 1);
    document.querySelector(`#${id} .prev`).onclick = () => show(idx - 1);
    setInterval(() => show(idx + 1), 6000);
}

// --- MARQUEE REVIEWS ---
function initMarquee(id, data) {
    const container = document.getElementById(id);
    const content = [...data, ...data, ...data].map(r => `
        <div class="review-card">
            <div class="review-card-top">
                <div class="review-user-block">
                    <div class="avatar">${r.av}</div>
                    <div class="user-info">
                        <p class="user-name">${r.name}</p>
                        <p class="user-date">Hace 1 mes</p>
                    </div>
                </div>
                <div class="stars-mini">
                    <i data-lucide="star" class="star-icon-mini"></i>
                    <i data-lucide="star" class="star-icon-mini"></i>
                    <i data-lucide="star" class="star-icon-mini"></i>
                    <i data-lucide="star" class="star-icon-mini"></i>
                    <i data-lucide="star" class="star-icon-mini"></i>
                </div>
            </div>
            <div class="review-card-body">
                <p>"${r.text}"</p>
            </div>
        </div>
    `).join('');
    container.innerHTML = content;
}

// --- STATS COUNT ---
const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target.querySelector('.stat-value');
            const target = parseInt(entry.target.dataset.target);
            const suffix = entry.target.dataset.suffix;
            let current = 0;
            const step = target / 60;
            const int = setInterval(() => {
                current += step;
                if (current >= target) { el.innerText = target + suffix; clearInterval(int); }
                else el.innerText = Math.floor(current) + suffix;
            }, 30);
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// --- HOLO EFFECT ---
document.querySelectorAll('.holo-card').forEach(card => {
    card.onmousemove = e => {
        const r = card.getBoundingClientRect();
        card.style.transform = `perspective(1000px) rotateX(${(e.clientY - r.top - r.height/2)/-12}deg) rotateY(${(e.clientX - r.left - r.width/2)/12}deg) scale(1.03)`;
    };
    card.onmouseleave = () => card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
});

window.onload = () => {
    initCarousel('web-carousel', webFeatures);
    initCarousel('bot-carousel', botFeatures);
    initMarquee('marquee1', reviewsData);
    initMarquee('marquee2', [...reviewsData].reverse());
    document.querySelectorAll('.stat-card').forEach(s => obs.observe(s));
    // Importante: llamar a Lucide después de inyectar el HTML dinámico
    lucide.createIcons();
};