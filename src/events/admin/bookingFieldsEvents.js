import {
  addBookingField,
  updateBookingField,
  addBookingService,
  updateBookingService,
  deleteBookingService,
  addBookingMedicalHistory,
  updateBookingMedicalHistory,
  deleteBookingMedicalHistory
} from "../../pages/Admin/BookingFieldsManager";

import {
  deleteBookingField,
  updateBookingField as updateBookingFieldApi,
  moveBookingFieldUp,
  moveBookingFieldDown
} from "../../api/bookingFieldsApi";

import {
  toggleBookingServiceVisibility,
  moveBookingServiceUp,
  moveBookingServiceDown
} from "../../api/bookingServicesApi";

import {
  toggleBookingMedicalHistoryVisibility,
  moveBookingMedicalHistoryUp,
  moveBookingMedicalHistoryDown
} from "../../api/bookingMedicalHistoryApi";

import { showConfirm } from "../../utils/dialogs";

export function attachBookingFieldsEvents(router) {

  document
    .querySelector("#bookingFieldsBtn")
    ?.addEventListener(
      "click",
      () => router.renderBookingFieldsManager()
    );

  document
    .querySelector("#addBookingFieldBtn")
    ?.addEventListener("click", async () => {

      await addBookingField();

      await router.renderBookingFieldsManager();

    });

  document
    .querySelectorAll(".booking-field-title")
    .forEach(input => {

      input.addEventListener("blur", async () => {

        if (input.value === input.dataset.original) return;

        await updateBookingField(input.dataset.id);

      });

    });

  document
    .querySelectorAll(".toggle-booking-field-visible")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await updateBookingFieldApi(
          Number(btn.dataset.id),
          { visible: btn.dataset.visible !== "true" }
        );

        await router.renderBookingFieldsManager();

      });

    });

  document
    .querySelectorAll(".toggle-booking-field-required")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await updateBookingFieldApi(
          Number(btn.dataset.id),
          { required: btn.dataset.required !== "true" }
        );

        await router.renderBookingFieldsManager();

      });

    });

  document
    .querySelectorAll(".delete-booking-field")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        if (!showConfirm("حذف الحقل؟")) return;

        await deleteBookingField(btn.dataset.id);

        await router.renderBookingFieldsManager();

      });

    });

  document
    .querySelectorAll(".move-booking-field-up")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await moveBookingFieldUp(
          Number(btn.dataset.id)
        );

        await router.renderBookingFieldsManager();

      });

    });

  document
    .querySelectorAll(".move-booking-field-down")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await moveBookingFieldDown(
          Number(btn.dataset.id)
        );

        await router.renderBookingFieldsManager();

      });

    });

  /* ========================= */
  /* خدمات الحجز */
  /* ========================= */

  document
    .querySelector("#addBookingServiceBtn")
    ?.addEventListener("click", async () => {

      await addBookingService();

      await router.renderBookingFieldsManager();

    });

  document
    .querySelectorAll(".booking-service-title")
    .forEach(input => {

      input.addEventListener("blur", async () => {

        if (input.value === input.dataset.original) return;

        await updateBookingService(input.dataset.id);

      });

    });

  document
    .querySelectorAll(".delete-booking-service")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        if (!showConfirm("حذف الخدمة؟")) return;

        await deleteBookingService(btn.dataset.id);

        await router.renderBookingFieldsManager();

      });

    });

  document
    .querySelectorAll(".toggle-booking-service-visible")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await toggleBookingServiceVisibility(
          Number(btn.dataset.id),
          btn.dataset.visible !== "true"
        );

        await router.renderBookingFieldsManager();

      });

    });

  document
    .querySelectorAll(".move-booking-service-up")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await moveBookingServiceUp(
          Number(btn.dataset.id)
        );

        await router.renderBookingFieldsManager();

      });

    });

  document
    .querySelectorAll(".move-booking-service-down")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await moveBookingServiceDown(
          Number(btn.dataset.id)
        );

        await router.renderBookingFieldsManager();

      });

    });

  /* ========================= */
  /* الأمراض المتاحة للاختيار */
  /* ========================= */

  document
    .querySelector("#addBookingMedicalHistoryBtn")
    ?.addEventListener("click", async () => {

      await addBookingMedicalHistory();

      await router.renderBookingFieldsManager();

    });

  document
    .querySelectorAll(".booking-medical-history-title")
    .forEach(input => {

      input.addEventListener("blur", async () => {

        if (input.value === input.dataset.original) return;

        await updateBookingMedicalHistory(input.dataset.id);

      });

    });

  document
    .querySelectorAll(".delete-booking-medical-history")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        if (!showConfirm("حذف المرض؟")) return;

        await deleteBookingMedicalHistory(btn.dataset.id);

        await router.renderBookingFieldsManager();

      });

    });

  document
    .querySelectorAll(".toggle-booking-medical-history-visible")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await toggleBookingMedicalHistoryVisibility(
          Number(btn.dataset.id),
          btn.dataset.visible !== "true"
        );

        await router.renderBookingFieldsManager();

      });

    });

  document
    .querySelectorAll(".move-booking-medical-history-up")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await moveBookingMedicalHistoryUp(
          Number(btn.dataset.id)
        );

        await router.renderBookingFieldsManager();

      });

    });

  document
    .querySelectorAll(".move-booking-medical-history-down")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await moveBookingMedicalHistoryDown(
          Number(btn.dataset.id)
        );

        await router.renderBookingFieldsManager();

      });

    });

}
