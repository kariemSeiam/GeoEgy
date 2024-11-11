// modules/exportData.js

import { filteredData } from '../script.js';

export function exportFullDataCSV() {
    const fullDataEntries = filteredData.map(item => ({
        'اسم المكان': item.name || '',
        'الوصف': item.about || '',
        'رقم الهاتف': item.phone_number || '',
        'خط العرض': item.coordinates ? item.coordinates.latitude : '',
        'خط الطول': item.coordinates ? item.coordinates.longitude : '',
        'الموقع الإلكتروني': item.url || '',
        'عدد المراجعات': item.reviews ? item.reviews.count : '',
        'متوسط التقييم': item.reviews ? item.reviews.average_rating : '',
        'العنوان': item.address ? item.address.formatted_address : '',
        'الفئة': item.additional_info ? item.additional_info.category : '',
    }));

    if (fullDataEntries.length === 0) {
        alert('لا توجد بيانات للتصدير.');
        return;
    }

    const csvContent = convertToCSV(fullDataEntries);
    downloadCSV(csvContent, 'بيانات_الأماكن.csv');
}

function convertToCSV(dataArray) {
    const headers = Object.keys(dataArray[0]);
    const csvRows = dataArray.map(row =>
        headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(',')
    );
    return [headers.join(','), ...csvRows].join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
