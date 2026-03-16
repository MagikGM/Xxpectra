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
        
        // --- NUEVO: Mezclar portafolio aleatoriamente al entrar ---
        if (pageId === 'portfolio') {
            shufflePortfolio();
        }
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

    // 6. Guardar la página actual en localStorage
    localStorage.setItem('currentPage', pageId);
    localStorage.setItem('lastVisitTime', Date.now());
}

// Inicialización: Asegurar que Home es visible al cargar
document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que la página empiece desde arriba inmediatamente
    window.scrollTo(0, 0);

    // Verificar si hay una página guardada en localStorage
    const savedPage = localStorage.getItem('currentPage');
    const lastVisitTime = localStorage.getItem('lastVisitTime');
    const sessionTimeout = 20 * 60 * 1000; // 20 minutos de expiración (en milisegundos)

    if (savedPage && lastVisitTime && (Date.now() - lastVisitTime < sessionTimeout) && document.getElementById(savedPage)) {
        // Mostrar la página guardada
        showPage(savedPage);
    } else {
        // Si pasó mucho tiempo, limpiar memoria para empezar de cero
        localStorage.removeItem('currentPage');
        localStorage.removeItem('lastVisitTime');

        // El HTML ya tiene la clase active en Home, pero esto es un seguro
        if (!document.querySelector('.page-view.active')) {
            showPage('home');
        }
    }
});


// --- LOGICA DEL MODAL DINAMICO ---
const serviceData = {
    'sociales': {
        title: "Eventos Sociales",
        desc: "Momentos irrepetibles convertidos en recuerdos atemporales, capturados con sensibilidad y detalle.",
        list: ["Bodas", "XV años", "Bautizos", "Primera comunión", "Cumpleaños", "Aniversarios", "Entre otros..."],
        images: ["media/servicios/sociales/s1.webp", "media/servicios/sociales/s2.webp", "media/servicios/sociales/s3.webp", "media/servicios/sociales/s4.webp", "media/servicios/sociales/s5.webp"], // Agrega más fotos aquí separadas por coma
        video: "media/servicios/sociales/sociales.webm" // Asegúrate que este archivo exista y sea .webm
    },
    'corporativo': {
        title: "Corporativo",
        desc: "Imagen profesional que comunica liderazgo, confianza y la esencia de tu empresa.",
        list: ["Corporativos", "Conferencias", "Congresos", "Fotografía empresarial", "Entre otros..."],
        images: ["media/servicios/corporativo/c1.webp", "media/servicios/corporativo/c2.webp", "media/servicios/corporativo/c3.webp", "media/servicios/corporativo/c4.webp"], 
        video: "media/servicios/corporativo/corporativo.webm"
    },
    'marketing': {
        title: "Marketing",
        desc: "Contenido visual estratégico diseñado para atraer, conectar y generar impacto.",
        list: ["Fotografía y video de productos", "Lanzamientos de marca", "Entre otros..."],
        images: ["media/servicios/marketing/m1.webp", "media/servicios/marketing/m2.webp", "media/servicios/marketing/m3.webp", "media/servicios/marketing/m4.webp"],
        video: "media/servicios/marketing/marketing.webm"
    },
    'drone': {
        title: "Video con Dron",
        desc: "Perspectivas aéreas que elevan tu proyecto y muestran cada espacio desde un angulo extraordinario.",
        list: ["Eventos sociales", "Eventos masivos", "Festivales", "Eventos Deportivos", "Eventos Coorporativos", "Entre otros..."],
        images: [""],
        video: ""
    },
    'cultural': {
        title: "Cultural y Deportivo",
        desc: "Energía, pasión y movimiento capturados en su maxima expresión.",
        list: ["Conciertos", "Festivales", "Presentaciones Artisticas", "Obras de teatro", "Actividades Municipales", "Expocisiones", "Competencias", "Carreras", "Entre otros..."],
        images: ["media/servicios/cultural/c1.webp", "media/servicios/cultural/c2.webp", "media/servicios/cultural/c3.webp", "media/servicios/cultural/c4.webp"],
        video: "media/servicios/cultural/cultural.webm"
    },
    'edicion': {
        title: "Post-producción",
        desc: "Donde ocurre la magia. Transformamos material crudo en piezas maestras mediante corrección de color y diseño sonoro.",
        list: ["Correcciones de color", "Retoque Natural", "Ajustes de luz y encuadre", "Musicalización", "Transiciones profesionales", "Entre otros..."],
        images: ["media/servicios/edicion/e1.webp"],
        video: ""
    }
};

