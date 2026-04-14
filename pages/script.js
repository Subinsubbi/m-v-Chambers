// Mobile detection
const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Initialize Swiper for Hero Section
document.addEventListener("DOMContentLoaded", function() {
    // Mobile-optimized Swiper configuration
    const swiperConfig = isMobile ? {
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1500, 
        autoplay: {
            delay: 4000, 
            disableOnInteraction: false,
        },
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        simulateTouch: true, 
        touchRatio: 0.5, 
        resistanceRatio: 0, 
    } : {
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 2500, // Slow cinematic fade on desktop
        autoplay: {
            delay: 6000, // 6 seconds per slide
            disableOnInteraction: false,
        },
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        simulateTouch: false, 
    };

    const swiper = new Swiper('.hero-swiper', swiperConfig);

    // Mobile-optimized AOS configuration
    const aosConfig = isMobile ? {
        duration: 600, 
        easing: 'ease-out-cubic',
        once: true,
        offset: 30, 
        disable: false, 
        startEvent: 'DOMContentLoaded', 
        initClassName: 'aos-init',
        animatedClassName: 'aos-animate',
        useClassNames: false,
        disableMutationObserver: false,
        debounceDelay: 50,
        throttleDelay: 99,
    } : {
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        disable: false,
    };

    AOS.init(aosConfig);

    // Mobile Drawer Logic with enhanced animations
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const drawer = document.getElementById('drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openDrawer() {
        drawerBackdrop.classList.remove('hidden');
        drawerBackdrop.classList.add('mobile-drawer-enter');
        drawer.classList.add('mobile-drawer-enter');
        setTimeout(() => {
            drawerBackdrop.classList.remove('opacity-0');
            drawer.classList.remove('translate-x-full');
        }, 10);
        document.body.style.overflow = 'hidden';

        // Add haptic feedback on mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    function closeDrawer() {
        drawer.classList.add('mobile-drawer-exit');
        drawerBackdrop.classList.add('mobile-drawer-exit');
        setTimeout(() => {
            drawer.classList.add('translate-x-full');
            drawerBackdrop.classList.add('opacity-0');
            setTimeout(() => {
                drawerBackdrop.classList.add('hidden');
                drawer.classList.remove('mobile-drawer-enter', 'mobile-drawer-exit');
                drawerBackdrop.classList.remove('mobile-drawer-enter', 'mobile-drawer-exit');
            }, 300);
        }, 10);
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // Mobile-specific touch interactions
    if (isMobile) {
        // Add touch feedback to interactive elements
        const interactiveElements = document.querySelectorAll('button, a, .mobile-card, .mobile-btn');
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-feedback');
            });

            element.addEventListener('touchend', function() {
                this.classList.remove('touch-feedback');
            });
        });

        // Mobile scroll animations
        let scrollTimeout;
        const handleScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;

                // Parallax effect for mobile
                const parallaxElements = document.querySelectorAll('.mobile-parallax');
                parallaxElements.forEach(element => {
                    element.style.transform = `translateY(${rate}px)`;
                });
            }, 10);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Mobile gesture handling
        let startY = 0;
        let startX = 0;

        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        }, { passive: true });

        // Prevent pull-to-refresh on mobile
        document.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const diffY = startY - currentY;
            const diffX = startX - currentX;

            // If scrolling horizontally or at top/bottom, allow default behavior
            if (Math.abs(diffX) > Math.abs(diffY) || window.scrollY === 0 || window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                return;
            }

            // Prevent vertical overscroll
            if ((window.scrollY === 0 && diffY < 0) || (window.innerHeight + window.scrollY >= document.body.offsetHeight && diffY > 0)) {
                e.preventDefault();
            }
        }, { passive: false });

        // Mobile performance optimizations
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('mobile-scroll-fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const animateElements = document.querySelectorAll('.mobile-card, .mobile-btn');
        animateElements.forEach(element => {
            observer.observe(element);
        });

        // Mobile loading states
        const addLoadingState = (element) => {
            element.classList.add('mobile-loading');
            setTimeout(() => {
                element.classList.remove('mobile-loading');
            }, 1000);
        };

        // Add loading states to buttons on click
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (!button.classList.contains('mobile-loading')) {
                    addLoadingState(button);
                }
            });
        });

        // Mobile viewport height fix
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', () => {
            setTimeout(setVH, 100);
        });
    }

    // Intersection Observer for performance
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        // Lazy load images
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
