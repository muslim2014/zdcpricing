import {
  getDoctorProfile
} from "../../api/doctorApi";

export async function DoctorProfile() {

  const doctor = await getDoctorProfile();

  return `
    <div class="container">

      <div class="top-bar">

        <button
          id="backToDashboard"
          class="back-btn"
        >
          ←
        </button>

        <h2>عن الطبيب</h2>

      </div>

      <div class="glass-card">

        <div
          style="
            display:flex;
            justify-content:center;
            margin-bottom:20px;
          "
        >

          <img
            id="doctorImagePreview"
            src="${
              doctor.image ||
              "https://placehold.co/220x220?text=Doctor"
            }"
            style="
              width:180px;
              height:180px;
              border-radius:50%;
              object-fit:cover;
              border:2px solid rgba(255,255,255,.2);
            "
          >

        </div>

        <div class="form-group">

          <label>الصورة الشخصية</label>

          <input
            id="doctorImage"
            type="file"
            accept="image/*"
            class="glass-input"
          >

        </div>

        <div class="form-group">

          <label>اسم الطبيب</label>

          <input
            id="doctorName"
            class="glass-input"
            value="${doctor.name ?? ""}"
          >

        </div>

        <div class="form-group">

          <label>اللقب</label>

          <input
            id="doctorTitle"
            class="glass-input"
            value="${doctor.title ?? ""}"
          >

        </div>

        <div class="form-group">

          <label>التخصص</label>

          <input
            id="doctorSpecialty"
            class="glass-input"
            value="${doctor.specialty ?? ""}"
          >

        </div>

        <div class="form-group">

          <label>سنوات الخبرة</label>

          <input
            id="doctorExperience"
            class="glass-input"
            value="${doctor.experience ?? ""}"
          >

        </div>

        <div class="form-group">

          <label>نبذة عن الطبيب</label>

          <textarea
            id="doctorFullBio"
            class="glass-input"
            rows="12"
          >${doctor.full_bio ?? ""}</textarea>

        </div>

        <button
          id="saveDoctorProfile"
          class="glass-button"
        >
          💾 حفظ التعديلات
        </button>

      </div>

    </div>
  `;

}