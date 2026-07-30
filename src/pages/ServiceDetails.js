export function ServiceDetails(service) {
  return `
    <div class="container">

      <div class="top-bar">

        <button class="back-btn" id="backToServices" type="button">
          ←
        </button>

        <h2>${service.name}</h2>

      </div>

      <div class="details-card">

        <div class="details-image">

          ${
            service.image
              ? `<img src="${service.image}" alt="${service.name}">`
              : "🦷"
          }

        </div>

        <div class="details-content">

          <h3>${service.name}</h3>

          <div class="detail-item">

            <span>💰</span>

            <span>

              ${
                service.price
                  ? `يبدأ من ${service.price} جنيه`
                  : "يحدد بعد الكشف"

              }

            </span>

          </div>

          <div class="detail-item">

            <span>⏱️</span>

            <span>

              ${
                service.duration
                  ? service.duration
                  : "حسب الحالة"

              }

            </span>

          </div>

          <p class="service-description">

            ${
              service.description
                ? service.description
                : "سيتم إضافة وصف لهذه الخدمة قريبًا."

            }

          </p>

          ${
            service.features && service.features.length
              ? `
              <div class="service-features">

                <h4>مميزات الخدمة</h4>

                <ul>

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

          <a

            class="whatsapp-btn"

            href="https://wa.me/201000000000?text=${encodeURIComponent(
  service.whatsapp_message ||
  `أرغب في الاستفسار عن خدمة ${service.name}`
)}"

            target="_blank"

          >

            💬 استفسر عبر واتساب

          </a>

        </div>

      </div>

    </div>
  `;
}