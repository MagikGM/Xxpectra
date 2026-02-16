// Disable scroll restoration to prevent browser from remembering scroll position on reload
history.scrollRestoration = 'manual';

// Elementos del DOM
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const navLinks = document.querySelectorAll('.nav-link');
const views = document.querySelectorAll('.page-view');

// Función para abrir menú
function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
}

// Función para cerrar menú
function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event Listeners Menú
menuToggle.addEventListener('click', openSidebar);
closeMenu.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// Lógica de Navegación (SPA Switcher)
function showPage(pageId) {
    // 1. Ocultar todas las vistas
    views.forEach(view => {
        view.classList.remove('active');
    });

    // 2. Mostrar la vista seleccionada
    const targetView = document.getElementById(pageId);
    if (targetView) {
        targetView.classList.add('active');
    }

    // 3. Actualizar clase activa en el menú
    navLinks.forEach(link => {
        link.classList.remove('active');
        // Check if this link corresponds to the current page
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(pageId)) {
            link.classList.add('active');
        }
    });

    // 4. Cerrar menú móvil
    closeSidebar();

    // 5. Scroll al inicio inmediatamente
    window.scrollTo(0, 0);

    // 6. Trigger scroll animations immediately for the new page
    setTimeout(() => {
        const fadeInElements = document.querySelectorAll('.fade-in');
        fadeInElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0 && !element.classList.contains('visible')) {
                element.classList.add('visible');
            }
        });
    }, 10); // Small delay to ensure DOM is updated

    // 7. Guardar la página actual en localStorage
    localStorage.setItem('currentPage', pageId);
}

// Inicialización: Asegurar que Home es visible al cargar
document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que la página empiece desde arriba inmediatamente
    window.scrollTo(0, 0);

    // Verificar si hay una página guardada en localStorage
    const savedPage = localStorage.getItem('currentPage');

    if (savedPage && document.getElementById(savedPage)) {
        // Mostrar la página guardada
        showPage(savedPage);
    } else {
        // El HTML ya tiene la clase active en Home, pero esto es un seguro
        if (!document.querySelector('.page-view.active')) {
            showPage('home');
        }
    }

    // Trigger scroll animations immediately after page load
    setTimeout(() => {
        const fadeInElements = document.querySelectorAll('.fade-in');
        fadeInElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0 && !element.classList.contains('visible')) {
                element.classList.add('visible');
            }
        });
    }, 50); // Small delay to ensure everything is loaded
});


// --- LOGICA DEL MODAL DINAMICO ---
const serviceData = {
    'sociales': {
        title: "Eventos Sociales",
        desc: "Momentos irrepetibles convertidos en recuerdos atemporales, capturados con sensibilidad y detalle.",
        list: ["Bodas", "XV años", "Bautizos", "Primera comunión", "Cumpleaños", "Aniversarios", "Entre otros..."],
        img: "imagenes/modal-social.jpg",
        video: ""
    },
    'corporativo': {
        title: "Corporativo",
        desc: "Imagen profesional que comunica liderazgo, confianza y la esencia de tu empresa.",
        list: ["Corporativos", "Conferencias", "Congresos", "Fotografía empresarial", "Entre otros..."],
        img: "imagenes/",
        video: ""
    },
    'marketing': {
        title: "Marketing",
        desc: "Contenido visual estratégico diseñado para atraer, conectar y generar impacto.",
        list: ["Fotografía y video de productos", "Lanzamientos de marca", "Entre otros..."],
        img: "imagenes/modal-marketing.jpg",
        video: ""
    },
    'drone': {
        title: "Video con Drone",
        desc: "Perspectivas aéreas que elevan tu proyecto y muestran cada espacio desde un angulo extraordinario",
        list: ["Eventos sociales", "Eventos masivos", "Festivales", "Eventos Deportivos", "Eventos Coorporativos", "Entre otros..."],
        img: "",
        video: ""
    },
    'cultural': {
        title: "Cultural y Deportivo",
        desc: "Energía, pasión y movimiento capturados en su maxima expresión.",
        list: ["Conciertos", "Festivales", "Presentaciones Artisticas", "Obras de teatro", "Actividades Municipales", "Expocisiones", "Competencias", "Carreras", "Entre otros..."],
        img: "imagenes/modal-deportivo.jpg",
        video: ""
    },
    'edicion': {
        title: "Post-producción",
        desc: "Donde ocurre la magia. Transformamos material crudo en piezas maestras mediante corrección de color y diseño sonoro.",
        list: ["Correcciones de color", "Retoque Natural", "Ajustes de luz y encuadre", "Musicalización", "Transiciones profesionales", "Entre otros..."],
        img: "",
        video: ""
    }
};

const modal = document.getElementById('serviceModal');
const mTitle = document.getElementById('m-title');
const mDesc = document.getElementById('m-desc');
const mList = document.getElementById('m-list');
const mImg = document.getElementById('m-img');
const mVideo = document.getElementById('m-video');
const mDeliverablesTitle = document.querySelector('.deliverables-title');

