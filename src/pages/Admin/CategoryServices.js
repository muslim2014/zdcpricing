import {
  getCategories
} from "../../api/categoriesApi";

import {
  getServices
} from "../../api/servicesApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function CategoryServices(categoryId) {

  const categories = await getCategories();

  const category = categories.find(
    c => Number(c.id) === Number(categoryId)
  );

  if (!category) {

    return `
      <div class="container">
        <h2>القسم غير موجود</h2>
      </div>
    `;

  }

  const services = await getServices(categoryId);

  return `
    <div class="container">

      ${TopBar(category.name, "backToServicesManager")}

      <div class="glass-card">

        <input
          id="categoryServiceSearch"
          class="glass-input"
          placeholder="بحث عن خدمة..."
          style="margin-bottom:20px"
        >

        ${services.map(service => `

          <div
            class="admin-list-item"
            data-name="${service.name}"
          >

            <div>

              <strong>${service.name}</strong>

              <div style="opacity:.7;font-size:13px">

                ${
                  service.price
                    ? service.price + " جنيه"
                    : "بدون سعر"
                }

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
                className: "move-up",
                data: { id: service.id }
              })}

              ${GlassButton("⬇️", {
                className: "move-down",
                data: { id: service.id }
              })}

              ${GlassButton(
                service.visible
                  ? "👁️ ظاهر"
                  : "🚫 مخفي",
                {
                  className: "toggle-visible",
                  data: {
                    id: service.id,
                    visible: service.visible
                  }
                }
              )}

              ${GlassButton(
                service.featured
                  ? "⭐ مميز"
                  : "☆ عادي",
                {
                  className: "toggle-featured",
                  data: {
                    id: service.id,
                    featured: service.featured
                  }
                }
              )}

              ${GlassButton("✏️", {
                className: "edit-service",
                data: {
                  category: category.id,
                  id: service.id
                }
              })}

              ${GlassButton("🗑️", {
                className: "delete-service",
                data: {
                  category: category.id,
                  id: service.id
                }
              })}

            </div>

          </div>

        `).join("")}

        ${GlassButton("➕ إضافة خدمة", {
          id: "addServiceBtn",
          data: { category: category.id },
          style: "margin-top:20px"
        })}

      </div>

    </div>
  `;
}