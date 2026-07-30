export function Admin() {
  return `
    <div class="container">

      <div class="top-bar">
        <button id="adminBackBtn" class="back-btn">
          ←
        </button>

        <h2>لوحة الإدارة</h2>
      </div>

      <div class="glass-card">

        <button id="generalSettingsBtn" class="glass-button">
          ⚙️ الإعدادات العامة
        </button>

        <button id="categoriesBtn" class="glass-button">
          📂 إدارة الأقسام
        </button>

        <button id="servicesBtn" class="glass-button">
          🦷 إدارة الخدمات
        </button>

        <button id="galleryBtn" class="glass-button">
          🖼 إدارة الصور
        </button>

        <button id="socialBtn" class="glass-button">
          🌐 روابط التواصل
        </button>

        <button id="logoutBtn" class="glass-button">
          🚪 تسجيل الخروج
        </button>

      </div>

    </div>
  `;
}