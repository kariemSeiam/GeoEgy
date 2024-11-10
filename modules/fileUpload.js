// modules/fileUpload.js

import { rawData } from '../script.js';
import { cleanData } from './utils.js';
import { initializeFilters, applyFilters } from './filters.js';

export function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file && file.type === "application/json") {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        rawData.length = 0;
        rawData.push(...cleanData(JSON.parse(e.target.result)));
        initializeFilters();
        applyFilters();
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert('ملف JSON غير صالح. تأكد من أن الملف يحتوي على JSON صحيح.');
      }
    };
    reader.readAsText(file);
  } else {
    alert('يرجى تحميل ملف JSON صالح.');
  }
}
