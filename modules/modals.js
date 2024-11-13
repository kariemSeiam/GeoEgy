// modules/modals.js

import { calculatePrice } from './pricing.js';

// تحديد العناصر
const buyModal = document.getElementById('buy-modal');
const buyForm = document.getElementById('buy-form');
const totalPriceElement = document.getElementById('total-price');
const selectAllCheckbox = document.getElementById('select-all');
const governorateCheckboxes = document.querySelectorAll('.governorate-checkbox');


// تحديث التكلفة الإجمالية
function updateTotalPrice() {
  const selectedGovernorates = getSelectedGovernorates();
  const totalPrice = calculatePrice(selectedGovernorates);
  totalPriceElement.textContent = `${totalPrice} جنيه مصري`;
}

// الحصول على المحافظات المختارة
function getSelectedGovernorates() {
  const selected = [];
  if (selectAllCheckbox.checked) {
    selected.push('كل محافظات مصر');
  } else {
    governorateCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selected.push(checkbox.value);
      }
    });
  }
  return selected;
}



document.addEventListener('DOMContentLoaded', () => {


  // مستمعي الأحداث

  // عند تغيير اختيار "كل المحافظات"
  selectAllCheckbox.addEventListener('change', () => {
    governorateCheckboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
    updateTotalPrice();
  });

  // عند تغيير اختيار المحافظات الفردية
  governorateCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      if (!checkbox.checked) {
        selectAllCheckbox.checked = false;
      }
      updateTotalPrice();
    });
  });

  // عند تغيير المدخلات الأخرى
  buyForm.addEventListener('input', (e) => {
    if (e.target.matches('#buy-search-input')) {
      // يمكن إضافة أي عملية هنا إذا لزم الأمر
    }
  });

  // عند إرسال النموذج
  buyForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // جمع البيانات
    const searchQuery = buyForm.searchQuery.value.trim();
    const businessInfo = buyForm.businessInfo.value.trim();
    const selectedGovernorates = getSelectedGovernorates();
    const totalPrice = totalPriceElement.textContent;

    // التحقق من المدخلات
    if (!searchQuery || selectedGovernorates.length === 0) {
      alert('يرجى إدخال الأماكن التي تريد البحث عنها واختيار محافظة واحدة على الأقل.');
      return;
    }

    // إعداد رسالة واتساب
    const orderDetails = `
📢 *طلب جديد لشراء بيانات*

📍 *الأماكن المطلوبة:*
    ${searchQuery}

🌍 *المحافظات المختارة:*
    ${selectedGovernorates.join(', ')}

💰 *التكلفة الإجمالية:*
    *${totalPrice}*


*إزاي تكمل؟*

1. *حول المبلغ عبر فودافون كاش على الرقم:*
       01033939828 💸

2. بعد ما تعمل التحويل، ابعت لنا صورة من رسالة التحويل فيها:
       - *رقم المحول*
       - *رقم المستلم*
       - *المبلغ المحول*


🔒 *هنأكد التحويل، وبعدها هنبعتلك الملف الخاص بالبيانات.*

💻 *إيه اللي هيحصل بعد كده؟*
    لما نأكد الطلب ونرسل لك الملف، هتحتاج تفتح لوحة التحكم من الرابط :
    https://kariemseiam.github.io/GeoEgy/

    بعد فتح اللوحة، كل اللي عليك ترفّع الملف المرسل ليك عليها، وهيكون متاح لك على الفور علشان تستخدمه بكل سهولة.

⏳ *ما تفوتش الفرصة!*
    العرض محدود، فاستغل الفرصة دي واستلم بياناتك بأسرع وقت. إحنا هنا عشان نوفرلك كل حاجة بسهولة وراحة. 👐

🚨 *العرض ده مش هيتكرر تاني!*
    دي فرصتك علشان تستفيد بأحسن سعر وبسرعة مش هتلاقيها تاني! ⚡


💡 *وعدنا ليك:*
    - *هتستلم بياناتك بعد التأكيد.* ✅
    - *العملية سريعة ومباشرة علشان نوفرلك وقتك.* ⏱️
    `;


    // رقم واتساب الخاص بك (تأكد من إدخال الرقم بشكل صحيح)
    const whatsappNumber = '+201033939828'; // استبدل XXXXXXXXXXX برقمك

    // إنشاء رابط واتساب
    const whatsappLink = `https://wa.me/+2${whatsappNumber}?text=${encodeURIComponent(orderDetails)}`;

    // فتح واتساب في نافذة جديدة
    window.open(whatsappLink, '_blank');

    // إغلاق النافذة المنبثقة
    closeAllModals();
  });







  // إغلاق النافذة عند النقر على زر الإغلاق
  document.querySelectorAll('.modal__close-btn').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  // إغلاق النافذة عند النقر خارج المحتوى
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      closeAllModals();
    }
  });
});


// إغلاق جميع النوافذ المنبثقة
export function closeAllModals() {
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.style.display = 'none';
  });
}
// فتح النافذة المنبثقة
function openModal(modal) {
  modal.style.display = 'flex';
  modal.querySelector('.modal__content').focus();
}

export function showBuyModal() {
    openModal(buyModal);
    updateTotalPrice();

}
