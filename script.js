// script.js

import { handleFileUpload } from './modules/fileUpload.js';
import { initializeFilters, applyFilters } from './modules/filters.js';
import { handleClickOutside, handleKeyDown } from './modules/events.js';
import { exportFullDataCSV } from './modules/exportData.js';
import { toggleTheme, lazyLoadImages, backToTopVisibility } from './modules/utils.js';
import { showBuyModal } from './modules/modals.js';
import { initializeMap, toggleMapView, closeMapView } from './modules/map.js';

// DOM Elements
const fileInput = document.getElementById('file-input');
const ratingFilter = document.getElementById('rating-filter');
const ratingValue = document.getElementById('rating-value');
const phoneFilter = document.getElementById('phone-filter');
const urlFilter = document.getElementById('url-filter');
const exportDataBtn = document.getElementById('export-data-btn');
const toggleThemeBtn = document.getElementById('toggle-theme-btn');
const buyDataBtn = document.getElementById('buy-data-btn');
const searchInput = document.getElementById('search-input');
const backToTopBtn = document.getElementById('back-to-top');
const mapToggleBtn = document.getElementById('map-toggle-btn');
const closeMapBtn = document.getElementById('close-map-btn');

// Data Variables
export let rawData = [];
export let filteredData = [];

// Event Listeners
fileInput.addEventListener('change', handleFileUpload);
ratingFilter.addEventListener('input', () => {
    ratingValue.textContent = ratingFilter.value;
    applyFilters();
});
phoneFilter.addEventListener('change', applyFilters);
urlFilter.addEventListener('change', applyFilters);
exportDataBtn.addEventListener('click', exportFullDataCSV);
buyDataBtn.addEventListener('click', showBuyModal);
searchInput.addEventListener('input', applyFilters);

document.addEventListener('click', handleClickOutside);
document.addEventListener('keydown', handleKeyDown);
toggleThemeBtn.addEventListener('click', toggleTheme);
window.addEventListener('scroll', () => {
    lazyLoadImages();
    backToTopVisibility();
});
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Map Event Listeners
mapToggleBtn.addEventListener('click', toggleMapView);
closeMapBtn.addEventListener('click', closeMapView);

// Initial Setup
ratingValue.textContent = ratingFilter.value;
initializeMap();
