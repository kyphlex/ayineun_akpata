// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const skillBars = document.querySelectorAll('.skill-progress');
const aboutSection = document.querySelector('.about');
const header = document.querySelector('header');
const darkModeToggle = document.getElementById('darkModeToggle');


// Mobile Navigation
function initMobileMenu() {
  if (!hamburger || !navLinks) return;
  
  const toggleMenu = () => {
    navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('active'));
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

// Smooth Scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = header?.offsetHeight || 80;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Sticky Header
function initStickyHeader() {
  if (!header) return;
  
  const headerHeight = header.offsetHeight;
  const stickyClass = 'sticky';
  
  window.addEventListener('scroll', () => {
    header.classList.toggle(stickyClass, window.scrollY > 0);
    
    // Add padding to prevent content jump
    document.body.style.paddingTop = header.classList.contains(stickyClass) 
      ? `${headerHeight}px` 
      : '';
  });
}

// Skill Bars Animation
function animateSkillBars() {
  skillBars.forEach(bar => {
    const width = bar.getAttribute('data-width') || bar.style.width;
    bar.style.width = '0';
    bar.style.transition = 'width 1s ease-in-out';
    
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
}

// Intersection Observer for animations
function initIntersectionObserver() {
  if (!('IntersectionObserver' in window) || !aboutSection) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars();
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px' // Triggers slightly before element is in view
  });

  observer.observe(aboutSection);
}

// Initialize all functions when DOM is loaded
function init() {
  initMobileMenu();
  initSmoothScrolling();
  initStickyHeader();
  initIntersectionObserver();
  initDarkMode();
}


// Use either DOMContentLoaded or defer attribute in script tag
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Dark Theme
function initDarkMode() {
  // Check for saved user preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Determine initial theme
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);
  
  // Update icon
  updateToggleIcon(initialTheme);
  
  // Toggle functionality
  darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
  });
}

// Helper function to update the toggle icon
function updateToggleIcon(theme) {
  const icon = darkModeToggle.querySelector('i');
  if (theme === 'dark') {
    icon.classList.replace('fa-moon', 'fa-sun');
    darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
}
