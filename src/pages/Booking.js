import {
  getBookingServices
} from "../api/bookingServicesApi";
import {
  getBookingMedicalHistory
} from "../api/bookingMedicalHistoryApi";
import {
  getBookingFields
} from "../api/bookingFieldsApi";
import { ThemeToggle } from "../components/ThemeToggle";
import { GlassButton } from "../components/GlassButton";

const PLACEHOLDERS = {
  name: "الاسم بالكامل",
  phone: "01xxxxxxxxx"
};

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

function renderField(field, services, medicalHistory) {

  const id = toFieldId(field.field_key);

  const label = field.title;

  const required = field.required ? "required" : "";

  const placeholder =
    PLACEHOLDERS[field.field_key] ?? "";

  switch (field.type) {

    case "textarea":

      return `
        <div class="form-group">

          <label>${label}</label>

          <textarea
            id="${id}"
            class="glass-input"
            rows="4"
            ${required}
          ></textarea>

        </div>
      `;

    case "select":

      const isServiceField =
        field.field_key === "service";

      const isServicesSource =
        field.data_source === "services";

      let optionHtml = "";

      if (isServiceField || isServicesSource) {

        if (services.length === 0) {

          optionHtml = `
            <option value="" disabled>
              لا توجد خدمات متاحة
            </option>
          `;

        } else {

          optionHtml = services.map(service => `
            <option
              value="${service.id}"
              data-name="${service.title}"
            >
              ${service.title}
            </option>
          `).join("");

        }

      } else {

        optionHtml = (field.options || []).map(option => `
          <option value="${option}">
            ${option}
          </option>
        `).join("");

      }

      return `
        <div class="form-group">

          <label>${label}</label>

          <select
            id="${id}"
            class="glass-input"
            ${required}
          >

            <option value="">
              اختر ${label}
            </option>

            ${optionHtml}

          </select>

        </div>
      `;

    case "multiselect":

      if (field.field_key === "medical_history") {

        if (medicalHistory.length === 0) {

          return `
            <div class="form-group">

              <label>${label}</label>

              <div>
                لا توجد أمراض متاحة
              </div>

            </div>
          `;

        }

        return `
          <div class="form-group">

            <label>${label}</label>

            <div
              style="
                display:flex;
                flex-direction:column;
                gap:8px;
              "
            >

              ${medicalHistory.map(item => `
                <label
                  style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                  "
                >

                  <input
                    type="checkbox"
                    class="booking-checkbox"
                    value="${
                      item.title === "أخرى"
                        ? "أخرى"
                        : item.id
                    }"
                    data-name="${item.title}"
                    ${
                      item.title === "أخرى"
                        ? `onchange="this.closest('.form-group').querySelector('.other-condition').style.display = this.checked ? 'block' : 'none'"`
                        : ""
                    }
                  >

                  ${item.title}

                </label>
              `).join("")}

              <div
                class="other-condition"
                style="
                  display:none;
                  margin-top:8px;
                "
              >

                <label>اذكر المرض</label>

                <input
                  type="text"
                  class="glass-input"
                  placeholder="اذكر المرض"
                >

              </div>

            </div>

          </div>
        `;

      }

      if (field.data_source === "services") {

        if (services.length === 0) {

          return `
            <div class="form-group">

              <label>${label}</label>

              <div>
                لا توجد خدمات متاحة
              </div>

            </div>
          `;

        }

        return `
          <div class="form-group">

            <label>${label}</label>

            <div
              style="
                display:flex;
                flex-direction:column;
                gap:8px;
              "
            >

              ${services.map(service => `
                <label
                  style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                  "
                >

                  <input
                    type="checkbox"
                    class="booking-checkbox"
                    value="${service.id}"
                    data-name="${service.title}"
                  >

                  ${service.title}

                </label>
              `).join("")}

            </div>

          </div>
        `;

      }

      const options = field.options || [];

      return `
        <div class="form-group">

          <label>${label}</label>

          <div
            style="
              display:flex;
              flex-direction:column;
              gap:8px;
            "
          >

            ${options.map(option => `
              <label
                style="
                  display:flex;
                  align-items:center;
                  gap:8px;
                "
              >

                <input
                  type="checkbox"
                  class="booking-checkbox"
                  value="${option}"
                  ${
                    option === "أخرى"
                      ? `onchange="this.closest('.form-group').querySelector('.other-condition').style.display = this.checked ? 'block' : 'none'"`
                      : ""
                  }
                >

                ${option}

              </label>
            `).join("")}

            <div
              class="other-condition"
              style="
                display:none;
                margin-top:8px;
              "
            >

              <label>اذكر المرض</label>

              <input
                type="text"
                class="glass-input"
                placeholder="اذكر المرض"
              >

            </div>

          </div>

        </div>
      `;

    default:

      const inputType =
        ["text", "tel", "number", "date", "time"]
          .includes(field.type)
          ? field.type
          : "text";

      return `
        <div class="form-group">

          <label>${label}</label>

          <input
            id="${id}"
            type="${inputType}"
            class="glass-input"
            placeholder="${placeholder}"
            ${required}
          >

        </div>
      `;

  }

}

export async function Booking() {

  const services = await getBookingServices(true);

  const medicalHistory = await getBookingMedicalHistory(true);

  let fields = [];

  try {

    fields = await getBookingFields();

  } catch (error) {

    console.error(error);

  }

  if (!fields || fields.length === 0) {

    return `
      <div class="container">

        <div class="top-bar">

          <button
            id="backToHome"
            class="back-btn"
          >
            ←
          </button>

          <h2>حجز موعد</h2>

          ${ThemeToggle()}

        </div>

        <div class="glass-card">

          <p style="text-align:center">
            لا توجد حقول حجز متاحة حالياً
          </p>

        </div>

      </div>
    `;

  }

  const visibleFields =
    fields.filter(field => field.visible === true);

  return `
    <div class="container">

      <div class="top-bar">

        <button
          id="backToHome"
          class="back-btn"
        >
          ←
        </button>

        <h2>حجز موعد</h2>

        ${ThemeToggle()}

      </div>

      <div class="glass-card">

        ${visibleFields.map(field =>
          renderField(field, services, medicalHistory)
        ).join("")}

        ${GlassButton("إرسال طلب الحجز", { id: "saveBooking" })}

      </div>

    </div>
  `;

}
