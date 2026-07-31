import {
  saveSettings
} from "../../api/settingsApi";

export function attachSettingsEvents(router) {

  document
    .querySelector("#generalSettingsBtn")
    ?.addEventListener(
      "click",
      router.renderGeneralSettings
    );

  document
    .querySelector("#homeSectionsBtn")
    ?.addEventListener(
      "click",
      router.renderHomeSections
    );

  document
    .querySelector("#doctorProfileBtn")
    ?.addEventListener(
      "click",
      router.renderDoctorProfile
    );

  document
    .querySelector("#doctorCertificatesBtn")
    ?.addEventListener(
      "click",
      router.renderDoctorCertificates
    );

  document
    .querySelector("#socialBtn")
    ?.addEventListener(
      "click",
      router.renderSocialLinksManager
    );

  document
    .querySelector("#galleryBtn")
    ?.addEventListener(
      "click",
      router.renderGalleryManager
    );

  document
    .querySelector("#bookingsBtn")
    ?.addEventListener(
      "click",
      router.renderBookingsManager
    );

  document
    .querySelector("#adminAccountBtn")
    ?.addEventListener(
      "click",
      router.renderAdminAccount
    );

  document
    .querySelector("#backToDashboard")
    ?.addEventListener(
      "click",
      router.renderAdminDashboard
    );

  document
    .querySelector("#typographyBtn")
    ?.addEventListener(
      "click",
      router.renderTypographyManager
   );

  /* حفظ الإعدادات العامة */

  document
    .querySelector("#saveGeneralSettings")
    ?.addEventListener("click", async () => {

      try {

        await saveSettings({

          clinicName:
            document.querySelector("#clinicName").value.trim(),

          doctorName:
            document.querySelector("#doctorName").value.trim(),

          logo:
            document.querySelector("#logo").value.trim(),

          pricingTitle:
            document.querySelector("#pricingTitle").value.trim(),

          pricingDescription:
            document.querySelector("#pricingDescription").value.trim(),

          address:
            document.querySelector("#address").value.trim()

        });

        alert("تم حفظ التعديلات");

        router.renderHome();

      }

      catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء الحفظ");

      }

    });

  /* حفظ حساب المدير */

  document
    .querySelector("#saveAdminAccount")
    ?.addEventListener("click", () => {

      alert("سيتم نقل حساب المدير إلى Supabase لاحقًا.");

    });

}