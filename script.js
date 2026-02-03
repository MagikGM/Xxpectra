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
        desc: "Capturamos la narrativa de tu día especial con un enfoque documental y artístico, asegurando que cada emoción quede inmortalizada.",
        list: ["Cobertura completa (8-10 hrs)", "Photobook Premium 30x30cm", "USB Box de madera grabada", "Galería online privada", "Trailer cinematográfico (3-5 min)"],
        img: "https://images.unsplash.com/photo-1627915594191-248db7b3334e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        video: "https://player.vimeo.com/external/371836779.sd.mp4?s=d7e79326e6761665a8820f4c3305417431e5050d&profile_id=164&oauth2_token_id=57447761"
    },
    'corporativo': {
        title: "Corporativo",
        desc: "Proyectamos la profesionalidad de tu marca mediante retratos ejecutivos, cobertura de eventos y videos institucionales.",
        list: ["Sesión de Retrato Ejecutivo", "Cobertura de Evento Empresarial", "Entrega digital en alta resolución", "Cesión de derechos de uso comercial"],
        img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        video: "https://player.vimeo.com/external/370467553.sd.mp4?s=96e63f5b72d242589574447728471c265882410f&profile_id=164&oauth2_token_id=57447761"
    },
    'marketing': {
        title: "Marketing",
        desc: "Contenido diseñado para el algoritmo. Creamos piezas visuales dinámicas que detienen el scroll y generan conversión.",
        list: ["Paquete de 10 Reels/TikToks", "Fotografía de Producto para web", "Formatos adaptados (9:16 y 4:5)", "Estrategia visual mensual"],
        img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        video: "https://player.vimeo.com/external/480277335.sd.mp4?s=34f8c983758373b984534808389659353982467d&profile_id=164&oauth2_token_id=57447761"
    },
    'drone': {
        title: "Video con Drone",
        desc: "Perspectivas aéreas que transforman tu narrativa. Tomas cinematográficas que elevan la calidad de tus proyectos.",
        list: ["Video aéreo profesional 4K", "Edición cinematográfica avanzada", "Música y efectos visuales", "Permisos de vuelo incluidos", "Entrega en USB y digital"],
        img: "https://images.unsplash.com/photo-1506947411487-a56738267384?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        video: "https://player.vimeo.com/external/369069562.sd.mp4?s=27d057181057e49755b796850c9569426f432742&profile_id=164&oauth2_token_id=57447761"
    },
    'cultural': {
        title: "Cultural y Deportivo",
        desc: "La velocidad y la expresión artística requieren técnica precisa. Capturamos la acción en su punto máximo.",
        list: ["Cobertura de competiciones", "Video resumen (Highlights)", "Ráfaga de fotos de acción", "Entrevistas cortas post-evento"],
        img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        video: "https://player.vimeo.com/external/392765655.sd.mp4?s=d0718d07019623087220556637b58793390886c9&profile_id=164&oauth2_token_id=57447761"
    },
    'edicion': {
        title: "Post-producción",
        desc: "Donde ocurre la magia. Transformamos material crudo en piezas maestras mediante corrección de color y diseño sonoro.",
        list: ["Edición no lineal", "Corrección de color (Color Grading)", "Diseño sonoro y mezcla", "Retoque fotográfico High-End"],
        img: "https://images.unsplash.com/photo-1626785774573-4b799314346d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        video: "https://player.vimeo.com/external/494236056.sd.mp4?s=83d6a945199464e837644268e0d5a42207901594&profile_id=164&oauth2_token_id=57447761"
    }
};

const modal = document.getElementById('serviceModal');
const mTitle = document.getElementById('m-title');
const mDesc = document.getElementById('m-desc');
const mList = document.getElementById('m-list');
const mImg = document.getElementById('m-img');
const mVideo = document.getElementById('m-video');

function openModal(serviceKey) {
    const data = serviceData[serviceKey];
    if (!data) return;

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
