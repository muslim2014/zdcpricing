import {
  toggleSectionVisibility,
  toggleSectionFeatured,
  moveSectionUp,
  moveSectionDown
} from "../../api/sectionsApi";

import { showAlert } from "../../utils/dialogs";

export function attachHomeSectionsEvents(router) {

  /* ========================= */
  /* إضافة كارت جديد */
  /* ========================= */

  document
    .querySelector(".add-section")
    ?.addEventListener("click", () => {

      router.renderSectionEditor(null);

    });

  /* ========================= */
  /* إظهار / إخفاء */
  /* ========================= */

  document
    .querySelectorAll(".toggle-section-visible")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await toggleSectionVisibility(
            Number(btn.dataset.id),
            btn.dataset.visible !== "true"
          );

          await router.renderHomeSections();

        } catch (error) {

          console.error(error);
          showAlert(error.message);

        }

      });

    });

  /* ========================= */
  /* مميز / غير مميز */
  /* ========================= */

  document
    .querySelectorAll(".toggle-section-featured")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await toggleSectionFeatured(
            Number(btn.dataset.id),
            btn.dataset.featured !== "true"
          );

          await router.renderHomeSections();

        } catch (error) {

          console.error(error);
          showAlert(error.message);

        }

      });

    });

  /* ========================= */
  /* تحريك لأعلى */
  /* ========================= */

  document
    .querySelectorAll(".move-section-up")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await moveSectionUp(
            Number(btn.dataset.id)
          );

          await router.renderHomeSections();

        } catch (error) {

          console.error(error);
          showAlert(error.message);

        }

      });

    });

  /* ========================= */
  /* تحريك لأسفل */
  /* ========================= */

  document
    .querySelectorAll(".move-section-down")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await moveSectionDown(
            Number(btn.dataset.id)
          );

          await router.renderHomeSections();

        } catch (error) {

          console.error(error);
          showAlert(error.message);

        }

      });

    });

  /* ========================= */
  /* تعديل */
  /* ========================= */

  document
    .querySelectorAll(".edit-section")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        router.renderSectionEditor(
          Number(btn.dataset.id)
        );

      });

    });

}