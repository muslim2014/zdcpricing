import {
  getSections
} from "../../api/sectionsApi";
import { GeneralSettingsContent } from "./GeneralSettings";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function HomeSections() {

  const sections = await getSections("home");

  return `
    <div class="container">

      ${TopBar("إدارة الصفحة الرئيسية")}

      ${await GeneralSettingsContent()}

      <div style="height:30px"></div>

      <div class="glass-card">

        ${GlassButton("➕ إضافة كارت", {
          className: "add-section"
        })}

        <div style="height:16px"></div>

        ${sections.map(section => `

          <div class="admin-list-item">

            <div
              style="
                flex:1;
                display:flex;
                flex-direction:column;
                gap:4px;
              "
            >

              <strong>
                ${section.title}
              </strong>

              <div
                style="
                  opacity:.7;
                  font-size:13px;
                "
              >
                ${section.section_key}
              </div>

            </div>

            <div
              style="
                display:flex;
                gap:8px;
                flex-wrap:wrap;
                justify-content:flex-end;
              "
            >

              ${GlassButton("⬆️", {
                className: "move-section-up",
                data: { id: section.id }
              })}

              ${GlassButton("⬇️", {
                className: "move-section-down",
                data: { id: section.id }
              })}

              ${GlassButton(
                section.visible
                  ? "👁️ ظاهر"
                  : "🚫 مخفي",
                {
                  className: "toggle-section-visible",
                  data: {
                    id: section.id,
                    visible: section.visible
                  }
                }
              )}

              ${GlassButton(
                section.featured
                  ? "⭐ مميز"
                  : "☆ عادي",
                {
                  className: "toggle-section-featured",
                  data: {
                    id: section.id,
                    featured: section.featured
                  }
                }
              )}

              ${GlassButton("✏️", {
                className: "edit-section",
                data: { id: section.id }
              })}

            </div>

          </div>

        `).join("")}

      </div>

    </div>
  `;

}