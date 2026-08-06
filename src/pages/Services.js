import { getServices } from "../api/servicesApi";
import { ThemeToggle } from "../components/ThemeToggle";

export async function Services(category) {

 const services = await getServices(category.id, true);

  return `
    <div class="container">

      <div class="top-bar">

        <button
          class="back-btn"
          id="backToCategories"
          type="button"
        >
          ←
        </button>

        <h2>${category.name}</h2>

        ${ThemeToggle()}

      </div>

      <div style="position:relative;margin-bottom:20px">

        <input
          id="publicServiceSearch"
          class="glass-input"
          placeholder="ابحث عن خدمة..."
          style="padding-left:40px"
        >

        <button
          id="clearServiceSearch"
          type="button"
          style="
            position:absolute;
            top:50%;
            left:12px;
            transform:translateY(-50%);
            width:26px;
            height:26px;
            border-radius:50%;
            border:none;
            background:var(--border-hover);
            color:var(--text);
            cursor:pointer;
            font-size:14px;
            line-height:1;
            display:none;
            align-items:center;
            justify-content:center;
          "
        >
          ✕
        </button>

      </div>

      <div class="services">

        ${services.map(service => `

          <div
            class="service-card"
            data-category="${category.id}"
            data-id="${service.id}"
          >

            <div class="service-image">

              ${
                service.image
                  ? `<img src="${service.image}" alt="${service.name}">`
                  : `
                    <div class="service-placeholder">
                      🦷
                    </div>
                  `
              }

            </div>

            <div class="service-info">

              <h3>${service.name}</h3>

              <span class="service-link">عرض التفاصيل ←</span>

            </div>

            <span
              class="service-search-text"
              style="display:none"
            >${service.description || ""}</span>

          </div>

        `).join("")}

      </div>

      <div
        id="noServicesFound"
        style="display:none"
      >
        <div class="glass-card">
          <p style="text-align:center;opacity:.8">
            عذرًا، لم نجد خدمة مطابقة لبحثك.
          </p>
        </div>
      </div>

    </div>
  `;
}
