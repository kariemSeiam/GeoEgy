// modules/events.js

import { closeAllModals } from './modals.js';

export function handleScroll() {
    const fab = document.getElementById('fab');
    if (window.scrollY > 200) {
        fab.style.display = 'flex';
        document.body.classList.add('scrolled');
    } else {
        fab.style.display = 'none';
        document.body.classList.remove('scrolled');
    }
}

export function handleClickOutside(event) {
    // Close Modals
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close Dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
            const toggleButton = dropdown.querySelector('.dropdown__toggle');
            toggleButton.setAttribute('aria-expanded', 'false');
            dropdown.classList.remove('dropdown--open');
        }
    });
}

export function handleKeyDown(event) {
    if (event.key === 'Escape') {
        closeAllModals();  // Use closeAllModals from modals.js
        // Close Dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const toggleButton = dropdown.querySelector('.dropdown__toggle');
            toggleButton.setAttribute('aria-expanded', 'false');
            dropdown.classList.remove('dropdown--open');
        });
    }
}
