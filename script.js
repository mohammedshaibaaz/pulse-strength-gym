'use strict';

/**
 * MOBILE MENU TOGGLE
 * Handle hamburger menu for mobile devices with Escape/resize close
 */
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    const setMenuState = (isOpen) => {
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        navMenu.setAttribute('aria-expanded', String(isOpen));
    };

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        setMenuState(!isExpanded);
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenuState(false));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            setMenuState(false);
        }
    });

    // Close on Escape for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setMenuState(false);
        }
    });

    // Close if resizing to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            setMenuState(false);
        }
    });
}

/**
 * Smooth scroll behavior for navigation links
 * Provides accessible keyboard and mouse navigation
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Use smooth scroll with fallback
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                // Set focus for keyboard users
                target.focus({ preventScroll: true });
            }
        }
    });
});

/**
 * Intersection Observer for scroll-based animations
 * Improves performance by observing viewport intersection
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Remove will-change after animation for performance
            setTimeout(() => {
                entry.target.style.willChange = 'auto';
            }, 600);
        }
    });
}, observerOptions);

// Observe elements for scroll animations
const animatedElements = document.querySelectorAll(
    '.program-card, .process-step, .pricing-card, .faq-item'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 600ms ease, transform 600ms ease';
    el.style.willChange = 'transform, opacity';
    observer.observe(el);
});

/**
 * STATS COUNTER ANIMATION
 * Animates numbers from 0 to target value on scroll
 */
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.count);
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
            statsObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
    statsObserver.observe(el);
});

/**
 * TESTIMONIAL CAROUSEL
 * Navigate between testimonials with next/prev buttons
 */
const carousel = document.querySelector('.testimonials-carousel');
if (carousel) {
    const cards = Array.from(document.querySelectorAll('.testimonial-card'));
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    if (cards.length > 0) {
        let currentIndex = 0;

        const showCard = (index) => {
            cards.forEach((card, i) => {
                if (i === index) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        };

        const nextCard = () => {
            currentIndex = (currentIndex + 1) % cards.length;
            showCard(currentIndex);
        };

        const prevCard = () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            showCard(currentIndex);
        };

        if (nextBtn) nextBtn.addEventListener('click', nextCard);
        if (prevBtn) prevBtn.addEventListener('click', prevCard);

        // Auto-rotate testimonials every 8 seconds
        setInterval(nextCard, 8000);
    }
}

/**
 * FAQ ACCORDION
 * Enhance details element behavior
 */
const faqItems = document.querySelectorAll('.faq-item');
const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersReducedMotion = prefersReducedMotionQuery.matches;

const setFaqHeight = (faq, isOpen) => {
    const answer = faq.querySelector('.faq-answer');
    if (!answer) return;
    const targetHeight = answer.scrollHeight + 8;

    if (prefersReducedMotion) {
        answer.style.maxHeight = isOpen ? `${targetHeight}px` : '0px';
        answer.style.opacity = isOpen ? '1' : '0';
        return;
    }

    if (isOpen) {
        // Reset to 0 then animate to target for consistent open animation every time
        answer.style.maxHeight = '0px';
        answer.style.opacity = '0';
        // Force reflow
        // eslint-disable-next-line no-unused-expressions
        answer.offsetHeight;
        requestAnimationFrame(() => {
            answer.style.maxHeight = `${targetHeight}px`;
            answer.style.opacity = '1';
        });
    } else {
        // Set current height then collapse smoothly
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        answer.style.opacity = '1';
        // Force reflow
        // eslint-disable-next-line no-unused-expressions
        answer.offsetHeight;
        requestAnimationFrame(() => {
            answer.style.maxHeight = '0px';
            answer.style.opacity = '0';
        });
    }
};

faqItems.forEach(item => {
    const answer = item.querySelector('.faq-answer');
    if (answer) {
        answer.setAttribute('tabindex', '-1');
    }

    // Initialize heights based on default open state
    setFaqHeight(item, item.open);

    item.addEventListener('toggle', () => {
        if (item.open) {
            setFaqHeight(item, true);

            // Focus answer for keyboard users
            if (answer) {
                answer.focus({ preventScroll: true });
            }

            // Smooth scroll on mobile to keep opened item in view
            if (window.innerWidth < 768) {
                item.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            setFaqHeight(item, false);
        }
    });
});

/**
 * CONTACT FORM VALIDATION & SUBMISSION
 * Client-side validation with error handling
 */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateForm = () => {
        let isValid = true;
        const name = document.getElementById('contact-name');
        const email = document.getElementById('contact-email');
        const message = document.getElementById('contact-message');
        const interest = document.getElementById('contact-interest');

        // Clear previous errors
        contactForm.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });

        // Validate name
        if (!name || !name.value.trim()) {
            showError('contact-name', 'Please enter your name');
            isValid = false;
        }

        // Validate email
        if (!email || !email.value.trim()) {
            showError('contact-email', 'Please enter your email');
            isValid = false;
        } else if (!validateEmail(email.value)) {
            showError('contact-email', 'Please enter a valid email');
            isValid = false;
        }

        // Validate message
        if (!message || !message.value.trim()) {
            showError('contact-message', 'Please enter a message');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError('contact-message', 'Message must be at least 10 characters');
            isValid = false;
        }

        // Validate interest
        if (!interest || !interest.value) {
            showError('contact-interest', 'Please select an interest');
            isValid = false;
        }

        return isValid;
    };

    const showError = (fieldId, message) => {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(fieldId.replace('contact-', '') + '-error');
        
        if (field) {
            const group = field.closest('.form-group');
            if (group) {
                group.classList.add('error');
            }
        }
        
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const statusEl = document.getElementById('form-status');
        
        try {
            // Simulate form submission (replace with actual API call)
            if (statusEl) statusEl.textContent = 'Sending...';

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Success response
            if (statusEl) {
                statusEl.textContent = '✓ Message sent successfully! We\'ll be in touch soon.';
                statusEl.classList.add('success');
            }
            contactForm.reset();

            // Clear success message after 5 seconds
            setTimeout(() => {
                if (statusEl) {
                    statusEl.textContent = '';
                    statusEl.className = '';
                }
            }, 5000);

        } catch (error) {
            if (statusEl) {
                statusEl.textContent = '✗ Error sending message. Please try again.';
                statusEl.classList.add('error');
            }
        }
    });

    // Clear error messages on input
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', () => {
            const errorEl = document.getElementById(field.name + '-error');
            const group = field.closest('.form-group');
            if (errorEl) {
                errorEl.classList.remove('show');
            }
            if (group) {
                group.classList.remove('error');
            }
        });
    });
}

