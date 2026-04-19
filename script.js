/*
    Back on Track Counselling - Interactive JavaScript
    Handles form submissions, navigation, and dynamic features
*/

// ========================================
// FORM HANDLING
// ========================================

// Handle booking form submission
function handleBookingSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        counsellor: document.getElementById('counsellor').value,
        format: document.querySelector('input[name="format"]:checked').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        issues: document.getElementById('issues').value,
    };

    // Validate form
    if (!validateBookingForm(formData)) {
        return;
    }

    // Show success message
    showSuccessMessage('Your session has been booked successfully! We will confirm your appointment within 24 hours.');
    
    // Log form data (in real app, would send to server)
    console.log('Booking submitted:', formData);
    
    // Reset form
    event.target.reset();
}

// Validate booking form
function validateBookingForm(data) {
    if (!data.name || !data.email || !data.phone) {
        showErrorMessage('Please fill in all required fields.');
        return false;
    }

    if (!validateEmail(data.email)) {
        showErrorMessage('Please enter a valid email address.');
        return false;
    }

    if (!data.service || !data.format || !data.date || !data.time) {
        showErrorMessage('Please complete all booking details.');
        return false;
    }

    return true;
}

// Handle newsletter subscription
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;

    if (!validateEmail(email)) {
        showErrorMessage('Please enter a valid email address.');
        return;
    }

    showSuccessMessage('Thank you for subscribing! Check your email for a welcome message.');
    event.target.reset();
    console.log('Newsletter subscription:', email);
}

// ========================================
// VALIDATION UTILITIES
// ========================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? '✓' : '✕';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add styles if not already in CSS
    if (!document.querySelector('style[data-notifications]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notifications', 'true');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                z-index: 9999;
                animation: slideIn 0.3s ease-out;
                max-width: 400px;
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .notification-success {
                background: #2ECC71;
                color: white;
                border-left: 5px solid #27AE60;
            }

            .notification-error {
                background: #E74C3C;
                color: white;
                border-left: 5px solid #C0392B;
            }

            .notification-icon {
                font-weight: bold;
                font-size: 1.2rem;
            }

            .notification-message {
                flex-grow: 1;
            }

            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 1.5rem;
                padding: 0;
                line-height: 1;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @media (max-width: 480px) {
                .notification {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ========================================
// NAVIGATION HELPERS
// ========================================

// Update active navigation link
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ========================================
// ACCORDION FOR FAQ (if needed)
// ========================================

function setupAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h4');
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
    });
}

// ========================================
// LAZY LOADING & ANIMATIONS
// ========================================

// Intersection Observer for fade-in animations
function setupIntersectionObserver() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observe all cards and sections with animations
    document.querySelectorAll(
        '.feature-card, .service-item, .testimonial-card, .team-member, .blog-post, .faq-item'
    ).forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// MOBILE MENU TOGGLE
// ========================================

function setupMobileMenu() {
    // Create hamburger button if on mobile
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!document.querySelector('.hamburger')) {
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        
        // Add styles for mobile menu
        if (!document.querySelector('style[data-mobile-menu]')) {
            const style = document.createElement('style');
            style.setAttribute('data-mobile-menu', 'true');
            style.textContent = `
                .hamburger {
                    display: none;
                    flex-direction: column;
                    background: none;
                    border: none;
                    cursor: pointer;
                    gap: 5px;
                    padding: 0;
                }

                .hamburger span {
                    width: 25px;
                    height: 3px;
                    background: white;
                    border-radius: 2px;
                    transition: all 0.3s ease;
                }

                .hamburger.active span:nth-child(1) {
                    transform: rotate(45deg) translate(8px, 8px);
                }

                .hamburger.active span:nth-child(2) {
                    opacity: 0;
                }

                .hamburger.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(8px, -8px);
                }

                @media (max-width: 768px) {
                    .hamburger {
                        display: flex;
                    }

                    .nav-menu {
                        position: absolute;
                        top: 70px;
                        left: 0;
                        right: 0;
                        background: #2C3E50;
                        flex-direction: column !important;
                        align-items: center !important;
                        gap: 1rem !important;
                        padding: 1rem 0 !important;
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height 0.3s ease;
                    }

                    .nav-menu.active {
                        max-height: 400px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navbar.querySelector('.nav-brand').parentElement.appendChild(hamburger);
    }
}

// ========================================
// FORM DATE VALIDATION
// ========================================

function setupDateValidation() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Disable weekends if desired (uncomment to enable)
        // dateInput.addEventListener('change', function() {
        //     const selectedDate = new Date(this.value);
        //     if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
        //         alert('Please select a weekday');
        //         this.value = '';
        //     }
        // });
    }
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================

function setupScrollToTop() {
    if (!document.querySelector('#scrollToTop')) {
        const button = document.createElement('button');
        button.id = 'scrollToTop';
        button.innerHTML = '↑';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FF6B6B, #FF5252);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            font-size: 24px;
            z-index: 999;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        `;

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.display = 'flex';
                button.style.alignItems = 'center';
                button.style.justifyContent = 'center';
            } else {
                button.style.display = 'none';
            }
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-5px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });

        document.body.appendChild(button);
    }
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Run initialization functions
    updateActiveNavLink();
    setupSmoothScroll();
    setupIntersectionObserver();
    setupMobileMenu();
    setupDateValidation();
    setupScrollToTop();
    setupAccordions();

    // Log initialization
    console.log('Back on Track Counselling website initialized');
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format phone number
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) return phoneNumber;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Add animation class on scroll
function addScrollAnimation() {
    const elements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    });
    elements.forEach(el => observer.observe(el));
}

// ========================================
// KEYBOARD SHORTCUTS (Optional)
// ========================================

document.addEventListener('keydown', function(event) {
    // Press / to focus search (if search exists)
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
        event.preventDefault();
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) searchInput.focus();
    }

    // Press Escape to close mobile menu
    if (event.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ========================================
// ANALYTICS TRACKING (Optional)
// ========================================

// Simple page tracking (replace with your analytics code)
function trackPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'YOUR_GA_ID', {
            'page_path': window.location.pathname
        });
    }
}

// Track user interactions
function setupEventTracking() {
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', () => {
            console.log('Primary CTA clicked:', button.textContent);
        });
    });
}

// Run tracking on load
document.addEventListener('DOMContentLoaded', setupEventTracking);

// ========================================
// RESPONSIVE BEHAVIOR
// ========================================

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});
