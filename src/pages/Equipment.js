import {
  getPublicEquipmentSections
} from "../api/equipmentApi";
import { ThemeToggle } from "../components/ThemeToggle";

export async function Equipment() {

  const sections =
    await getPublicEquipmentSections();

  return `
    <div class="container equipment-page">

      <div class="top-bar">

        <button
          class="back-btn"
          id="backToPublicHome"
          type="button"
        >
          ←
        </button>

        <h2>تجهيزات وإمكانيات العيادة</h2>

        ${ThemeToggle()}

      </div>

      ${
        !sections.length
          ? `
            <div class="glass-card">
              <p style="text-align:center;opacity:.8">
                لا توجد تجهيزات متاحة حالياً.
              </p>
            </div>
          `
          : sections.map(section => `

            <div class="equipment-section">

              <div class="equipment-section-divider">

                <span class="equipment-divider-line"></span>

                <h3 class="equipment-divider-title">${section.title}</h3>

                <span class="equipment-divider-line"></span>

              </div>

              ${
                section.description
                  ? `<p class="equipment-divider-sub">${section.description}</p>`
                  : ""
              }

              ${
                section.items.length
                  ? `

                    <div class="services">

                      ${section.items.map(item => `

                        <div
                          class="service-card equipment-card"
                          data-section="${section.id}"
                          data-id="${item.id}"
                        >

                          <div class="service-image">

                            ${
                              item.image
                                ? `
                                  <img
                                    src="${item.image}"
                                    alt="${item.title}"
                                    loading="lazy"
                                  >
                                `
                                : `
                                  <div class="service-placeholder">
                                    🦷
                                  </div>
                                `
                            }

                          </div>

                          <div class="service-info">

                            <h3>${item.title}</h3>

                            <span class="service-link">
                              عرض التفاصيل
                            </span>

                          </div>

                        </div>

                      `).join("")}

                    </div>

                  `
                  : ""
              }

            </div>

          `).join("")
      }

    </div>
  `;

}