/* ============================================
   АЛЬФА И ОМЕГА — Main Script
   Scroll animations, parallax, interactions
   ============================================ */

(function () {
    'use strict';

    // --- DOM References (all guarded) ---
    var header = document.getElementById('siteHeader');
    var burger = document.getElementById('burger');
    var mobileMenu = document.getElementById('mobileMenu');
    var backToTop = document.getElementById('backToTop');
    var heroSection = document.getElementById('hero');
    var heroBg = document.querySelector('.hero-bg');
    var testimonialsTrack = document.getElementById('testimonialsTrack');
    var tPrev = document.getElementById('tPrev');
    var tNext = document.getElementById('tNext');
    var tDots = document.getElementById('tDots');
    var appointmentForm = document.getElementById('appointmentForm');

    // --- State ---
    var currentTestimonial = 0;
    var totalTestimonials = 3;
    var ticking = false;

    // ============================================
    // SCROLL HANDLER
    // ============================================
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                var scrollY = window.scrollY;

                // Header state
                if (header) {
                    if (scrollY > 60) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }

                // Back to top visibility
                if (backToTop) {
                    if (scrollY > window.innerHeight * 0.8) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                }

                // Hero parallax
                if (heroBg && scrollY < window.innerHeight * 1.5) {
                    var parallaxOffset = scrollY * 0.35;
                    heroBg.style.transform = 'translateY(' + parallaxOffset + 'px) scale(1.1)';
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
        var revealElements = document.querySelectorAll('.reveal, .reveal-up');

        if (!revealElements.length) return;

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
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

        revealElements.forEach(function (el) { observer.observe(el); });
    }

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function createCounterObserver() {
        var counters = document.querySelectorAll('[data-count]');

        if (!counters.length) return;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(function (counter) { observer.observe(counter); });
    }

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 2000;
        var startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var easedProgress = easeOutQuart(progress);
            var current = Math.round(easedProgress * target);

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
        if (!burger || !mobileMenu) return;

        burger.addEventListener('click', function () {
            burger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        var mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', function () {
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
        if (!testimonialsTrack || !tPrev || !tNext || !tDots) return;

        function goTo(index) {
            currentTestimonial = index;
            testimonialsTrack.style.transform = 'translateX(-' + (index * 100) + '%)';
            updateDots();
        }

        function updateDots() {
            var dots = tDots.querySelectorAll('.t-dot');
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === currentTestimonial);
            });
        }

        tPrev.addEventListener('click', function () {
            var prev = currentTestimonial === 0 ? totalTestimonials - 1 : currentTestimonial - 1;
            goTo(prev);
        });

        tNext.addEventListener('click', function () {
            var next = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
            goTo(next);
        });

        // Dot clicks
        var dots = tDots.querySelectorAll('.t-dot');
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { goTo(i); });
        });

        // Touch/swipe support
        var touchStartX = 0;

        testimonialsTrack.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialsTrack.addEventListener('touchend', function (e) {
            var touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    var next = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
                    goTo(next);
                } else {
                    var prev = currentTestimonial === 0 ? totalTestimonials - 1 : currentTestimonial - 1;
                    goTo(prev);
                }
            }
        }, { passive: true });

        // Auto-advance every 6 seconds
        var autoplay = setInterval(function () {
            var next = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
            goTo(next);
        }, 6000);

        // Pause autoplay on interaction
        [tPrev, tNext, testimonialsTrack].forEach(function (el) {
            el.addEventListener('pointerenter', function () { clearInterval(autoplay); });
        });
    }

    // ============================================
    // SMOOTH SCROLL for anchor links
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                var targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                e.preventDefault();

                var headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 80;

                var elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                var offsetPosition = elementPosition - headerOffset;

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
        if (!backToTop) return;
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================
    // FORM HANDLING
    // ============================================
    function initForm() {
        if (!appointmentForm) return;

        appointmentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('formName');
            var phone = document.getElementById('formPhone');

            // Basic validation
            var valid = true;

            if (name && !name.value.trim()) {
                shakeInput(name);
                valid = false;
            }

            if (phone && !phone.value.trim()) {
                shakeInput(phone);
                valid = false;
            }

            if (!valid) return;

            // Simulate submission
            var formCol = appointmentForm.parentElement;
            appointmentForm.style.opacity = '0';
            appointmentForm.style.transform = 'translateY(10px)';
            appointmentForm.style.transition = 'all 0.4s ease';

            setTimeout(function () {
                formCol.innerHTML =
                    '<div class="form-success">' +
                        '<span class="form-success-icon">&#10003;</span>' +
                        '<h3 class="form-success-title">\u0417\u0430\u044F\u0432\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0430</h3>' +
                        '<p class="form-success-text">\u0421\u043F\u0430\u0441\u0438\u0431\u043E! \u041C\u044B \u0441\u0432\u044F\u0436\u0435\u043C\u0441\u044F \u0441 \u0432\u0430\u043C\u0438 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 30 \u043C\u0438\u043D\u0443\u0442 \u0434\u043B\u044F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u0437\u0430\u043F\u0438\u0441\u0438.</p>' +
                    '</div>';
            }, 400);
        });
    }

    function shakeInput(input) {
        input.style.borderColor = '#C4534A';
        input.style.animation = 'shake 0.5s ease';

        setTimeout(function () {
            input.style.borderColor = '';
            input.style.animation = '';
        }, 600);
    }

    // Add shake animation
    var shakeStyle = document.createElement('style');
    shakeStyle.textContent =
        '@keyframes shake {' +
            '0%, 100% { transform: translateX(0); }' +
            '20% { transform: translateX(-6px); }' +
            '40% { transform: translateX(6px); }' +
            '60% { transform: translateX(-4px); }' +
            '80% { transform: translateX(4px); }' +
        '}';
    document.head.appendChild(shakeStyle);

    // ============================================
    // PHONE INPUT MASK (basic)
    // ============================================
    function initPhoneMask() {
        var phoneInput = document.getElementById('formPhone');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', function (e) {
            var value = e.target.value.replace(/\D/g, '');

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

            var formatted = '+7';
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
        if (!heroSection) return;

        // Mark hero elements as visible after a short delay
        setTimeout(function () {
            heroSection.querySelectorAll('.reveal').forEach(function (el, i) {
                setTimeout(function () {
                    el.classList.add('visible');
                }, i * 120);
            });
        }, 300);
    }

    // ============================================
    // BEFORE/AFTER SLIDERS
    // ============================================
    function initBeforeAfterSliders() {
        var sliders = document.querySelectorAll('.case-slider');
        if (!sliders.length) return;

        sliders.forEach(function (slider) {
            var container = slider.querySelector('.slider-container');
            var beforeWrapper = slider.querySelector('.slider-before-wrapper');
            var beforeImg = slider.querySelector('.slider-before');
            var handle = slider.querySelector('.slider-handle');
            var isDragging = false;

            function syncBeforeImgWidth() {
                beforeImg.style.width = container.offsetWidth + 'px';
            }

            function updateSlider(x) {
                var rect = container.getBoundingClientRect();
                var pos = (x - rect.left) / rect.width;
                pos = Math.max(0.05, Math.min(0.95, pos));
                beforeWrapper.style.width = (pos * 100) + '%';
                handle.style.left = (pos * 100) + '%';
            }

            // Set before image to full container width so it clips, not scales
            syncBeforeImgWidth();
            window.addEventListener('resize', syncBeforeImgWidth);

            // Mouse events
            container.addEventListener('mousedown', function (e) {
                isDragging = true;
                updateSlider(e.clientX);
                e.preventDefault();
            });

            document.addEventListener('mousemove', function (e) {
                if (!isDragging) return;
                updateSlider(e.clientX);
            });

            document.addEventListener('mouseup', function () {
                isDragging = false;
            });

            // Touch events
            container.addEventListener('touchstart', function (e) {
                isDragging = true;
                updateSlider(e.touches[0].clientX);
            }, { passive: true });

            container.addEventListener('touchmove', function (e) {
                if (!isDragging) return;
                updateSlider(e.touches[0].clientX);
                e.preventDefault();
            }, { passive: false });

            container.addEventListener('touchend', function () {
                isDragging = false;
            }, { passive: true });
        });
    }

    // ============================================
    // CASES CAROUSEL
    // ============================================
    function initCasesCarousel() {
        var track = document.getElementById('casesTrack');
        var prevBtn = document.getElementById('casesPrev');
        var nextBtn = document.getElementById('casesNext');
        var currentNum = document.getElementById('casesCurrentNum');
        var totalNum = document.getElementById('casesTotalNum');

        if (!track || !prevBtn || !nextBtn) return;

        var slides = track.querySelectorAll('.case-slide');
        var total = slides.length;
        var current = 0;

        if (totalNum) totalNum.textContent = total;

        function goTo(index) {
            current = index;
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            if (currentNum) currentNum.textContent = current + 1;
        }

        prevBtn.addEventListener('click', function () {
            goTo(current === 0 ? total - 1 : current - 1);
        });

        nextBtn.addEventListener('click', function () {
            goTo(current === total - 1 ? 0 : current + 1);
        });

        // Swipe support
        var touchStartX = 0;
        track.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', function (e) {
            var diff = touchStartX - e.changedTouches[0].screenX;
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
        var toggle = document.getElementById('a11yToggle');
        var panel = document.getElementById('a11yPanel');
        var resetBtn = document.getElementById('a11yReset');
        var root = document.documentElement;

        if (!toggle || !panel) return;

        var STORAGE_KEY = 'aomega_a11y_settings';
        var DEFAULTS = {
            fontSize: 'normal',
            colorScheme: 'normal',
            letterSpacing: 'normal',
            images: 'show'
        };

        var settings = Object.assign({}, DEFAULTS);

        // Load saved settings
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
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
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                settings = Object.assign({}, DEFAULTS);
                saveSettings();
                applySettings();
            });
        }

        // Apply on load
        applySettings();
    }

    // ============================================
    // SEARCH
    // ============================================
    function initSearch() {
        var searchToggle = document.getElementById('searchToggle');
        var searchModal = document.getElementById('searchModal');
        var searchClose = document.getElementById('searchModalClose');
        var searchBackdrop = searchModal ? searchModal.querySelector('.search-modal-backdrop') : null;
        var pagefindLoaded = false;

        if (!searchToggle || !searchModal) return;

        function openSearch() {
            searchModal.classList.add('active');
            searchModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            if (!pagefindLoaded) {
                pagefindLoaded = true;
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '/_pagefind/pagefind-ui.css';
                document.head.appendChild(link);

                var script = document.createElement('script');
                script.src = '/_pagefind/pagefind-ui.js';
                script.onload = function () {
                    new PagefindUI({
                        element: '#pagefindSearch',
                        showSubResults: true,
                        translations: {
                            placeholder: '\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0441\u0430\u0439\u0442\u0443\u2026',
                            zero_results: '\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443 [SEARCH_TERM]',
                            many_results: '\u041D\u0430\u0439\u0434\u0435\u043D\u043E [COUNT] \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432',
                            one_result: '\u041D\u0430\u0439\u0434\u0435\u043D [COUNT] \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442',
                            alt_search: '\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 [SEARCH_TERM]',
                            search_suggestion: '\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 [SEARCH_TERM]',
                            searching: '\u0418\u0449\u0435\u043C\u2026',
                            load_more: '\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0451'
                        }
                    });
                    focusInput();
                };
                document.head.appendChild(script);
            } else {
                focusInput();
            }
        }

        function focusInput() {
            setTimeout(function () {
                var input = searchModal.querySelector('.pagefind-ui__search-input');
                if (input) input.focus();
            }, 100);
        }

        function closeSearch() {
            searchModal.classList.remove('active');
            searchModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            searchToggle.focus();
        }

        searchToggle.addEventListener('click', openSearch);
        searchClose.addEventListener('click', closeSearch);

        if (searchBackdrop) {
            searchBackdrop.addEventListener('click', closeSearch);
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                closeSearch();
            }
        });
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
        initSearch();

        // Initial scroll state check
        onScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
