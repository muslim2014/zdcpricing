import {
  updateDoctorProfile,
  deleteCertificate,
  moveCertificateDown,
  moveCertificateUp,
  toggleCertificateVisibility
} from "../../api/doctorApi";

import {
  uploadImage
} from "../../lib/uploadImage";

import {
  showAlert,
  showConfirm
} from "../../utils/dialogs";

export function attachDoctorProfileEvents(router) {

  document
    .querySelector("#backToDashboard")
    ?.addEventListener(
      "click",
      router.renderAdminDashboard
    );

  const imageInput =
    document.querySelector("#doctorImage");

  const preview =
    document.querySelector("#doctorImagePreview");

  imageInput?.addEventListener("change", () => {

    const file = imageInput.files?.[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);

  });

  const saveBtn =
    document.querySelector("#saveDoctorProfile");

  saveBtn?.addEventListener("click", async () => {

    try {

      let image = preview?.src || "";

      const file = imageInput?.files?.[0];

      if (file) {

        image = await uploadImage(
          file,
          "doctor"
        );

      }

      await updateDoctorProfile({

        image,

        name: document
          .querySelector("#doctorName")
          .value
          .trim(),

        title: document
          .querySelector("#doctorTitle")
          .value
          .trim(),

        specialty: document
          .querySelector("#doctorSpecialty")
          .value
          .trim(),

        experience: document
          .querySelector("#doctorExperience")
          .value
          .trim(),

        full_bio: document
          .querySelector("#doctorFullBio")
          .value
          .trim()

      });

      showAlert("تم حفظ البيانات");

      await router.renderDoctorProfile();

    } catch (error) {

      console.error(error);

      showAlert(error.message);

    }

  });

  /* الشهادات */

  document
    .querySelector("#addCertificateBtn")
    ?.addEventListener("click", () => {

      router.renderCertificateEditor();

    });

  document
    .querySelectorAll(".edit-certificate")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        router.renderCertificateEditor(
          Number(btn.dataset.id)
        );

      });

    });

  document
    .querySelectorAll(".toggle-certificate")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await toggleCertificateVisibility(
            Number(btn.dataset.id),
            btn.dataset.visible !== "true"
          );

          await router.renderDoctorProfile();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  document
    .querySelectorAll(".move-certificate-up")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await moveCertificateUp(
            Number(btn.dataset.id)
          );

          await router.renderDoctorProfile();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  document
    .querySelectorAll(".move-certificate-down")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await moveCertificateDown(
            Number(btn.dataset.id)
          );

          await router.renderDoctorProfile();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  document
    .querySelectorAll(".delete-certificate")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        if (!showConfirm("حذف هذه الشهادة؟"))
          return;

        try {

          await deleteCertificate(
            Number(btn.dataset.id)
          );

          await router.renderDoctorProfile();

        } catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

}
