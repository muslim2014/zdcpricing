import {
  getDoctorProfile,
  getCertificates
} from "../api/doctorApi";

import { TopBar } from "../components/TopBar";

function toPoints(text) {
  return (text || "")
    .split(/[\r\n•]+/)
    .flatMap(line => line.split(/[،,;؛]/))
    .map(item => item.trim().replace(/^[-•*\s]+/, ""))
    .filter(Boolean);
}

export async function About() {

  const doctor = await getDoctorProfile();

  const certificates =
    await getCertificates();

  const visibleCerts =
    certificates.filter(c => c.visible);

  const areas = toPoints(
    doctor.areas_of_expertise
  );

  return `

    <div class="container doctor-about-page">

      ${TopBar("عن الطبيب", "backToHome")}


      <!-- ========================= -->
      <!-- الكارت 1: رأس الطبيب -->
      <!-- ========================= -->

      <div class="glass-card doctor-about-card doctor-hero-card">

        <div class="doctor-image">

          <img
            src="${
              doctor.image ||
              "https://placehold.co/220x220?text=Doctor"
            }"
            alt="${doctor.name ?? ""}"
          >

        </div>


        <h2 class="doctor-name">
          ${doctor.name ?? ""}
        </h2>


        <p class="doctor-specialty">
          ${doctor.specialty ?? ""}
        </p>


        ${
          doctor.experience
            ? `
              <p class="doctor-experience">
                ${doctor.experience}
              </p>
            `
            : ""
        }

      </div>


      <!-- ========================= -->
      <!-- الكارت 2: نبذة عن الطبيب -->
      <!-- ========================= -->

      ${
        doctor.full_bio
          ? `

            <h2 class="certificates-title doctor-section-title">
              نبذة عن الطبيب
            </h2>

            <div class="doctor-bio glass-card">
              ${doctor.full_bio}
            </div>

          `
          : ""
      }


      <!-- ========================= -->
      <!-- الكارت 3: الرحلة المهنية والتدريب والتطوير -->
      <!-- ========================= -->

      ${
        doctor.professional_journey
          ? `

            <h2 class="certificates-title doctor-section-title">
              الرحلة المهنية والتدريب والتطوير
            </h2>

            <div class="doctor-bio glass-card">
              ${doctor.professional_journey}
            </div>

          `
          : ""
      }


      <!-- ========================= -->
      <!-- الكارت 4: منهجية العلاج -->
      <!-- ========================= -->

      ${
        doctor.restorative_approach
          ? `

            <h2 class="certificates-title doctor-section-title">
              منهجية العلاج
            </h2>

            <div class="doctor-bio glass-card">
              ${doctor.restorative_approach}
            </div>

          `
          : ""
      }


      <!-- ========================= -->
      <!-- الكارت 5: مجالات الخبرة -->
      <!-- ========================= -->

      ${
        areas.length
          ? `

            <h2 class="certificates-title doctor-section-title">
              مجالات الخبرة
            </h2>

            <div class="doctor-points glass-card">

              <ul>

                ${areas.map(a => `
                  <li>${a}</li>
                `).join("")}

              </ul>

            </div>

          `
          : ""
      }


      <!-- ========================= -->
      <!-- الكارت الأخير: الشهادات والدورات -->
      <!-- ========================= -->

      ${
        visibleCerts.length
          ? `

            <h2 class="certificates-title doctor-section-title">
              الشهادات والدورات
            </h2>

            <div class="glass-card doctor-about-card">

              <div class="about-cert-grid">

                ${visibleCerts.map((c, i) => `

                  <div
                    class="about-cert-card"
                    data-index="${i}"
                  >

                    <img
                      src="${c.image}"
                      class="about-cert-img"
                      loading="lazy"
                      alt="${c.title || "شهادة"}"
                    >

                  </div>

                `).join("")}

              </div>

            </div>


            <!-- Certificate Viewer -->

            <div
              id="certOverlay"
              class="gallery-overlay hidden"
            >

              <button
                id="certCloseBtn"
                class="gallery-overlay-close"
              >
                ✖
              </button>

              <button
                id="certPrevBtn"
                class="gallery-nav-btn left"
              >
                ⬅
              </button>

              <img
                id="certFullImage"
                class="gallery-full-img"
                src=""
                alt=""
              >

              <button
                id="certNextBtn"
                class="gallery-nav-btn right"
              >
                ➡
              </button>

            </div>

          `
          : ""
      }

    </div>

  `;
}