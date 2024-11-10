/// modules/renderData.js

import { filteredData } from '../script.js';

const dataGrid = document.getElementById('data-grid');

export function renderData() {
    dataGrid.innerHTML = '';

    if (filteredData.length === 0) {
        dataGrid.innerHTML = '<p class="no-results">لم يتم العثور على نتائج.</p>';
        return;
    }

    filteredData.forEach(item => {
        const card = document.createElement('article');
        card.className = 'data-card';


        // Image with Map Button
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'data-card__image-wrapper';
        if (item.image) {
            const img = document.createElement('img');
            img.className = 'data-card__image';
            img.src = item.image;
            img.alt = item.name || 'صورة';
            imageWrapper.appendChild(img);
        }
        const mapButton = document.createElement('div');
        mapButton.className = 'map-button';
        mapButton.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
        mapButton.addEventListener('click', () => {
            const lat = item.coordinates.latitude;
            const lng = item.coordinates.longitude;
            window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
        });
        imageWrapper.appendChild(mapButton);
        card.appendChild(imageWrapper);

        // Content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'data-card__content';

        const title = document.createElement('h2');
        title.className = 'data-card__title';
        title.textContent = item.name || 'اسم غير متوفر';
        contentDiv.appendChild(title);

        const description = document.createElement('p');
        description.className = 'data-card__description';
        description.textContent = item.about || 'لا يوجد وصف متاح.';
        contentDiv.appendChild(description);

        const locationInfo = document.createElement('div');
        locationInfo.className = 'data-card__location';
        locationInfo.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${item.address ? item.address.formatted_address : 'عنوان غير متوفر'}`;
        contentDiv.appendChild(locationInfo);

        // Actions
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'data-card__actions';

        // Copy Phone Number
        if (item.phone_number) {
            const copyButton = document.createElement('button');
            copyButton.className = 'data-card__button';
            copyButton.innerHTML = '<i class="fas fa-copy"></i> نسخ الرقم';
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(item.phone_number).then(() => {
                    alert('تم نسخ رقم الهاتف إلى الحافظة.');
                });
            });
            actionsDiv.appendChild(copyButton);

            // WhatsApp Button
            const whatsappButton = document.createElement('a');
            whatsappButton.href = `https://wa.me/${item.phone_number}`;
            whatsappButton.target = '_blank';
            whatsappButton.rel = 'noopener noreferrer';
            whatsappButton.className = 'data-card__button';
            whatsappButton.innerHTML = '<i class="fas fa-whatsapp"></i> واتساب';
            actionsDiv.appendChild(whatsappButton);
        }

        // Google Reviews
        if (item.reviews && item.reviews.url) {
            const reviewsButton = document.createElement('a');
            reviewsButton.href = item.reviews.url;
            reviewsButton.target = '_blank';
            reviewsButton.rel = 'noopener noreferrer';
            reviewsButton.className = 'data-card__button';
            reviewsButton.innerHTML = '<i class="fas fa-comments"></i> مراجعات جوجل';
            actionsDiv.appendChild(reviewsButton);
        }

        // Website
        const websiteButton = document.createElement('a');
        websiteButton.className = 'data-card__link';
        if (item.url && item.url !== 'N/A') {
            websiteButton.href = item.url;
            websiteButton.target = '_blank';
            websiteButton.rel = 'noopener noreferrer';
            websiteButton.innerHTML = '<i class="fas fa-globe"></i> زيارة الموقع';
        } else {
            websiteButton.classList.add('disabled');
            websiteButton.innerHTML = '<i class="fas fa-globe"></i> لا يوجد موقع';
        }
        actionsDiv.appendChild(websiteButton);

        contentDiv.appendChild(actionsDiv);
        card.appendChild(contentDiv);
        dataGrid.appendChild(card);
    });
}
