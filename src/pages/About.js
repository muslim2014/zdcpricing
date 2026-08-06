import {
  getDoctorProfile,
  getCertificates
} from "../api/doctorApi";
import { ThemeToggle } from "../components/ThemeToggle";

export async function About() {

  const doctor = await getDoctorProfile();

  const certificates = await getCertificates();
  const visibleCerts = certificates.filter(c => c.visible);

  return `
    <div class="container about-page">

      <div class="top-bar">

        <button class="back-btn" id="backToHome">←</button>
        <h2>عن الطبيب</h2>

        ${ThemeToggle()}

      </div>

      <div class="glass-card about-card">

        <div class="doctor-image">
          <img src="${
            doctor.image || "https://placehold.co/220x220?text=Doctor"
          }" alt="${doctor.name ?? ""}">
        </div>

        <h2 class="doctor-name">${doctor.name ?? ""}</h2>
        <p class="doctor-title">${doctor.title ?? ""}</p>
        <p class="doctor-specialty">${doctor.specialty ?? ""}</p>
        <p class="doctor-experience">${doctor.experience ?? ""}</p>

        <hr class="doctor-divider">

        <div class="doctor-bio">${doctor.full_bio ?? ""}</div>

        ${
          visibleCerts.length
            ? `
              <h3 class="certificates-title">الشهادات والدورات</h3>

              <div class="about-cert-grid">
                ${visibleCerts.map((c, i) => `
                  <div class="about-cert-card" data-index="${i}">
                    <img src="${c.image}" class="about-cert-img" loading="lazy" alt="">
                  </div>
                `).join("")}
              </div>

              <div id="certOverlay" class="gallery-overlay hidden">
                <button id="certCloseBtn" class="gallery-overlay-close">✖</button>
                <button id="certPrevBtn" class="gallery-nav-btn left">⬅</button>
                <img id="certFullImage" class="gallery-full-img" src="" alt="">
                <button id="certNextBtn" class="gallery-nav-btn right">➡</button>
              </div>
            `
            : ""
        }

      </div>

    </div>
  `;

}