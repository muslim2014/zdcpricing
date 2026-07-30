import {
  getGalleryImage
} from "../../api/galleryApi";

export async function GalleryEditor(id = null) {

  const image = id
    ? await getGalleryImage(id)
    : {
        title: "",
        description: "",
        image: "",
        visible: true
      };

  return `
    <div class="container">

      <div class="top-bar">

        <button
          id="backToGallery"
          class="back-btn"
        >
          ←
        </button>

        <h2>

          ${
            id
              ? "تعديل صورة"
              : "إضافة صورة"
          }

        </h2>

      </div>

      <div class="glass-card">

        <div class="form-group">

          <label>

            عنوان الصورة

          </label>

          <input
            id="galleryTitle"
            class="glass-input"
            value="${image.title ?? ""}"
          >

        </div>

        <div class="form-group">

          <label>

            وصف الصورة

          </label>

          <textarea
            id="galleryDescription"
            class="glass-input"
            rows="4"
          >${image.description ?? ""}</textarea>

        </div>

        <div class="form-group">

          <label>

            الصورة

          </label>

          <input
            id="galleryImage"
            type="file"
            accept="image/*"
            class="glass-input"
          >

        </div>

        <div
          style="
            display:flex;
            justify-content:center;
            margin:20px 0;
          "
        >

          <img
            id="galleryPreview"
            src="${image.image ?? ""}"
            style="
              max-width:100%;
              max-height:260px;
              border-radius:14px;
            "
          >

        </div>

        <div
          style="
            display:flex;
            align-items:center;
            gap:10px;
            margin-bottom:25px;
          "
        >

          <input
            id="galleryVisible"
            type="checkbox"

            ${
              image.visible
                ? "checked"
                : ""
            }

          >

          <label>

            إظهار الصورة

          </label>

        </div>

        <button
          id="saveGalleryImage"
          class="glass-button"
        >

          💾 حفظ

        </button>

      </div>

    </div>
  `;

}