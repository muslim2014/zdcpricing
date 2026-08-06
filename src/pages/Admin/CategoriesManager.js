import {
  getCategories,
  createCategory,
  updateCategory as updateCategoryApi,
  updateCategoryImage,
  deleteCategory as deleteCategoryApi
} from "../../api/categoriesApi";

import { uploadImage } from "../../lib/uploadImage";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function CategoriesManager() {

  const categories = await getCategories();

  return `
    <div class="container">

      ${TopBar("إدارة الأقسام")}

      <div class="glass-card">

        ${categories.map(category => `

          <div
            class="admin-list-item"
            style="
              display:flex;
              flex-direction:column;
              gap:14px;
            "
          >

            <div
              style="
                display:flex;
                align-items:center;
                gap:16px;
              "
            >

              <img
                src="${category.image || "/placeholder.png"}"
                style="
                  width:70px;
                  height:70px;
                  border-radius:12px;
                  object-fit:cover;
                  flex-shrink:0;
                "
              >

              <input
                class="glass-input category-name"
                data-id="${category.id}"
                value="${category.name}"
                style="flex:1;font-size:16px;font-weight:600"
              >

            </div>

            <div
              style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:8px;
                flex-wrap:wrap;
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

              ${GlassButton("🖼 تغيير الصورة", {
                type: "button",
                onclick: `document.getElementById('category-image-${category.id}').click()`,
                style: "padding:8px 12px;font-size:13px"
              })}

              <div
                style="
                  display:flex;
                  gap:8px;
                  flex-wrap:wrap;
                  justify-content:flex-end;
                  align-items:center;
                "
              >

                ${GlassButton("⬆️", {
                  className: "move-category-up",
                  data: { id: category.id }
                })}

                ${GlassButton("⬇️", {
                  className: "move-category-down",
                  data: { id: category.id }
                })}

                ${GlassButton(category.visible ? "👁️" : "🚫", {
                  className: "toggle-category-visible",
                  data: {
                    id: category.id,
                    visible: category.visible
                  }
                })}

                ${GlassButton(category.featured ? "⭐" : "☆", {
                  className: "toggle-category-featured",
                  data: {
                    id: category.id,
                    featured: category.featured
                  }
                })}

                ${GlassButton("💾", {
                  className: "save-category",
                  data: { id: category.id }
                })}

                ${GlassButton("🗑️", {
                  className: "delete-category",
                  data: { id: category.id }
                })}

              </div>

            </div>

          </div>

        `).join("")}

        ${GlassButton("➕ إضافة قسم", {
          id: "addCategoryBtn",
          style: "margin-top:20px"
        })}

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