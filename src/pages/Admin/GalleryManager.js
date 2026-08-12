import {
  getGallery
} from "../../api/galleryApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function GalleryManager() {

  const images = await getGallery();

  return `
    <div class="container">

      ${TopBar("إدارة معرض الصور")}

      <div class="glass-card">

        <div
          style="
            display:flex;
            flex-direction:column;
            gap:14px;
          "
        >

          ${GlassButton("➕ إضافة صورة", {
            id: "addGalleryImageBtn"
          })}

          <input
            id="bulkGalleryInput"
            type="file"
            accept="image/*"
            multiple
            class="glass-input"
            style="display:none;"
          >

          ${GlassButton("📤 رفع صور متعددة", {
            id: "bulkUploadTrigger"
          })}

          <div
            id="bulkPreviewGrid"
            class="bulk-preview-grid"
            style="display:none;"
          ></div>

          <div
            style="
              display:flex;
              align-items:center;
              gap:12px;
              margin-top:4px;
            "
          >

            <span
              id="bulkUploadProgress"
              style="
                color:var(--text-soft);
                font-size:14px;
              "
            ></span>

            ${GlassButton("⬆️ رفع الصور", {
              id: "bulkUploadStart",
              style: "display:none;"
            })}

          </div>

        </div>

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

                ${GlassButton("↑", {
                  className: "move-gallery-up",
                  data: { id: image.id }
                })}

                ${GlassButton("↓", {
                  className: "move-gallery-down",
                  data: { id: image.id }
                })}

                ${GlassButton(
                  image.visible
                    ? "إخفاء"
                    : "إظهار",
                  {
                    className: "toggle-gallery",
                    data: {
                      id: image.id,
                      visible: image.visible
                    }
                  }
                )}

                ${GlassButton("تعديل", {
                  className: "edit-gallery",
                  data: { id: image.id }
                })}

                ${GlassButton("حذف", {
                  className: "delete-gallery",
                  data: { id: image.id }
                })}

              </div>

            </div>

          </div>

        `).join("")}

      </div>

    </div>
  `;

}