import {
  deleteBooking,
  updateBookingStatus
} from "../../api/bookingsApi";

import {
  showAlert,
  showConfirm
} from "../../utils/dialogs";

export function attachBookingsEvents(router) {

  document
    .querySelector("#backToDashboard")
    ?.addEventListener(
      "click",
      router.renderAdminDashboard
    );

  document
    .querySelector("#backToBookings")
    ?.addEventListener(
      "click",
      router.renderBookingsManager
    );

  /* =========================
     حذف الحجز
  ========================= */

  document
    .querySelectorAll(".delete-booking")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        const confirmed = showConfirm(
          "هل تريد حذف هذا الحجز؟"
        );

        if (!confirmed) return;

        try {

          await deleteBooking(
            Number(btn.dataset.id)
          );

          showAlert("تم حذف الحجز");

          router.renderBookingsManager();

        }

        catch (error) {

          console.error(error);

          showAlert(error.message);

        }

      });

    });

  /* =========================
     فتح تفاصيل الحجز
  ========================= */

  document
    .querySelectorAll(".edit-booking")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        router.renderBookingEditor(
          Number(btn.dataset.id)
        );

      });

    });

  /* =========================
     حفظ الحالة
  ========================= */

  document
    .querySelector("#saveBookingStatus")
    ?.addEventListener("click", async e => {

      try {

        const id =
          Number(
            e.currentTarget.dataset.id
          );

        const status =
          document.querySelector(
            "#bookingStatus"
          ).value;

        await updateBookingStatus(
          id,
          status
        );

        showAlert("تم حفظ الحالة");

        router.renderBookingsManager();

      }

      catch (error) {

        console.error(error);

        showAlert(error.message);

      }

    });

  /* =========================
     البحث
  ========================= */

  const search =
    document.querySelector("#bookingSearch");

  if (search) {

    search.addEventListener("input", () => {

      const value =
        search.value
          .trim()
          .toLowerCase();

      document
        .querySelectorAll(".admin-list-item")
        .forEach(item => {

          item.style.display =
            item.innerText
              .toLowerCase()
              .includes(value)
              ? ""
              : "none";

        });

    });

  }

}