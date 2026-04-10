/* ══════════════════════════════════════════════════
   MAISAI REALTY — Main Script
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Navbar Scroll Effect ── */
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    const handleScroll = () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 40);
        lastScroll = scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });


    /* ── Mobile Hamburger Menu ── */
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        // Close menu when a link is tapped
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }


    /* ── Infinite Circular Carousel ── */
    const track = document.getElementById('carousel-track');
    const prev = document.getElementById('arrow-prev');
    const next = document.getElementById('arrow-next');

    if (track && prev && next) {
        const originals = [...track.querySelectorAll('.property-card')];
        const cardCount = originals.length;

        // Clone all cards and append/prepend for seamless looping
        const clonesAfter = originals.map(c => { const cl = c.cloneNode(true); cl.classList.add('clone'); cl.removeAttribute('data-card'); return cl; });
        const clonesBefore = originals.map(c => { const cl = c.cloneNode(true); cl.classList.add('clone'); cl.removeAttribute('data-card'); return cl; });

        // Remove entry animation from clones so they don't re-animate
        [...clonesAfter, ...clonesBefore].forEach(cl => { cl.style.opacity = '1'; cl.style.transform = 'none'; cl.style.animation = 'none'; });

        clonesBefore.reverse().forEach(cl => track.prepend(cl));
        clonesAfter.forEach(cl => track.append(cl));

        const getGap = () => parseInt(getComputedStyle(track).gap) || 18;
        const getCardWidth = () => {
            const card = track.querySelector('.property-card');
            return card ? card.offsetWidth + getGap() : 320;
        };

        // Jump to real first card (skipping prepended clones) — no animation
        const jumpToReal = () => {
            track.style.scrollBehavior = 'auto';
            track.scrollLeft = cardCount * getCardWidth();
            // Restore smooth for user interactions
            requestAnimationFrame(() => { track.style.scrollBehavior = 'smooth'; });
        };

        // Initial position — after entry animations finish
        setTimeout(jumpToReal, 2000);

        let isScrolling = false;

        const checkBounds = () => {
            isScrolling = false;
            const cardW = getCardWidth();
            const minScroll = 0;
            const maxScroll = track.scrollWidth - track.clientWidth;
            const realStart = cardCount * cardW;
            const realEnd = realStart + cardCount * cardW;

            // Past the end clones → jump back to real start
            if (track.scrollLeft >= realEnd - cardW * 0.5) {
                track.style.scrollBehavior = 'auto';
                track.scrollLeft = realStart + (track.scrollLeft - realEnd);
                requestAnimationFrame(() => { track.style.scrollBehavior = 'smooth'; });
            }
            // Before the start clones → jump to real end
            else if (track.scrollLeft <= realStart - cardW * 0.5) {
                track.style.scrollBehavior = 'auto';
                track.scrollLeft = realEnd - (realStart - track.scrollLeft);
                requestAnimationFrame(() => { track.style.scrollBehavior = 'smooth'; });
            }
        };

        let scrollTimer;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(checkBounds, 120);
        }, { passive: true });

        next.addEventListener('click', () => {
            track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
        });

        prev.addEventListener('click', () => {
            track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
        });
    }


    /* ── Smooth Scroll for Nav Links ── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
