import { getServices } from "../api/servicesApi";

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
                  : "🦷"
              }

            </div>

            <div class="service-info">

              <h3>${service.name}</h3>

              <p>

                ${
                  service.price
                    ? `يبدأ من ${service.price} جنيه`
                    : "يحدد لاحقًا"
                }

              </p>

            </div>

          </div>

        `).join("")}

      </div>

    </div>
  `;
}