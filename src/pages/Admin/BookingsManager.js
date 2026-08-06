import {
  getBookings
} from "../../api/bookingsApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function BookingsManager() {

  const bookings =
    await getBookings();

  return `
    <div class="container">

      ${TopBar("إدارة الحجوزات")}

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

            ${GlassButton("فتح", {
              className: "edit-booking",
              data: { id: b.id }
            })}

            ${GlassButton("حذف", {
              className: "delete-booking",
              data: { id: b.id }
            })}

          </div>

        </div>

      `).join("")}

    </div>
  `;

}