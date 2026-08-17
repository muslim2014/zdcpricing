import {
  getEquipmentSection
} from "../../api/equipmentApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function EquipmentSectionEditor(id = null) {

  const section = id
    ? await getEquipmentSection(id)
    : {
        title: ""
      };

  if (id && !section) {

    return `
      <div class="container">
        <h2>الخط غير موجود</h2>
      </div>
    `;

  }

  return `
    <div class="container">

      ${TopBar(id ? "تعديل خط" : "إضافة خط", "backToEquipment")}

      <div class="glass-card">

        <div class="form-group">

          <label>اسم الخط</label>

          <input
            id="equipmentSectionTitle"
            class="glass-input"
            value="${section.title || ""}"
          >

        </div>

        ${GlassButton("💾 حفظ", {
          id: "saveEquipmentSectionBtn",
          data: { id: section.id || "" }
        })}

      </div>

    </div>
  `;

}