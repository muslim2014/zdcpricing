import {
  createService,
  saveService,
  removeService
} from "../../pages/Admin/serviceActions";

import {
  toggleServiceVisibility,
  toggleServiceFeatured,
  moveServiceUp,
  moveServiceDown,
  moveService
} from "../../api/servicesApi";

import {
  uploadImage
} from "../../lib/uploadImage";

import {
  deleteImageByUrl
} from "../../lib/storage";

import {
  showAlert,
  showConfirm,
  showConfirmModal
} from "../../utils/dialogs";

export function attachServicesEvents(router) {

  let pendingReplacedImages = [];

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
  /* حذف الخدمة من الكارت مباشرة */
  /* ========================= */

  document
    .querySelectorAll(".admin-list-item .delete-service")
    .forEach(btn => {

      btn.addEventListener("click", async (event) => {

        event.stopPropagation();
        event.preventDefault();

        if (!(await showConfirmModal("حذف هذه الخدمة؟")))
          return;

        const item = btn.closest(".admin-list-item");

        try {

          await removeService(
            Number(btn.dataset.category),
            Number(btn.dataset.id)
          );

          item?.remove();

        } catch (error) {

          console.error(error);

          showAlert(
            error?.message ||
            "حدث خطأ أثناء حذف الخدمة"
          );

        }

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

          short_description: document
            .querySelector("#serviceShortDescription")
            .value
            .trim(),

          description: document
            .querySelector("#serviceDescription")
            .value
            .trim(),

          sessions: document
            .querySelector("#serviceSessions")
            .value
            .trim(),

          features: document
            .querySelector("#serviceFeatures")
            .value
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean),

          image:
            imageInput?.dataset.current || ""

        }

      );

      for (const oldUrl of pendingReplacedImages) {

        try {

          await deleteImageByUrl(oldUrl);

        } catch (error) {

          console.error(
            "فشل حذف الصورة القديمة للخدمة:",
            {
              oldUrl,
              path: typeof error?.path === "string"
                ? error.path
                : "",
              error: error?.cause || error
            }
          );

          showAlert(
            "تم حفظ الخدمة لكن فشل حذف الصورة القديمة: " +
            (error?.message || "خطأ غير معروف")
          );

        }

      }

      pendingReplacedImages = [];

      await router.renderCategoryServices(
        router.getCurrentCategoryId()
      );

    });

  /* ========================= */

  document
    .querySelector("#deleteServiceBtn")
    ?.addEventListener("click", async () => {

      if (!showConfirm("حذف الخدمة؟")) return;

      await removeService(

        router.getCurrentCategoryId(),

        router.getCurrentServiceId()

      );

      await router.renderCategoryServices(
        router.getCurrentCategoryId()
      );

    });

  /* ========================= */
  /* نقل الخدمة إلى قسم آخر */
  /* ========================= */

  document
    .querySelector("#moveServiceBtn")
    ?.addEventListener("click", async () => {

      const select =
        document.querySelector("#serviceMoveCategory");

      const targetCategoryId =
        Number(select?.value);

      if (!targetCategoryId) {

        showAlert("اختر القسم الجديد أولاً");
        return;

      }

      if (
        targetCategoryId ===
        Number(router.getCurrentCategoryId())
      ) {

        showAlert(
          "الخدمة موجودة بالفعل في هذا القسم"
        );

        return;

      }

      if (
        !showConfirm(
          "نقل الخدمة إلى القسم المحدد؟"
        )
      ) {

        return;

      }

      try {

        await moveService(
          Number(router.getCurrentServiceId()),
          targetCategoryId
        );

        await router.renderCategoryServices(
          targetCategoryId
        );

      } catch (error) {

        console.error(error);

        showAlert(
          error?.message ||
          "حدث خطأ أثناء نقل الخدمة"
        );

      }

    });

  /* ========================= */

  document
    .querySelector("#serviceImage")
    ?.addEventListener("change", async e => {

      const file = e.target.files[0];

      if (!file) return;

      const oldUrl =
        e.target.dataset.current || "";

      try {

        const imageUrl = await uploadImage(
          file,
          "services"
        );

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

        e.target.dataset.current = imageUrl;

        if (oldUrl) {

          pendingReplacedImages.push(oldUrl);

        }

      } catch (error) {

        console.error(error);

        showAlert("فشل رفع الصورة");

      }

    });

  /* ========================= */
  /* بحث في الأقسام */
  /* ========================= */

  const categorySearch =
    document.querySelector("#categorySearch");

  if (categorySearch) {

    categorySearch.addEventListener("input", () => {

      const value =
        categorySearch.value
          .trim()
          .toLowerCase();

      document
        .querySelectorAll(".category-select-card")
        .forEach(card => {

          card.style.display =
            (card.dataset.name || "")
              .toLowerCase()
              .includes(value)
              ? ""
              : "none";

        });

    });

  }

  /* ========================= */
  /* بحث في الخدمات داخل القسم */
  /* ========================= */

  const categoryServiceSearch =
    document.querySelector("#categoryServiceSearch");

  if (categoryServiceSearch) {

    categoryServiceSearch.addEventListener("input", () => {

      const value =
        categoryServiceSearch.value
          .trim()
          .toLowerCase();

      document
        .querySelectorAll(".admin-list-item")
        .forEach(item => {

          item.style.display =
            (item.dataset.name || "")
              .toLowerCase()
              .includes(value)
              ? ""
              : "none";

        });

    });

  }

}