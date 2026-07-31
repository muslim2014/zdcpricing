import { getSections } from "../api/sectionsApi";
import { getSettings } from "../api/settingsApi";
import { getTypography } from "../api/typographyApi";
import { getSocialLinks } from "../api/socialLinksApi";
import {
  getSocialIcon,
  buildSocialHref
} from "../utils/socialLinks";

export async function Home() {

  const settings = await getSettings();

  const typography = await getTypography();

  const sections = await getSections("home");

  const socialLinks = await getSocialLinks();

  const visibleLinks = socialLinks.filter(
    link => link.visible
  );

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

  <div
    class="logo"
    style="
      font-size:${typography.logo_size}px;
      font-family:'${typography.font_family}', sans-serif;
    "
  >
    ${settings.logo}
  </div>

  <p
    class="welcome"
    style="
      font-family:'${typography.font_family}', sans-serif;
    "
  >
    أهلاً بك في
  </p>

  <h1
    class="clinic-name"
    style="
      font-size:${typography.clinic_name_size}px;
      font-family:'${typography.font_family}', sans-serif;
    "
  >
    ${settings.clinicName}
  </h1>

  <p
    class="doctor-name"
    style="
      font-size:${typography.doctor_name_size}px;
      font-family:'${typography.font_family}', sans-serif;
    "
  >
    ${settings.doctorName}
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
            font-family:'${typography.font_family}', sans-serif;
          "
        >

          <div
            class="icon"
            style="
              font-size:${typography.card_icon_size}px;
            "
          >
            ${section.icon || settings.logo}
          </div>

          <div class="text">

            <h3
              style="
                font-size:${typography.card_title_size}px;
                font-family:'${typography.font_family}', sans-serif;
              "
            >
              ${section.title}
            </h3>

            <p
              style="
                font-size:${typography.card_description_size}px;
                font-family:'${typography.font_family}', sans-serif;
              "
            >
              ${section.description ?? ""}
            </p>

          </div>

          <div
            class="arrow"
            style="
              font-family:'${typography.font_family}', sans-serif;
            "
          >
            ›
          </div>

        </button>

      `).join("")}

  </div>

  ${sections.find(
    s => s.section_key === "social"
  )?.visible ? `

    <p
      class="social-links-title"
      style="
        font-family:'${typography.font_family}', sans-serif;
      "
    >
      ${sections.find(
        s => s.section_key === "social"
      ).title}
    </p>

  ` : ""}

  <div class="social-links">

    ${visibleLinks.map(link => `

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