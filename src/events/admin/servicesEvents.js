import {
  createService,
  saveService,
  removeService
} from "../../pages/Admin/serviceActions";

import {
  toggleServiceVisibility,
  toggleServiceFeatured,
  moveServiceUp,
  moveServiceDown
} from "../../api/servicesApi";

import { uploadImage } from "../../lib/uploadImage";

export function attachServicesEvents(router) {

  document
    .querySelector("#servicesBtn")
    ?.addEventListener(
      "click",
      router.renderServicesManager
    );

  document
    .querySelectorAll(".open-category-services")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        router.renderCategoryServices(btn.dataset.id);

      });

    });

  document
    .querySelector("#backToServicesManager")
    ?.addEventListener(
      "click",
      router.renderServicesManager
    );

  document
    .querySelectorAll(".edit-service")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        router.renderServiceEditor(
          btn.dataset.category,
          btn.dataset.id
        );

      });

    });

  /* ========================= */
  /* تحريك لأعلى */
  /* ========================= */

  document
    .querySelectorAll(".move-up")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await moveServiceUp(
          Number(btn.dataset.id)
        );

        await router.renderCategoryServices(
          router.getCurrentCategoryId()
        );

      });

    });

  /* ========================= */
  /* تحريك لأسفل */
  /* ========================= */

  document
    .querySelectorAll(".move-down")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await moveServiceDown(
          Number(btn.dataset.id)
        );

        await router.renderCategoryServices(
          router.getCurrentCategoryId()
        );

      });

    });

  /* ========================= */
  /* إظهار / إخفاء */
  /* ========================= */

  document
    .querySelectorAll(".toggle-visible")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await toggleServiceVisibility(
          Number(btn.dataset.id),
          btn.dataset.visible !== "true"
        );

        await router.renderCategoryServices(
          router.getCurrentCategoryId()
        );

      });

    });

  /* ========================= */
  /* مميز / غير مميز */
  /* ========================= */

  document
    .querySelectorAll(".toggle-featured")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await toggleServiceFeatured(
          Number(btn.dataset.id),
          btn.dataset.featured !== "true"
        );

        await router.renderCategoryServices(
          router.getCurrentCategoryId()
        );

      });

    });

  /* ========================= */

  document
    .querySelector("#backToCategoryServices")
    ?.addEventListener("click", () => {

      router.renderCategoryServices(
        router.getCurrentCategoryId()
      );

    });

  /* ========================= */

  document
    .querySelector("#addServiceBtn")
    ?.addEventListener("click", async () => {

      await createService(
        router.getCurrentCategoryId()
      );

      await router.renderCategoryServices(
        router.getCurrentCategoryId()
      );

    });

  /* ========================= */

  document
    .querySelector("#saveServiceBtn")
    ?.addEventListener("click", async () => {

      const imageInput =
        document.querySelector("#serviceImage");

      await saveService(

        router.getCurrentCategoryId(),

        router.getCurrentServiceId(),

        {

          name: document.querySelector("#serviceName").value.trim(),

          price: document.querySelector("#servicePrice").value.trim(),

          description: document
            .querySelector("#serviceDescription")
            .value
            .trim(),

          image:
            imageInput?.dataset.current || ""

        }

      );

      await router.renderCategoryServices(
        router.getCurrentCategoryId()
      );

    });

  /* ========================= */

  document
    .querySelector("#deleteServiceBtn")
    ?.addEventListener("click", async () => {

      if (!confirm("حذف الخدمة؟")) return;

      await removeService(

        router.getCurrentCategoryId(),

        router.getCurrentServiceId()

      );

      await router.renderCategoryServices(
        router.getCurrentCategoryId()
      );

    });

  /* ========================= */

  document
    .querySelector("#serviceImage")
    ?.addEventListener("change", async e => {

      const file = e.target.files[0];

      if (!file) return;

      try {

        const imageUrl = await uploadImage(file, "services");

        document.querySelector("#imagePreview").innerHTML = `
          <img
            src="${imageUrl}"
            style="
              max-width:220px;
              max-height:180px;
              border-radius:12px;
            "
          >
        `;

        document
          .querySelector("#serviceImage")
          .dataset.current = imageUrl;

      } catch (error) {

        console.error(error);

        alert("فشل رفع الصورة");

      }

    });

}