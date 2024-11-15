// modules/pricing.js

export const governoratePrices = {
    'القاهرة': 300,
    'الجيزة': 300,
    'الإسكندرية': 300,
    'البحيرة': 250,
    'الدقهلية': 250,
    'الشرقية': 250,
    'الغربية': 250,
    'المنوفية': 250,
    'الفيوم': 250,
    'السويس': 250,
    'الاسماعيلية': 250,
    'أسوان': 200,
    'أسيوط': 200,
    'الأقصر': 200,
    'البحر الأحمر': 200,
    'بني سويف': 200,
    'بورسعيد': 200,
    'جنوب سيناء': 200,
    'دمياط': 200,
    'سوهاج': 200,
    'مرسى مطروح': 200,
    'شمال سيناء': 200,
    'قنا': 200,
    'كفر الشيخ': 200,
    'المنيا': 200
};

// تسعيرة مصر الشاملة بناءً على التسعيرات المدروسة
const allEgyptPrice = 4000; // تم تحديد هذا السعر بناءً على التنوع في الأسعار

/**
 * حساب التكلفة الإجمالية بناءً على المحافظات المختارة
 * @param {Array} selectedGovernorates - المحافظات المختارة
 * @returns {number} - التكلفة الإجمالية
 */
export function calculatePrice(selectedGovernorates) {
    const allGovernorates = Object.keys(governoratePrices);

    // إذا تم اختيار "كل محافظات مصر"
    if (selectedGovernorates.includes('كل محافظات مصر')) {
        return allEgyptPrice;
    }

    // حساب التكلفة بناءً على المحافظات المختارة
    return selectedGovernorates.reduce((total, gov) => {
        return total + (governoratePrices[gov] || 200); // إضافة سعر افتراضي إذا لم يتم العثور على المحافظة
    }, 0);
}
