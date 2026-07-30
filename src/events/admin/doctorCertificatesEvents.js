import {
  deleteCertificate,
  moveCertificateDown,
  moveCertificateUp,
  toggleCertificateVisibility
} from "../../api/doctorApi";

export function attachDoctorCertificatesEvents(router) {

  document
    .querySelector("#backToDashboard")
    ?.addEventListener(
      "click",
      router.renderAdminDashboard
    );

  document
  .querySelector("#addCertificateBtn")
  ?.addEventListener("click", () => {

    console.log("ADD CLICKED");

    alert("ADD CLICKED");

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

          await router.renderDoctorCertificates();

        } catch (error) {

          console.error(error);

          alert(error.message);

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

          await router.renderDoctorCertificates();

        } catch (error) {

          console.error(error);

          alert(error.message);

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

          await router.renderDoctorCertificates();

        } catch (error) {

          console.error(error);

          alert(error.message);

        }

      });

    });

  document
    .querySelectorAll(".delete-certificate")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        if (!confirm("حذف هذه الشهادة؟"))
          return;

        try {

          await deleteCertificate(
            Number(btn.dataset.id)
          );

          await router.renderDoctorCertificates();

        } catch (error) {

          console.error(error);

          alert(error.message);

        }

      });

    });

}