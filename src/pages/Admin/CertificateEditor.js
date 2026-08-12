import {
  getCertificate
} from "../../api/doctorApi";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export async function CertificateEditor(id = null) {

  const certificate = id
    ? await getCertificate(id)
    : {
        title: "",
        description: "",
        image: "",
        visible: true
      };

  if (id && !certificate) {

    return `
      <div class="container">
        <h2>الشهادة غير موجودة</h2>
      </div>
    `;

  }

  return `
    <div class="container">

      ${TopBar(id ? "تعديل شهادة" : "إضافة شهادة", "backToCertificates")}

      <div class="glass-card">

        <div class="form-group">

          <label>
            عنوان الشهادة
          </label>

          <input
            id="certificateTitle"
            class="glass-input"
            value="${certificate.title ?? ""}"
          >

        </div>

        <div class="form-group">

          <label>
            وصف مختصر (اختياري)
          </label>

          <textarea
            id="certificateDescription"
            class="glass-input"
            rows="3"
          >${certificate.description ?? ""}</textarea>

        </div>

        <div class="form-group">

          <label>
            صورة الشهادة
          </label>

          <input
            id="certificateImage"
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
            id="certificatePreview"
            src="${
              certificate.image ||
              "https://placehold.co/700x500?text=Certificate"
            }"
            style="
              max-width:100%;
              max-height:320px;
              border-radius:16px;
              object-fit:contain;
              border:1px solid rgba(255,255,255,.15);
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
            id="certificateVisible"
            type="checkbox"
            ${
              certificate.visible
                ? "checked"
                : ""
            }
          >

          <label>
            إظهار الشهادة
          </label>

        </div>

        ${GlassButton("💾 حفظ", {
          id: "saveCertificate",
          data: { id: id ?? "" }
        })}

      </div>

    </div>
  `;

}