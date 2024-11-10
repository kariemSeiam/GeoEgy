// modules/utils.js

export function debounce(func, wait = 250, immediate = false) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export function cleanData(data) {
    return data.map(item => {
        if (item.address && item.address.governorate) {
            item.address.governorate = item.address.governorate.replace(/\d+/g, '').trim();
        }
        if (item.name) item.name = item.name.trim();
        if (item.about) item.about = item.about.trim();
        for (let key in item) {
            if (item[key] === 'N/A' || item[key] === '') {
                delete item[key];
            }
        }
        if (item.address && (item.address.governorate === 'N/A' || item.address.governorate === '')) {
            delete item.address.governorate;
        }
        if (item.additional_info && (item.additional_info.category === 'N/A' || item.additional_info.category === '')) {
            delete item.additional_info.category;
        }
        return item;
    });
}

export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', targetTheme);
    const icon = document.getElementById('toggle-theme-btn').querySelector('i');
    icon.className = targetTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}
