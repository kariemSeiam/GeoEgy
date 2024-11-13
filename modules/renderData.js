// modules/renderData.js

import { filteredData } from '../script.js';

const dataGrid = document.getElementById('data-grid');

export function renderData() {
    dataGrid.innerHTML = '';

    if (filteredData.length === 0) {
        dataGrid.innerHTML = '<p class="no-results">لم يتم العثور على نتائج.</p>';
        return;
    }

    // Sort places by largest count of reviews
    filteredData.sort((a, b) => {
        const reviewsA = a.reviews ? a.reviews.count : 0;
        const reviewsB = b.reviews ? b.reviews.count : 0;
        return reviewsB - reviewsA;
    });

    filteredData.forEach(item => {
        const card = document.createElement('article');
        card.className = 'data-card';

        // Header Section
        const headerDiv = document.createElement('div');
        headerDiv.className = 'data-card__header';

        // Avatar
        const avatarWrapper = document.createElement('div');
        avatarWrapper.className = 'data-card__image-wrapper';

        // Add click event to show location on map
        avatarWrapper.addEventListener('click', () => {
            if (item.coordinates && item.coordinates.latitude && item.coordinates.longitude) {
                const lat = item.coordinates.latitude;
                const lng = item.coordinates.longitude;
                openDetailMap(lat, lng, item);
            } else {
                alert('لا تتوفر معلومات الموقع لهذا المكان.');
            }
        });

        if (item.image) {
            const img = document.createElement('img');
            img.className = 'data-card__image';
            img.setAttribute('data-src', item.image);
            img.alt = item.name || 'صورة';
            avatarWrapper.appendChild(img);
        } else {
            const avatarLetter = document.createElement('span');
            avatarLetter.className = 'data-card__avatar-letter';
            avatarLetter.textContent = item.name ? item.name.charAt(0) : '?';
            avatarWrapper.appendChild(avatarLetter);
        }

        // Lazy Load Images
        if (item.image) {
            const img = avatarWrapper.querySelector('img');
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        img.src = img.getAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(img);
        }

        // Location Overlay
        const locationOverlay = document.createElement('div');
        locationOverlay.className = 'location-overlay';
        locationOverlay.textContent ='عرض الخريطة';
        locationOverlay.innerHTML = `<i class="fas fa-map-marker"></i> Maps `;

        avatarWrapper.appendChild(locationOverlay);

        // Append Avatar to Header
        headerDiv.appendChild(avatarWrapper);

        // Content Section
        const contentDiv = document.createElement('div');
        contentDiv.className = 'data-card__content';

        // Title
        const title = document.createElement('h2');
        title.className = 'data-card__title';
        title.textContent = item.name || 'اسم غير متوفر';
        contentDiv.appendChild(title);



        // Description
        const description = document.createElement('p');
        description.className = 'data-card__subtitle';
        description.textContent = item.about || 'لا يوجد وصف متاح.';
        contentDiv.appendChild(description);



        // Location Information
        if (item.address && item.address.governorate) {
            const locationInfo = document.createElement('div');
            locationInfo.className = 'data-card__details';
            locationInfo.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${item.address.governorate}`;
            contentDiv.appendChild(locationInfo);
        } else if (item.coordinates && item.coordinates.latitude && item.coordinates.longitude) {
            const locationInfo = document.createElement('div');
            locationInfo.className = 'data-card__details';
            const lat = item.coordinates.latitude;
            const lng = item.coordinates.longitude;
            locationInfo.innerHTML = `<i class="fas fa-map-marker-alt"></i> <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" target="_blank">الموقع على الخريطة</a>`;
            contentDiv.appendChild(locationInfo);
        } else {
            const locationInfo = document.createElement('div');
            locationInfo.className = 'data-card__details';
            locationInfo.innerHTML = `<i class="fas fa-map-marker-alt"></i> عنوان غير متوفر`;
            contentDiv.appendChild(locationInfo);
        }





        // Append header to card
        card.appendChild(headerDiv);

        // Action Buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'data-card__actions';

        // Copyable Phone Number
        if (item.phone_number) {
            const phoneNumberDiv = document.createElement('div');
            phoneNumberDiv.className = 'data-card__details';
            phoneNumberDiv.innerHTML = `<i class="fas fa-phone-alt"></i> <span class="copyable-phone-number">${item.phone_number}</span>`;
            contentDiv.appendChild(phoneNumberDiv);

            const copyPhoneButton = document.createElement('button');
            copyPhoneButton.className = 'data-card__button';
            copyPhoneButton.innerHTML = '<i class="fas fa-copy"></i>';
            copyPhoneButton.title = 'نسخ رقم الهاتف';
            copyPhoneButton.addEventListener('click', () => {
                navigator.clipboard.writeText(item.phone_number).then(() => {
                    alert('تم نسخ رقم الهاتف إلى الحافظة.');
                });
            });

        }
        // WhatsApp Button
        const whatsappButton = document.createElement('a');
        whatsappButton.className = 'data-card__button';
        if (item.phone_number) {
            whatsappButton.href = `https://wa.me/${item.phone_number}`;
            whatsappButton.target = '_blank';
            whatsappButton.rel = 'noopener noreferrer';
            whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
            whatsappButton.title = 'واتساب';
        } else {
            whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
            whatsappButton.classList.add('disabled');
        }
        actionsDiv.appendChild(whatsappButton);

        // Facebook or Website Button
        const facebookButton = document.createElement('a');
        facebookButton.className = 'data-card__button';
        if (item.url && item.url !== 'N/A') {
            facebookButton.href = item.url;
            facebookButton.target = '_blank';
            facebookButton.rel = 'noopener noreferrer';
            if (item.url.includes("facebook")) {
                facebookButton.title = 'فيسبوك';
                facebookButton.innerHTML = '<i class="fab fa-facebook-f"></i>';
            } else {
                facebookButton.title = 'موقع ويب';
                facebookButton.innerHTML = '<i class="fas fa-globe"></i>';
            }
        } else {
          if (item.additional_info.google_local_guide && item.additional_info.google_local_guide !== 'N/A' ) {
            facebookButton.innerHTML = '<i class="fas fa-globe"></i>';
            facebookButton.target = '_blank';
            facebookButton.rel = 'noopener noreferrer';
            facebookButton.title = 'التقييمات';
            facebookButton.href = item.additional_info.google_local_guide;
          }else {
            facebookButton.classList.add('disabled');
            facebookButton.innerHTML = '<i class="fas fa-globe"></i>';
            facebookButton.title = 'لا يوجد موقع';
          }
        }
        actionsDiv.appendChild(facebookButton);

        // Navigation Button
        if (item.coordinates && item.coordinates.latitude && item.coordinates.longitude) {
            const navigateButton = document.createElement('a');
            navigateButton.className = 'data-card__button';
            const lat = item.coordinates.latitude;
            const lng = item.coordinates.longitude;
            navigateButton.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            navigateButton.target = '_blank';
            navigateButton.rel = 'noopener noreferrer';
            navigateButton.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
            navigateButton.title = 'الانتقال إلى الموقع';
            actionsDiv.appendChild(navigateButton);
        } else {
            const disabledNavigateButton = document.createElement('button');
            disabledNavigateButton.className = 'data-card__button disabled';
            disabledNavigateButton.innerHTML = '<i class="fas fa-directions"></i>';
            disabledNavigateButton.title = 'موقع غير متوفر';
            actionsDiv.appendChild(disabledNavigateButton);
        }

        // Reviews Button
        const reviewsButton = document.createElement('a');
        reviewsButton.className = 'data-card__button';
        if (item.place_id) {
            reviewsButton.href = `https://search.google.com/local/reviews?placeid=${item.place_id}`;
            reviewsButton.target = '_blank';
            reviewsButton.rel = 'noopener noreferrer';
            reviewsButton.innerHTML = '<i class="fas fa-comments"></i>';
            reviewsButton.title = 'مراجعات جوجل';
        } else {
            reviewsButton.classList.add('disabled');
            reviewsButton.innerHTML = '<i class="fas fa-comments"></i>';
            reviewsButton.title = 'لا توجد مراجعات';
        }


        if (item.reviews && item.reviews.average_rating) {
            const ratingBadge = document.createElement('div');
            ratingBadge.className = 'data-rating-badge';

            // Determine color based on rating value
            const ratingValue = item.reviews.average_rating;
            let colorClass;
            if (ratingValue >= 2.5) {
                colorClass = 'high-rating'; // Green for high ratings
            } else if (ratingValue >= 2) {
                colorClass = 'medium-rating'; // Yellow for medium ratings
            } else {
                colorClass = 'low-rating'; // Red for low ratings
            }
            ratingBadge.classList.add(colorClass);

            // Create icon and text
            const icon = document.createElement('i');
            icon.className = 'fas fa-star';
            ratingBadge.appendChild(icon);

            // Add rating text
            const ratingText = document.createTextNode(` ${ratingValue.toFixed(1)} (${item.reviews.count})`);
            ratingBadge.appendChild(ratingText);

            contentDiv.appendChild(ratingBadge);
        }

        // Append content to header
        headerDiv.appendChild(contentDiv);

        actionsDiv.appendChild(reviewsButton);

        // Append actions to card
        card.appendChild(actionsDiv);

        // Append card to data grid
        dataGrid.appendChild(card);
    });
}

function openDetailMap(lat, lng, item) {
    // Implement a modal or popup to show the location on the map with detailed info
    // This can be an advanced feature where you create a custom map popup
    // For simplicity, we'll just open Google Maps for now
    window.open(`https://www.google.com/maps/@${lat},${lng},15z`, '_blank');
}
