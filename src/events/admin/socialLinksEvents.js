import {
  getSocialLinks,
  updateSocialLink,
  toggleSocialVisibility,
  moveSocialUp,
  moveSocialDown
} from "../../api/socialLinksApi";

import { showAlert } from "../../utils/dialogs";

export function attachSocialLinksEvents(router) {

  document
    .querySelector("#backToDashboard")
    ?.addEventListener(
      "click",
      router.renderAdminDashboard
    );

  /* =========================
     حفظ الرابط
  ========================= */

  document
    .querySelectorAll(".save-social")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          const id = Number(btn.dataset.id);

          const input = document.querySelector(
            `.social-url[data-id="${id}"]`
          );

          await updateSocialLink(id, {
            url: input.value.trim()
          });

          showAlert("تم الحفظ");

        }

        catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  /* =========================
     إظهار / إخفاء
  ========================= */

  document
    .querySelectorAll(".toggle-social")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await toggleSocialVisibility(

            Number(btn.dataset.id),

            btn.dataset.visible !== "true"

          );

          router.renderSocialLinksManager();

        }

        catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  /* =========================
     لأعلى
  ========================= */

  document
    .querySelectorAll(".move-social-up")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await moveSocialUp(
            Number(btn.dataset.id)
          );

          router.renderSocialLinksManager();

        }

        catch (error) {

          console.error(error);

        }

      });

    });

  /* =========================
     لأسفل
  ========================= */

  document
    .querySelectorAll(".move-social-down")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await moveSocialDown(
            Number(btn.dataset.id)
          );

          router.renderSocialLinksManager();

        }

        catch (error) {

          console.error(error);

        }

      });

    });

}