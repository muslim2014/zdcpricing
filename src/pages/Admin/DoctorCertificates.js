import {
  getCertificates
} from "../../api/doctorApi";

export async function DoctorCertificates() {

  const certificates =
    await getCertificates();

  return `
    <div class="container">

      <div class="top-bar">

        <button
          id="backToDashboard"
          class="back-btn"
        >
          ←
        </button>

        <h2>إدارة الشهادات</h2>

      </div>

      <div class="glass-card">

        <button
          id="addCertificateBtn"
          class="glass-button"
        >
          ➕ إضافة شهادة
        </button>

      </div>

      <div style="height:20px"></div>

      <div class="certificates-grid">

        ${certificates.map(c => `

          <div class="certificate-card">

            <div class="certificate-image">

              <img
                src="${
                  c.image ||
                  "https://placehold.co/600x400?text=Certificate"
                }"
                alt="${c.title}"
              >

              <div class="
                certificate-status
                ${c.visible ? "visible" : "hidden"}
              ">

                ${
                  c.visible
                    ? "👁 ظاهرة"
                    : "🚫 مخفية"
                }

              </div>

            </div>

            <div class="certificate-body">

              <h3>
                ${c.title || "بدون عنوان"}
              </h3>

              <p>
                ${
                  c.description ||
                  "لا يوجد وصف"
                }
              </p>

            </div>

            <div class="certificate-actions">

              <button
                class="glass-button move-certificate-up"
                data-id="${c.id}"
                title="لأعلى"
              >
                ⬆
              </button>

              <button
                class="glass-button move-certificate-down"
                data-id="${c.id}"
                title="لأسفل"
              >
                ⬇
              </button>

              <button
                class="glass-button edit-certificate"
                data-id="${c.id}"
                title="تعديل"
              >
                ✏️
              </button>

              <button
                class="glass-button toggle-certificate"
                data-id="${c.id}"
                data-visible="${c.visible}"
                title="${
                  c.visible
                    ? "إخفاء"
                    : "إظهار"
                }"
              >
                ${
                  c.visible
                    ? "🙈"
                    : "👁"
                }
              </button>

              <button
                class="glass-button delete-certificate"
                data-id="${c.id}"
                title="حذف"
              >
                🗑
              </button>

            </div>

          </div>

        `).join("")}

      </div>

    </div>
  `;

}