import {
  addCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage
} from "../../pages/Admin/CategoriesManager";

import {
  toggleCategoryVisibility,
  toggleCategoryFeatured,
  moveCategoryUp,
  moveCategoryDown
} from "../../api/categoriesApi";

export function attachCategoriesEvents(router) {

  document
    .querySelector("#categoriesBtn")
    ?.addEventListener(
      "click",
      () => router.renderCategoriesManager()
    );

  document
    .querySelector("#addCategoryBtn")
    ?.addEventListener("click", async () => {

      await addCategory();

      await router.renderCategoriesManager();

    });

  document
    .querySelectorAll(".save-category")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await updateCategory(btn.dataset.id);

        await router.renderCategoriesManager();

      });

    });

  document
    .querySelectorAll(".delete-category")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        if (!confirm("حذف القسم؟")) return;

        await deleteCategory(btn.dataset.id);

        await router.renderCategoriesManager();

      });

    });

  document
    .querySelectorAll(".category-image")
    .forEach(input => {

      input.addEventListener("change", async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        await uploadCategoryImage(
          input.dataset.id,
          file
        );

        await router.renderCategoriesManager();

      });

    });

  document
    .querySelectorAll(".toggle-category-visible")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await toggleCategoryVisibility(
          Number(btn.dataset.id),
          btn.dataset.visible !== "true"
        );

        await router.renderCategoriesManager();

      });

    });

  document
    .querySelectorAll(".toggle-category-featured")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await toggleCategoryFeatured(
          Number(btn.dataset.id),
          btn.dataset.featured !== "true"
        );

        await router.renderCategoriesManager();

      });

    });

  document
    .querySelectorAll(".move-category-up")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await moveCategoryUp(
          Number(btn.dataset.id)
        );

        await router.renderCategoriesManager();

      });

    });

  document
    .querySelectorAll(".move-category-down")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await moveCategoryDown(
          Number(btn.dataset.id)
        );

        await router.renderCategoriesManager();

      });

    });

}