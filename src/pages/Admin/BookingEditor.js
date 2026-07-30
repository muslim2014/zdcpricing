import {
  getBooking
} from "../../api/bookingsApi";

export async function BookingEditor(id) {

  const booking =
    await getBooking(id);

  return `
    <div class="container">

      <div class="top-bar">

        <button
          id="backToBookings"
          class="back-btn"
        >
          ←
        </button>

        <h2>
          تفاصيل الحجز
        </h2>

      </div>

      <div class="glass-card">

        <div class="form-group">

          <label>الاسم</label>

          <input
            class="glass-input"
            value="${booking.full_name ?? ""}"
            readonly
          >

        </div>

        <div class="form-group">

          <label>رقم الهاتف</label>

          <input
            class="glass-input"
            value="${booking.phone ?? ""}"
            readonly
          >

        </div>

        <div
          style="
            display:flex;
            gap:10px;
            margin-bottom:20px;
          "
        >

          <a
            href="tel:${booking.phone}"
            class="glass-button"
            style="
              flex:1;
              text-align:center;
            "
          >
            📞 اتصال
          </a>

          <a
            href="https://wa.me/2${booking.phone}"
            target="_blank"
            class="glass-button"
            style="
              flex:1;
              text-align:center;
            "
          >
            💬 واتساب
          </a>

        </div>

        <div class="form-group">

          <label>الخدمة</label>

          <input
            class="glass-input"
            value="${booking.service_name ?? ""}"
            readonly
          >

        </div>

        <div class="form-group">

          <label>التاريخ المطلوب</label>

          <input
            class="glass-input"
            value="${booking.preferred_date ?? ""}"
            readonly
          >

        </div>

        <div class="form-group">

          <label>الوقت المطلوب</label>

          <input
            class="glass-input"
            value="${booking.preferred_time ?? ""}"
            readonly
          >

        </div>

        <div class="form-group">

          <label>الملاحظات</label>

          <textarea
            class="glass-input"
            rows="4"
            readonly
          >${booking.notes ?? ""}</textarea>

        </div>

        <div class="form-group">

          <label>الحالة</label>

          <select
            id="bookingStatus"
            class="glass-input"
          >

            <option
              value="new"
              ${
                booking.status === "new"
                  ? "selected"
                  : ""
              }
            >
              جديد
            </option>

            <option
              value="contacted"
              ${
                booking.status === "contacted"
                  ? "selected"
                  : ""
              }
            >
              تم التواصل
            </option>

            <option
              value="confirmed"
              ${
                booking.status === "confirmed"
                  ? "selected"
                  : ""
              }
            >
              تم الحجز
            </option>

            <option
              value="cancelled"
              ${
                booking.status === "cancelled"
                  ? "selected"
                  : ""
              }
            >
              تم الإلغاء
            </option>

          </select>

        </div>

        <button
          id="saveBookingStatus"
          class="glass-button"
          data-id="${booking.id}"
        >
          💾 حفظ التعديلات
        </button>

      </div>

    </div>
  `;

}