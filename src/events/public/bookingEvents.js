import {
  createBooking
} from "../../api/bookingsApi";

import {
  getBookingFields
} from "../../api/bookingFieldsApi";

import {
  getSocialLinks
} from "../../api/socialLinksApi";

import { showAlert } from "../../utils/dialogs";

const MESSAGE_LABELS = {
  name: "الاسم",
  phone: "رقم الهاتف",
  age: "السن",
  service: "الخدمة",
  date: "التاريخ",
  time: "الوقت",
  medical_history: "التاريخ المرضي",
  notes: "الملاحظات"
};

/* ========================= */

function toFieldId(fieldKey) {

  return (
    "booking" +
    fieldKey
      .split("_")
      .map(part =>
        part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join("")
  );

}

/* ========================= */

function getMultiselectValues(field) {

  const groups =
    document.querySelectorAll(".form-group");

  for (const group of groups) {

    const label = group.querySelector("label");

    if (label && label.textContent.trim() === field.title) {

      const otherInput =
        group.querySelector(
          'input[placeholder="اذكر المرض"]'
        );

      const values = Array
        .from(
          group.querySelectorAll(
            ".booking-checkbox:checked"
          )
        )
        .map(cb => {

          if (
            cb.value === "أخرى" &&
            otherInput &&
            otherInput.value.trim()
          ) {

            return otherInput.value.trim();

          }

          return cb.dataset.name || cb.value;

        });

      return values.join(" - ");

    }

  }

  return "";

}

/* ========================= */

function readFieldValue(field) {

  if (field.type === "multiselect") {

    return getMultiselectValues(field);

  }

  const el = document.getElementById(
    toFieldId(field.field_key)
  );

  if (!el) return "";

  if (field.type === "select") {

    const option = el.options[el.selectedIndex];

    if (!option || !option.value) return "";

    return option.dataset.name ||
      option.textContent.trim();

  }

  return el.value.trim();

}

/* ========================= */

function buildBookingMessage(fields) {

  const visibleKeys = new Set(
    fields
      .filter(field => field.visible === true)
      .map(field => field.field_key)
  );

  const lines = [];

  for (const [key, label] of Object.entries(MESSAGE_LABELS)) {

    if (!visibleKeys.has(key)) continue;

    const field = fields.find(
      f => f.field_key === key
    );

    const value = readFieldValue(field) || "-";

    lines.push(`${label}:\n${value}`);

  }

  return [
    "السلام عليكم",
    "",
    "أرغب في تأكيد حجز موعد.",
    "",
    lines.join("\n\n")
  ].join("\n");

}

/* ========================= */

function extractWhatsappNumber(url) {

  const match = url.match(/wa\.me\/(\d+)/);

  if (match) return match[1];

  return url.replace(/\D/g, "");

}

/* ========================= */

export function attachBookingEvents(router) {

  document
    .querySelector("#saveBooking")
    ?.addEventListener("click", async () => {

      try {

        /* تحديد الحقول الظاهرة فقط حتى لا يتأثر الإرسال
           عند إخفاء أي حقل من Admin */
        let bookingFields = [];

        try {

          bookingFields =
            (await getBookingFields()) || [];

        } catch (error) {

          console.error(
            "[booking] فشل قراءة حقول الحجز:",
            error
          );

        }

        const visibleKeys = new Set(
          bookingFields
            .filter(field => field.visible === true)
            .map(field => field.field_key)
        );

        /* قراءة قيمة الحقل بأمان: أي حقل مخفي أو غير موجود
           يُرجَع له "" بدل Any Crash على null */
        function readInputValue(fieldKey) {

          const el =
            document.getElementById(
              toFieldId(fieldKey)
            );

          return el ? el.value.trim() : "";

        }

        const hasName =
          visibleKeys.has("name");

        const hasPhone =
          visibleKeys.has("phone");

        const full_name =
          hasName
            ? readInputValue("name")
            : "";

        const phone =
          hasPhone
            ? readInputValue("phone")
            : "";

        if (hasName && hasPhone) {

          if (!full_name || !phone) {

            showAlert("يرجى إدخال الاسم ورقم الهاتف");

            return;

          }

        } else if (hasName && !full_name) {

          showAlert("يرجى إدخال الاسم");

          return;

        } else if (hasPhone && !phone) {

          showAlert("يرجى إدخال رقم الهاتف");

          return;

        }

        const serviceSelect =
          visibleKeys.has("service")
            ? document.querySelector("#bookingService")
            : null;

        const option =
          serviceSelect &&
          serviceSelect.options[
            serviceSelect.selectedIndex
          ]
            ? serviceSelect.options[
                serviceSelect.selectedIndex
              ]
            : null;

        const booking = {

          full_name,

          phone,

          service_id:
            serviceSelect && serviceSelect.value
              ? Number(serviceSelect.value)
              : null,

          service_name:
            option?.dataset?.name || "",

          preferred_date:
            visibleKeys.has("date")
              ? (readInputValue("date") || null)
              : null,

          preferred_time:
            visibleKeys.has("time")
              ? (readInputValue("time") || null)
              : null,

          notes:
            visibleKeys.has("notes")
              ? readInputValue("notes")
              : "",

          status: "new"

        };

        await createBooking(booking);

        console.log("[booking] createBooking نجحت", booking);

        try {

          const fields =
            await getBookingFields();

          const message =
            buildBookingMessage(fields);

          console.log(
            "[booking] الرسالة قبل encodeURIComponent:",
            message
          );

          const socialLinks =
            await getSocialLinks();

          const whatsapp =
            socialLinks.find(
              link => link.platform === "whatsapp"
            );

          console.log(
            "[booking] whatsappLink التي تم العثور عليها:",
            whatsapp
          );

          const number =
            whatsapp?.url
              ? extractWhatsappNumber(whatsapp.url)
              : "";

          console.log(
            "[booking] رقم الواتساب بعد استخراجه:",
            number
          );

          if (number) {

            const finalLink =
              `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

            console.log(
              "[booking] الرابط النهائي الذي سيتم فتحه:",
              finalLink
            );

            showAlert(
              "✅ تم استلام طلب الحجز بنجاح.\n" +
              "سيتم الآن فتح واتساب لإرسال رسالة تأكيد إلى العيادة."
            );

            console.log("[booking] قبل window.open");

            window.open(

              finalLink,

              "_blank"

            );

            console.log("[booking] بعد window.open");

          } else {

            showAlert(
              "✅ تم استلام طلب الحجز بنجاح."
            );

          }

        } catch (error) {

          console.error(error);

          showAlert(
            "✅ تم استلام طلب الحجز بنجاح."
          );

        }

        router.renderHome();

      }

      catch (error) {

        console.error(error);

        showAlert(error.message);

      }

    });

}
