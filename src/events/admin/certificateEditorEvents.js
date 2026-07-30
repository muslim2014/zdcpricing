import {
  createCertificate,
  updateCertificate,
  getCertificates
} from "../../api/doctorApi";

import {
  uploadImage
} from "../../lib/uploadImage";

export function attachCertificateEditorEvents(router) {

  document
    .querySelector("#backToCertificates")
    ?.addEventListener(
      "click",
      router.renderDoctorCertificates
    );

  const imageInput =
    document.querySelector("#certificateImage");

  const preview =
    document.querySelector("#certificatePreview");

  imageInput?.addEventListener("change", () => {

    const file = imageInput.files?.[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);

  });

  document
    .querySelector("#saveCertificate")
    ?.addEventListener("click", async () => {

      try {

        let image = preview.src;

        const file = imageInput?.files?.[0];

        if (file) {

          image = await uploadImage(
            file,
            "clinic-images",
            "certificates"
          );

        }

        const id =
          router.getCurrentCertificateId();

        const certificate = {

          title: document
            .querySelector("#certificateTitle")
            .value
            .trim(),

          description: document
            .querySelector("#certificateDescription")
            .value
            .trim(),

          image,

          visible:
            document.querySelector("#certificateVisible")
              ?.checked ?? true

        };

        if (id) {

          await updateCertificate(
            id,
            certificate
          );

        } else {

          const certificates =
            await getCertificates();

          await createCertificate({

            ...certificate,

            sort_order:
              certificates.length + 1

          });

        }

        alert("تم حفظ الشهادة");

        await router.renderDoctorCertificates();

      }

      catch (error) {

        console.error(error);

        alert(error.message);

      }

    });

}