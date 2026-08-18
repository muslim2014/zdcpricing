import {
  getEquipmentSections,
  createEquipmentSection,
  updateEquipmentSection,
  deleteEquipmentSection,
  toggleEquipmentSectionVisibility,
  moveEquipmentSectionUp,
  moveEquipmentSectionDown,
  getEquipmentItem,
  getEquipmentItems,
  createEquipmentItem,
  updateEquipmentItem,
  deleteEquipmentItem,
  toggleEquipmentItemVisibility,
  moveEquipmentItemUp,
  moveEquipmentItemDown,
  moveEquipmentItemToSection
} from "../../api/equipmentApi";

import {
  uploadImage
} from "../../lib/uploadImage";

import {
  deleteImageByUrl
} from "../../lib/storage";

import {
  showAlert,
  showConfirmModal
} from "../../utils/dialogs";

export function attachEquipmentEvents(router) {

  let pendingReplacedImages = [];

  let latestUploadedImage = null;

  /* =========================
     زر الـDashboard
  ========================= */

  document
    .querySelector("#equipmentBtn")
    ?.addEventListener("click", () => {

      router.renderEquipmentManager();

    });

  /* =========================
     إضافة خط جديد
  ========================= */

  document
    .querySelector("#addEquipmentSectionBtn")
    ?.addEventListener("click", () => {

      router.renderEquipmentSectionEditor(null);

    });

  /* =========================
     تعديل خط
  ========================= */

  document
    .querySelectorAll(".edit-equipment-section")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        router.renderEquipmentSectionEditor(
          Number(btn.dataset.id)
        );

      });

    });

  /* =========================
     حذف خط (مع تنبيه الـCASCADE)
  ========================= */

  document
    .querySelectorAll(".delete-equipment-section")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        const sectionId = Number(btn.dataset.id);

        if (
          !(await showConfirmModal(
            "حذف هذا الخط؟ سيتم حذف جميع الكروت " +
            "الموجودة بداخله (ON DELETE CASCADE)."
          ))
        ) {

          return;

        }

        try {

          const items =
            await getEquipmentItems(sectionId);

          await deleteEquipmentSection(sectionId);

          for (const item of items) {

            if (item?.image) {

              try {

                await deleteImageByUrl(item.image);

              } catch (error) {

                console.error(
                  "فشل حذف صورة الكارت:",
                  error
                );

              }

            }

          }

          showAlert("تم حذف الخط وكروته");

          await router.renderEquipmentManager();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  /* =========================
     إظهار / إخفاء خط
  ========================= */

  document
    .querySelectorAll(".toggle-equipment-section-visible")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await toggleEquipmentSectionVisibility(
            Number(btn.dataset.id),
            btn.dataset.visible !== "true"
          );

          await router.renderEquipmentManager();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  /* =========================
     ترتيب خط ↑
  ========================= */

  document
    .querySelectorAll(".move-equipment-section-up")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await moveEquipmentSectionUp(
            Number(btn.dataset.id)
          );

          await router.renderEquipmentManager();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  /* =========================
     ترتيب خط ↓
  ========================= */

  document
    .querySelectorAll(".move-equipment-section-down")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await moveEquipmentSectionDown(
            Number(btn.dataset.id)
          );

          await router.renderEquipmentManager();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  /* =========================
     محرر الخط
  ========================= */

  document
    .querySelector("#backToEquipment")
    ?.addEventListener("click", () => {

      router.renderEquipmentManager();

    });

  document
    .querySelector("#saveEquipmentSectionBtn")
    ?.addEventListener("click", async () => {

      try {

        const btn = document.querySelector(
          "#saveEquipmentSectionBtn"
        );

        const id = btn.dataset.id
          ? Number(btn.dataset.id)
          : null;

        const title = document
          .querySelector("#equipmentSectionTitle")
          .value
          .trim();

        if (!title) {

          showAlert("يرجى إدخال اسم الخط");

          return;

        }

        if (id) {

          await updateEquipmentSection(id, { title });

        } else {

          const sections =
            await getEquipmentSections();

          await createEquipmentSection({
            title,
            visible: true,
            sort_order: sections.length + 1
          });

        }

        showAlert(id ? "تم حفظ التعديلات" : "تمت إضافة الخط");

        await router.renderEquipmentManager();

      } catch (error) {

        console.error(error);

        showAlert(error.message);

      }

    });

  /* =========================
     إضافة كارت داخل خط
  ========================= */

  document
    .querySelectorAll(".add-equipment-card")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        router.renderEquipmentCardEditor(
          Number(btn.dataset.section),
          null
        );

      });

    });

  /* =========================
     تعديل كارت
  ========================= */

  document
    .querySelectorAll(".edit-equipment-card")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        router.renderEquipmentCardEditor(
          Number(btn.dataset.section),
          Number(btn.dataset.id)
        );

      });

    });

  /* =========================
     حذف كارت
  ========================= */

  document
    .querySelectorAll(".delete-equipment-card")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        const cardId = Number(btn.dataset.id);

        if (!(await showConfirmModal("حذف هذا الكارت؟")))
          return;

        try {

          const card = await getEquipmentItem(cardId);

          await deleteEquipmentItem(cardId);

          if (card?.image) {

            try {

              await deleteImageByUrl(card.image);

            } catch (error) {

              console.error(
                "فشل حذف صورة الكارت:",
                error
              );

            }

          }

          showAlert("تم حذف الكارت");

          await router.renderEquipmentManager();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  /* =========================
     إظهار / إخفاء كارت
  ========================= */

  document
    .querySelectorAll(".toggle-equipment-item-visible")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await toggleEquipmentItemVisibility(
            Number(btn.dataset.id),
            btn.dataset.visible !== "true"
          );

          await router.renderEquipmentManager();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  /* =========================
     ترتيب كارت ↑ / ↓ داخل الخط
  ========================= */

  document
    .querySelectorAll(".move-equipment-item-up")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await moveEquipmentItemUp(
            Number(btn.dataset.id)
          );

          await router.renderEquipmentManager();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  document
    .querySelectorAll(".move-equipment-item-down")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await moveEquipmentItemDown(
            Number(btn.dataset.id)
          );

          await router.renderEquipmentManager();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  /* =========================
     رفع صورة الكارت
  ========================= */

  document
    .querySelector("#equipmentCardImage")
    ?.addEventListener("change", async e => {

      const file = e.target.files[0];

      if (!file) return;

      const oldUrl =
        e.target.dataset.current || "";

      try {

        const imageUrl = await uploadImage(
          file,
          "equipment"
        );

        document
          .querySelector("#equipmentCardImagePreview")
          .innerHTML = `
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

        latestUploadedImage = imageUrl;

        if (oldUrl) {

          pendingReplacedImages.push(oldUrl);

        }

      } catch (error) {

        console.error(error);

        showAlert("فشل رفع الصورة");

      }

    });

  /* =========================
     حفظ / إضافة كارت
  ========================= */

  document
    .querySelector("#saveEquipmentCardBtn")
    ?.addEventListener("click", async () => {

      try {

        const btn = document.querySelector(
          "#saveEquipmentCardBtn"
        );

        const sectionId = Number(btn.dataset.section);

        const cardId = btn.dataset.id
          ? Number(btn.dataset.id)
          : null;

        const imageInput = document.querySelector(
          "#equipmentCardImage"
        );

        const payload = {

          title: document
            .querySelector("#equipmentCardTitle")
            .value
            .trim(),

          image: imageInput?.dataset.current || "",

          description: document
            .querySelector("#equipmentCardDescription")
            .value
            .trim(),

          features: document
            .querySelector("#equipmentCardFeatures")
            .value
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean)
            .join("\n"),

          visible: document
            .querySelector("#equipmentCardVisible")
            .checked

        };

        if (!payload.title) {

          showAlert("يرجى إدخال اسم الجهاز");

          return;

        }

        if (cardId) {

          await updateEquipmentItem(cardId, payload);

        } else {

          const items = await getEquipmentItems(
            sectionId
          );

          await createEquipmentItem({
            section_id: sectionId,
            ...payload,
            sort_order: items.length + 1
          });

        }

        for (const oldUrl of pendingReplacedImages) {

          try {

            await deleteImageByUrl(oldUrl);

          } catch (error) {

            console.error(
              "فشل حذف الصورة القديمة للكارت:",
              error
            );

            showAlert(
              "تم الحفظ لكن فشل حذف الصورة القديمة: " +
              (error?.message || "خطأ غير معروف")
            );

          }

        }

        pendingReplacedImages = [];

        latestUploadedImage = null;

        showAlert(
          cardId ? "تم حفظ التعديلات" : "تمت إضافة الكارت"
        );

        await router.renderEquipmentManager();

      } catch (error) {

        /* منع الصور اليتيمة:
           لو نجح رفع صورة جديدة ثم فشل تحديث الـDB، تُحذف الصور الجديدة
           غير المحفوظة من Storage، مع الإبقاء على الصورة الأصلية
           التي ما زالت قاعدة البيانات تشير إليها. */
        const orphanCandidates = [
          latestUploadedImage,
          ...pendingReplacedImages.slice(1)
        ].filter(Boolean);

        for (const url of orphanCandidates) {

          try {

            await deleteImageByUrl(url);

          } catch (cleanupError) {

            console.error(
              "فشل حذف الصورة غير المحفوظة:",
              cleanupError
            );

          }

        }

        console.error(error);

        showAlert(error.message);

      }

    });

  /* =========================
     حذف كارت (من المحرر)
  ========================= */

  document
    .querySelector("#deleteEquipmentCardBtn")
    ?.addEventListener("click", async () => {

      if (!(await showConfirmModal("حذف هذا الكارت؟")))
        return;

      try {

        const btn = document.querySelector(
          "#deleteEquipmentCardBtn"
        );

        const cardId = Number(btn.dataset.id);

        const card = await getEquipmentItem(cardId);

        await deleteEquipmentItem(cardId);

        if (card?.image) {

          try {

            await deleteImageByUrl(card.image);

          } catch (error) {

            console.error(
              "فشل حذف صورة الكارت:",
              error
            );

          }

        }

        showAlert("تم حذف الكارت");

        await router.renderEquipmentManager();

      } catch (error) {

        console.error(error);

        showAlert(error.message);

      }

    });

  /* =========================
     نقل كارت إلى خط آخر
  ========================= */

  document
    .querySelector("#moveEquipmentCardBtn")
    ?.addEventListener("click", async () => {

      try {

        const btn = document.querySelector(
          "#moveEquipmentCardBtn"
        );

        const cardId = Number(btn.dataset.id);

        const select = document.querySelector(
          "#equipmentCardMoveSection"
        );

        const targetSectionId = Number(select?.value);

        if (!targetSectionId) {

          showAlert("اختر الخط الجديد أولاً");
          return;

        }

        if (
          !(await showConfirmModal(
            "نقل الكارت إلى الخط المحدد؟"
          ))
        ) {

          return;

        }

        await moveEquipmentItemToSection(
          cardId,
          targetSectionId
        );

        showAlert("تم نقل الكارت");

        await router.renderEquipmentManager();

      } catch (error) {

        console.error(error);

        showAlert(error.message);

      }

    });

}