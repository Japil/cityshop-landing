// Cross-browser compatible smooth scroll function
function smoothScrollTo(target) {
    const element = document.getElementById(target);
    if (!element) return;
    
    // Try modern smooth scroll first
    if ('scrollBehavior' in document.documentElement.style) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        // Fallback for older browsers
        const targetPosition = element.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;
        
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function
            const ease = percentage < 0.5 ? 2 * percentage * percentage : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        }
        
        window.requestAnimationFrame(step);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initScrollAnimations();
    initFormHandling();
    initSmoothScrolling();
    initModelSelection();
    initImageErrorHandling();
    initScrollProgress();
    
    // Add loading state management
    document.body.classList.add('loaded');
});

// Scroll animations with improved browser support
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: just show all elements
        const elementsToShow = document.querySelectorAll('.fade-in');
        elementsToShow.forEach(element => {
            element.classList.add('visible');
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to elements
    const elementsToAnimate = [
        '.step',
        '.model-card',
        '.advantage', 
        '.review',
        '.demo-image'
    ];

    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.transitionDelay = (index * 0.1) + 's';
            observer.observe(element);
        });
    });
}

// Enhanced form handling with better validation
function initFormHandling() {
    const form = document.getElementById('orderForm');
    
    if (!form) return;
    
    // Add input event listeners for real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const orderData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            model: formData.get('model'),
            address: formData.get('address'),
            consent: formData.get('consent')
        };
        
        // Validate form
        if (validateForm(orderData)) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showSuccessMessage();
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });
}

// Individual field validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch(field.type) {
        case 'text':
            if (field.name === 'name' && value.length < 2) {
                isValid = false;
                errorMessage = 'Введите корректное имя';
            }
            break;
        case 'tel':
            if (!/^\+?[\d\s\-\(\)]{10,}$/.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный номер телефона';
            }
            break;
        case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный email';
            }
            break;
        case 'select-one':
            if (!value) {
                isValid = false;
                errorMessage = 'Выберите модель';
            }
            break;
        case 'textarea':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Введите полный адрес доставки';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#dc2626';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = '#dc2626';
}

// Clear field error
function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.style.borderColor = '';
}

// Enhanced form validation
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Введите корректное имя');
    }
    
    if (!data.phone || !/^\+?[\d\s\-\(\)]{10,}$/.test(data.phone)) {
        errors.push('Введите корректный номер телефона');
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Введите корректный email');
    }
    
    if (!data.model) {
        errors.push('Выберите модель');
    }
    
    if (!data.address || data.address.trim().length < 10) {
        errors.push('Введите полный адрес доставки');
    }
    
    if (!data.consent) {
        errors.push('Необходимо согласие на обработку данных');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors);
        return false;
    }
    
    return true;
}

// Show success message with better styling
function showSuccessMessage() {
    if (document.querySelector('.success-message')) return;
    
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div class="message-content">
            <div class="success-icon">✓</div>
            <h3>Заказ успешно отправлен!</h3>
            <p>Мы свяжемся с вами в течение 30 минут для подтверждения заказа.</p>
            <button onclick="this.parentElement.parentElement.remove()" class="btn btn--primary">Закрыть</button>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Add styles if not already added
    if (!document.querySelector('#success-message-styles')) {
        const style = document.createElement('style');
        style.id = 'success-message-styles';
        style.textContent = `
            .success-message {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.75);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease-out;
                backdrop-filter: blur(4px);
            }
            
            .message-content {
                background: white;
                padding: 2.5rem;
                border-radius: 16px;
                text-align: center;
                max-width: 400px;
                margin: 0 1rem;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                animation: slideIn 0.3s ease-out;
            }
            
            .success-icon {
                width: 60px;
                height: 60px;
                background: #059669;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                font-weight: bold;
                margin: 0 auto 1.5rem;
            }
            
            .message-content h3 {
                color: #059669;
                margin: 0 0 1rem 0;
                font-size: 1.5rem;
            }
            
            .message-content p {
                margin: 0 0 2rem 0;
                color: #666;
                line-height: 1.6;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { opacity: 0; transform: scale(0.9) translateY(-20px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Show error message
function showErrorMessage(errors) {
    if (document.querySelector('.error-message')) return;
    
    const message = document.createElement('div');
    message.className = 'error-message';
    message.innerHTML = `
        <div class="message-content error">
            <div class="error-icon">⚠</div>
            <h3>Ошибка в заполнении формы</h3>
            <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
            <button onclick="this.parentElement.parentElement.remove()" class="btn btn--primary">Исправить</button>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Add styles if not already added
    if (!document.querySelector('#error-message-styles')) {
        const style = document.createElement('style');
        style.id = 'error-message-styles';
        style.textContent = `
            .error-message {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.75);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease-out;
                backdrop-filter: blur(4px);
            }
            
            .error-icon {
                width: 60px;
                height: 60px;
                background: #dc2626;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                font-weight: bold;
                margin: 0 auto 1.5rem;
            }
            
            .message-content.error h3 {
                color: #dc2626;
                margin: 0 0 1rem 0;
            }
            
            .message-content.error ul {
                text-align: left;
                margin: 0 0 2rem 0;
                padding: 0 0 0 1.5rem;
            }
            
            .message-content.error li {
                color: #666;
                margin-bottom: 0.5rem;
                line-height: 1.4;
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced smooth scrolling
function initSmoothScrolling() {
    // Main CTA button
    const ctaButtons = document.querySelectorAll('[data-scroll-to]');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-scroll-to');
            smoothScrollTo(target);
        });
    });
    
    // Hero CTA fallback
    const heroCtaButtons = document.querySelectorAll('.hero__cta:not([data-scroll-to])');
    heroCtaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollTo('order');
        });
    });
}

// Enhanced model selection
function initModelSelection() {
    const modelButtons = document.querySelectorAll('.model-order-btn');
    const modelSelect = document.getElementById('model');
    
    modelButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const modelValue = this.getAttribute('data-model');
            
            // Scroll to order form
            smoothScrollTo('order');
            
            // Pre-select the model after scroll
            setTimeout(() => {
                if (modelSelect && modelValue) {
                    modelSelect.value = modelValue;
                    modelSelect.focus();
                    
                    // Visual feedback
                    modelSelect.style.borderColor = '#2563eb';
                    modelSelect.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    
                    setTimeout(() => {
                        modelSelect.style.borderColor = '';
                        modelSelect.style.boxShadow = '';
                    }, 2000);
                }
            }, 800);
        });
    });
}

// Image error handling
function initImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Show loading state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            // The onerror in HTML will handle the display
        });
    });
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    const style = document.createElement('style');
    style.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(255, 255, 255, 0.2);
            z-index: 9999;
            pointer-events: none;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #2563eb, #059669);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);
    
    function updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = scrollPercent + '%';
        }
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', function() {
        requestTick();
        ticking = false;
    });
}

// Enhanced button interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add enhanced hover effects for featured buttons
    const featuredButtons = document.querySelectorAll('.btn--featured');
    featuredButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    });
    
    // Add click feedback to all buttons
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.success-message, .error-message');
        modals.forEach(modal => modal.remove());
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when page is hidden
        const featuredButtons = document.querySelectorAll('.btn--featured');
        featuredButtons.forEach(button => {
            button.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page becomes visible
        const featuredButtons = document.querySelectorAll('.btn--featured');
        featuredButtons.forEach(button => {
            button.style.animationPlayState = 'running';
        });
    }
});

// Performance optimization: Lazy load images that are not critical
function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);