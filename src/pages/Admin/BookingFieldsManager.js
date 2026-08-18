import {
  getBookingFields,
  createBookingField,
  updateBookingField as updateBookingFieldApi,
  deleteBookingField as deleteBookingFieldApi,
  moveBookingFieldUp,
  moveBookingFieldDown
} from "../../api/bookingFieldsApi";

import {
  getBookingServices,
  createBookingService,
  updateBookingService as updateBookingServiceApi,
  deleteBookingService as deleteBookingServiceApi,
  moveBookingServiceUp,
  moveBookingServiceDown
} from "../../api/bookingServicesApi";

import {
  getBookingMedicalHistory,
  createBookingMedicalHistory,
  updateBookingMedicalHistory as updateBookingMedicalHistoryApi,
  deleteBookingMedicalHistory as deleteBookingMedicalHistoryApi,
  moveBookingMedicalHistoryUp,
  moveBookingMedicalHistoryDown
} from "../../api/bookingMedicalHistoryApi";

import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function BookingFieldsManager() {

  const fields = await getBookingFields();

  const services = await getBookingServices();

  const medicalHistory = await getBookingMedicalHistory();

  return `
    <div class="container">

      ${TopBar("إدارة حجز المواعيد")}

      ${fields.map(field => `

        <div class="glass-card booking-field-card">

          <div
            class="admin-list-item"
            style="
              display:flex;
              align-items:center;
              gap:12px;
              margin-bottom:0;
            "
          >

            <div style="flex:1;min-width:180px">

              <input
                class="glass-input booking-field-title"
                data-id="${field.id}"
                data-original="${field.title}"
                value="${field.title}"
                placeholder="العنوان"
              >

              <div
                style="
                  display:flex;
                  gap:10px;
                  align-items:center;
                  margin-top:8px;
                  flex-wrap:wrap;
                "
              >

                <span class="booking-field-type">
                  ${field.type}
                </span>

                <span>
                  ${field.visible ? "👁️ ظاهر" : "🚫 مخفي"}
                </span>

                <span>
                  ${field.required ? "إجباري" : "اختياري"}
                </span>

              </div>

            </div>

            <div
              style="
                display:flex;
                gap:8px;
                flex-wrap:wrap;
                justify-content:flex-end;
                align-items:center;
              "
            >

              ${GlassButton("⬆️", {
                className: "move-booking-field-up",
                data: { id: field.id }
              })}

              ${GlassButton("⬇️", {
                className: "move-booking-field-down",
                data: { id: field.id }
              })}

              ${GlassButton(field.visible ? "👁️" : "🚫", {
                className: "toggle-booking-field-visible",
                data: {
                  id: field.id,
                  visible: field.visible
                }
              })}

              ${GlassButton(field.required ? "إجباري" : "اختياري", {
                className: "toggle-booking-field-required",
                data: {
                  id: field.id,
                  required: field.required
                }
              })}

              ${GlassButton("🗑️", {
                className: "delete-booking-field",
                data: { id: field.id }
              })}

            </div>

          </div>

          ${
            (field.type === "select" ||
             field.type === "multiselect") &&
            field.field_key !== "service" &&
            field.field_key !== "medical_history" &&
            Array.isArray(field.options) &&
            field.options.length
              ? `
                <div class="booking-field-options">
                  ${field.options.map(option => `
                    <span class="booking-field-option">
                      ${option}
                    </span>
                  `).join("")}
                </div>
              `
              : ""
          }

        </div>

      `).join("")}

      ${GlassButton("➕ إضافة حقل جديد", {
        id: "addBookingFieldBtn",
        style: "margin-top:20px"
      })}

      <div style="height:30px"></div>

      <div class="glass-card">

        <h3 style="margin-bottom:16px">
          الخدمات المتاحة للحجز
        </h3>

        ${services.map(service => `

          <div
            class="admin-list-item"
            style="
              display:flex;
              align-items:center;
              gap:12px;
            "
          >

            <div style="flex:1;min-width:180px">

              <input
                class="glass-input booking-service-title"
                data-id="${service.id}"
                data-original="${service.title}"
                value="${service.title}"
                placeholder="اسم الخدمة"
              >

            </div>

            <div
              style="
                display:flex;
                gap:8px;
                flex-wrap:wrap;
                justify-content:flex-end;
                align-items:center;
              "
            >

              ${GlassButton("⬆️", {
                className: "move-booking-service-up",
                data: { id: service.id }
              })}

              ${GlassButton("⬇️", {
                className: "move-booking-service-down",
                data: { id: service.id }
              })}

              ${GlassButton(service.visible ? "👁️" : "🚫", {
                className: "toggle-booking-service-visible",
                data: {
                  id: service.id,
                  visible: service.visible
                }
              })}

              ${GlassButton("🗑️", {
                className: "delete-booking-service",
                data: { id: service.id }
              })}

            </div>

          </div>

        `).join("")}

        ${GlassButton("➕ إضافة خدمة", {
          id: "addBookingServiceBtn",
          style: "margin-top:20px"
        })}

      </div>

      <div style="height:30px"></div>

      <div class="glass-card">

        <h3 style="margin-bottom:16px">
          الأمراض المتاحة للاختيار
        </h3>

        ${medicalHistory.map(item => `

          <div
            class="admin-list-item"
            style="
              display:flex;
              align-items:center;
              gap:12px;
            "
          >

            <div style="flex:1;min-width:180px">

              <input
                class="glass-input booking-medical-history-title"
                data-id="${item.id}"
                data-original="${item.title}"
                value="${item.title}"
                placeholder="اسم المرض"
              >

            </div>

            <div
              style="
                display:flex;
                gap:8px;
                flex-wrap:wrap;
                justify-content:flex-end;
                align-items:center;
              "
            >

              ${GlassButton("⬆️", {
                className: "move-booking-medical-history-up",
                data: { id: item.id }
              })}

              ${GlassButton("⬇️", {
                className: "move-booking-medical-history-down",
                data: { id: item.id }
              })}

              ${GlassButton(item.visible ? "👁️" : "🚫", {
                className: "toggle-booking-medical-history-visible",
                data: {
                  id: item.id,
                  visible: item.visible
                }
              })}

              ${GlassButton("🗑️", {
                className: "delete-booking-medical-history",
                data: { id: item.id }
              })}

            </div>

          </div>

        `).join("")}

        ${GlassButton("➕ إضافة اختيار", {
          id: "addBookingMedicalHistoryBtn",
          style: "margin-top:20px"
        })}

      </div>

    </div>
  `;
}

