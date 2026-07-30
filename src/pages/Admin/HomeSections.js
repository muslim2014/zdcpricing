import {
  getSections
} from "../../api/sectionsApi";

export async function HomeSections() {

  const sections = await getSections("home");

  return `
    <div class="container">

      <div class="top-bar">

        <button
          id="backToDashboard"
          class="back-btn"
        >
          ←
        </button>

        <h2>إدارة الصفحة الرئيسية</h2>

      </div>

      <div class="glass-card">

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

              <button
                class="glass-button move-section-up"
                data-id="${section.id}"
              >
                ⬆️
              </button>

              <button
                class="glass-button move-section-down"
                data-id="${section.id}"
              >
                ⬇️
              </button>

              <button
                class="glass-button toggle-section-visible"
                data-id="${section.id}"
                data-visible="${section.visible}"
              >
                ${
                  section.visible
                    ? "👁️ ظاهر"
                    : "🚫 مخفي"
                }
              </button>

              <button
                class="glass-button toggle-section-featured"
                data-id="${section.id}"
                data-featured="${section.featured}"
              >
                ${
                  section.featured
                    ? "⭐ مميز"
                    : "☆ عادي"
                }
              </button>

              <button
                class="glass-button edit-section"
                data-id="${section.id}"
              >
                ✏️
              </button>

            </div>

          </div>

        `).join("")}

      </div>

    </div>
  `;

}