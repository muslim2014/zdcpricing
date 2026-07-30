import { getCategories } from "../../api/categoriesApi";
import { getServices } from "../../api/servicesApi";

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

      <div class="top-bar">

        <button
          id="backToDashboard"
          class="back-btn"
        >
          ←
        </button>

        <h2>إدارة الخدمات</h2>

      </div>

      <div class="glass-card">

        <p style="margin-bottom:20px">
          اختر القسم
        </p>

        ${categoriesWithCount.map(category => `

          <button
            class="glass-button open-category-services"
            data-id="${category.id}"
            style="margin-bottom:12px;width:100%"
          >

            ${category.name}

            <span style="float:left">
              (${category.servicesCount})
            </span>

          </button>

        `).join("")}

      </div>

    </div>
  `;
}