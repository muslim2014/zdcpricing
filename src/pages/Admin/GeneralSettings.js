import { getSettings } from "../../api/settingsApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

const LOGO_PLACEHOLDER =
  "https://placehold.co/220x220?text=Logo";

export async function GeneralSettingsContent() {

  const settings = await getSettings();

  const logo = settings.logo || LOGO_PLACEHOLDER;

  return `
        <div class="glass-card">

        <div
          class="form-group"
          style="
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:12px;
          "
        >

          <label>اللوجو</label>

          <img
            id="logoPreview"
            src="${logo}"
            alt="اللوجو"
            style="
              width:140px;
              height:140px;
              object-fit:cover;
              border-radius:20px;
              border:2px solid rgba(255,255,255,.2);
              background:rgba(255,255,255,.1);
            "
          >

          ${GlassButton("تغيير الصورة", {
            id: "changeLogoBtn",
            type: "button"
          })}

          <input
            id="logo"
            type="file"
            accept="image/*"
            style="display:none"
          >

        </div>

        <div class="form-group">
          <label>عرض اللوجو (بالبكسل)</label>
          <input
            id="logoWidth"
            type="number"
            class="glass-input"
            value="${settings.logoWidth}"
            data-original="${settings.logoWidth}"
            min="80"
            max="600"
          >
        </div>

        <div class="form-group">
          <label>اسم العيادة</label>
          <input
            id="clinicName"
            class="glass-input"
            value="${settings.clinicName}"
            data-original="${settings.clinicName}"
          >
        </div>

        <div class="form-group">
          <label>اسم الطبيب</label>
          <input
            id="doctorName"
            class="glass-input"
            value="${settings.doctorName}"
            data-original="${settings.doctorName}"
          >
        </div>

        <div class="form-group">
          <label>عنوان زر الخدمات</label>
          <input
            id="pricingTitle"
            class="glass-input"
            value="${settings.pricingTitle}"
            data-original="${settings.pricingTitle}"
          >
        </div>

        <div class="form-group">
          <label>وصف زر الخدمات</label>
          <textarea
            id="pricingDescription"
            class="glass-input"
            rows="3"
            data-original="${settings.pricingDescription}"
          >${settings.pricingDescription}</textarea>
        </div>

        <div class="form-group">
          <label>عنوان صفحة الأقسام</label>
          <input
            id="categoriesPageTitle"
            class="glass-input"
            value="${settings.categoriesPageTitle}"
            data-original="${settings.categoriesPageTitle}"
          >
        </div>

        <div class="form-group">
          <label>رقم الواتساب</label>
          <input
            id="whatsappNumber"
            class="glass-input"
            value="${settings.whatsappNumber}"
            data-original="${settings.whatsappNumber}"
            placeholder="مثال: 201011122233"
          >
        </div>

      </div>
  `;

}

export async function GeneralSettings() {

  return `
    <div class="container">

      ${TopBar("الإعدادات العامة")}

      ${await GeneralSettingsContent()}

    </div>
  `;

}
