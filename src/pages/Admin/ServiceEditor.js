import { getService } from "../../api/servicesApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

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

      ${TopBar("تعديل الخدمة", "backToCategoryServices")}

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

          <label>عدد الجلسات</label>

          <input
            id="serviceSessions"
            class="glass-input"
            value="${service.sessions || ""}"
            placeholder="مثال: 3 جلسات"
          >

        </div>

        <div class="form-group">

          <label>الوصف المختصر</label>

          <textarea
            id="serviceShortDescription"
            class="glass-input"
            rows="3"
          >${service.short_description || ""}</textarea>

        </div>

        <div class="form-group">

          <label>الوصف التفصيلي</label>

          <textarea
            id="serviceDescription"
            class="glass-input"
            rows="6"
          >${service.description || ""}</textarea>

        </div>

        <div class="form-group">

          <label>المميزات</label>

          <textarea
            id="serviceFeatures"
            class="glass-input"
            rows="4"
            placeholder="كل مميزة في سطر منفصل"
          >${
            Array.isArray(service.features)
              ? service.features.join("\n")
              : ""
          }</textarea>

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

        ${GlassButton("💾 حفظ", {
          id: "saveServiceBtn"
        })}

        ${GlassButton("🗑 حذف الخدمة", {
          id: "deleteServiceBtn",
          style: "margin-top:12px;background:#b22222"
        })}

      </div>

    </div>

  `;

}