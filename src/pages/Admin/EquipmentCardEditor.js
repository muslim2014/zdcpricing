import {
  getEquipmentItem,
  getEquipmentSections
} from "../../api/equipmentApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function EquipmentCardEditor(sectionId, cardId = null) {

  const isNew = !cardId;

  const [card, sections] = await Promise.all([
    isNew
      ? Promise.resolve({
          section_id: Number(sectionId),
          title: "",
          description: "",
          image: "",
          features: "",
          visible: true
        })
      : getEquipmentItem(cardId),
    getEquipmentSections()
  ]);

  if (!isNew && !card) {

    return `
      <div class="container">
        <h2>الكارت غير موجود</h2>
      </div>
    `;

  }

  const currentSection = sections.find(
    s => Number(s.id) === Number(sectionId)
  );

  const sectionOptions = sections
    .filter(s => Number(s.id) !== Number(sectionId))
    .map(s => `
      <option value="${s.id}">${s.title}</option>
    `)
    .join("");

  return `
    <div class="container">

      ${TopBar(
        isNew ? "إضافة كارت" : "تعديل الكارت",
        "backToEquipment"
      )}

      <div class="glass-card">

        <div class="form-group">

          <label>اسم الجهاز</label>

          <input
            id="equipmentCardTitle"
            class="glass-input"
            value="${card.title || ""}"
          >

        </div>

        <div class="form-group">

          <label>صورة الجهاز</label>

          <input
            id="equipmentCardImage"
            class="glass-input"
            type="file"
            accept="image/*"
            data-current="${card.image || ""}"
          >

        </div>

        <div
          id="equipmentCardImagePreview"
          style="
            margin-top:15px;
            text-align:center;
          "
        >

          ${
            card.image
              ? `
                <img
                  src="${card.image}"
                  style="
                    max-width:220px;
                    max-height:180px;
                    border-radius:12px;
                  "
                >
              `
              : ""
          }

        </div>

        <div class="form-group">

          <label>الوصف</label>

          <textarea
            id="equipmentCardDescription"
            class="glass-input"
            rows="4"
          >${card.description || ""}</textarea>

        </div>

        <div class="form-group">

          <label>المميزات</label>

          <textarea
            id="equipmentCardFeatures"
            class="glass-input"
            rows="4"
            placeholder="كل مميزة في سطر منفصل"
          >${card.features || ""}</textarea>

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
            id="equipmentCardVisible"
            type="checkbox"

            ${card.visible ? "checked" : ""}

          >

          <label>إظهار الكارت</label>

        </div>

        ${
          isNew
            ? ""
            : `
              <div class="form-group">

                <label>الخط الحالي</label>

                <input
                  class="glass-input"
                  value="${
                    currentSection
                      ? currentSection.title
                      : "غير محدد"
                  }"
                  readonly
                >

              </div>

              <div class="form-group">

                <label>نقل إلى خط آخر</label>

                <select
                  id="equipmentCardMoveSection"
                  class="glass-input"
                >

                  <option value="">
                    اختر الخط...
                  </option>

                  ${sectionOptions}

                </select>

              </div>

              ${GlassButton("↔️ نقل الكارت", {
                id: "moveEquipmentCardBtn",
                data: {
                  section: sectionId,
                  id: card.id
                },
                style: "margin-top:12px;background:#2e7d32"
              })}
            `
        }

        ${GlassButton(
          isNew ? "➕ إضافة الكارت" : "💾 حفظ",
          {
            id: "saveEquipmentCardBtn",
            data: {
              section: sectionId,
              id: card.id || ""
            }
          }
        )}

        ${
          isNew
            ? ""
            : `
              ${GlassButton("🗑 حذف الكارت", {
                id: "deleteEquipmentCardBtn",
                data: {
                  section: sectionId,
                  id: card.id
                },
                style: "margin-top:12px;background:#b22222"
              })}
            `
        }

      </div>

    </div>
  `;
}