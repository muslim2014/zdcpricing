import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export function AdminDashboard() {
  return `
    <div class="background">
      <div class="blob blob1"></div>
      <div class="blob blob2"></div>
      <div class="blob blob3"></div>
    </div>

    <div class="container">

      ${TopBar("لوحة الإدارة", "logoutBtn", "⎋")}

      <div class="glass-card dashboard-grid">

        ${GlassButton("🏠 إدارة الصفحة الرئيسية", { id: "homeSectionsBtn" })}

        ${GlassButton("📂 إدارة الأقسام", { id: "categoriesBtn" })}

        ${GlassButton("🦷 إدارة الخدمات", { id: "servicesBtn" })}

        ${GlassButton("👨‍⚕️ إدارة عن الطبيب", { id: "doctorProfileBtn" })}

        ${GlassButton("🖼 إدارة معرض الصور", { id: "galleryBtn" })}

        ${GlassButton("📋 إدارة حجز المواعيد", { id: "bookingFieldsBtn" })}

        ${GlassButton("📅 إدارة الحجوزات", { id: "bookingsBtn" })}

        ${GlassButton("🌐 روابط التواصل", { id: "socialBtn" })}

        ${GlassButton("🔤 أحجام النصوص", { id: "typographyBtn" })}

        ${GlassButton("🔐 حساب المدير", { id: "adminAccountBtn" })}

      </div>

    </div>
  `;
}