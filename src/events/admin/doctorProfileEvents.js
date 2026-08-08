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

  /* ========================= */
  /* Back */
  /* ========================= */

  document
    .querySelector("#backToDashboard")
    ?.addEventListener(
      "click",
      router.renderAdminDashboard
    );


  /* ========================= */
  /* Doctor Image */
  /* ========================= */

  const imageInput =
    document.querySelector("#doctorImage");

  const preview =
    document.querySelector("#doctorImagePreview");


  imageInput?.addEventListener("change", () => {

    const file = imageInput.files?.[0];

    if (!file) return;

    if (preview) {
      preview.src = URL.createObjectURL(file);
    }

  });


  /* ========================= */
  /* Save Doctor Profile */
  /* ========================= */

  const saveBtn =
    document.querySelector("#saveDoctorProfile");


  saveBtn?.addEventListener("click", async () => {

    try {

      /* ========================= */
      /* Basic validation */
      /* ========================= */

      const name =
        document
          .querySelector("#doctorName")
          ?.value
          .trim() || "";

      const specialty =
        document
          .querySelector("#doctorSpecialty")
          ?.value
          .trim() || "";

      const experience =
        document
          .querySelector("#doctorExperience")
          ?.value
          .trim() || "";

      const fullBio =
        document
          .querySelector("#doctorFullBio")
          ?.value
          .trim() || "";


      /* ========================= */
      /* New Doctor Profile Fields */
      /* ========================= */

      const education =
        document
          .querySelector("#doctorEducation")
          ?.value
          .trim() || "";

      const professionalJourney =
        document
          .querySelector("#doctorProfessionalJourney")
          ?.value
          .trim() || "";

      const restorativeApproach =
        document
          .querySelector("#doctorRestorativeApproach")
          ?.value
          .trim() || "";

      const areasOfExpertise =
        document
          .querySelector("#doctorAreasOfExpertise")
          ?.value
          .trim() || "";


      /* ========================= */
      /* Image */
      /* ========================= */

      let image =
        preview?.src || "";

      const file =
        imageInput?.files?.[0];


      if (file) {

        image = await uploadImage(
          file,
          "doctor"
        );

      }


      /* ========================= */
      /* Single Supabase Update */
      /* ========================= */

      await updateDoctorProfile({

        image,

        name,

        specialty,

        experience,

        full_bio: fullBio,

        education,

        professional_journey:
          professionalJourney,

        restorative_approach:
          restorativeApproach,

        areas_of_expertise:
          areasOfExpertise

      });


      /* ========================= */
      /* Success */
      /* ========================= */

      showAlert(
        "تم حفظ جميع بيانات الطبيب بنجاح"
      );


      await router.renderDoctorProfile();


    } catch (error) {

      console.error(
        "Doctor profile save error:",
        error
      );

      showAlert(
        error?.message ||
        "حدث خطأ أثناء حفظ البيانات"
      );

    }

  });


  /* ========================= */
  /* Certificates */
  /* ========================= */

  document
    .querySelector("#addCertificateBtn")
    ?.addEventListener("click", () => {

      router.renderCertificateEditor();

    });


  /* ========================= */
  /* Edit Certificate */
  /* ========================= */

  document
    .querySelectorAll(".edit-certificate")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        router.renderCertificateEditor(
          Number(btn.dataset.id)
        );

      });

    });


  /* ========================= */
  /* Toggle Certificate */
  /* ========================= */

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

          showAlert(
            error?.message ||
            "حدث خطأ أثناء تحديث الشهادة"
          );

        }

      });

    });


  /* ========================= */
  /* Move Certificate Up */
  /* ========================= */

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

          showAlert(
            error?.message ||
            "حدث خطأ أثناء ترتيب الشهادات"
          );

        }

      });

    });


  /* ========================= */
  /* Move Certificate Down */
  /* ========================= */

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

          showAlert(
            error?.message ||
            "حدث خطأ أثناء ترتيب الشهادات"
          );

        }

      });

    });


  /* ========================= */
  /* Delete Certificate */
  /* ========================= */

  document
    .querySelectorAll(".delete-certificate")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        if (!showConfirm("حذف هذه الشهادة؟")) {
          return;
        }


        try {

          await deleteCertificate(
            Number(btn.dataset.id)
          );

          await router.renderDoctorProfile();

        } catch (error) {

          console.error(error);

          showAlert(
            error?.message ||
            "حدث خطأ أثناء حذف الشهادة"
          );

        }

      });

    });

}