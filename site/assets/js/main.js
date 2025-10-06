// BeğonTech - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Hide page loader when DOM is ready
    const loader = document.getElementById('pageLoader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        });
    }
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('mobile-menu-show');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to header
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Service cards hover animation enhancement
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Contact form validation (if exists)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // ...existing code...
        });
    }
    // ...existing code...

    // Smart Home Device Dots Popup Logic
    const hotspots = document.querySelectorAll('.hotspot');
    const popup = document.getElementById('devicePopup');
    if (hotspots.length && popup) {
        hotspots.forEach(dot => {
            dot.addEventListener('mouseenter', function(e) {
                const device = dot.getAttribute('data-device');
                const detail = dot.getAttribute('data-detail');
                popup.innerHTML = `<strong>${device}</strong><br><span>${detail}</span>`;
                popup.style.display = 'block';
                popup.style.position = 'fixed';
                // Position popup near the dot
                const dotRect = dot.getBoundingClientRect();
                setTimeout(() => {
                    const popupRect = popup.getBoundingClientRect();
                    let top, left;
                    const offset = 12;
                    // Prefer above the dot
                    if (dotRect.top - popupRect.height - offset > 0) {
                        top = dotRect.top - popupRect.height - offset;
                    } else {
                        // If not enough space above, show below
                        top = dotRect.bottom + offset;
                    }
                    // Center horizontally to dot
                    left = dotRect.left + dotRect.width / 2 - popupRect.width / 2;
                    // Prevent off-screen
                    if (left + popupRect.width > window.innerWidth) {
                        left = window.innerWidth - popupRect.width - 10;
                    }
                    if (left < 0) {
                        left = 10;
                    }
                    popup.style.top = top + 'px';
                    popup.style.left = left + 'px';
                }, 0);
            });
            dot.addEventListener('mouseleave', function(e) {
                popup.style.display = 'none';
            });
        });
        // Hide popup on scroll or click elsewhere
        window.addEventListener('scroll', () => { popup.style.display = 'none'; });
        document.body.addEventListener('click', (e) => {
            if (!e.target.classList.contains('hotspot')) popup.style.display = 'none';
        });
    }
    
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.service-card, .hero-content');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});