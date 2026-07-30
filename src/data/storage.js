const STORAGE_KEY = "zdc_clinic_data";

/**
 * قراءة جميع بيانات الموقع
 */
export function loadData(defaultData = {}) {

  try {

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultData)
      );

      return structuredClone(defaultData);

    }

    const savedData = JSON.parse(stored);

    return {

      ...structuredClone(defaultData),

      ...savedData,

      settings: {

        ...defaultData.settings,

        ...savedData.settings

      }

    };

  } catch (error) {

    console.error("Error loading data:", error);

    return structuredClone(defaultData);

  }

}

/**
 * حفظ جميع بيانات الموقع
 */
export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving data:", error);
    return false;
  }
}

/**
 * حذف جميع البيانات
 */
export function clearData() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * تحديث جزء معين من البيانات
 */
export function updateData(section, value, defaultData = {}) {
  const data = loadData(defaultData);

  data[section] = value;

  saveData(data);

  return data;
}