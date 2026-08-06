import { getCategories } from "../../api/categoriesApi";
import { getServices } from "../../api/servicesApi";
import { TopBar } from "../../components/TopBar";

export async function ServicesManager() {

  const categories = await getCategories();

  const categoriesWithCount = await Promise.all(

    categories.map(async category => ({

      ...category,

      servicesCount: (await getServices(category.id)).length

    }))

  );

  return `
    <div class="container">

      ${TopBar("إدارة الخدمات")}

      <div class="glass-card">

        <p style="margin-bottom:20px">
          اختر القسم
        </p>

        <input
          id="categorySearch"
          class="glass-input"
          placeholder="بحث عن قسم..."
          style="margin-bottom:20px"
        >

        <div class="category-select-grid">

          ${categoriesWithCount.map(category => `

            <button
              class="category-select-card open-category-services"
              data-id="${category.id}"
              data-name="${category.name}"
              type="button"
            >

              <div class="category-select-image">

                ${
                  category.image
                    ? `
                      <img
                        src="${category.image}"
                        alt="${category.name}"
                      >
                    `
                    : `
                      <div class="category-select-placeholder">
                        📂
                      </div>
                    `
                }

              </div>

              <div class="category-select-name">
                ${category.name}
              </div>

              <div class="category-select-count">
                ${category.servicesCount} خدمة
              </div>

            </button>

          `).join("")}

        </div>

      </div>

    </div>
  `;
}
