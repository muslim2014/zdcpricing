import {
  getBookings
} from "../../api/bookingsApi";

export async function BookingsManager() {

  const bookings =
    await getBookings();

  return `
    <div class="container">

      <div class="top-bar">

        <button
          id="backToDashboard"
          class="back-btn"
        >
          ←
        </button>

        <h2>
          إدارة الحجوزات
        </h2>

      </div>

      <div class="glass-card">

        <input
          id="bookingSearch"
          class="glass-input"
          placeholder="بحث بالاسم أو الهاتف..."
        >

      </div>

      <div style="height:20px"></div>

      ${bookings.map(b => `

        <div class="admin-list-item">

          <div>

            <strong>

              ${b.full_name}

            </strong>

            <br>

            <small>

              📞 ${b.phone}

            </small>

            <br>

            <small>

              🦷 ${b.service_name || "-"}

            </small>

            <br>

            <small>

              📅 ${b.preferred_date || "-"}

              ${b.preferred_time || ""}

            </small>

            <br>

            <small>

              الحالة:
              ${b.status}

            </small>

          </div>

          <div
            style="
              display:flex;
              gap:8px;
              flex-wrap:wrap;
            "
          >

            <button
              class="glass-button edit-booking"
              data-id="${b.id}"
            >
              فتح
            </button>

            <button
              class="glass-button delete-booking"
              data-id="${b.id}"
            >
              حذف
            </button>

          </div>

        </div>

      `).join("")}

    </div>
  `;

}