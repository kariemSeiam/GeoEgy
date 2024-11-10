// modules/filters.js

import { rawData, filteredData } from '../script.js';
import { renderData } from './renderData.js';
import { updateAnalysisBar } from './analysisBar.js';
import { debounce } from './utils.js';

const ratingFilter = document.getElementById('rating-filter');
const phoneFilter = document.getElementById('phone-filter');
const urlFilter = document.getElementById('url-filter');
const categoryFilter = document.getElementById('category-filter');
const governorateFilter = document.getElementById('governorate-filter');
const searchInput = document.getElementById('search-input');

let categories = new Set();
let governorates = new Set();

export function initializeFilters() {
    categories.clear();
    governorates.clear();

    rawData.forEach(item => {
        if (item.additional_info && item.additional_info.category) {
            categories.add(item.additional_info.category);
        }
        if (item.address && item.address.governorate) {
            governorates.add(item.address.governorate);
        }
    });

    initDropdown(categoryFilter, Array.from(categories), 'اختر الفئات');
    initDropdown(governorateFilter, Array.from(governorates), 'اختر المحافظات');
}


function initDropdown(dropdownElement, options, placeholder) {
    const toggleButton = dropdownElement.querySelector('.dropdown__toggle');
    const placeholderSpan = toggleButton.querySelector('.dropdown__placeholder');
    const tagsContainer = toggleButton.querySelector('.dropdown__tags');
    const menu = dropdownElement.querySelector('.dropdown__menu');
    const searchInput = dropdownElement.querySelector('.dropdown__search-input');
    const list = dropdownElement.querySelector('.dropdown__list');
    const selectAllCheckbox = dropdownElement.querySelector('.dropdown__select-all-checkbox');

    placeholderSpan.textContent = placeholder;
    tagsContainer.innerHTML = '';
    list.innerHTML = '';

    options.sort().forEach(option => {
        const listItem = document.createElement('li');
        listItem.className = 'dropdown__item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = option;
        checkbox.checked = true;
        checkbox.className = 'dropdown__checkbox';
        checkbox.id = `${dropdownElement.id}-${option}`;

        const label = document.createElement('label');
        label.setAttribute('for', checkbox.id);
        label.textContent = option;

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        list.appendChild(listItem);

        checkbox.addEventListener('change', () => {
            updateSelectedOptions(dropdownElement, placeholder);
            applyFilters();
        });
    });

    toggleButton.addEventListener('click', () => {
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        closeAllDropdowns();
        toggleButton.setAttribute('aria-expanded', !isExpanded);
        dropdownElement.classList.toggle('dropdown--open', !isExpanded);
    });

    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toLowerCase();
        const items = list.querySelectorAll('.dropdown__item');
        let found = false;

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const match = text.includes(filter);
            item.style.display = match ? '' : 'none';
            if (match) found = true;
        });

        selectAllCheckbox.checked = found ? [...list.querySelectorAll('.dropdown__item:not([style*="display: none"]) .dropdown__checkbox')].every(cb => cb.checked) : false;
    });

    selectAllCheckbox.checked = true;

    selectAllCheckbox.addEventListener('change', () => {
        const checkboxes = list.querySelectorAll('.dropdown__checkbox');
        const filter = searchInput.value.toLowerCase();

        checkboxes.forEach(cb => {
            const listItem = cb.closest('.dropdown__item');
            if (listItem && listItem.style.display !== 'none') {
                cb.checked = selectAllCheckbox.checked;
            }
        });

        updateSelectedOptions(dropdownElement, placeholder);
        applyFilters();
    });

    updateSelectedOptions(dropdownElement, placeholder);
}

function updateSelectedOptions(dropdownElement, placeholder) {
    const toggleButton = dropdownElement.querySelector('.dropdown__toggle');
    const placeholderSpan = toggleButton.querySelector('.dropdown__placeholder');
    const tagsContainer = toggleButton.querySelector('.dropdown__tags');
    const checkboxes = dropdownElement.querySelectorAll('.dropdown__checkbox');
    const selectAllCheckbox = dropdownElement.querySelector('.dropdown__select-all-checkbox');

    const selectedOptions = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

    tagsContainer.innerHTML = '';

    const maxVisibleTags = 1; // Adjust this number based on your design needs
    const visibleOptions = selectedOptions.slice(0, maxVisibleTags);
    const remainingCount = selectedOptions.length - visibleOptions.length;

    if (selectedOptions.length > 0) {
        placeholderSpan.style.display = 'none';
        visibleOptions.forEach(option => {
            const tag = document.createElement('div');
            tag.className = 'dropdown__tag';
            tag.textContent = option;

            const removeBtn = document.createElement('span');
            removeBtn.className = 'dropdown__tag-remove';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const checkbox = dropdownElement.querySelector(`.dropdown__checkbox[value="${option}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                    updateSelectedOptions(dropdownElement, placeholder);
                    applyFilters();
                }
            });

            tag.appendChild(removeBtn);
            tagsContainer.appendChild(tag);
        });

        if (remainingCount > 0) {
            const moreTag = document.createElement('div');
            moreTag.className = 'dropdown__tag dropdown__tag--more';
            moreTag.textContent = `+ ${remainingCount} أخرى`;
            tagsContainer.appendChild(moreTag);
        }
    } else {
        placeholderSpan.style.display = '';
    }

    selectAllCheckbox.checked = selectedOptions.length === checkboxes.length;
}

function closeDropdown(dropdownElement) {
    const toggleButton = dropdownElement.querySelector('.dropdown__toggle');
    toggleButton.setAttribute('aria-expanded', 'false');
    dropdownElement.classList.remove('dropdown--open');
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        closeDropdown(dropdown);
    });
}

export const applyFilters = debounce(() => {
    const selectedCategories = getSelectedOptions(categoryFilter);
    const selectedGovernorates = getSelectedOptions(governorateFilter);
    const selectedRating = parseFloat(ratingFilter.value);
    const phoneNumberRequired = phoneFilter.checked;
    const urlRequired = urlFilter.checked;
    const searchQuery = searchInput.value.trim().toLowerCase();

    filteredData.length = 0;
    filteredData.push(...rawData.filter(item => {
        const itemCategory = item.additional_info && item.additional_info.category;
        const itemGovernorate = item.address && item.address.governorate;
        const itemRating = item.reviews && item.reviews.average_rating;
        const hasPhoneNumber = !!item.phone_number;
        const hasUrl = item.url && item.url !== 'N/A';

        const categoryMatch = selectedCategories.length > 0 ? selectedCategories.includes(itemCategory) : true;
        const governorateMatch = selectedGovernorates.length > 0 ? selectedGovernorates.includes(itemGovernorate) : true;
        const ratingMatch = itemRating !== undefined ? itemRating >= selectedRating : true;
        const phoneMatch = phoneNumberRequired ? hasPhoneNumber : true;
        const urlMatch = urlRequired ? hasUrl : true;
        const searchMatch = searchQuery ? (item.name && item.name.toLowerCase().includes(searchQuery)) : true;

        return categoryMatch && governorateMatch && ratingMatch && phoneMatch && urlMatch && searchMatch;
    }));

    renderData();
    updateAnalysisBar();
}, 300);

function getSelectedOptions(dropdownElement) {
    const checkboxes = dropdownElement.querySelectorAll('.dropdown__checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}
