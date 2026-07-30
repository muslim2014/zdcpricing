import {
  createBooking
} from "../../api/bookingsApi";

import {
  getSettings
} from "../../api/settingsApi";

export function attachBookingEvents(router) {

  document
    .querySelector("#saveBooking")
    ?.addEventListener("click", async () => {

      try {

        const full_name =
          document
            .querySelector("#bookingName")
            .value
            .trim();

        const phone =
          document
            .querySelector("#bookingPhone")
            .value
            .trim();

        if (!full_name || !phone) {

          alert("يرجى إدخال الاسم ورقم الهاتف");

          return;

        }

        const serviceSelect =
          document.querySelector("#bookingService");

        const option =
          serviceSelect.options[
            serviceSelect.selectedIndex
          ];

        const booking = {

          full_name,

          phone,

          service_id:
            serviceSelect.value
              ? Number(serviceSelect.value)
              : null,

          service_name:
            option.dataset.name || "",

          preferred_date:
            document.querySelector("#bookingDate")
              .value || null,

          preferred_time:
            document.querySelector("#bookingTime")
              .value || null,

          notes:
            document.querySelector("#bookingNotes")
              .value
              .trim(),

          status: "new"

        };

        await createBooking(booking);

        const settings =
          await getSettings();

        const message =
`طلب حجز جديد

الاسم: ${booking.full_name}
الهاتف: ${booking.phone}
الخدمة: ${booking.service_name}
التاريخ: ${booking.preferred_date || "-"}
الوقت: ${booking.preferred_time || "-"}
ملاحظات: ${booking.notes || "-"}`;

        if (settings.whatsapp) {

          window.open(

            `${settings.whatsapp}?text=${encodeURIComponent(message)}`,

            "_blank"

          );

        }

        alert("تم إرسال طلب الحجز");

        router.renderHome();

      }

      catch (error) {

        console.error(error);

        alert(error.message);

      }

    });

}