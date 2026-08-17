import {
  getEquipmentSectionsWithItems
} from "../../api/equipmentApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function EquipmentManager() {

  const sections =
    await getEquipmentSectionsWithItems();

  const lines = sections.map(section => ({
    ...section,
    items: (section.items || []).sort(
      (a, b) =>
        Number(a.sort_order) - Number(b.sort_order)
    )
  }));

  return `
    <div class="container equipment-admin">

      ${TopBar("إدارة تجهيزات العيادة")}

      <div class="equipment-admin-actions">

        ${GlassButton("➕ إضافة خط", {
          id: "addEquipmentSectionBtn"
        })}

      </div>

      ${
        !lines.length
          ? `
            <div class="glass-card">
              <p style="text-align:center;opacity:.8">
                لا توجد خطوط بعد. ابدأ بإضافة خط.
              </p>
            </div>
          `
          : lines.map(section => `

            <div class="glass-card equipment-line">

              <div class="equipment-line-header">

                <div class="equipment-line-info">

                  <span class="equipment-line-icon">
                    ${section.icon || "🦷"}
                  </span>

                  <div class="equipment-line-meta">

                    <div class="equipment-line-title-row">

                      <span class="equipment-type-badge equipment-type-badge-line">
                        خط
                      </span>

                      <strong>${section.title}</strong>

                    </div>

                    ${
                      section.description
                        ? `
                          <div class="equipment-line-sub">
                            ${section.description}
                          </div>
                        `
                        : ""
                    }

                  </div>

                </div>

                <div class="equipment-line-actions">

                  ${GlassButton("⬆️", {
                    className: "move-equipment-section-up",
                    data: { id: section.id },
                    title: "تحريك الخط لأعلى"
                  })}

                  ${GlassButton("⬇️", {
                    className: "move-equipment-section-down",
                    data: { id: section.id },
                    title: "تحريك الخط لأسفل"
                  })}

                  ${GlassButton(
                    section.visible
                      ? "👁️ ظاهر"
                      : "🚫 مخفي",
                    {
                      className: "toggle-equipment-section-visible",
                      data: {
                        id: section.id,
                        visible: section.visible
                      },
                      title: "إظهار / إخفاء الخط"
                    }
                  )}

                  ${GlassButton("✏️", {
                    className: "edit-equipment-section",
                    data: { id: section.id },
                    title: "تعديل الخط"
                  })}

                  ${GlassButton("🗑️", {
                    className: "delete-equipment-section",
                    data: { id: section.id },
                    title: "حذف الخط وكروته"
                  })}

                </div>

              </div>

              <div class="equipment-line-cards">

                ${
                  !section.items.length
                    ? `
                      <div class="equipment-empty">
                        لا توجد كروت في هذا الخط
                      </div>
                    `
                    : section.items.map(item => `

                      <div class="equipment-card-row">

                        <div class="equipment-card-thumb">

                          ${
                            item.image
                              ? `
                                <img
                                  src="${item.image}"
                                  alt="${item.title}"
                                >
                              `
                              : `<span>🦷</span>`
                          }

                        </div>

                        <div class="equipment-card-info">

                          <div class="equipment-card-title-row">

                            <span class="equipment-type-badge equipment-type-badge-card">
                              كارت
                            </span>

                            <strong>${item.title}</strong>

                          </div>

                          ${
                            item.features
                              ? `
                                <div class="equipment-card-sub">
                                  ${
                                    item.features
                                      .split("\n")
                                      .filter(Boolean)
                                      .length
                                  } مميزات
                                </div>
                              `
                              : ""
                          }

                        </div>

                        <span
                          class="equipment-visible-badge ${
                            item.visible === false ? "hidden" : ""
                          }"
                        >
                          ${
                            item.visible === false
                              ? "مخفي"
                              : "ظاهر"
                          }
                        </span>

                        <div class="equipment-card-actions">

                          ${GlassButton("⬆️", {
                            className: "move-equipment-item-up",
                            data: { id: item.id },
                            title: "تحريك الكارت لأعلى"
                          })}

                          ${GlassButton("⬇️", {
                            className: "move-equipment-item-down",
                            data: { id: item.id },
                            title: "تحريك الكارت لأسفل"
                          })}

                          ${GlassButton(
                            item.visible === false
                              ? "👁️"
                              : "🚫",
                            {
                              className: "toggle-equipment-item-visible",
                              data: {
                                id: item.id,
                                visible: item.visible !== false
                              },
                              title: "إظهار / إخفاء الكارت"
                            }
                          )}

                          ${GlassButton("✏️", {
                            className: "edit-equipment-card",
                            data: {
                              section: section.id,
                              id: item.id
                            },
                            title: "تعديل الكارت"
                          })}

                          ${GlassButton("🗑️", {
                            className: "delete-equipment-card",
                            data: {
                              section: section.id,
                              id: item.id
                            },
                            title: "حذف الكارت"
                          })}

                        </div>

                      </div>

                    `).join("")
                }

                ${GlassButton("➕ إضافة كارت", {
                  className: "add-equipment-card",
                  data: { section: section.id }
                })}

              </div>

            </div>

          `).join("")
      }

    </div>
  `;
}