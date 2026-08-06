import {
  saveSettings
} from "../../api/settingsApi";

import {
  uploadImage
} from "../../lib/uploadImage";

import { showAlert } from "../../utils/dialogs";

const AUTO_SAVE_FIELDS = [
  "clinicName",
  "doctorName",
  "logoWidth",
  "pricingTitle",
  "pricingDescription",
  "categoriesPageTitle",
  "whatsappNumber"
];

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

  /* حفظ تلقائي عند مغادرة الحقل */

  AUTO_SAVE_FIELDS.forEach(key => {

    const input =
      document.querySelector(`#${key}`);

    if (!input) return;

    input.addEventListener("blur", async () => {

      const newValue = input.value.trim();

      if (newValue === input.dataset.original) return;

      try {

        const result = await saveSettings({ [key]: newValue });

        console.log(result);

        input.dataset.original = newValue;

      } catch (error) {

        console.error("Settings Save Error:", error);

        console.error({
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          code: error?.code
        });

        showAlert(error?.message || "فشل الحفظ");

      }

    });

  });

  /* رفع اللوجو */

  const logoInput =
    document.querySelector("#logo");

  const logoPreview =
    document.querySelector("#logoPreview");

  document
    .querySelector("#changeLogoBtn")
    ?.addEventListener("click", () => {

      logoInput?.click();

    });

  logoInput?.addEventListener(
    "change",
    async () => {

      const file = logoInput.files?.[0];

      if (!file) return;

      logoPreview.src =
        URL.createObjectURL(file);

      try {

        const logo = await uploadImage(
          file,
          "settings"
        );

        await saveSettings({ logo });

        logoPreview.src = logo;

        showAlert("تم رفع اللوجو وحفظه");

      } catch (error) {

        console.error(error);

        showAlert("فشل رفع اللوجو");

      }

    }
  );

  /* حفظ حساب المدير */

  document
    .querySelector("#saveAdminAccount")
    ?.addEventListener("click", () => {

      showAlert("سيتم نقل حساب المدير إلى Supabase لاحقًا.");

    });

}