const modal = document.getElementById('serviceModal');
const mTitle = document.getElementById('m-title');
const mDesc = document.getElementById('m-desc');
const mList = document.getElementById('m-list');
const mCarouselContainer = document.getElementById('m-carousel-container');
const mVideo = document.getElementById('m-video');
const mDeliverablesTitle = document.querySelector('.deliverables-title');
const mCtaBtn = document.querySelector('.modal-cta-btn');
let carouselInterval; // Variable para controlar el tiempo

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
    
    // Actualizar enlace de WhatsApp con mensaje personalizado
    const message = `Hola, me interesa cotizar el servicio de ${data.title} por favor`;
    mCtaBtn.href = `https://wa.me/5523145831?text=${encodeURIComponent(message)}`;

    // --- LÓGICA DEL CARRUSEL ---
    // 1. Limpiar contenedor
    mCarouselContainer.innerHTML = '';
    
    // 2. Insertar imágenes
    if (data.images && data.images.length > 0) {
        data.images.forEach((imgSrc, index) => {
            if(imgSrc === "") return; // Saltar si está vacío
            const img = document.createElement('img');
            img.src = imgSrc;
            img.className = index === 0 ? 'carousel-img active' : 'carousel-img';
            img.alt = data.title;
            
            // Añadir evento click para Lightbox (reemplaza la lógica anterior)
            img.addEventListener('click', function() {
                lightboxImg.src = this.src;
                lightbox.classList.add('active');
            });

            mCarouselContainer.appendChild(img);
        });

        // 3. Iniciar intervalo si hay más de una imagen
        if (data.images.length > 1) {
            startCarousel();
        }
    } else {
        // Opcional: Poner una imagen placeholder si no hay imágenes
    }

    mList.innerHTML = '';
    data.list.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-check"></i> ${item}`;
        mList.appendChild(li);
    });

    // Ocultar el contenedor de video si no hay video definido
    if (data.video && data.video.trim() !== "") {
        mVideo.src = data.video;
        mVideo.parentElement.style.display = 'block';
    } else {
        mVideo.src = "";
        mVideo.parentElement.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Ensure modal content scrolls to top on mobile
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
}

function startCarousel() {
    // Limpiar intervalo previo por seguridad
    if (carouselInterval) clearInterval(carouselInterval);

    carouselInterval = setInterval(() => {
        const images = document.querySelectorAll('.carousel-img');
        if (images.length < 2) return;

        const activeIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
        const nextIndex = (activeIndex + 1) % images.length;

        images[activeIndex].classList.remove('active');
        images[nextIndex].classList.add('active');
    }, 3000); // 3 segundos
}

function closeModalBtn() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (carouselInterval) clearInterval(carouselInterval); // Detener carrusel
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

