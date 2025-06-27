// Natural History Museum - Custom JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSmoothScrolling();
    initNavbarEffects();
    initAnimations();
    initContactForm();
    initMembershipCards();
    initImageLazyLoading();
    initAccessibility();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active nav link
                updateActiveNavLink(this.getAttribute('href'));
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink(targetId) {
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`a[href="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Navbar effects on scroll
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Change navbar background on scroll
        if (scrollTop > 50) {
            navbar.style.backgroundColor = 'rgba(33, 37, 41, 0.95)';
            navbar.classList.add('scrolled');
        } else {
            navbar.style.backgroundColor = 'rgba(33, 37, 41, 0.8)';
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;

        // Update active section in navigation
        updateActiveSection();
    });
}

// Update active section based on scroll position
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            updateActiveNavLink(`#${sectionId}`);
        }
    });
}

// Initialize scroll animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.card, .collection-card, .event-card, .info-card, .membership-card, .exhibit-feature'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Stagger animation for cards in the same row
    const cardRows = document.querySelectorAll('.row');
    cardRows.forEach(row => {
        const cards = row.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const formObject = {};
            
            // Convert FormData to object
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form
            if (validateContactForm(formObject)) {
                submitContactForm(formObject);
            }
        });

        // Real-time validation
        const requiredFields = contactForm.querySelectorAll('input[required], textarea[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

// Validate contact form
function validateContactForm(data) {
    let isValid = true;
    const errors = [];

    // Check required fields
    if (!data.firstName || data.firstName.trim() === '') {
        showFieldError('firstName', 'First name is required');
        isValid = false;
    }

    if (!data.lastName || data.lastName.trim() === '') {
        showFieldError('lastName', 'Last name is required');
        isValid = false;
    }

    if (!data.email || data.email.trim() === '') {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }

    if (!data.message || data.message.trim() === '') {
        showFieldError('message', 'Message is required');
        isValid = false;
    }

    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.getAttribute('id');

    clearFieldError(field);

    if (field.hasAttribute('required') && !value) {
        showFieldError(field.id, `${getFieldLabel(field)} is required`);
        return false;
    }

    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field.id, 'Please enter a valid email address');
        return false;
    }

    return true;
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`) || createErrorElement(fieldId);
    
    field.classList.add('is-invalid');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Clear field error
function clearFieldError(field) {
    const fieldId = field.id;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    field.classList.remove('is-invalid');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Create error element
function createErrorElement(fieldId) {
    const errorElement = document.createElement('div');
    errorElement.id = `${fieldId}-error`;
    errorElement.className = 'invalid-feedback d-block';
    errorElement.style.display = 'none';
    
    const field = document.getElementById(fieldId);
    field.parentNode.appendChild(errorElement);
    
    return errorElement;
}

// Get field label
function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace('*', '').trim() : field.getAttribute('placeholder') || 'Field';
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Submit contact form
function submitContactForm(data) {
    // Show loading state
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        showSuccessMessage('Thank you for your message! We will get back to you within 2 business days.');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Clear any validation errors
        document.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });
        document.querySelectorAll('.invalid-feedback').forEach(error => {
            error.style.display = 'none';
        });
    }, 2000);
}

// Show success message
function showSuccessMessage(message) {
    const alertElement = document.createElement('div');
    alertElement.className = 'alert alert-success alert-dismissible fade show';
    alertElement.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(alertElement, form);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.remove();
        }
    }, 5000);
}

// Membership card interactions
function initMembershipCards() {
    const membershipCards = document.querySelectorAll('.membership-card');
    
    membershipCards.forEach(card => {
        const button = card.querySelector('button');
        
        button.addEventListener('click', function() {
            const membershipType = this.textContent.replace('Choose ', '');
            handleMembershipSelection(membershipType);
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('featured') ? 
                'scale(1.08) translateY(-5px)' : 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('featured') ? 
                'scale(1.05)' : 'translateY(0)';
        });
    });
}

// Handle membership selection
function handleMembershipSelection(membershipType) {
    // Create modal or redirect to membership page
    showMembershipModal(membershipType);
}

// Show membership modal
function showMembershipModal(membershipType) {
    const modalHtml = `
        <div class="modal fade" id="membershipModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-star me-2"></i>${membershipType} Membership
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <i class="bi bi-check-circle text-success fs-1"></i>
                            <h4 class="mt-3">Great Choice!</h4>
                            <p class="lead">You've selected the ${membershipType} membership package.</p>
                        </div>
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            This is a demo website. In a real implementation, this would redirect to a secure payment processor.
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <h6>Next Steps:</h6>
                                <ul class="list-unstyled">
                                    <li><i class="bi bi-1-circle me-2"></i>Complete application form</li>
                                    <li><i class="bi bi-2-circle me-2"></i>Secure payment processing</li>
                                    <li><i class="bi bi-3-circle me-2"></i>Receive membership card</li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h6>Questions?</h6>
                                <p class="small">Contact our membership team:</p>
                                <p class="small mb-1"><i class="bi bi-telephone me-2"></i>+44 20 7123 4567</p>
                                <p class="small"><i class="bi bi-envelope me-2"></i>membership@museum.ac.uk</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">
                            <i class="bi bi-credit-card me-2"></i>Proceed to Application
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if present
    const existingModal = document.getElementById('membershipModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('membershipModal'));
    modal.show();
}

// Lazy loading for images
function initImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Accessibility enhancements
function initAccessibility() {
    // Add skip to main content link
    addSkipToMainLink();
    
    // Enhanced keyboard navigation
    initKeyboardNavigation();
    
    // ARIA live regions for dynamic content
    addLiveRegions();
    
    // Focus management for modals
    manageFocusForModals();
}

// Add skip to main content link
function addSkipToMainLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only sr-only-focusable btn btn-primary';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '10px';
    skipLink.style.left = '10px';
    skipLink.style.zIndex = '9999';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('main') || document.querySelector('.hero-section');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('tabindex', '-1');
    }
}

// Enhanced keyboard navigation
function initKeyboardNavigation() {
    // ESC key handling
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                const modalInstance = bootstrap.Modal.getInstance(openModal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        }
    });

    // Improve focus visibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Add ARIA live regions
function addLiveRegions() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
}

// Announce message to screen readers
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// Focus management for modals
function manageFocusForModals() {
    document.addEventListener('shown.bs.modal', function(e) {
        const modal = e.target;
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance monitoring
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart);
        });
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, you would send this to an error reporting service
});

// Initialize performance monitoring
initPerformanceMonitoring();
