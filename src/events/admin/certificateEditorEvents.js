import {
  createCertificate,
  updateCertificate,
  getCertificates,
  getCertificate
} from "../../api/doctorApi";

import {
  uploadAndReplace
} from "../../lib/storage";

import { showAlert } from "../../utils/dialogs";

export function attachCertificateEditorEvents(router) {

  document
    .querySelector("#backToCertificates")
    ?.addEventListener(
      "click",
      router.renderDoctorProfile
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

        const file = imageInput?.files?.[0];

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

          visible:
            document.querySelector("#certificateVisible")
              ?.checked ?? true

        };

        if (file) {

          let currentImage = "";

          if (id) {

            const current =
              await getCertificate(id);

            currentImage =
              current?.image || "";

          }

          await uploadAndReplace(
            file,
            "certificates",
            currentImage,
            async (newUrl) => {

              certificate.image = newUrl;

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

            }
          );

        } else if (id) {

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

        showAlert("تم حفظ الشهادة");

        await router.renderDoctorProfile();

      }

      catch (error) {

        console.error(error);

        showAlert(error.message);

      }

    });

}