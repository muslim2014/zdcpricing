import { ThemeToggle } from "../../components/ThemeToggle";
import { GlassButton } from "../../components/GlassButton";

export function AdminLogin() {
  return `
    <div class="background">
      <div class="blob blob1"></div>
      <div class="blob blob2"></div>
      <div class="blob blob3"></div>
    </div>

    ${ThemeToggle()}

    <div class="container">

      <div class="glass-card admin-login">

        <h2>تسجيل دخول المدير</h2>

        <div class="form-group">
          <input
            id="adminUsername"
            class="glass-input"
            type="text"
            placeholder="اسم المستخدم"
          >
        </div>

        <div class="form-group">
          <input
            id="adminPassword"
            class="glass-input"
            type="password"
            placeholder="كلمة المرور"
          >
        </div>

        ${GlassButton("دخول", { id: "adminLoginBtn" })}

        <p
          id="loginError"
          style="display:none;color:#ff8f8f;margin-top:15px"
        >
          اسم المستخدم أو كلمة المرور غير صحيحة
        </p>

      </div>

    </div>
  `;
}