// script.js

import { handleFileUpload } from './modules/fileUpload.js';
import { initializeFilters, applyFilters } from './modules/filters.js';
import { handleScroll, handleClickOutside, handleKeyDown } from './modules/events.js';
import { exportFullDataCSV } from './modules/exportData.js';
import { toggleTheme } from './modules/utils.js';
import { showBuyModal } from './modules/modals.js';

// DOM Elements
const fileInput = document.getElementById('file-input');
const ratingFilter = document.getElementById('rating-filter');
const ratingValue = document.getElementById('rating-value');
const phoneFilter = document.getElementById('phone-filter');
const urlFilter = document.getElementById('url-filter');
const exportDataBtn = document.getElementById('export-data-btn');
const fab = document.getElementById('fab');
const toggleThemeBtn = document.getElementById('toggle-theme-btn');
const buyDataBtn = document.getElementById('buy-data-btn');
const searchInput = document.getElementById('search-input');

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
fab.addEventListener('click', () => fileInput.click());
toggleThemeBtn.addEventListener('click', toggleTheme);
buyDataBtn.addEventListener('click', showBuyModal);
searchInput.addEventListener('input', applyFilters);

document.addEventListener('click', handleClickOutside);
document.addEventListener('keydown', handleKeyDown);
window.addEventListener('scroll', handleScroll);

// Initial Setup
ratingValue.textContent = ratingFilter.value;
