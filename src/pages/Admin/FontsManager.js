import {
  getFonts,
  getCurrentFont
} from "../../api/fontsApi";

export async function FontsManager() {

  const fonts = await getFonts();

  const currentFont =
    await getCurrentFont();

  return `
    <div class="container">

      <div class="top-bar">

        <button
          id="backToDashboard"
          class="back-btn"
        >
          ←
        </button>

        <h2>
          إدارة الخطوط
        </h2>

      </div>

      <div class="glass-card">

        <input
          id="fontFile"
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          class="glass-input"
        >

        <button
          id="uploadFont"
          class="glass-button"
        >
          رفع خط جديد
        </button>

      </div>

      <div class="admin-list">

        ${fonts.map(font => `

          <div class="admin-list-item">

            <div>

              <strong>
                ${font.name}
              </strong>

              ${font.is_system
                ? "<br><small>خط افتراضي</small>"
                : ""}

              ${
                Number(currentFont) === Number(font.id)
                  ? "<br><small style='color:#2EA3B3'>✔ الخط الحالي</small>"
                  : ""
              }

            </div>

            <div
              style="
                display:flex;
                gap:10px;
              "
            >

              <button
                class="glass-button use-font"
                data-id="${font.id}"
              >
                استخدام
              </button>

              ${!font.is_system ? `

                <button
                  class="glass-button delete-font"
                  data-id="${font.id}"
                >
                  حذف
                </button>

              ` : ""}

            </div>

          </div>

        `).join("")}

      </div>

    </div>
  `;

}