// --- MOBILE SCROLL HOVER EFFECT FOR PORTFOLIO ---
function initMobilePortfolioHover() {
    const portfolioSection = document.getElementById('portfolio');
    const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));

    if (!portfolioSection || portfolioItems.length === 0) return;

    let currentActiveIndex = -1;
    let lastSwitchTime = 0;
    const minSwitchInterval = 300; // Minimum 300ms between switches

    function handleScroll() {
        if (window.innerWidth > 768) return; // Only apply on mobile

        const now = Date.now();
        if (now - lastSwitchTime < minSwitchInterval) return; // Prevent too frequent switches

        const windowHeight = window.innerHeight;
        const viewportCenter = windowHeight / 2;

        // Calculate item positions relative to viewport center
        const itemPositions = portfolioItems.map((item, index) => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.top + rect.height / 2;
            const distanceFromCenter = Math.abs(itemCenter - viewportCenter);
            return { index, distanceFromCenter, item, itemCenter };
        });

        // Find the item closest to viewport center
        itemPositions.sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);
        const closestItem = itemPositions[0];

        // Only switch if the closest item is within activation zone
        const activationThreshold = 150; // pixels from center
        const hysteresisThreshold = 80; // pixels of hysteresis

        let shouldSwitch = false;

        if (currentActiveIndex === -1) {
            shouldSwitch = closestItem.distanceFromCenter < activationThreshold;
        } else {
            const currentItem = itemPositions.find(p => p.index === currentActiveIndex);
            if (currentItem) {
                const distanceDiff = currentItem.distanceFromCenter - closestItem.distanceFromCenter;
                shouldSwitch = distanceDiff > hysteresisThreshold && closestItem.distanceFromCenter < activationThreshold;
            } else {
                shouldSwitch = closestItem.distanceFromCenter < activationThreshold;
            }
        }

        if (shouldSwitch) {
            if (currentActiveIndex !== -1) {
                portfolioItems[currentActiveIndex].classList.remove('active');
            }
            portfolioItems[closestItem.index].classList.add('active');
            currentActiveIndex = closestItem.index;
            lastSwitchTime = now;
        }
    }

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

    window.addEventListener('scroll', requestTick, { passive: true });
    handleScroll();

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            handleScroll();
        } else {
            portfolioItems.forEach(item => item.classList.remove('active'));
            currentActiveIndex = -1;
            lastSwitchTime = 0;
        }
    });
}

// --- SCROLL ANIMATIONS ---
function initScrollAnimations() {
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Dejar de observar una vez que es visible
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Revelar suavemente un poco antes
        threshold: 0.1
    });

    fadeInElements.forEach(element => {
        if (!element.classList.contains('visible')) {
            observer.observe(element);
        }
    });
}

// Initialize mobile service hover and scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileServiceHover();
    initMobilePortfolioHover();
    initScrollAnimations();
});

// --- PARTICLES JS CONFIGURATION ---
// Configuración adaptada del efecto solicitado (Hexágonos cayendo)
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('particles-js') && window.particlesJS) {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 30,
                    "density": {
                        "enable": false,
                        "value_area": 1763.753266952075
                    }
                },
                "color": {
                    "value": "#aaaaaa"
                },
                "shape": {
                    "type": "polygon",
                    "stroke": {
                        "width": 0,
                        "color": "#000"
                    },
                    "polygon": {
                        "nb_sides": 6
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.14993805191013182,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 1.0557003759917487,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 120.2559045649142,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 10,
                        "size_min": 40,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": false,
                    "distance": 200,
                    "color": "#ffffff",
                    "opacity": 1,
                    "width": 2
                },
                "move": {
                    "enable": true,
                    "speed": 3,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "window",
                "events": {
                    "onhover": {
                        "enable": false,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": false,
                        "mode": "bubble"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }
});

// --- LIGHTBOX LOGIC ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function closeLightboxBtn() {
    lightbox.classList.remove('active');
}

function closeLightbox(e) {
    if (e.target === lightbox) {
        closeLightboxBtn();
    }
}

// --- ABRIR LIGHTBOX DESDE PORTAFOLIO ---
function openPortfolioLightbox(element) {
    const img = element.querySelector('img');
    if (img && img.src && img.src !== window.location.href) { // Evita abrir imágenes vacías
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
    }
}

// --- FUNCIÓN PARA MEZCLAR EL PORTAFOLIO ALEATORIAMENTE ---
function shufflePortfolio() {
    const grid = document.querySelector('.portfolio-grid');
    if (!grid) return;

    const items = Array.from(grid.children);
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]]; // Intercambiar posiciones en el array
    }

    // Re-insertar los elementos en el DOM con el nuevo orden
    items.forEach(item => grid.appendChild(item));
}