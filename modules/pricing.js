// modules/pricing.js

const governoratePrices = {
    'القاهرة': 200,
    'الجيزة': 180,
    'الإسكندرية': 200,
    'أسوان': 120,
    'أسيوط': 120,
    'الأقصر': 120,
    'البحر الأحمر': 120,
    'البحيرة': 150,
    'بني سويف': 120,
    'بورسعيد': 120,
    'جنوب سيناء': 120,
    'الدقهلية': 150,
    'دمياط': 150,
    'سوهاج': 120,
    'المنوفية': 150,
    'الغربية': 150,
    'الفيوم': 150,
    'السويس': 150,
    'مرسى مطروح': 120,
    'شمال سيناء': 120,
    'قنا': 120,
    'الشرقية': 150,
    'كفر الشيخ': 150,
    'المنيا': 120,
    'الاسماعيلية': 150,
    'بني سويف': 120,
    'دمياط': 150
};

// تسعيرة مصر الشاملة بناءً على التسعيرات المدروسة
const allEgyptPrice = 3500; // تم تحديد هذا السعر بناءً على التنوع في الأسعار

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
        return total + (governoratePrices[gov] || 150); // إضافة سعر افتراضي إذا لم يتم العثور على المحافظة
    }, 0);
}