/* ========================= */

export async function addBookingField() {

  const fields = await getBookingFields();

  await createBookingField({

    field_key: "field_" + Date.now(),

    title: "حقل جديد",

    type: "text",

    visible: true,

    required: false,

    sort_order: fields.length + 1,

    options: [],

    data_source: "manual"

  });

}

/* ========================= */

export async function updateBookingField(id) {

  const input = document.querySelector(
    `.booking-field-title[data-id="${id}"]`
  );

  await updateBookingFieldApi(id, {

    title: input.value.trim()

  });

}

/* ========================= */

export async function addBookingService() {

  const services = await getBookingServices();

  await createBookingService({

    title: "خدمة جديدة",

    visible: true,

    sort_order: services.length + 1

  });

}

/* ========================= */

export async function updateBookingService(id) {

  const input = document.querySelector(
    `.booking-service-title[data-id="${id}"]`
  );

  await updateBookingServiceApi(id, {

    title: input.value.trim()

  });

}

/* ========================= */

export async function deleteBookingService(id) {

  await deleteBookingServiceApi(id);

}

/* ========================= */

export async function addBookingMedicalHistory() {

  const items = await getBookingMedicalHistory();

  await createBookingMedicalHistory({

    title: "مرض جديد",

    visible: true,

    sort_order: items.length + 1

  });

}

/* ========================= */

export async function updateBookingMedicalHistory(id) {

  const input = document.querySelector(
    `.booking-medical-history-title[data-id="${id}"]`
  );

  await updateBookingMedicalHistoryApi(id, {

    title: input.value.trim()

  });

}

/* ========================= */

export async function deleteBookingMedicalHistory(id) {

  await deleteBookingMedicalHistoryApi(id);

}
