import {
  getCategories
} from "../../api/categoriesApi";

import {
  getServices
} from "../../api/servicesApi";

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

      <div class="top-bar">

        <button
          id="backToServicesManager"
          class="back-btn"
        >
          ←
        </button>

        <h2>${category.name}</h2>

      </div>

      <div class="glass-card">

        ${services.map(service => `

          <div class="admin-list-item">

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

              <button
                class="glass-button move-up"
                data-id="${service.id}"
              >
                ⬆️
              </button>

              <button
                class="glass-button move-down"
                data-id="${service.id}"
              >
                ⬇️
              </button>

              <button
                class="glass-button toggle-visible"
                data-id="${service.id}"
                data-visible="${service.visible}"
              >
                ${
                  service.visible
                    ? "👁️ ظاهر"
                    : "🚫 مخفي"
                }
              </button>

              <button
                class="glass-button toggle-featured"
                data-id="${service.id}"
                data-featured="${service.featured}"
              >
                ${
                  service.featured
                    ? "⭐ مميز"
                    : "☆ عادي"
                }
              </button>

              <button
                class="glass-button edit-service"
                data-category="${category.id}"
                data-id="${service.id}"
              >
                ✏️
              </button>

              <button
                class="glass-button delete-service"
                data-category="${category.id}"
                data-id="${service.id}"
              >
                🗑️
              </button>

            </div>

          </div>

        `).join("")}

        <button
          id="addServiceBtn"
          class="glass-button"
          data-category="${category.id}"
          style="margin-top:20px"
        >
          ➕ إضافة خدمة
        </button>

      </div>

    </div>
  `;
}