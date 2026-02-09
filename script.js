/* ============================================
   DENTAL CLINIC - DR. MARIJA RAŠIN
   JavaScript - Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // PRELOADER
    // ============================================
    const preloader = document.querySelector('.preloader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1000);
    });

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleNavScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll);

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 200;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    const counters = document.querySelectorAll('[data-count]');
    const speed = 200;

    function animateCounter(counter) {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(() => animateCounter(counter), 10);
        } else {
            counter.innerText = target.toLocaleString();
        }
    }

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-image');

    // Add js-loaded class to body to enable animations
    document.body.classList.add('js-loaded');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Immediately check for elements already in view
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('visible');
        }
    });

    // Fallback: If elements are still hidden after 2 seconds, make them visible
    setTimeout(() => {
        revealElements.forEach(el => {
            if (!el.classList.contains('visible')) {
                el.classList.add('visible');
            }
        });
    }, 2000);

    // ============================================
    // TESTIMONIALS SLIDER
    // ============================================
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');

    let currentSlide = 0;
    let slidesPerView = 3;

    // Update slides per view based on screen size
    function updateSlidesPerView() {
        if (window.innerWidth <= 768) {
            slidesPerView = 1;
        } else if (window.innerWidth <= 1200) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
    }

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);

    // Create dots
    const totalDots = Math.ceil(slides.length / slidesPerView);
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.slider-dots .dot');

    function updateSlider() {
        const slideWidth = slides[0].offsetWidth + 24; // Including gap
        track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalDots;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalDots) % totalDots;
        updateSlider();
    }

    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    // Auto-slide
    let autoSlide = setInterval(nextSlide, 5000);

    // Pause on hover
    if (track) {
        track.addEventListener('mouseenter', () => clearInterval(autoSlide));
        track.addEventListener('mouseleave', () => {
            autoSlide = setInterval(nextSlide, 5000);
        });
    }

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============================================
    // FORM HANDLING
    // ============================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Gather form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Simple validation
            let isValid = true;
            const inputs = this.querySelectorAll('input, textarea, select');

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#e74c3c';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (isValid) {
                // Show success message
                const btn = this.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span>✓ Poruka poslana!</span>';
                btn.style.background = '#27ae60';

                // Reset form
                setTimeout(() => {
                    this.reset();
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    // ============================================
    // PARALLAX EFFECT ON HERO
    // ============================================
    const heroImage = document.querySelector('.hero-image-wrapper');
    const floatingCircles = document.querySelectorAll('.floating-circle');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }

        floatingCircles.forEach((circle, index) => {
            const speed = 0.05 * (index + 1);
            circle.style.transform = `translate(${scrolled * speed}px, ${scrolled * speed}px)`;
        });
    });

    // ============================================
    // MAGNETIC BUTTON EFFECT
    // ============================================
    const magneticButtons = document.querySelectorAll('.btn-primary, .nav-cta');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // ============================================
    // TILT EFFECT ON SERVICE CARDS
    // ============================================
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // ============================================
    // IMAGE LAZY LOADING
    // ============================================
    const images = document.querySelectorAll('img[src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // ============================================
    // CURSOR GLOW EFFECT (Optional - Desktop Only)
    // ============================================
    if (window.matchMedia('(min-width: 1024px)').matches) {
        const cursorGlow = document.createElement('div');
        cursorGlow.classList.add('cursor-glow');
        cursorGlow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(26, 188, 156, 0.15) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(cursorGlow);

        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });

        // Hide cursor glow on certain sections
        const darkSections = document.querySelectorAll('.testimonials, .footer');
        darkSections.forEach(section => {
            section.addEventListener('mouseenter', () => {
                cursorGlow.style.opacity = '0';
            });
            section.addEventListener('mouseleave', () => {
                cursorGlow.style.opacity = '1';
            });
        });
    }

    // ============================================
    // TYPING EFFECT FOR HERO TITLE (Optional)
    // ============================================
    function typeEffect(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    const animatedElements = document.querySelectorAll('[class*="animate-"]');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        animationObserver.observe(el);
    });

    // ============================================
    // GALLERY LIGHTBOX (Simple)
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            lightbox.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: zoom-out;
                animation: fadeIn 0.3s ease;
            `;

            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src.replace(/w=\d+/, 'w=1200');
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 90vh;
                border-radius: 8px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: scaleIn 0.3s ease;
            `;

            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            lightbox.addEventListener('click', () => {
                lightbox.remove();
                document.body.style.overflow = '';
            });
        });
    });

    // ============================================
    // PERFORMANCE: DEBOUNCE SCROLL EVENTS
    // ============================================
    function debounce(func, wait = 10, immediate = true) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Apply debounce to scroll handlers
    window.addEventListener('scroll', debounce(handleNavScroll));
    window.addEventListener('scroll', debounce(highlightNavLink));


    // ============================================
    // SMOOTH SCROLLING (LENIS)
    // ============================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // ============================================
    // BEFORE/AFTER SLIDER
    // ============================================
    const sliderContainer = document.querySelector('.comparison-container');
    const sliderRange = document.querySelector('.comparison-range');
    const afterImage = document.querySelector('.comparison-after');
    const sliderHandle = document.querySelector('.comparison-handle');

    if (sliderRange && afterImage && sliderHandle) {
        sliderRange.addEventListener('input', (e) => {
            const value = e.target.value;
            afterImage.style.width = `${value}%`;
            sliderHandle.style.left = `${value}%`;
        });

        // Optional: Add touch support if needed, but range input handles it mostly.
    }

});
