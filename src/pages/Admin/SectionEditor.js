import {
  getSection,
  saveSection
} from "../../api/sectionsApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function SectionEditor(id) {

  const section = await getSection(id);

  if (!section) {

    return `
      <div class="container">
        <h2>القسم غير موجود</h2>
      </div>
    `;

  }

  return `
    <div class="container">

      ${TopBar("تعديل القسم", "backToHomeSections")}

      <div class="glass-card">

        <div class="form-group">

          <label>العنوان</label>

          <input
            id="sectionTitle"
            class="glass-input"
            value="${section.title || ""}"
          >

        </div>

        <div class="form-group">

          <label>الوصف</label>

          <textarea
            id="sectionDescription"
            class="glass-input"
            rows="3"
          >${section.description || ""}</textarea>

        </div>

        <div class="form-group">

          <label>الأيقونة</label>

          <input
            id="sectionIcon"
            class="glass-input"
            value="${section.icon || ""}"
          >

        </div>

        <div class="form-group">

          <label>نص الزر</label>

          <input
            id="sectionButtonText"
            class="glass-input"
            value="${section.button_text || ""}"
          >

        </div>

        <div class="form-group">

          <label>رابط الزر</label>

          <input
            id="sectionButtonLink"
            class="glass-input"
            value="${section.button_link || ""}"
          >

        </div>

        ${GlassButton("💾 حفظ التعديلات", {
          id: "saveSectionBtn",
          data: { id: section.id }
        })}

      </div>

    </div>
  `;
}