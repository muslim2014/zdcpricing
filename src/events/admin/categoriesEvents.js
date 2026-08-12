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

import {
  showAlert,
  showConfirm
} from "../../utils/dialogs";

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

        if (!showConfirm("حذف القسم؟")) return;

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

        try {

          await uploadCategoryImage(
            input.dataset.id,
            file
          );

          await router.renderCategoriesManager();

        } catch (error) {

          console.error(
            "خطأ أثناء استبدال صورة القسم:",
            error
          );

          showAlert(
            error?.message ||
            "حدث خطأ أثناء حفظ الصورة"
          );

        }

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