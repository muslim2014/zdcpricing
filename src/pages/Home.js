import { getSections } from "../api/sectionsApi";
import { getSettings } from "../api/settingsApi";

export async function Home() {

  const settings = await getSettings();

  const sections = await getSections("home");

  return `
<div class="background">
  <div class="blob blob1"></div>
  <div class="blob blob2"></div>
  <div class="blob blob3"></div>
</div>

<div class="container">

  <button
    id="adminBtn"
    class="admin-btn"
    title="لوحة الإدارة"
  >
    <i class="fa-solid fa-gear"></i>
  </button>

  <div class="logo">
    ${settings.logo}
  </div>

  <p class="welcome">
    أهلاً بك في
  </p>

  <h1 class="clinic-name">
    ${settings.clinicName}
  </h1>

  <p class="doctor-name">
    ${settings.doctorName}
  </p>

  <div class="buttons">

    ${sections
      .filter(section => section.visible && section.section_key !== "social")
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(section => `

        <button
          class="card home-section-btn"
          data-key="${section.section_key}"
        >

          <div class="icon">
            ${section.icon || settings.logo}
          </div>

          <div class="text">

            <h3>
              ${section.title}
            </h3>

            <p>
              ${section.description ?? ""}
            </p>

          </div>

          <div class="arrow">
            ›
          </div>

        </button>

      `).join("")}

  </div>

  ${sections.find(s => s.section_key === "social")?.visible ? `
    <p class="social-links-title">
      ${sections.find(s => s.section_key === "social").title}
    </p>
  ` : ""}

  <div class="social-links">

    <a
      id="instagramBtn"
      class="social-icon"
      href="${settings.instagram}"
      target="_blank"
      title="Instagram"
    >
      <i class="fa-brands fa-instagram"></i>
    </a>

    <a
      id="facebookBtn"
      class="social-icon"
      href="${settings.facebook}"
      target="_blank"
      title="Facebook"
    >
      <i class="fa-brands fa-facebook-f"></i>
    </a>

    <a
      id="whatsappBtn"
      class="social-icon"
      href="${settings.whatsapp}"
      target="_blank"
      title="WhatsApp"
    >
      <i class="fa-brands fa-whatsapp"></i>
    </a>

    <a
      id="mapsBtn"
      class="social-icon"
      href="${settings.maps}"
      target="_blank"
      title="Google Maps"
    >
      <i class="fa-solid fa-location-dot"></i>
    </a>

    <a
      id="phoneBtn"
      class="social-icon"
      href="tel:${settings.phone}"
      title="اتصال"
    >
      <i class="fa-solid fa-phone"></i>
    </a>

  </div>

</div>
`;

}