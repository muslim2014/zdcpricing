import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export function Admin() {
  return `
    <div class="container">

      ${TopBar("لوحة الإدارة", "adminBackBtn")}

      <div class="glass-card">

        ${GlassButton("⚙️ الإعدادات العامة", { id: "generalSettingsBtn" })}

        ${GlassButton("📂 إدارة الأقسام", { id: "categoriesBtn" })}

        ${GlassButton("🦷 إدارة الخدمات", { id: "servicesBtn" })}

        ${GlassButton("🖼 إدارة الصور", { id: "galleryBtn" })}

        ${GlassButton("🌐 روابط التواصل", { id: "socialBtn" })}

        ${GlassButton("🚪 تسجيل الخروج", { id: "logoutBtn" })}

      </div>

    </div>
  `;
}