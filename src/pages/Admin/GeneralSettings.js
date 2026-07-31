import { getSettings } from "../../api/settingsApi";

export async function GeneralSettings() {

  const settings = await getSettings();

  return `
    <div class="container">

      <div class="top-bar">

        <button
          id="backToDashboard"
          class="back-btn"
        >
          ←
        </button>

        <h2>الإعدادات العامة</h2>

      </div>

      <div class="glass-card">

        <div class="form-group">
          <label>اسم العيادة</label>
          <input
            id="clinicName"
            class="glass-input"
            value="${settings.clinicName}"
          >
        </div>

        <div class="form-group">
          <label>اسم الطبيب</label>
          <input
            id="doctorName"
            class="glass-input"
            value="${settings.doctorName}"
          >
        </div>

        <div class="form-group">
          <label>اللوجو</label>
          <input
            id="logo"
            class="glass-input"
            value="${settings.logo}"
          >
        </div>

        <div class="form-group">
          <label>عنوان زر الخدمات</label>
          <input
            id="pricingTitle"
            class="glass-input"
            value="${settings.pricingTitle}"
          >
        </div>

        <div class="form-group">
          <label>وصف زر الخدمات</label>
          <textarea
            id="pricingDescription"
            class="glass-input"
            rows="3"
          >${settings.pricingDescription}</textarea>
        </div>

        <div class="form-group">
          <label>العنوان</label>
          <input
            id="address"
            class="glass-input"
            value="${settings.address}"
          >
        </div>

        <button
          id="saveGeneralSettings"
          class="glass-button"
        >
          حفظ التعديلات
        </button>

      </div>

    </div>
  `;

}