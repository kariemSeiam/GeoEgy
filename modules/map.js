// modules/map.js

import { filteredData } from '../script.js';

let map;
export function initializeMap() {
    map = L.map('map', {
        center: [26.8206, 30.8025],
        zoom: 6,
    });

    // Use OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; مساهمة <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    }).addTo(map);
}

export function updateMapData() {
    if (!map) return;

    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    filteredData.forEach(item => {
        if (item.coordinates && item.coordinates.latitude && item.coordinates.longitude) {
            const lat = item.coordinates.latitude;
            const lng = item.coordinates.longitude;

            const marker = L.marker([lat, lng]).addTo(map);
            const popupContent = createPopupContent(item);
            marker.bindPopup(popupContent);
        }
    });
}

function createPopupContent(item) {
    let content = `<div class="popup-content">`;
    content += `<h3>${item.name || 'اسم غير متوفر'}</h3>`;
    content += `<p>${item.about || 'لا يوجد وصف متاح.'}</p>`;
    if (item.address && item.address.formatted_address) {
        content += `<p><i class="fas fa-map-marker-alt"></i> ${item.address.formatted_address}</p>`;
    }
    if (item.phone_number) {
        content += `<p><i class="fas fa-phone-alt"></i> ${item.phone_number}</p>`;
    }
    if (item.url) {
        content += `<p><a href="${item.url}" target="_blank">موقع إلكتروني</a></p>`;
    }
    content += `<a href="https://maps.google.com/maps?daddr=${item.coordinates.latitude},${item.coordinates.longitude}" target="_blank" class="button button--primary">انتقل إلى الموقع</a>`;
    content += `</div>`;
    return content;
}

export function toggleMapView() {
    const mapContainer = document.getElementById('map-container');
    mapContainer.classList.toggle('active');
    if (map) {
        map.invalidateSize();
    }
}

export function closeMapView() {
    const mapContainer = document.getElementById('map-container');
    mapContainer.classList.remove('active');
}
