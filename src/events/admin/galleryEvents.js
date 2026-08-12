import {
  createGalleryImage,
  deleteGalleryImage,
  getGallery,
  moveGalleryDown,
  moveGalleryUp,
  toggleGalleryVisibility
} from "../../api/galleryApi";

import {
  uploadImage
} from "../../lib/uploadImage";

import {
  deleteImageByUrl,
  extractStoragePath
} from "../../lib/storage";

import {
  showAlert,
  showConfirm
} from "../../utils/dialogs";

export function attachGalleryEvents(router) {

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

  /* =========================
     رفع صور متعددة (Bulk Upload)
  ========================= */

  const bulkInput =
    document.querySelector("#bulkGalleryInput");

  const bulkTrigger =
    document.querySelector("#bulkUploadTrigger");

  const previewGrid =
    document.querySelector("#bulkPreviewGrid");

  const bulkStartBtn =
    document.querySelector("#bulkUploadStart");

  const progressEl =
    document.querySelector("#bulkUploadProgress");

  let selectedFiles = [];

  let uploading = false;

  function escapeHtml(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  }

  function renderPreview() {

    if (!selectedFiles.length) {

      previewGrid.style.display = "none";

      bulkStartBtn.style.display = "none";

      progressEl.textContent = "";

      return;

    }

    previewGrid.style.display = "grid";

    bulkStartBtn.style.display = "";

    previewGrid.innerHTML =
      selectedFiles.map((item, index) => `

        <div class="bulk-preview-item">

          <img
            src="${item.url}"
            alt="${escapeHtml(item.file.name)}"
          >

          <div class="bulk-preview-name">

            ${escapeHtml(item.file.name)}

          </div>

          <button
            type="button"
            class="bulk-remove-btn"
            data-index="${index}"
          >
            ✕
          </button>

        </div>

      `).join("");

  }

  bulkTrigger?.addEventListener("click", () => {

    bulkInput.click();

  });

  bulkInput?.addEventListener("change", event => {

    const files =
      Array.from(event.target.files || []);

    files.forEach(file => {

      selectedFiles.push({
        file,
        url: URL.createObjectURL(file)
      });

    });

    event.target.value = "";

    renderPreview();

  });

  previewGrid?.addEventListener("click", event => {

    const btn =
      event.target.closest(".bulk-remove-btn");

    if (!btn) return;

    const index = Number(btn.dataset.index);

    const removed = selectedFiles.splice(index, 1)[0];

    if (removed?.url) {

      URL.revokeObjectURL(removed.url);

    }

    renderPreview();

  });

  bulkStartBtn?.addEventListener("click", async () => {

    if (uploading) return;

    if (!selectedFiles.length) return;

    uploading = true;

    bulkStartBtn.disabled = true;

    const files =
      selectedFiles.map(item => item.file);

    const total = files.length;

    let succeeded = 0;

    let failed = 0;

    let nextSortOrder =
      await getNextSortOrder();

    for (let i = 0; i < total; i++) {

      progressEl.textContent =
        `جاري رفع ${i + 1} من ${total}`;

      const file = files[i];

      try {

        const newUrl =
          await uploadImage(file, "gallery");

        try {

          await createGalleryImage({

            title: "",

            description: "",

            image: newUrl,

            visible: true,

            sort_order: nextSortOrder

          });

          nextSortOrder++;

          succeeded++;

        } catch (dbError) {

          failed++;

          console.error(
            "BulkUpload: رُفع الملف لكن فشل إنشاء سجل Gallery",
            {
              oldUrl: newUrl,
              path: extractStoragePath(newUrl),
              fileName: file.name,
              error: dbError
            }
          );

          rollbackUploadedFile(
            newUrl,
            file.name
          );

        }

      } catch (uploadError) {

        failed++;

        console.error(
          "BulkUpload: فشل رفع الصورة إلى Storage",
          {
            fileName: file.name,
            error: uploadError
          }
        );

      }

    }

    selectedFiles.forEach(item => {

      URL.revokeObjectURL(item.url);

    });

    selectedFiles = [];

    renderPreview();

    uploading = false;

    progressEl.textContent =
      `تم رفع ${succeeded} بنجاح${
        failed
          ? `، فشل ${failed}`
          : ""
      }`;

    showAlert(
      `الانتهاء: نجحت ${succeeded}${failed ? `، فشل ${failed}` : ""}`
    );

    await router.renderGalleryManager();

  });

  async function getNextSortOrder() {

    const gallery = await getGallery();

    return gallery.reduce(
      (max, image) => {

        const order =
          Number(image.sort_order) || 0;

        return order > max ? order : max;

      },
      0
    ) + 1;

  }

  async function rollbackUploadedFile(newUrl, fileName) {

    try {

      const deleted =
        await deleteImageByUrl(newUrl);

      console.log(
        "BulkUpload: تم حذف الملف المرفوع بعد فشل DB",
        {
          path: extractStoragePath(newUrl),
          fileName,
          deleted
        }
      );

    } catch (rollbackError) {

      console.error(
        "BulkUpload: فشل حذف الملف المرفوع بعد فشل DB",
        {
          path: extractStoragePath(newUrl) ||
            newUrl,
          fileName,
          error: rollbackError
        }
      );

    }

  }

}