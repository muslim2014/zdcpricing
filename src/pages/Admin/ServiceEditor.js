import { getService } from "../../api/servicesApi";

export async function ServiceEditor(categoryId, serviceId) {

  const service = await getService(serviceId);

  if (!service) {

    return `
      <div class="container">
        <h2>الخدمة غير موجودة</h2>
      </div>
    `;

  }

  return `

    <div class="container">

      <div class="top-bar">

        <button
          id="backToCategoryServices"
          class="back-btn"
        >
          ←
        </button>

        <h2>تعديل الخدمة</h2>

      </div>

      <div class="glass-card">

        <div class="form-group">

          <label>اسم الخدمة</label>

          <input
            id="serviceName"
            class="glass-input"
            value="${service.name}"
          >

        </div>

        <div class="form-group">

          <label>السعر</label>

          <input
            id="servicePrice"
            class="glass-input"
            value="${service.price || ""}"
          >

        </div>

        <div class="form-group">

          <label>الوصف</label>

          <textarea
            id="serviceDescription"
            class="glass-input"
            rows="6"
          >${service.description || ""}</textarea>

        </div>

        <div class="form-group">

          <label>صورة الخدمة</label>

          <input
            id="serviceImage"
            class="glass-input"
            type="file"
            accept="image/*"
          >

        </div>

        <div
          id="imagePreview"
          style="
            margin-top:15px;
            text-align:center;
          "
        >

          ${
            service.image
              ? `
                <img
                  src="${service.image}"
                  style="
                    max-width:220px;
                    max-height:180px;
                    border-radius:12px;
                  "
                >
              `
              : ""
          }

        </div>

        <button
          id="saveServiceBtn"
          class="glass-button"
        >
          💾 حفظ
        </button>

        <button
          id="deleteServiceBtn"
          class="glass-button"
          style="margin-top:12px;background:#b22222"
        >
          🗑 حذف الخدمة
        </button>

      </div>

    </div>

  `;

}