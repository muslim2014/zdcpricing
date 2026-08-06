import { getSettings } from "../api/settingsApi";
import { ThemeToggle } from "../components/ThemeToggle";
import { GlassButton } from "../components/GlassButton";

export async function ServiceDetails(service) {

  const settings = await getSettings();

  const waNumber = (settings.whatsappNumber || "")
    .replace(/[^0-9]/g, "");

  const hasWhatsapp = waNumber.length >= 9;

  const sessionText = service.sessions
    ? `<p class="detail-card-text">🔁 عدد الجلسات: ${service.sessions}</p>`
    : "";

  const durationText = service.duration
    ? `<p class="detail-card-text">⏱ مدة الجلسة: ${service.duration}</p>`
    : "";

  const showSchedule = service.duration || service.sessions;

  return `
    <div class="container">

      <div class="top-bar">

        <button class="back-btn" id="backToServices" type="button">
          ←
        </button>

        ${ThemeToggle()}

      </div>

      <div style="position:relative;margin-bottom:20px">

        <input
          id="detailServiceSearch"
          class="glass-input"
          placeholder="ابحث في جميع الخدمات..."
          style="padding-left:40px"
        >

        <button
          id="clearDetailService"
          type="button"
          style="
            position:absolute;
            top:50%;
            left:12px;
            transform:translateY(-50%);
            width:26px;
            height:26px;
            border-radius:50%;
            border:none;
            background:var(--border-hover);
            color:var(--text);
            cursor:pointer;
            font-size:14px;
            line-height:1;
            display:none;
            align-items:center;
            justify-content:center;
          "
        >
          ✕
        </button>

      </div>

      <div
        id="detailServiceResults"
        class="glass-card"
        style="display:none;margin-bottom:20px;padding:8px"
      ></div>

      <h1 class="service-details-title">
        ${service.name}
      </h1>

      <div class="glass-card detail-image-card">

        <div class="detail-image">

          ${
            service.image
              ? `<img src="${service.image}" alt="${service.name}">`
              : `
                <div class="detail-image-placeholder">
                  🦷
                </div>
              `
          }

        </div>

      </div>

      ${
        service.short_description
          ? `
            <div class="glass-card detail-card">

              <div class="detail-card-title">الوصف المختصر</div>

              <p class="detail-card-text">
                ${service.short_description}
              </p>

            </div>
          `
          : ""
      }

      ${
        service.description
          ? `
            <div class="glass-card detail-card">

              <div class="detail-card-title">الوصف التفصيلي</div>

              <p class="detail-card-text">
                ${service.description}
              </p>

            </div>
          `
          : ""
      }

      ${
        showSchedule
          ? `
            <div class="glass-card detail-card">

              <div class="detail-card-title">🗓 معلومات الجلسات</div>

              ${durationText}

              ${sessionText}

            </div>
          `
          : ""
      }

      ${
        service.features && service.features.length
          ? `
            <div class="glass-card detail-card">

              <div class="detail-card-title">✨ مميزات الخدمة</div>

              <ul class="detail-features-list">

                ${service.features
                  .map(
                    feature => `
                      <li>✔ ${feature}</li>
                    `
                  )
                  .join("")}

              </ul>

            </div>
          `
          : ""
      }

      ${
        service.price
          ? `
            <div class="glass-card detail-card detail-card-price">

              <div class="detail-card-title">💰 السعر</div>

              <p class="detail-card-text">
                يبدأ من ${service.price} جنيه
              </p>

            </div>
          `
          : ""
      }

      ${
        hasWhatsapp
          ? `
            <a
              class="whatsapp-btn"
              href="https://wa.me/${waNumber}?text=${encodeURIComponent(
  service.whatsapp_message ||
  `أرغب في الاستفسار عن خدمة ${service.name}`
)}"
              target="_blank"
            >
              💬 استفسر عبر واتساب
            </a>
          `
          : ""
      }

      ${GlassButton("📅 احجز موعد", {
        id: "bookServiceBtn"
      })}

    </div>
  `;

}