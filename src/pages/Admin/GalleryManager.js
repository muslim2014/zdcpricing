import {
  getGallery
} from "../../api/galleryApi";

export async function GalleryManager() {

  const images = await getGallery();

  return `
    <div class="container">

      <div class="top-bar">

        <button
          id="backToDashboard"
          class="back-btn"
        >
          ←
        </button>

        <h2>إدارة معرض الصور</h2>

      </div>

      <div class="glass-card">

        <button
          id="addGalleryImageBtn"
          class="glass-button"
        >
          ➕ إضافة صورة
        </button>

      </div>

      <div style="height:20px"></div>

      <div class="certificates-grid">

        ${images.map(image => `

          <div class="certificate-card">

            <div class="certificate-image">

              <img
                src="${image.image}"
                class="certificate-preview"
                alt="${image.title ?? ""}"
              >

            </div>

            <div class="certificate-body">

              <h3>
                ${image.title || "بدون عنوان"}
              </h3>

              <p>
                ${
                  image.visible
                    ? "👁 ظاهرة"
                    : "🚫 مخفية"
                }
              </p>

              <div class="certificate-actions">

                <button
                  class="glass-button move-gallery-up"
                  data-id="${image.id}"
                >
                  ↑
                </button>

                <button
                  class="glass-button move-gallery-down"
                  data-id="${image.id}"
                >
                  ↓
                </button>

                <button
                  class="glass-button toggle-gallery"
                  data-id="${image.id}"
                  data-visible="${image.visible}"
                >
                  ${
                    image.visible
                      ? "إخفاء"
                      : "إظهار"
                  }
                </button>

                <button
                  class="glass-button edit-gallery"
                  data-id="${image.id}"
                >
                  تعديل
                </button>

                <button
                  class="glass-button delete-gallery"
                  data-id="${image.id}"
                >
                  حذف
                </button>

              </div>

            </div>

          </div>

        `).join("")}

      </div>

    </div>
  `;

}