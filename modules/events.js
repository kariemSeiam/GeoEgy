// modules/events.js


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
        // Close Dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const toggleButton = dropdown.querySelector('.dropdown__toggle');
            toggleButton.setAttribute('aria-expanded', 'false');
            dropdown.classList.remove('dropdown--open');
        });
    }
}
