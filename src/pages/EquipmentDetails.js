import { ThemeToggle } from "../components/ThemeToggle";

export async function EquipmentDetails(section, item) {

  const features = (item.features || "")
    .split("\n")
    .map(feature => feature.trim())
    .filter(Boolean);

  return `
    <div class="container">

      <div class="top-bar">

        <button
          class="back-btn"
          id="backToEquipment"
          type="button"
        >
          ←
        </button>

        <h2>${section.title}</h2>

        ${ThemeToggle()}

      </div>

      <h1 class="service-details-title">
        ${item.title}
      </h1>

      <div class="glass-card detail-image-card">

        <div class="detail-image equipment-detail-image">
          ${
            item.image
              ? `<img src="${item.image}" alt="${item.title}">`
              : `
                <div class="detail-image-placeholder">
                  🦷
                </div>
              `
          }
        </div>

      </div>

      ${
        item.image
          ? `
            <!-- صورة الجهاز Fullscreen -->

            <div
              id="equipmentImageOverlay"
              class="gallery-overlay hidden"
            >

              <button
                id="equipmentImageCloseBtn"
                class="gallery-overlay-close"
              >
                ✖
              </button>

              <img
                id="equipmentFullImage"
                class="gallery-full-img"
                src=""
                alt=""
              >

            </div>
          `
          : ""
      }

      ${
        item.description
          ? `
            <div class="glass-card detail-card">

              <div class="detail-card-title">الشرح</div>

              <p class="detail-card-text">
                ${item.description}
              </p>

            </div>
          `
          : ""
      }

      ${
        features.length
          ? `
            <div class="glass-card detail-card">

              <div class="detail-card-title">✨ المميزات</div>

              <ul class="detail-features-list">

                ${features
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

    </div>
  `;

}