/**
 * PRICING TOGGLE
 * Switch between monthly and annual billing
 */
const billingToggle = document.getElementById('billing-toggle');
if (billingToggle) {
    billingToggle.addEventListener('change', (e) => {
        const isAnnual = e.target.checked;
        
        document.querySelectorAll('.price-monthly').forEach(el => {
            el.style.display = isAnnual ? 'none' : 'inline';
        });
        
        document.querySelectorAll('.price-annual').forEach(el => {
            el.style.display = isAnnual ? 'inline' : 'none';
        });
        
        document.querySelectorAll('.period-monthly').forEach(el => {
            el.style.display = isAnnual ? 'none' : 'inline';
        });
        
        document.querySelectorAll('.period-annual').forEach(el => {
            el.style.display = isAnnual ? 'inline' : 'none';
        });
    });
}

/**
 * Video lazy loading optimization
 * Only plays videos when they enter the viewport
 */
if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            video.classList.add('loaded');
                        })
                        .catch(error => {
                            console.log('Video autoplay prevented:', error);
                        });
                }
                videoObserver.unobserve(video);
            }
        });
    }, { rootMargin: '50px' });

    document.querySelectorAll('video[loading="lazy"]').forEach(video => {
        videoObserver.observe(video);
    });
}

/**
 * Handle reduced motion preference
 * Respects user's accessibility settings
 */
if (prefersReducedMotionQuery.matches) {
    document.querySelectorAll('video[autoplay]').forEach(video => {
        video.removeAttribute('autoplay');
    });
}

/**
 * Add loaded class to lazy-loaded images for fade-in effect
 */
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
}

/**
 * Skip to main content functionality
 * Ensures proper focus management for keyboard users
 */
const skipLink = document.querySelector('.skip-to-main');
if (skipLink) {
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.tabIndex = -1;
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

/**
 * Error handling for failed video loads
 * Provides graceful degradation
 */
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('error', function(e) {
        console.warn('Video failed to load:', this.src);
        this.style.display = 'none';
    });
});

/**
 * Performance monitoring (for development)
 * Can be removed in production or used with analytics
 */
if ('PerformanceObserver' in window) {
    try {
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
        console.warn('Performance observer failed:', error);
    }
}

/**
 * CTA Navigation → Contact Form
 * Scrolls to the contact form and preselects the interest dropdown
 */
(function setupCTANavigation() {
    const formSection = document.querySelector('.contact-section');
    const interestSelect = document.getElementById('contact-interest');

    const interestLabels = {
        'free-trial': 'Free Trial',
        'get-started': 'Get Started',
        'tour': 'Schedule a Tour'
    };

    const navigateToFormWithInterest = (value) => {
        if (!formSection) return;

        if (interestSelect) {
            // Ensure option exists (in case of future content changes)
            const exists = Array.from(interestSelect.options).some(opt => opt.value === value);
            if (!exists) {
                const opt = document.createElement('option');
                opt.value = value;
                opt.textContent = interestLabels[value] || value;
                interestSelect.appendChild(opt);
            }
            interestSelect.value = value;
        }

        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (interestSelect) interestSelect.focus({ preventScroll: true });
    };

    // Attach handlers to relevant buttons by label
    const buttons = Array.from(document.querySelectorAll('button'));
    buttons.forEach(btn => {
        const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
        const text = (btn.textContent || '').toLowerCase();
        const label = `${aria} ${text}`.trim();

        if (label.includes('free trial')) {
            btn.addEventListener('click', () => navigateToFormWithInterest('free-trial'));
        } else if (label.includes('schedule a tour')) {
            btn.addEventListener('click', () => navigateToFormWithInterest('tour'));
        } else if (label.includes('get started')) {
            btn.addEventListener('click', () => navigateToFormWithInterest('get-started'));
        }
    });
})();
