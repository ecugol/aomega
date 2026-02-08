/* ============================================
   АЛЬФА И ОМЕГА — Main Script
   Scroll animations, parallax, interactions
   ============================================ */

(function () {
    'use strict';

    // --- DOM References ---
    const header = document.getElementById('siteHeader');
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const backToTop = document.getElementById('backToTop');
    const heroSection = document.getElementById('hero');
    const heroBg = document.querySelector('.hero-bg');
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    const tPrev = document.getElementById('tPrev');
    const tNext = document.getElementById('tNext');
    const tDots = document.getElementById('tDots');
    const appointmentForm = document.getElementById('appointmentForm');

    // --- State ---
    let currentTestimonial = 0;
    const totalTestimonials = 3;
    let ticking = false;

    // ============================================
    // SCROLL HANDLER
    // ============================================
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // Header state
                if (scrollY > 60) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Back to top visibility
                if (scrollY > window.innerHeight * 0.8) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }

                // Hero parallax
                if (heroBg && scrollY < window.innerHeight * 1.5) {
                    const parallaxOffset = scrollY * 0.35;
                    heroBg.style.transform = `translateY(${parallaxOffset}px) scale(1.1)`;
                }

                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ============================================
    // INTERSECTION OBSERVER — Scroll Reveals
    // ============================================
    function createRevealObserver() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-up');

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        revealElements.forEach(el => observer.observe(el));
    }

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function createCounterObserver() {
        const counters = document.querySelectorAll('[data-count]');

        if (!counters.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 2000;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(easedProgress * target);

            el.textContent = formatNumber(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return num.toLocaleString('ru-RU');
        }
        return num.toString();
    }

    // ============================================
    // MOBILE MENU
    // ============================================
    function initMobileMenu() {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================
    // TESTIMONIALS CAROUSEL
    // ============================================
    function initTestimonials() {
        function goTo(index) {
            currentTestimonial = index;
            testimonialsTrack.style.transform = `translateX(-${index * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = tDots.querySelectorAll('.t-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentTestimonial);
            });
        }

        tPrev.addEventListener('click', () => {
            const prev = currentTestimonial === 0 ? totalTestimonials - 1 : currentTestimonial - 1;
            goTo(prev);
        });

        tNext.addEventListener('click', () => {
            const next = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
            goTo(next);
        });

        // Dot clicks
        const dots = tDots.querySelectorAll('.t-dot');
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => goTo(i));
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialsTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialsTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe left — next
                    const next = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
                    goTo(next);
                } else {
                    // Swipe right — prev
                    const prev = currentTestimonial === 0 ? totalTestimonials - 1 : currentTestimonial - 1;
                    goTo(prev);
                }
            }
        }, { passive: true });

        // Auto-advance every 6 seconds
        let autoplay = setInterval(() => {
            const next = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
            goTo(next);
        }, 6000);

        // Pause autoplay on interaction
        [tPrev, tNext, testimonialsTrack].forEach(el => {
            el.addEventListener('pointerenter', () => clearInterval(autoplay));
        });
    }

    // ============================================
    // SMOOTH SCROLL for anchor links
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                e.preventDefault();

                const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 80;

                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ============================================
    // BACK TO TOP
    // ============================================
    function initBackToTop() {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================
    // FORM HANDLING
    // ============================================
    function initForm() {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('formName');
            const phone = document.getElementById('formPhone');

            // Basic validation
            let valid = true;

            if (!name.value.trim()) {
                shakeInput(name);
                valid = false;
            }

            if (!phone.value.trim()) {
                shakeInput(phone);
                valid = false;
            }

            if (!valid) return;

            // Simulate submission
            const formCol = appointmentForm.parentElement;
            appointmentForm.style.opacity = '0';
            appointmentForm.style.transform = 'translateY(10px)';
            appointmentForm.style.transition = 'all 0.4s ease';

            setTimeout(() => {
                formCol.innerHTML = `
                    <div class="form-success">
                        <span class="form-success-icon">&#10003;</span>
                        <h3 class="form-success-title">Заявка отправлена</h3>
                        <p class="form-success-text">
                            Спасибо! Мы свяжемся с вами в течение 30 минут
                            для подтверждения записи.
                        </p>
                    </div>
                `;
            }, 400);
        });
    }

    function shakeInput(input) {
        input.style.borderColor = '#C4534A';
        input.style.animation = 'shake 0.5s ease';

        setTimeout(() => {
            input.style.borderColor = '';
            input.style.animation = '';
        }, 600);
    }

    // Add shake animation
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(6px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // ============================================
    // PHONE INPUT MASK (basic)
    // ============================================
    function initPhoneMask() {
        const phoneInput = document.getElementById('formPhone');

        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length === 0) {
                e.target.value = '';
                return;
            }

            // Ensure starts with 7
            if (value[0] === '8') {
                value = '7' + value.slice(1);
            }
            if (value[0] !== '7') {
                value = '7' + value;
            }

            let formatted = '+7';
            if (value.length > 1) formatted += ' (' + value.slice(1, 4);
            if (value.length > 4) formatted += ') ' + value.slice(4, 7);
            if (value.length > 7) formatted += '-' + value.slice(7, 9);
            if (value.length > 9) formatted += '-' + value.slice(9, 11);

            e.target.value = formatted;
        });
    }

    // ============================================
    // HERO ENTRANCE ANIMATION
    // ============================================
    function initHeroEntrance() {
        // Mark hero elements as visible after a short delay
        setTimeout(() => {
            heroSection.querySelectorAll('.reveal').forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, i * 120);
            });
        }, 300);
    }

    // ============================================
    // INIT
    // ============================================
    function init() {
        initHeroEntrance();
        createRevealObserver();
        createCounterObserver();
        initMobileMenu();
        initTestimonials();
        initSmoothScroll();
        initBackToTop();
        initForm();
        initPhoneMask();

        // Initial scroll state check
        onScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
