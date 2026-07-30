import {
  getCategories,
  createCategory,
  updateCategory as updateCategoryApi,
  updateCategoryImage,
  deleteCategory as deleteCategoryApi
} from "../../api/categoriesApi";

import { uploadImage } from "../../lib/uploadImage";

export async function CategoriesManager() {

  const categories = await getCategories();

  return `
    <div class="container">

      <div class="top-bar">

        <button
          id="backToDashboard"
          class="back-btn"
        >
          ←
        </button>

        <h2>إدارة الأقسام</h2>

      </div>

      <div class="glass-card">

        ${categories.map(category => `

          <div
            class="admin-list-item"
            style="
              display:flex;
              align-items:center;
              gap:20px;
            "
          >

            <div
              style="
                display:flex;
                flex-direction:column;
                align-items:center;
                gap:8px;
                min-width:90px;
              "
            >

              <img
                src="${category.image || "/placeholder.png"}"
                style="
                  width:70px;
                  height:70px;
                  border-radius:12px;
                  object-fit:cover;
                "
              >

              <input
                id="category-image-${category.id}"
                type="file"
                class="category-image"
                data-id="${category.id}"
                accept="image/*"
                style="display:none"
              >

              <button
                class="glass-button"
                type="button"
                onclick="document.getElementById('category-image-${category.id}').click()"
                style="
                  padding:6px 10px;
                  font-size:13px;
                "
              >
                🖼 تغيير
              </button>

            </div>

            <div style="flex:1">

              <input
                class="glass-input category-name"
                data-id="${category.id}"
                value="${category.name}"
              >

            </div>

            <div
              style="
                display:flex;
                gap:8px;
                flex-wrap:wrap;
                justify-content:flex-end;
                align-items:center;
              "
            >

              <button
                class="glass-button move-category-up"
                data-id="${category.id}"
              >
                ⬆️
              </button>

              <button
                class="glass-button move-category-down"
                data-id="${category.id}"
              >
                ⬇️
              </button>

              <button
                class="glass-button toggle-category-visible"
                data-id="${category.id}"
                data-visible="${category.visible}"
              >
                ${category.visible ? "👁️" : "🚫"}
              </button>

              <button
                class="glass-button toggle-category-featured"
                data-id="${category.id}"
                data-featured="${category.featured}"
              >
                ${category.featured ? "⭐" : "☆"}
              </button>

              <button
                class="glass-button save-category"
                data-id="${category.id}"
              >
                💾
              </button>

              <button
                class="glass-button delete-category"
                data-id="${category.id}"
              >
                🗑️
              </button>

            </div>

          </div>

        `).join("")}

        <button
          id="addCategoryBtn"
          class="glass-button"
          style="margin-top:20px"
        >
          ➕ إضافة قسم
        </button>

      </div>

    </div>
  `;
}

/* ========================= */

export async function addCategory() {

  const categories = await getCategories();

  await createCategory({

    name: "قسم جديد",

    image: "",

    featured: false,

    visible: true,

    sort_order: categories.length + 1

  });

}

/* ========================= */

export async function updateCategory(id) {

  const input = document.querySelector(
    `.category-name[data-id="${id}"]`
  );

  await updateCategoryApi(id, {

    name: input.value.trim()

  });

}

/* ========================= */

export async function uploadCategoryImage(id, file) {

  const image = await uploadImage(
    file,
    "categories"
  );

  await updateCategoryImage(
    id,
    image
  );

}

/* ========================= */

export async function deleteCategory(id) {

  await deleteCategoryApi(id);

}