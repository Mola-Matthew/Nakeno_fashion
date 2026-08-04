 // Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('mainNav');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Back to top button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for counters
const observerOptions = { threshold: 0.5 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => animateCounter(counter));
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections with counters
const sectionsWithCounters = document.querySelectorAll('#about, #home');
sectionsWithCounters.forEach(section => {
    observer.observe(section);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});

// Active nav link update on scroll ;
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav-link[href*=' + sectionId + ']').classList.add('active');
        } else {
            document.querySelector('.nav-link[href*=' + sectionId + ']').classList.remove('active');
        }
    });
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = darkModeToggle.querySelector('i');

// Check for saved dark mode preference
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeIcon.classList.remove('bi-moon-fill');
    darkModeIcon.classList.add('bi-sun-fill');
}

// Toggle dark mode
darkModeToggle.addEventListener('click', function(e) {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeIcon.classList.remove('bi-moon-fill');
        darkModeIcon.classList.add('bi-sun-fill');
    } else {
        localStorage.setItem('darkMode', 'disabled');
        darkModeIcon.classList.remove('bi-sun-fill');
        darkModeIcon.classList.add('bi-moon-fill');
    }
});

// Products Accordion Toggle
function toggleProduct(header) {
    const category = header.parentElement;
    const allCategories = document.querySelectorAll('.product-category');
    
    // Close all other categories
    allCategories.forEach(cat => {
        if (cat !== category && cat.classList.contains('active')) {
            cat.classList.remove('active');
        }
    });
    
    // Toggle current category
    category.classList.toggle('active');
}

/* ============================================
   PORTFOLIO FUNCTIONALITY
   ============================================ */

// ---------- Portfolio Filtering ----------
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioGrid = document.querySelector('.portfolio-grid');

    if (!filterButtons.length || !portfolioItems.length) return;

    filterButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const filterValue = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter items with animation
            portfolioItems.forEach((item) => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || itemCategory === filterValue) {
                    // Show item
                    item.classList.remove('hidden');
                    item.style.position = '';
                    item.style.visibility = '';
                    
                    // Re-trigger AOS animation
                    item.setAttribute('data-aos', 'fade-up');
                    item.setAttribute('data-aos-duration', '600');
                    
                    // Force AOS refresh for this element
                    if (typeof AOS !== 'undefined') {
                        AOS.refreshHard();
                    }
                } else {
                    // Hide item
                    item.classList.add('hidden');
                }
            });

            // Re-align grid after filtering
            if (portfolioGrid) {
                setTimeout(() => {
                    // Trigger reflow for animation
                    portfolioGrid.style.opacity = '0.99';
                    requestAnimationFrame(() => {
                        portfolioGrid.style.opacity = '1';
                    });
                }, 50);
            }
        });
    });
}

