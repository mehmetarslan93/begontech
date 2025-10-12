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
    
    // Smooth scrolling for anchor links (only if href still starts with # at click time)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href') || '';
            // If the link was later changed to an absolute/relative URL, do nothing
            if (!href.startsWith('#')) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to header (guard in case header is loaded asynchronously by partials)
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    if (header) {
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                header.classList.add('shadow-lg');
            } else {
                header.classList.remove('shadow-lg');
            }

            lastScrollY = currentScrollY;
        });
    } else {
        // Header partial may be loaded later; attempt to attach when header appears
        document.addEventListener('DOMContentLoaded', () => {
            const hdr = document.querySelector('header');
            if (!hdr) return;
            window.addEventListener('scroll', function() {
                const currentScrollY = window.scrollY;
                if (currentScrollY > 100) hdr.classList.add('shadow-lg');
                else hdr.classList.remove('shadow-lg');
            });
        });
    }
    
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
        // Small timeout so user can move cursor from hotspot to popup without it closing
        let hideTimeout = null;
        const HIDE_DELAY = 250; // ms

        hotspots.forEach(dot => {
            dot.addEventListener('mouseenter', function(e) {
                const device = dot.getAttribute('data-device');
                const detail = dot.getAttribute('data-detail');
                const image = dot.getAttribute('data-image');
                const usage = dot.getAttribute('data-usage');
                // Allow per-hotspot override for preview image width via data-image-width (e.g. "160px" or "160")
                let imageWidth = dot.getAttribute('data-image-width') || dot.getAttribute('data-image-size') || '220px';
                if (/^\d+$/.test(imageWidth)) imageWidth = imageWidth + 'px';
                // Build popup content, include image and usage if provided
                let content = `<div style="max-width:320px;"><strong>${device}</strong><br><span>${detail}</span>`;
                if (image) {
                    // centered preview image for hotspot popup; width can be overridden per-hotspot
                    content += `<div style="margin-top:12px;display:flex;align-items:center;justify-content:center"><img src="${image}" alt="${device}" style="width:${imageWidth};max-width:80%;height:auto;object-fit:contain;border-radius:6px;box-shadow:0 6px 16px rgba(0,0,0,0.12);"/></div>`;
                }
                if (usage) {
                    content += `<div style="margin-top:8px;color:#374151;font-size:14px;">${usage}</div>`;
                }

                // Add action buttons if product id or detail url provided
                const prodId = dot.getAttribute('data-id');
                const detailUrl = dot.getAttribute('data-detail-url');
                if (prodId || detailUrl) {
                    content += `<div style="margin-top:10px;display:flex;gap:8px;justify-content:center">`;
                    if (prodId) {
                        // Primary action button matching site primary gradient
                        content += `<button id="add-to-cart-btn" data-prod-id="${prodId}" class="btn-popup btn-primary" style="color:white;border:none;cursor:pointer">Sepete Ekle</button>`;
                    }
                    if (detailUrl) {
                        // Outline / secondary button matching site outline style
                        content += `<a id="view-details-btn" href="${detailUrl}" class="btn-popup btn-outline">Ürünü Görüntüle</a>`;
                    }
                    content += `</div>`;
                }

                content += `</div>`;
                popup.innerHTML = content;
                // Clear any pending hide request and show popup
                if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
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
                // Delay hiding so the user can move pointer to the popup
                hideTimeout = setTimeout(() => { popup.style.display = 'none'; hideTimeout = null; }, HIDE_DELAY);
            });
        });
        // Keep popup visible while hovering over it
        popup.addEventListener('mouseenter', () => {
            if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
        });
        popup.addEventListener('mouseleave', () => {
            // When leaving the popup, hide after the same delay
            hideTimeout = setTimeout(() => { popup.style.display = 'none'; hideTimeout = null; }, HIDE_DELAY);
        });
        // Hide popup on scroll or click elsewhere
        window.addEventListener('scroll', () => { popup.style.display = 'none'; });
        document.body.addEventListener('click', (e) => {
            // If click is not on a hotspot and not inside the popup, hide it
            const clickedHotspot = e.target.closest && e.target.closest('.hotspot');
            if (!clickedHotspot && !popup.contains(e.target)) popup.style.display = 'none';
        });
        // Delegated handler for Add to Cart button inside popup
        popup.addEventListener('click', function(e) {
            const addBtn = e.target.closest('#add-to-cart-btn');
            if (addBtn) {
                const pid = addBtn.getAttribute('data-prod-id');
                if (!pid) return;
                // read product metadata if present
                const pname = addBtn.getAttribute('data-prod-name') || addBtn.closest('[data-prod-name]')?.getAttribute('data-prod-name') || addBtn.closest('.hotspot')?.getAttribute('data-name') || pid;
                const pprice = addBtn.getAttribute('data-prod-price') || addBtn.closest('[data-prod-price]')?.getAttribute('data-prod-price') || addBtn.closest('.hotspot')?.getAttribute('data-price') || null;
                // Read basket from localStorage using the products page key
                let basket = [];
                try {
                    basket = JSON.parse(localStorage.getItem('begon_basket') || '[]');
                } catch (err) { basket = []; }
                const existing = basket.find(i => i.id === pid);
                if (existing) existing.qty += 1;
                else basket.push({ id: pid, name: pname, price: pprice, qty: 1 });
                localStorage.setItem('begon_basket', JSON.stringify(basket));
                // Update simple badges if present
                try {
                    const total = basket.reduce((s, i) => s + (i.qty||0), 0);
                    const basketCountElNow = document.getElementById('basket-count');
                    const mobileBasketCountNow = document.getElementById('mobile-basket-count');
                    const headerCount = document.getElementById('header-basket-count') || document.querySelector('[data-basket-count]');
                    if (basketCountElNow) basketCountElNow.textContent = String(total);
                    if (mobileBasketCountNow) mobileBasketCountNow.textContent = String(total);
                    if (headerCount) headerCount.textContent = String(total);
                } catch (_) {}
                // Show a transient confirmation inside popup
                const confirmEl = document.createElement('div');
                confirmEl.style.marginTop = '8px';
                confirmEl.style.textAlign = 'center';
                confirmEl.style.color = '#065f46';
                confirmEl.style.fontWeight = '600';
                confirmEl.innerText = 'Sepete eklendi. Ürünler sayfasından sepete erişebilirsiniz. ✔';
                popup.appendChild(confirmEl);
                setTimeout(() => { if (confirmEl && confirmEl.parentNode) confirmEl.parentNode.removeChild(confirmEl); }, 2000);
            }
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