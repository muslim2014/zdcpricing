import {
  getCertificates
} from "../../api/doctorApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function DoctorCertificates() {

  const certificates =
    await getCertificates();

  return `
    <div class="container">

      ${TopBar("إدارة الشهادات")}

      <div class="glass-card">

        ${GlassButton("➕ إضافة شهادة", {
          id: "addCertificateBtn"
        })}

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

              ${GlassButton("⬆", {
                className: "move-certificate-up",
                data: { id: c.id },
                title: "لأعلى"
              })}

              ${GlassButton("⬇", {
                className: "move-certificate-down",
                data: { id: c.id },
                title: "لأسفل"
              })}

              ${GlassButton("✏️", {
                className: "edit-certificate",
                data: { id: c.id },
                title: "تعديل"
              })}

              ${GlassButton(c.visible ? "🙈" : "👁", {
                className: "toggle-certificate",
                data: {
                  id: c.id,
                  visible: c.visible
                },
                title: c.visible ? "إخفاء" : "إظهار"
              })}

              ${GlassButton("🗑", {
                className: "delete-certificate",
                data: { id: c.id },
                title: "حذف"
              })}

            </div>

          </div>

        `).join("")}

      </div>

    </div>
  `;

}