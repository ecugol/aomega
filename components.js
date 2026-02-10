/* ============================================
   Shared Components — Header, Footer, A11y, etc.
   Injects into mount-point <div>s on every page.
   ============================================ */
(function () {
    'use strict';

    var loc = window.location.pathname;
    var isIndex = loc === '/' || loc.endsWith('/index.html') || loc === '/index.html';

    function hp(anchor) {
        return isIndex ? anchor : '/' + anchor;
    }

    /* ---- Header ---- */
    var headerMount = document.getElementById('site-header-mount');
    if (headerMount) {
        headerMount.outerHTML =
            '<header class="site-header" id="siteHeader">' +
                '<div class="header-inner">' +
                    '<a href="/" class="logo">' +
                        '<span class="logo-alpha">&#913;</span>' +
                        '<span class="logo-separator">&amp;</span>' +
                        '<span class="logo-omega">&#937;</span>' +
                    '</a>' +
                    '<nav class="main-nav" id="mainNav">' +
                        '<a href="' + hp('#about') + '" class="nav-link">\u041E \u043A\u043B\u0438\u043D\u0438\u043A\u0435</a>' +
                        '<a href="' + hp('#services') + '" class="nav-link">\u0423\u0441\u043B\u0443\u0433\u0438</a>' +
                        '<a href="' + hp('#cases') + '" class="nav-link">\u0420\u0430\u0431\u043E\u0442\u044B</a>' +
                        '<a href="' + hp('#team') + '" class="nav-link">\u0412\u0440\u0430\u0447\u0438</a>' +
                        '<a href="' + hp('#contact') + '" class="nav-link">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</a>' +
                    '</nav>' +
                    '<a href="' + hp('#contact') + '" class="header-cta">\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u044C\u0441\u044F</a>' +
                    '<div class="header-controls">' +
                        '<button class="search-toggle" id="searchToggle" aria-label="\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0441\u0430\u0439\u0442\u0443" title="\u041F\u043E\u0438\u0441\u043A">' +
                            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                                '<circle cx="11" cy="11" r="8"/>' +
                                '<line x1="21" y1="21" x2="16.65" y2="16.65"/>' +
                            '</svg>' +
                        '</button>' +
                        '<button class="a11y-toggle" id="a11yToggle" aria-label="\u0412\u0435\u0440\u0441\u0438\u044F \u0434\u043B\u044F \u0441\u043B\u0430\u0431\u043E\u0432\u0438\u0434\u044F\u0449\u0438\u0445" aria-expanded="false" title="\u0412\u0435\u0440\u0441\u0438\u044F \u0434\u043B\u044F \u0441\u043B\u0430\u0431\u043E\u0432\u0438\u0434\u044F\u0449\u0438\u0445">' +
                            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                                '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>' +
                                '<circle cx="12" cy="12" r="3"/>' +
                            '</svg>' +
                        '</button>' +
                        '<button class="burger" id="burger" aria-label="\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E">' +
                            '<span></span><span></span><span></span>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</header>';
    }

    /* ---- A11y Panel ---- */
    var a11yMount = document.getElementById('site-a11y-mount');
    if (a11yMount) {
        a11yMount.outerHTML =
            '<div class="a11y-panel" id="a11yPanel" role="region" aria-label="\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438" hidden>' +
                '<div class="a11y-panel-inner">' +
                    '<div class="a11y-group">' +
                        '<span class="a11y-label">\u0420\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430</span>' +
                        '<div class="a11y-options">' +
                            '<button class="a11y-btn" data-setting="fontSize" data-value="normal" aria-label="\u041E\u0431\u044B\u0447\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430">\u0410</button>' +
                            '<button class="a11y-btn" data-setting="fontSize" data-value="large" aria-label="\u0423\u0432\u0435\u043B\u0438\u0447\u0435\u043D\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430">\u0410+</button>' +
                            '<button class="a11y-btn" data-setting="fontSize" data-value="xlarge" aria-label="\u041A\u0440\u0443\u043F\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430">\u0410++</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="a11y-group">' +
                        '<span class="a11y-label">\u0426\u0432\u0435\u0442\u043E\u0432\u0430\u044F \u0441\u0445\u0435\u043C\u0430</span>' +
                        '<div class="a11y-options">' +
                            '<button class="a11y-btn a11y-swatch a11y-swatch-normal" data-setting="colorScheme" data-value="normal" aria-label="\u041E\u0431\u044B\u0447\u043D\u044B\u0435 \u0446\u0432\u0435\u0442\u0430">\u0426</button>' +
                            '<button class="a11y-btn a11y-swatch a11y-swatch-bw" data-setting="colorScheme" data-value="bw" aria-label="\u0427\u0451\u0440\u043D\u044B\u0439 \u043D\u0430 \u0431\u0435\u043B\u043E\u043C">\u0427/\u0411</button>' +
                            '<button class="a11y-btn a11y-swatch a11y-swatch-wb" data-setting="colorScheme" data-value="wb" aria-label="\u0411\u0435\u043B\u044B\u0439 \u043D\u0430 \u0447\u0451\u0440\u043D\u043E\u043C">\u0411/\u0427</button>' +
                            '<button class="a11y-btn a11y-swatch a11y-swatch-blue" data-setting="colorScheme" data-value="blue" aria-label="\u0421\u0438\u043D\u044F\u044F \u0441\u0445\u0435\u043C\u0430">\u0421</button>' +
                            '<button class="a11y-btn a11y-swatch a11y-swatch-beige" data-setting="colorScheme" data-value="beige" aria-label="\u0411\u0435\u0436\u0435\u0432\u0430\u044F \u0441\u0445\u0435\u043C\u0430">\u0411</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="a11y-group">' +
                        '<span class="a11y-label">\u041C\u0435\u0436\u0431\u0443\u043A\u0432\u0435\u043D\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B</span>' +
                        '<div class="a11y-options">' +
                            '<button class="a11y-btn" data-setting="letterSpacing" data-value="normal" aria-label="\u041E\u0431\u044B\u0447\u043D\u044B\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B">\u0410\u0430</button>' +
                            '<button class="a11y-btn" data-setting="letterSpacing" data-value="medium" aria-label="\u0421\u0440\u0435\u0434\u043D\u0438\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B">\u0410 \u0430</button>' +
                            '<button class="a11y-btn" data-setting="letterSpacing" data-value="wide" aria-label="\u0428\u0438\u0440\u043E\u043A\u0438\u0439 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B">\u0410\u00a0 \u0430</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="a11y-group">' +
                        '<span class="a11y-label">\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F</span>' +
                        '<div class="a11y-options">' +
                            '<button class="a11y-btn" data-setting="images" data-value="show" aria-label="\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F">\u0412\u043A\u043B</button>' +
                            '<button class="a11y-btn" data-setting="images" data-value="hide" aria-label="\u0421\u043A\u0440\u044B\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F">\u0412\u044B\u043A\u043B</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="a11y-group a11y-group-reset">' +
                        '<button class="a11y-btn a11y-reset-btn" id="a11yReset" aria-label="\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438">' +
                            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>' +
                            '\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    /* ---- Mobile Menu ---- */
    var mobileMount = document.getElementById('site-mobile-menu-mount');
    if (mobileMount) {
        mobileMount.outerHTML =
            '<div class="mobile-menu" id="mobileMenu">' +
                '<nav class="mobile-nav">' +
                    '<a href="' + hp('#about') + '" class="mobile-nav-link">\u041E \u043A\u043B\u0438\u043D\u0438\u043A\u0435</a>' +
                    '<a href="' + hp('#services') + '" class="mobile-nav-link">\u0423\u0441\u043B\u0443\u0433\u0438</a>' +
                    '<a href="' + hp('#cases') + '" class="mobile-nav-link">\u0420\u0430\u0431\u043E\u0442\u044B</a>' +
                    '<a href="' + hp('#team') + '" class="mobile-nav-link">\u0412\u0440\u0430\u0447\u0438</a>' +
                    '<a href="' + hp('#contact') + '" class="mobile-nav-link">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</a>' +
                    '<a href="tel:+73462330753" class="mobile-nav-phone">+7 (3462) 33-07-53</a>' +
                '</nav>' +
            '</div>';
    }

    /* ---- Footer ---- */
    var footerMount = document.getElementById('site-footer-mount');
    if (footerMount) {
        footerMount.outerHTML =
            '<footer class="site-footer">' +
                '<div class="container">' +
                    '<div class="footer-top">' +
                        '<div class="footer-brand">' +
                            '<div class="footer-logo">' +
                                '<span class="logo-alpha">&#913;</span>' +
                                '<span class="logo-separator">&amp;</span>' +
                                '<span class="logo-omega">&#937;</span>' +
                            '</div>' +
                            '<p class="footer-tagline">\u0421\u0442\u043E\u043C\u0430\u0442\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043A\u043B\u0438\u043D\u0438\u043A\u0430<br>\u043F\u0440\u0435\u043C\u0438\u0443\u043C-\u043A\u043B\u0430\u0441\u0441\u0430</p>' +
                        '</div>' +
                        '<div class="footer-links-grid">' +
                            '<div class="footer-col">' +
                                '<h4 class="footer-heading">\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F</h4>' +
                                '<a href="' + hp('#about') + '">\u041E \u043A\u043B\u0438\u043D\u0438\u043A\u0435</a>' +
                                '<a href="' + hp('#services') + '">\u0423\u0441\u043B\u0443\u0433\u0438</a>' +
                                '<a href="' + hp('#team') + '">\u0412\u0440\u0430\u0447\u0438</a>' +
                                '<a href="' + hp('#contact') + '">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</a>' +
                            '</div>' +
                            '<div class="footer-col">' +
                                '<h4 class="footer-heading">\u0423\u0441\u043B\u0443\u0433\u0438</h4>' +
                                '<a href="' + hp('#services') + '">\u0418\u043C\u043F\u043B\u0430\u043D\u0442\u0430\u0446\u0438\u044F</a>' +
                                '<a href="' + hp('#services') + '">\u041E\u0440\u0442\u043E\u0434\u043E\u043D\u0442\u0438\u044F</a>' +
                                '<a href="' + hp('#services') + '">\u041F\u0440\u043E\u0442\u0435\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435</a>' +
                                '<a href="' + hp('#services') + '">\u041F\u0440\u043E\u0444\u0433\u0438\u0433\u0438\u0435\u043D\u0430</a>' +
                            '</div>' +
                            '<div class="footer-col">' +
                                '<h4 class="footer-heading">\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B</h4>' +
                                '<a href="tel:+73462330753">+7 (3462) 33-07-53</a>' +
                                '<a href="https://aodent.ru" target="_blank" rel="noopener">aodent.ru</a>' +
                                '<span>\u0433. \u0421\u0443\u0440\u0433\u0443\u0442, \u0443\u043B. \u041F\u0440\u043E\u0444\u0441\u043E\u044E\u0437\u043E\u0432, 16</span>' +
                            '</div>' +
                            '<div class="footer-col">' +
                                '<h4 class="footer-heading">\u041F\u0440\u0430\u0432\u043E\u0432\u0430\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F</h4>' +
                                '<a href="/license/">\u041B\u0438\u0446\u0435\u043D\u0437\u0438\u044F</a>' +
                                '<a href="/about-legal/">\u0421\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u043E\u0431 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438</a>' +
                                '<a href="/price-list/">\u041F\u0440\u0435\u0439\u0441\u043A\u0443\u0440\u0430\u043D\u0442</a>' +
                                '<a href="/doctors/">\u0412\u0440\u0430\u0447\u0438</a>' +
                                '<a href="/patients/">\u041F\u0440\u0430\u0432\u0430 \u043F\u0430\u0446\u0438\u0435\u043D\u0442\u043E\u0432</a>' +
                                '<a href="/paid-services/">\u041F\u043B\u0430\u0442\u043D\u044B\u0435 \u0443\u0441\u043B\u0443\u0433\u0438</a>' +
                                '<a href="/vacancies/">\u0412\u0430\u043A\u0430\u043D\u0441\u0438\u0438</a>' +
                                '<a href="/sitemap/">\u041A\u0430\u0440\u0442\u0430 \u0441\u0430\u0439\u0442\u0430</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="footer-bottom">' +
                        '<p>&copy; 2026 \u0410\u043B\u044C\u0444\u0430 \u0438 \u041E\u043C\u0435\u0433\u0430. \u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B.</p>' +
                        '<p>\u041B\u0438\u0446\u0435\u043D\u0437\u0438\u044F &#8470; \u041B\u041E-86-01-001751</p>' +
                    '</div>' +
                '</div>' +
            '</footer>';
    }

    /* ---- Search Modal ---- */
    var searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    searchModal.id = 'searchModal';
    searchModal.setAttribute('role', 'dialog');
    searchModal.setAttribute('aria-label', '\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0441\u0430\u0439\u0442\u0443');
    searchModal.setAttribute('aria-hidden', 'true');
    searchModal.innerHTML =
        '<div class="search-modal-backdrop"></div>' +
        '<div class="search-modal-content">' +
            '<button class="search-modal-close" id="searchModalClose" aria-label="\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0438\u0441\u043A">' +
                '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>' +
            '<div id="pagefindSearch"></div>' +
        '</div>';
    document.body.appendChild(searchModal);

    /* ---- Back to Top ---- */
    var bttMount = document.getElementById('site-back-to-top-mount');
    if (bttMount) {
        bttMount.outerHTML =
            '<button class="back-to-top" id="backToTop" aria-label="\u041D\u0430\u0432\u0435\u0440\u0445">' +
                '<span>&#8593;</span>' +
            '</button>';
    }
})();
