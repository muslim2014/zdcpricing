import { getTypography } from "../../api/typographyApi";

export async function TypographyManager() {

  const t = await getTypography();

  return `
    <div class="container">

      <div class="top-bar">

        <button
          id="backToDashboard"
          class="back-btn"
        >
          ←
        </button>

        <h2>إدارة الخطوط</h2>

      </div>

      <div class="glass-card">

        <div class="form-group">
          <label>Font Family</label>

          <select
            id="fontFamily"
            class="glass-input"
          >
            ${[
              "Cairo",
              "Tajawal",
              "IBM Plex Sans Arabic",
              "Noto Kufi Arabic"
            ].map(font => `
              <option
                value="${font}"
                ${t.font_family === font ? "selected" : ""}
              >
                ${font}
              </option>
            `).join("")}
          </select>
        </div>

        <div class="form-group">
          <label>حجم اللوجو</label>
          <input
            id="logoSize"
            class="glass-input"
            type="number"
            value="${t.logo_size}"
          >
        </div>

        <div class="form-group">
          <label>حجم اسم العيادة</label>
          <input
            id="clinicNameSize"
            class="glass-input"
            type="number"
            value="${t.clinic_name_size}"
          >
        </div>

        <div class="form-group">
          <label>حجم اسم الطبيب</label>
          <input
            id="doctorNameSize"
            class="glass-input"
            type="number"
            value="${t.doctor_name_size}"
          >
        </div>

        <div class="form-group">
          <label>حجم عنوان الكارت</label>
          <input
            id="cardTitleSize"
            class="glass-input"
            type="number"
            value="${t.card_title_size}"
          >
        </div>

        <div class="form-group">
          <label>حجم وصف الكارت</label>
          <input
            id="cardDescriptionSize"
            class="glass-input"
            type="number"
            value="${t.card_description_size}"
          >
        </div>

        <div class="form-group">
          <label>حجم أيقونة الكارت</label>
          <input
            id="cardIconSize"
            class="glass-input"
            type="number"
            value="${t.card_icon_size}"
          >
        </div>

        <div class="form-group">
          <label>حجم أيقونات التواصل</label>
          <input
            id="socialIconSize"
            class="glass-input"
            type="number"
            value="${t.social_icon_size}"
          >
        </div>

        <button
          id="saveTypography"
          class="glass-button"
        >
          حفظ التعديلات
        </button>

      </div>

    </div>
  `;

}