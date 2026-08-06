import {
  deleteGalleryImage,
  moveGalleryDown,
  moveGalleryUp,
  toggleGalleryVisibility
} from "../../api/galleryApi";

import {
  showAlert,
  showConfirm
} from "../../utils/dialogs";

export function attachGalleryEvents(router) {

  document
    .querySelector("#backToDashboard")
    ?.addEventListener(
      "click",
      router.renderAdminDashboard
    );

  document
    .querySelector("#addGalleryImageBtn")
    ?.addEventListener("click", () => {

      router.renderGalleryEditor();

    });

  document
    .querySelectorAll(".edit-gallery")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        router.renderGalleryEditor(
          Number(btn.dataset.id)
        );

      });

    });

  document
    .querySelectorAll(".toggle-gallery")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await toggleGalleryVisibility(
            Number(btn.dataset.id),
            btn.dataset.visible !== "true"
          );

          await router.renderGalleryManager();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  document
    .querySelectorAll(".move-gallery-up")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await moveGalleryUp(
            Number(btn.dataset.id)
          );

          await router.renderGalleryManager();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  document
    .querySelectorAll(".move-gallery-down")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await moveGalleryDown(
            Number(btn.dataset.id)
          );

          await router.renderGalleryManager();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  document
    .querySelectorAll(".delete-gallery")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        if (!showConfirm("حذف هذه الصورة؟"))
          return;

        try {

          await deleteGalleryImage(
            Number(btn.dataset.id)
          );

          await router.renderGalleryManager();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

}