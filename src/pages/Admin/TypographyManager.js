import { getTypography } from "../../api/typographyApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function TypographyManager() {

  const t = await getTypography();

  return `
    <div class="container">

      ${TopBar("أحجام النصوص")}

      <div class="glass-card">

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

        ${GlassButton("حفظ التعديلات", {
          id: "saveTypography"
        })}

      </div>

    </div>
  `;

}