// modules/pricing.js

const governoratePrices = {
    // Governorate: Price (EGP)
    "القاهرة": 300,
    "الجيزة": 300,
    "الإسكندرية": 350,
    "أسوان": 250,
    "أسيوط": 200,
    "الأقصر": 250,
    "البحر الأحمر": 250,
    "البحيرة": 200,
    "بني سويف": 200,
    "بورسعيد": 250,
    "جنوب سيناء": 250,
    "الدقهلية": 200,
    "دمياط": 200,
    "سوهاج": 200,
    // ... Add all governorates with their respective prices
};

const allEgyptPrice = 2500; // Special price for all of Egypt

export function calculatePrice(selectedGovernorates) {
    if (selectedGovernorates.length === Object.keys(governoratePrices).length) {
        return allEgyptPrice;
    }

    let totalPrice = selectedGovernorates.reduce((total, gov) => {
        const price = governoratePrices[gov] || 200;
        return total + price;
    }, 0);

    return totalPrice;
}
