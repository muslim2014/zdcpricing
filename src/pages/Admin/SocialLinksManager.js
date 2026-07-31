import {
  getSocialLinks
} from "../../api/socialLinksApi";

export async function SocialLinksManager() {

  const links =
    await getSocialLinks();

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
          إدارة روابط التواصل
        </h2>

      </div>

      <div class="admin-list">

        ${links.map(link => `

          <div class="admin-list-item">

            <div>

              <h3>

                ${link.icon}
                ${link.title}

              </h3>

              <small>

                ${link.platform}

              </small>

            </div>

            <input
              class="glass-input social-url"
              data-id="${link.id}"
              value="${link.url ?? ""}"
              placeholder="الرابط"
            >

            <div
              style="
              display:flex;
              gap:8px;
              flex-wrap:wrap;
              "
            >

              <button
                class="glass-button move-social-up"
                data-id="${link.id}"
              >
                ↑
              </button>

              <button
                class="glass-button move-social-down"
                data-id="${link.id}"
              >
                ↓
              </button>

              <button
                class="glass-button toggle-social"
                data-id="${link.id}"
                data-visible="${link.visible}"
              >
                ${
                  link.visible
                    ? "إخفاء"
                    : "إظهار"
                }
              </button>

              <button
                class="glass-button save-social"
                data-id="${link.id}"
              >
                حفظ
              </button>

            </div>

          </div>

        `).join("")}

      </div>

    </div>
  `;

}