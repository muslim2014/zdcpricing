import {
  getDoctorProfile,
  getCertificates
} from "../../api/doctorApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function DoctorProfile() {

  const doctor = await getDoctorProfile();

  const certificates = await getCertificates();

  return `
    <div class="container">

      ${TopBar("عن الطبيب")}

      <div class="glass-card">

        <div
          style="
            display:flex;
            justify-content:center;
            margin-bottom:20px;
          "
        >

          <img
            id="doctorImagePreview"
            src="${
              doctor.image ||
              "https://placehold.co/220x220?text=Doctor"
            }"
            style="
              width:180px;
              height:180px;
              border-radius:50%;
              object-fit:cover;
              border:2px solid rgba(255,255,255,.2);
            "
          >

        </div>

        <div class="form-group">

          <label>الصورة الشخصية</label>

          <input
            id="doctorImage"
            type="file"
            accept="image/*"
            class="glass-input"
          >

        </div>

        <div class="form-group">

          <label>اسم الطبيب</label>

          <input
            id="doctorName"
            class="glass-input"
            value="${doctor.name ?? ""}"
          >

        </div>

        <div class="form-group">

          <label>اللقب</label>

          <input
            id="doctorTitle"
            class="glass-input"
            value="${doctor.title ?? ""}"
          >

        </div>

        <div class="form-group">

          <label>التخصص</label>

          <input
            id="doctorSpecialty"
            class="glass-input"
            value="${doctor.specialty ?? ""}"
          >

        </div>

        <div class="form-group">

          <label>سنوات الخبرة</label>

          <input
            id="doctorExperience"
            class="glass-input"
            value="${doctor.experience ?? ""}"
          >

        </div>

        <div class="form-group">

          <label>نبذة عن الطبيب</label>

          <textarea
            id="doctorFullBio"
            class="glass-input"
            rows="12"
          >${doctor.full_bio ?? ""}</textarea>

        </div>

        ${GlassButton("💾 حفظ التعديلات", {
          id: "saveDoctorProfile"
        })}

      </div>

      <div style="height:30px"></div>

      <h2 class="certificates-title">الشهادات</h2>

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
