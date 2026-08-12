import {
  createGalleryImage,
  updateGalleryImage,
  getGallery
} from "../../api/galleryApi";

import {
  uploadAndReplace
} from "../../lib/storage";

import { showAlert } from "../../utils/dialogs";

export function attachGalleryEditorEvents(router) {

  document
    .querySelector("#backToGallery")
    ?.addEventListener(
      "click",
      router.renderGalleryManager
    );

  const imageInput =
    document.querySelector("#galleryImage");

  const preview =
    document.querySelector("#galleryPreview");

  imageInput?.addEventListener("change", () => {

    const file = imageInput.files?.[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);

  });

  document
    .querySelector("#saveGalleryImage")
    ?.addEventListener("click", async () => {

      try {

        const id =
          router.getCurrentGalleryId();

        const file =
          imageInput?.files?.[0];

        if (file) {

          await uploadAndReplace(
            file,
            "gallery",
            imageInput?.getAttribute("data-current") || "",
            async (newUrl) => {

              await saveImage(id, newUrl);

            }
          );

        } else if (!id) {

          showAlert("يجب اختيار صورة أولاً");

          return;

        } else {

          await saveImage(
            id,
            imageInput?.getAttribute("data-current") || ""
          );

        }

        showAlert("تم حفظ الصورة");

        await router.renderGalleryManager();

      } catch (error) {

        console.error(error);

        showAlert(error.message);

      }

    });

  async function saveImage(id, imageUrl) {

    if (!imageUrl) {

      showAlert("يجب اختيار صورة أولاً");

      return;

    }

    const galleryImage = {

      title:
        document
          .querySelector("#galleryTitle")
          .value
          .trim(),

      description:
        document
          .querySelector("#galleryDescription")
          .value
          .trim(),

      image: imageUrl,

      visible:
        document
          .querySelector("#galleryVisible")
          ?.checked ?? true

    };

    if (id) {

      await updateGalleryImage(
        id,
        galleryImage
      );

    } else {

      const gallery =
        await getGallery();

      await createGalleryImage({

        ...galleryImage,

        sort_order:
          gallery.length + 1

      });

    }

  }

}