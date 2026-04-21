/**
 * Modern Scroll Effects Manager
 * Uses Intersection Observer for high perf animations
 */

class ScrollEffects {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    // Smooth anchor links
    this.setupAnchorLinks();
    
    // Scroll animations
    this.setupScrollAnimations();
    
    // Parallax
    this.setupParallax();
    
    // Progress bar
    this.setupProgressBar();
    
    // Lazy loading
    this.setupLazyLoading();
  }

  setupAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      });
    });
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-animate');
          // Stagger animation
          const stagger = entry.target.dataset.stagger || 0;
          entry.target.style.animationDelay = `${stagger * 100}ms`;
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    document.querySelectorAll('.animate-on-scroll, [class*="card"], [class*="product"], .section').forEach(el => {
      observer.observe(el);
    });
  }

  setupParallax() {
    const parallaxEls = document.querySelectorAll('.parallax-bg');
    let ticking = false;

    const updateParallax = () => {
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const speed = 0.5;
        el.style.transform = `translateY(${rect.top * speed}px)`;
      });
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  setupProgressBar() {
    const progress = document.querySelector('.scroll-progress') || this.createProgressBar();
    window.addEventListener('scroll', () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      progress.style.transform = `scaleX(${scrolled / 100})`;
    });
  }

  createProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    return bar;
  }

  setupLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-fade');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          imageObserver.unobserve(entry.target);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new ScrollEffects();
});

// Export for React
if (typeof window !== 'undefined') {
  window.ScrollEffects = ScrollEffects;
}

