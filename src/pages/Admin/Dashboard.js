export function AdminDashboard() {
  return `
    <div class="background">
      <div class="blob blob1"></div>
      <div class="blob blob2"></div>
      <div class="blob blob3"></div>
    </div>

    <div class="container">

      <div class="top-bar">

        <button
          id="logoutBtn"
          class="back-btn"
        >
          ⎋
        </button>

        <h2>لوحة الإدارة</h2>

      </div>

      <div class="glass-card">

        <button
          id="generalSettingsBtn"
          class="glass-button"
        >
          ⚙️ الإعدادات العامة
        </button>

        <button
          id="homeSectionsBtn"
          class="glass-button"
        >
          🏠 إدارة الصفحة الرئيسية
        </button>

        <button
          id="doctorProfileBtn"
          class="glass-button"
        >
          👨‍⚕️ إدارة عن الطبيب
        </button>

        <button
          id="doctorCertificatesBtn"
          class="glass-button"
        >
          🎓 إدارة الشهادات
        </button>

        <button
          id="homeCardsBtn"
          class="glass-button"
        >
          🏠 الصفحة الرئيسية
        </button>

        <button
          id="categoriesBtn"
          class="glass-button"
        >
          📂 إدارة الأقسام
        </button>

        <button
          id="servicesBtn"
          class="glass-button"
        >
          🦷 إدارة الخدمات
        </button>

        <button
          id="galleryBtn"
          class="glass-button"
        >
          🖼 إدارة معرض الصور
        </button>

        <button
          id="bookingsBtn"
          class="glass-button"
        >
          📅 إدارة الحجوزات
        </button>

        <button
          id="socialBtn"
          class="glass-button"
        >
          🌐 روابط التواصل
        </button>

        <button
          id="adminAccountBtn"
          class="glass-button"
        >
          🔐 حساب المدير
        </button>

      </div>

    </div>
  `;
}