function openModal(serviceKey) {
    const data = serviceData[serviceKey];
    if (!data) return;

    if (serviceKey === 'edicion') {
        mDeliverablesTitle.textContent = "Servicios de Edición";
    } else {
        mDeliverablesTitle.textContent = "Tipos de Eventos";
    }

    mTitle.textContent = data.title;
    mDesc.textContent = data.desc;
    mImg.src = data.img;

    mList.innerHTML = '';
    data.list.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-check"></i> ${item}`;
        mList.appendChild(li);
    });

    mVideo.src = data.video;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Ensure modal content scrolls to top on mobile
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
}

function closeModalBtn() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
        mVideo.pause();
        mVideo.src = "";
    }, 300);
}

function closeModal(e) {
    if (e.target === modal) {
        closeModalBtn();
    }
}

// --- MOBILE SCROLL HOVER EFFECT FOR SERVICES ---
function initMobileServiceHover() {
    const servicesSection = document.getElementById('services');
    const serviceCards = Array.from(document.querySelectorAll('.service-card'));

    if (!servicesSection || serviceCards.length === 0) return;

    let currentActiveIndex = -1;
    let lastSwitchTime = 0;
    const minSwitchInterval = 300; // Minimum 300ms between switches

    function handleScroll() {
        if (window.innerWidth > 768) return; // Only apply on mobile

        const now = Date.now();
        if (now - lastSwitchTime < minSwitchInterval) return; // Prevent too frequent switches

        const windowHeight = window.innerHeight;
        const viewportCenter = windowHeight / 2;

        // Calculate card positions relative to viewport center
        const cardPositions = serviceCards.map((card, index) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
            return { index, distanceFromCenter, card, cardCenter };
        });

        // Find the card closest to viewport center
        cardPositions.sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);
        const closestCard = cardPositions[0];

        // Only switch if the closest card is significantly closer and within activation zone
        const activationThreshold = 150; // pixels from center
        const hysteresisThreshold = 80; // pixels of hysteresis

        let shouldSwitch = false;

        if (currentActiveIndex === -1) {
            // No active card yet, activate if close enough
            shouldSwitch = closestCard.distanceFromCenter < activationThreshold;
        } else {
            // Check if we should switch to a different card
            const currentCard = cardPositions.find(p => p.index === currentActiveIndex);
            if (currentCard) {
                const distanceDiff = currentCard.distanceFromCenter - closestCard.distanceFromCenter;
                shouldSwitch = distanceDiff > hysteresisThreshold && closestCard.distanceFromCenter < activationThreshold;
            } else {
                shouldSwitch = closestCard.distanceFromCenter < activationThreshold;
            }
        }

        if (shouldSwitch) {
            // Remove active class from current card
            if (currentActiveIndex !== -1) {
                serviceCards[currentActiveIndex].classList.remove('active');
            }

            // Add active class to new closest card
            serviceCards[closestCard.index].classList.add('active');
            currentActiveIndex = closestCard.index;
            lastSwitchTime = now;
        }
    }

    // Use requestAnimationFrame for smoother updates
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', requestTick, { passive: true });

    // Initial check
    handleScroll();

    // Re-check on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            handleScroll();
        } else {
            // Remove active class on desktop
            serviceCards.forEach(card => card.classList.remove('active'));
            currentActiveIndex = -1;
            lastSwitchTime = 0;
        }
    });
}

// --- SCROLL ANIMATIONS ---
function initScrollAnimations() {
    const fadeInElements = document.querySelectorAll('.fade-in');

    function checkScroll() {
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        // Handle fade-in elements (once revealed, stays visible)
        fadeInElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const elementBottom = rect.bottom + scrollY;

            // Element is in viewport (with some offset for smooth animation)
            // Only add 'visible' if not already visible (once revealed, stays revealed)
            if (elementTop < scrollY + windowHeight - 100 && elementBottom > scrollY + 100 && !element.classList.contains('visible')) {
                element.classList.add('visible');
            }
        });
    }

    // Throttle scroll events for better performance
    let scrollTimeout;
    function throttledScroll() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                checkScroll();
                scrollTimeout = null;
            }, 16); // ~60fps
        }
    }

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', throttledScroll, { passive: true });

    // Initial check
    checkScroll();

    // Reveal elements that are already in viewport on load
    fadeInElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add('visible');
        }
    });

    // Re-check on resize
    window.addEventListener('resize', checkScroll);
}

// Initialize mobile service hover and scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileServiceHover();
    initScrollAnimations();
});

// Ensure page starts from top on reload
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// --- LIGHTBOX LOGIC ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// Al hacer clic en la imagen del modal de servicios
if (mImg) {
    mImg.addEventListener('click', function() {
        // Solo abrir si hay una imagen cargada
        if (this.getAttribute('src') && this.getAttribute('src') !== "") {
            lightboxImg.src = this.src;
            lightbox.classList.add('active');
        }
    });
}

// Al hacer clic en la imagen DENTRO del lightbox (Zoom)
lightboxImg.addEventListener('click', function(e) {
    e.stopPropagation(); // Evita que se cierre el lightbox
    this.classList.toggle('zoomed');
});

function closeLightboxBtn() {
    lightbox.classList.remove('active');
    // Quitar zoom al cerrar para la próxima vez
    setTimeout(() => lightboxImg.classList.remove('zoomed'), 300);
}

function closeLightbox(e) {
    if (e.target === lightbox) {
        closeLightboxBtn();
    }
}