// ---------- Load More Functionality ----------
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;

    // Initially hide items beyond the first 6
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const initialVisible = 6;
    let currentlyVisible = initialVisible;

    if (portfolioItems.length <= initialVisible) {
        loadMoreBtn.style.display = 'none';
        return;
    }

    // Hide items beyond initial count
    portfolioItems.forEach((item, index) => {
        if (index >= initialVisible) {
            item.classList.add('hidden');
        }
    });

    loadMoreBtn.addEventListener('click', function () {
        const hiddenItems = document.querySelectorAll('.portfolio-item.hidden');
        const itemsToShow = Math.min(hiddenItems.length, 3); // Show 3 more each time

        for (let i = 0; i < itemsToShow; i++) {
            if (hiddenItems[i]) {
                hiddenItems[i].classList.remove('hidden');
                hiddenItems[i].style.position = '';
                hiddenItems[i].style.visibility = '';
                
                // Add animation
                hiddenItems[i].setAttribute('data-aos', 'fade-up');
                hiddenItems[i].setAttribute('data-aos-duration', '600');
            }
        }

        currentlyVisible += itemsToShow;

        // Refresh AOS for newly visible items
        if (typeof AOS !== 'undefined') {
            AOS.refreshHard();
        }

        // Hide button if no more items
        if (currentlyVisible >= portfolioItems.length) {
            loadMoreBtn.style.display = 'none';
        }

        // Update button text
        const remaining = portfolioItems.length - currentlyVisible;
        if (remaining > 0) {
            loadMoreBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Load More (${remaining} remaining)`;
        }
    });
}

// ---------- Modal Image Error Handling ----------
function initPortfolioImageFallbacks() {
    const portfolioImages = document.querySelectorAll('.portfolio-image img, .modal-image');
    
    portfolioImages.forEach((img) => {
        img.addEventListener('error', function () {
            // Create a stylish placeholder instead of broken image
            const placeholderColors = [
                'linear-gradient(135deg, #8B1A4A, #D4AF37)',
                'linear-gradient(135deg, #5E0F32, #E8C95A)',
                'linear-gradient(135deg, #2D1A22, #A83268)',
                'linear-gradient(135deg, #1A0A10, #D4AF37)',
            ];
            const randomGradient = placeholderColors[Math.floor(Math.random() * placeholderColors.length)];
            
            this.style.background = randomGradient;
            this.style.minHeight = this.classList.contains('modal-image') ? '400px' : '300px';
            this.style.objectFit = 'cover';
            
            // Add a subtle icon overlay via pseudo-element simulation
            const iconOverlay = document.createElement('div');
            iconOverlay.style.cssText = `
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                color: rgba(255,255,255,0.3);
            `;
            iconOverlay.innerHTML = '<i class="fa-solid fa-image"></i>';
            
            if (this.parentElement && !this.parentElement.querySelector('.image-fallback-icon')) {
                iconOverlay.classList.add('image-fallback-icon');
                this.parentElement.appendChild(iconOverlay);
            }
        });
    });
}

// ============================================
// PORTFOLIO FILTERING
// ============================================
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hidden');
                item.style.position = 'relative';
            } else {
                item.classList.add('hidden');
                setTimeout(() => {
                    if (item.classList.contains('hidden')) {
                        item.style.position = 'absolute';
                    }
                }, 500);
            }
        });
    });
});

// ============================================
// LIGHTBOX FUNCTIONALITY
// ============================================
const lightbox = document.getElementById('portfolioLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCat = document.getElementById('lightboxCat');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
let currentLightboxItems = [];
let currentLightboxIndex = 0;

function openLightbox(btn) {
    const img = btn.getAttribute('data-img');
    const title = btn.getAttribute('data-title');
    const cat = btn.getAttribute('data-cat');
    const desc = btn.getAttribute('data-desc');
    
    lightboxImg.src = img;
    lightboxImg.alt = title;
    lightboxCat.textContent = cat;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;
    
    // Collect all visible portfolio items for navigation
    const visibleItems = document.querySelectorAll('.portfolio-item:not(.hidden) .overlay-btn');
    currentLightboxItems = Array.from(visibleItems);
    currentLightboxIndex = currentLightboxItems.indexOf(btn);
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = currentLightboxItems.length - 1;
    if (currentLightboxIndex >= currentLightboxItems.length) currentLightboxIndex = 0;
    
    const item = currentLightboxItems[currentLightboxIndex];
    if (item) {
        lightboxImg.src = item.getAttribute('data-img');
        lightboxImg.alt = item.getAttribute('data-title');
        lightboxCat.textContent = item.getAttribute('data-cat');
        lightboxTitle.textContent = item.getAttribute('data-title');
        lightboxDesc.textContent = item.getAttribute('data-desc');
    }
}

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
    if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
        navigateLightbox(-1);
    }
    if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
        navigateLightbox(1);
    }
});

// ============================================
// LOAD MORE FUNCTIONALITY
// ============================================
let itemsToShow = 6;
const loadMoreBtn = document.getElementById('loadMoreBtn');

if (loadMoreBtn) {
    // Initially hide items beyond the first 6
    portfolioItems.forEach((item, index) => {
        if (index >= itemsToShow) {
            item.style.display = 'none';
        }
    });
    
    loadMoreBtn.addEventListener('click', function() {
        const hiddenItems = document.querySelectorAll('.portfolio-item[style*="display: none"]');
        const itemsToReveal = Array.from(hiddenItems).slice(0, 3);
        
        itemsToReveal.forEach((item, i) => {
            setTimeout(() => {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease forwards';
            }, i * 100);
        });
        
        // Hide button if no more items
        if (hiddenItems.length <= 3) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

// Add fadeInUp keyframe if not already present
if (!document.querySelector('#portfolio-animations')) {
    const style = document.createElement('style');
    style.id = 'portfolio-animations';
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}
