// script.js

// Smooth scroll and active nav highlighting
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section');
const backToTop = document.querySelector('.back-to-top');
const pageLoader = document.getElementById('page-loader');
const body = document.body;
const cursor = document.querySelector('.custom-cursor');
const typingText = document.querySelector('.typing-text');
const statNumbers = document.querySelectorAll('.stat-number');
const skillFillBars = document.querySelectorAll('.skill-meter-fill');
const contactForm = document.getElementById('contact-form');

const typingWords = ['AI Developer', 'Web Developer', 'Software Engineer', 'Tech Enthusiast'];
let typingIndex = 0;
let charIndex = 0;
let typingForward = true;

function typeLoop() {
    const currentWord = typingWords[typingIndex];
    const displayedText = currentWord.slice(0, charIndex);
    typingText.textContent = displayedText;

    if (typingForward) {
        charIndex += 1;
        if (charIndex > currentWord.length) {
            typingForward = false;
            setTimeout(typeLoop, 1300);
            return;
        }
    } else {
        charIndex -= 1;
        if (charIndex < 0) {
            typingForward = true;
            typingIndex = (typingIndex + 1) % typingWords.length;
        }
    }
    setTimeout(typeLoop, typingForward ? 120 : 70);
}

typeLoop();

function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = link.getAttribute('href');
        smoothScroll(target);
    });
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function activateSectionLink() {
    const scrollPos = window.scrollY + window.innerHeight / 2;

    sections.forEach((section) => {
        const id = section.getAttribute('id');
        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
        }
    });
}

function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    sections.forEach((section) => observer.observe(section));
}

function animateStats() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                statNumbers.forEach((number) => {
                    const target = +number.dataset.target;
                    let current = 0;
                    const increment = Math.max(1, Math.floor(target / 40));
                    const timer = setInterval(() => {
                        current += increment;
                        number.textContent = current > target ? target : current;
                        if (current >= target) {
                            clearInterval(timer);
                        }
                    }, 24);
                });
                obs.disconnect();
            }
        });
    }, { threshold: 0.2 });

    const statsSection = document.querySelector('#stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateSkills() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                skillFillBars.forEach((bar) => bar.style.transform = 'scaleX(1)');
                obs.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

function handleCursor(e) {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
}

function attachCursorInteractions() {
    document.addEventListener('mousemove', handleCursor);
    document.querySelectorAll('a, button, .button').forEach((element) => {
        element.addEventListener('mouseenter', () => cursor.classList.add('active'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
}

function initPageTransitions() {
    window.addEventListener('load', () => {
        pageLoader.classList.add('hidden');
        body.classList.remove('loading');
        setTimeout(() => pageLoader.style.display = 'none', 600);
    });
}

function validateForm(event) {
    event.preventDefault();
    const nameInput = contactForm.querySelector('#name');
    const emailInput = contactForm.querySelector('#email');
    const messageInput = contactForm.querySelector('#message');
    const inputs = [nameInput, emailInput, messageInput];
    let valid = true;

    inputs.forEach((field) => {
        const error = field.nextElementSibling;
        if (!field.value.trim()) {
            error.textContent = 'This field is required.';
            valid = false;
        } else {
            error.textContent = '';
        }
    });

    if (emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        emailInput.nextElementSibling.textContent = 'Enter a valid email.';
        valid = false;
    }

    const feedback = contactForm.querySelector('.form-feedback');
    if (valid) {
        feedback.textContent = 'Message sent! I will respond soon.';
        contactForm.reset();
    } else {
        feedback.textContent = 'Please fix the errors above before sending.';
    }
}

function initInteractions() {
    animateOnScroll();
    activateSectionLink();
    animateStats();
    animateSkills();
    attachCursorInteractions();
    initPageTransitions();

    document.addEventListener('scroll', activateSectionLink);
    contactForm.addEventListener('submit', validateForm);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractions);
} else {
    initInteractions();
}
