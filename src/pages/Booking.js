import {
  getServices
} from "../api/servicesApi";
import { ThemeToggle } from "../components/ThemeToggle";

export async function Booking() {

  const services = await getServices();

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

        <div class="form-group">

          <label>الاسم</label>

          <input
            id="bookingName"
            class="glass-input"
            placeholder="الاسم بالكامل"
          >

        </div>

        <div class="form-group">

          <label>رقم الهاتف</label>

          <input
            id="bookingPhone"
            class="glass-input"
            placeholder="01xxxxxxxxx"
          >

        </div>

        <div class="form-group">

          <label>الخدمة</label>

          <select
            id="bookingService"
            class="glass-input"
          >

            <option value="">
              اختر الخدمة
            </option>

            ${services.map(service => `
              <option
                value="${service.id}"
                data-name="${service.name}"
              >
                ${service.name}
              </option>
            `).join("")}

          </select>

        </div>

        <div class="form-group">

          <label>التاريخ المفضل</label>

          <input
            id="bookingDate"
            type="date"
            class="glass-input"
          >

        </div>

        <div class="form-group">

          <label>الوقت المفضل</label>

          <input
            id="bookingTime"
            type="time"
            class="glass-input"
          >

        </div>

        <div class="form-group">

          <label>ملاحظات</label>

          <textarea
            id="bookingNotes"
            class="glass-input"
            rows="4"
          ></textarea>

        </div>

        <button
          id="saveBooking"
          class="glass-button"
        >
          إرسال طلب الحجز
        </button>

      </div>

    </div>
  `;

}