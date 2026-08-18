import {
  getSection,
  saveSection
} from "../../api/sectionsApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function SectionEditor(id = null) {

  const isNew = !id;

  const section = isNew
    ? {
        section_key: "",
        title: "",
        description: "",
        icon: "",
        button_text: "",
        button_link: "",
        visible: true
      }
    : await getSection(id);

  if (!isNew && !section) {

    return `
      <div class="container">
        <h2>القسم غير موجود</h2>
      </div>
    `;

  }

  return `
    <div class="container">

      ${TopBar(
        isNew ? "إضافة كارت" : "تعديل الكارت",
        "backToHomeSections"
      )}

      <div class="glass-card">

        <div class="form-group">

          <label>المفتاح (section_key) — يُستخدم لربط الكارت بصفحته</label>

          <input
            id="sectionKey"
            class="glass-input"
            value="${section.section_key || ""}"
            ${isNew ? "" : "disabled"}
          >

          ${
            isNew
              ? ""
              : `
                <div
                  style="
                    opacity:.65;
                    font-size:12px;
                    margin-top:6px;
                  "
                >
                  المفتاح ثابت ولا يمكن تغييره بعد الإنشاء.
                </div>
              `
          }

        </div>

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

          <label>الأيقونة (Emoji)</label>

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

        <div
          style="
            display:flex;
            align-items:center;
            gap:10px;
            margin-bottom:25px;
          "
        >

          <input
            id="sectionVisible"
            type="checkbox"

            ${section.visible ? "checked" : ""}

          >

          <label>إظهار الكارت</label>

        </div>

        ${GlassButton(
          isNew ? "➕ إضافة الكارت" : "💾 حفظ التعديلات",
          {
            id: "saveSectionBtn",
            data: { id: section.id || "" }
          }
        )}

      </div>

    </div>
  `;
}