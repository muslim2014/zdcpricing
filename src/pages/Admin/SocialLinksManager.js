import {
  getSocialLinks
} from "../../api/socialLinksApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function SocialLinksManager() {

  const links =
    await getSocialLinks();

  return `
    <div class="container">

      ${TopBar("إدارة روابط التواصل")}

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

              ${GlassButton("↑", {
                className: "move-social-up",
                data: { id: link.id }
              })}

              ${GlassButton("↓", {
                className: "move-social-down",
                data: { id: link.id }
              })}

              ${GlassButton(
                link.visible
                  ? "إخفاء"
                  : "إظهار",
                {
                  className: "toggle-social",
                  data: {
                    id: link.id,
                    visible: link.visible
                  }
                }
              )}

              ${GlassButton("حفظ", {
                className: "save-social",
                data: { id: link.id }
              })}

            </div>

          </div>

        `).join("")}

      </div>

    </div>
  `;

}