import { getSections } from "../api/sectionsApi";
import { getSettings } from "../api/settingsApi";
import { getTypography } from "../api/typographyApi";
import { getVisibleSocialLinks } from "../api/socialLinksApi";
import { getDoctorProfile } from "../api/doctorApi";
import {
  getSocialIcon,
  buildSocialHref
} from "../utils/socialLinks";
import { ThemeToggle } from "../components/ThemeToggle";

export async function Home() {

  const [
    settings,
    typography,
    sections,
    socialLinks,
    doctor
  ] = await Promise.all([
    getSettings(),
    getTypography(),
    getSections("home"),
    getVisibleSocialLinks(),
    getDoctorProfile().catch(() => null)
  ]);

  const socialSection = sections.find(
    s => s.section_key === "social"
  );

  return `
<div class="background">
  <div class="blob blob1"></div>
  <div class="blob blob2"></div>
  <div class="blob blob3"></div>
</div>

<div class="container">

  ${ThemeToggle()}

  <button
    id="searchIconBtn"
    class="admin-btn"
    title="بحث"
    style="top:70px;right:18px;left:auto"
  >
    <i class="fa-solid fa-magnifying-glass"></i>
  </button>

  ${
    settings.logo
      ? `
        <img
          class="logo"
          src="${settings.logo}"
          alt="شعار العيادة"
          style="width:${settings.logoWidth}px;height:auto;"
        >
      `
      : `
        <div
          class="logo"
          style="
            font-size:${typography.logo_size}px;
            font-family:var(--app-font);
          "
        >
          🦷
        </div>
      `
  }

  <p
    class="welcome"
    style="
      font-family:var(--app-font);
    "
  >
    أهلاً بك في
  </p>

  <h1
    class="clinic-name"
    style="
      font-size:${typography.clinic_name_size}px;
      font-family:var(--app-font);
    "
  >
    ${settings.clinicName}
  </h1>

  <p
    class="doctor-name"
    style="
      font-size:${typography.doctor_name_size}px;
      font-family:var(--app-font);
    "
  >
    ${doctor?.name || settings.doctorName || ""}
  </p>

  <div class="buttons">

    ${sections
      .filter(
        section =>
          section.visible &&
          section.section_key !== "social"
      )
      .sort(
        (a, b) => a.sort_order - b.sort_order
      )
      .map(section => `

        <button
          class="card home-section-btn"
          data-key="${section.section_key}"
          style="
            font-family:var(--app-font);
          "
        >

          <div
            class="icon"
            style="
              font-size:${typography.card_icon_size}px;
            "
          >
            ${section.icon || "🦷"}
          </div>

          <div class="text">

            <h3
              style="
                font-size:${typography.card_title_size}px;
                font-family:var(--app-font);
              "
            >
              ${section.title}
            </h3>

            <p
              style="
                font-size:${typography.card_description_size}px;
                font-family:var(--app-font);
              "
            >
              ${section.description ?? ""}
            </p>

          </div>

          <div
            class="arrow"
            style="
              font-family:var(--app-font);
            "
          >
            ›
          </div>

        </button>

      `).join("")}

  </div>

  ${socialSection?.visible ? `

    <p
      class="social-links-title"
      style="
        font-family:var(--app-font);
      "
    >
      ${socialSection.title}
    </p>

  ` : ""}

  <div class="social-links">

    ${socialLinks.map(link => `

      <a
        class="social-icon"
        href="${buildSocialHref(link)}"
        target="_blank"
        title="${link.title}"
        style="
          font-size:${typography.social_icon_size}px;
        "
      >

        <i class="${getSocialIcon(link.platform)}"></i>

      </a>

    `).join("")}

  </div>

</div>
`;

}
