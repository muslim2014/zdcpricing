import {
  createGalleryImage,
  updateGalleryImage,
  getGallery
} from "../../api/galleryApi";

import {
  uploadImage
} from "../../lib/uploadImage";

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

        let image = preview.src;

        const file = imageInput?.files?.[0];

        if (file) {

          image = await uploadImage(
            file,
            "gallery"
          );

        }

        const id =
          router.getCurrentGalleryId();

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

          image,

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

        showAlert("تم حفظ الصورة");

        await router.renderGalleryManager();

      } catch (error) {

        console.error(error);

        showAlert(error.message);

      }

    });

}