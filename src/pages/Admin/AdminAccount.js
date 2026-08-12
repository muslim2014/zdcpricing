import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";
import { getCurrentUser } from "./auth";

export async function AdminAccount() {

 const user = await getCurrentUser();

 const email = user?.email || "";

 const username =
   user?.user_metadata?.username || email;

  return `

  <div class="container">

    ${TopBar("حساب المدير")}

    <div class="glass-card">

      <div class="form-group">

        <label>البريد الإلكتروني</label>

        <input
          class="glass-input"
          type="email"
          value="${email}"
          disabled
        >

      </div>

      <div class="form-group">

        <label>اسم المستخدم</label>

        <input
          id="adminUsername"
          class="glass-input"
          value="${username}"
        >

      </div>

      <div class="form-group">

        <label>كلمة المرور الحالية</label>

        <input
          id="currentPassword"
          class="glass-input"
          type="password"
          autocomplete="current-password"
        >

      </div>

      <div class="form-group">

        <label>كلمة المرور الجديدة</label>

        <input
          id="newPassword"
          class="glass-input"
          type="password"
          autocomplete="new-password"
        >

      </div>

      <div class="form-group">

        <label>تأكيد كلمة المرور</label>

        <input
          id="confirmPassword"
          class="glass-input"
          type="password"
          autocomplete="new-password"
        >

      </div>

      ${GlassButton("حفظ", { id: "saveAdminAccount" })}

    </div>

  </div>

  `;
}