// modules/modals.js

import { calculatePrice } from './pricing.js';
import { rawData } from '../script.js';

const buyModal = document.getElementById('buy-modal');
const paymentModal = document.getElementById('payment-modal');
const successModal = document.getElementById('success-modal');
const buyForm = document.getElementById('buy-form');
const governorateSelect = document.getElementById('buy-governorate-select');
const totalPriceElement = document.getElementById('total-price');
const paymentMethodName = document.getElementById('payment-method-name');
const whatsappLink = document.getElementById('whatsapp-link');
const paymentNumber = document.querySelector('.modal__payment-number');

export function showBuyModal() {
    populateGovernorateOptions();
    totalPriceElement.textContent = '0 جنيه مصري';
    openModal(buyModal);
}

function populateGovernorateOptions() {
    governorateSelect.innerHTML = '';
    const governorates = new Set();
    rawData.forEach(item => {
        if (item.address && item.address.governorate) {
            governorates.add(item.address.governorate);
        }
    });
    Array.from(governorates).sort().forEach(gov => {
        const option = document.createElement('option');
        option.value = gov;
        option.textContent = gov;
        governorateSelect.appendChild(option);
    });
}

buyForm.addEventListener('change', updateTotalPrice);

function updateTotalPrice() {
    const selectedGovernorates = Array.from(governorateSelect.selectedOptions).map(option => option.value);
    const price = calculatePrice(selectedGovernorates);
    totalPriceElement.textContent = `${price} جنيه مصري`;
}

buyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const paymentMethod = buyForm.elements['payment-method'].value;
    paymentMethodName.textContent = paymentMethod === 'vodafone' ? 'فودافون كاش' : 'إنستا باي';
    paymentNumber.textContent = paymentMethod === 'vodafone' ? '01012345678' : '01234567890';
    const selectedGovernorates = Array.from(governorateSelect.selectedOptions).map(option => option.value);
    const searchQuery = buyForm.elements['buy-search-input'].value.trim();
    const price = calculatePrice(selectedGovernorates);
    const message = `أرغب في شراء بيانات عن المحافظات التالية: ${selectedGovernorates.join(', ')}.\nبحث عن: ${searchQuery}\nالتكلفة الإجمالية: ${price} جنيه مصري`;
    whatsappLink.href = `https://wa.me/201012345678?text=${encodeURIComponent(message)}`;
    openModal(paymentModal);
});

function openModal(modal) {
    modal.style.display = 'flex';
    modal.querySelector('.modal__content').focus();
}

document.querySelectorAll('.modal__close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

export function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}
