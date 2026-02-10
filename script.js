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
    // BEFORE/AFTER SLIDERS
    // ============================================
    function initBeforeAfterSliders() {
        const sliders = document.querySelectorAll('.case-slider');

        sliders.forEach(slider => {
            const container = slider.querySelector('.slider-container');
            const beforeWrapper = slider.querySelector('.slider-before-wrapper');
            const beforeImg = slider.querySelector('.slider-before');
            const handle = slider.querySelector('.slider-handle');
            let isDragging = false;

            function syncBeforeImgWidth() {
                beforeImg.style.width = container.offsetWidth + 'px';
            }

            function updateSlider(x) {
                const rect = container.getBoundingClientRect();
                let pos = (x - rect.left) / rect.width;
                pos = Math.max(0.05, Math.min(0.95, pos));
                beforeWrapper.style.width = (pos * 100) + '%';
                handle.style.left = (pos * 100) + '%';
            }

            // Set before image to full container width so it clips, not scales
            syncBeforeImgWidth();
            window.addEventListener('resize', syncBeforeImgWidth);

            // Mouse events
            container.addEventListener('mousedown', (e) => {
                isDragging = true;
                updateSlider(e.clientX);
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                updateSlider(e.clientX);
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            // Touch events
            container.addEventListener('touchstart', (e) => {
                isDragging = true;
                updateSlider(e.touches[0].clientX);
            }, { passive: true });

            container.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                updateSlider(e.touches[0].clientX);
                e.preventDefault();
            }, { passive: false });

            container.addEventListener('touchend', () => {
                isDragging = false;
            }, { passive: true });
        });
    }

    // ============================================
    // CASES CAROUSEL
    // ============================================
    function initCasesCarousel() {
        const track = document.getElementById('casesTrack');
        const prevBtn = document.getElementById('casesPrev');
        const nextBtn = document.getElementById('casesNext');
        const currentNum = document.getElementById('casesCurrentNum');
        const totalNum = document.getElementById('casesTotalNum');

        if (!track) return;

        const slides = track.querySelectorAll('.case-slide');
        const total = slides.length;
        let current = 0;

        totalNum.textContent = total;

        function goTo(index) {
            current = index;
            track.style.transform = `translateX(-${current * 100}%)`;
            currentNum.textContent = current + 1;
        }

        prevBtn.addEventListener('click', () => {
            goTo(current === 0 ? total - 1 : current - 1);
        });

        nextBtn.addEventListener('click', () => {
            goTo(current === total - 1 ? 0 : current + 1);
        });

        // Swipe support
        let touchStartX = 0;
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) goTo(current === total - 1 ? 0 : current + 1);
                else goTo(current === 0 ? total - 1 : current - 1);
            }
        }, { passive: true });
    }

    // ============================================
    // ACCESSIBILITY MODE
    // ============================================
    function initAccessibilityMode() {
        const toggle = document.getElementById('a11yToggle');
        const panel = document.getElementById('a11yPanel');
        const resetBtn = document.getElementById('a11yReset');
        const root = document.documentElement;

        if (!toggle || !panel) return;

        const STORAGE_KEY = 'aomega_a11y_settings';
        const DEFAULTS = {
            fontSize: 'normal',
            colorScheme: 'normal',
            letterSpacing: 'normal',
            images: 'show'
        };

        let settings = Object.assign({}, DEFAULTS);

        // Load saved settings
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                settings = Object.assign({}, DEFAULTS, JSON.parse(saved));
            }
        } catch (e) { /* ignore */ }

        function saveSettings() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            } catch (e) { /* ignore */ }
        }

        function applySettings() {
            // Font size
            root.classList.remove('a11y-size-large', 'a11y-size-xlarge');
            if (settings.fontSize === 'large') root.classList.add('a11y-size-large');
            if (settings.fontSize === 'xlarge') root.classList.add('a11y-size-xlarge');

            // Color scheme
            root.classList.remove('a11y-scheme-bw', 'a11y-scheme-wb', 'a11y-scheme-blue', 'a11y-scheme-beige');
            if (settings.colorScheme !== 'normal') {
                root.classList.add('a11y-scheme-' + settings.colorScheme);
            }

            // Letter spacing
            root.classList.remove('a11y-spacing-medium', 'a11y-spacing-wide');
            if (settings.letterSpacing === 'medium') root.classList.add('a11y-spacing-medium');
            if (settings.letterSpacing === 'wide') root.classList.add('a11y-spacing-wide');

            // Images
            root.classList.remove('a11y-images-hidden');
            if (settings.images === 'hide') root.classList.add('a11y-images-hidden');

            updateActiveButtons();
        }

        function updateActiveButtons() {
            panel.querySelectorAll('.a11y-btn[data-setting]').forEach(function (btn) {
                var setting = btn.getAttribute('data-setting');
                var value = btn.getAttribute('data-value');
                btn.classList.toggle('a11y-active', settings[setting] === value);
            });
        }

        // Panel toggle
        function openPanel() {
            panel.hidden = false;
            // Force reflow for transition
            panel.offsetHeight;
            panel.classList.add('a11y-panel-open');
            toggle.setAttribute('aria-expanded', 'true');
        }

        function closePanel() {
            panel.classList.remove('a11y-panel-open');
            toggle.setAttribute('aria-expanded', 'false');
            panel.addEventListener('transitionend', function handler() {
                if (!panel.classList.contains('a11y-panel-open')) {
                    panel.hidden = true;
                }
                panel.removeEventListener('transitionend', handler);
            });
        }

        toggle.addEventListener('click', function () {
            if (panel.classList.contains('a11y-panel-open')) {
                closePanel();
            } else {
                openPanel();
            }
        });

        // Outside click
        document.addEventListener('click', function (e) {
            if (panel.classList.contains('a11y-panel-open') &&
                !panel.contains(e.target) &&
                !toggle.contains(e.target)) {
                closePanel();
            }
        });

        // Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && panel.classList.contains('a11y-panel-open')) {
                closePanel();
                toggle.focus();
            }
        });

        // Setting buttons
        panel.addEventListener('click', function (e) {
            var btn = e.target.closest('.a11y-btn[data-setting]');
            if (!btn) return;
            var setting = btn.getAttribute('data-setting');
            var value = btn.getAttribute('data-value');
            settings[setting] = value;
            saveSettings();
            applySettings();
        });

        // Reset
        resetBtn.addEventListener('click', function () {
            settings = Object.assign({}, DEFAULTS);
            saveSettings();
            applySettings();
        });

        // Apply on load
        applySettings();
    }

    // ============================================
    // INIT
    // ============================================
    function init() {
        initAccessibilityMode();
        initHeroEntrance();
        createRevealObserver();
        createCounterObserver();
        initMobileMenu();
        initTestimonials();
        initBeforeAfterSliders();
        initCasesCarousel();
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
