// modules/analysisBar.js

import { filteredData } from '../script.js';

const totalPlacesElement = document.getElementById('total-places');
const totalReviewsElement = document.getElementById('total-reviews');
const averageRatingElement = document.getElementById('average-rating');

export function updateAnalysisBar() {
    const totalPlaces = filteredData.length;

    let totalReviews = 0;
    let ratingSum = 0;
    let ratingCount = 0;

    filteredData.forEach(item => {
        if (item.reviews && item.reviews.count && item.reviews.average_rating) {
            totalReviews += item.reviews.count;
            ratingSum += item.reviews.average_rating * item.reviews.count;
            ratingCount += item.reviews.count;
        }
    });

    const averageRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(2) : '0';

    totalPlacesElement.textContent = totalPlaces;
    totalReviewsElement.textContent = totalReviews;
    averageRatingElement.textContent = averageRating;
}
