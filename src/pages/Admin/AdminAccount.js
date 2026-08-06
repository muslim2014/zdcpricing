import { getData } from "../../data/dataProvider";
import { TopBar } from "../../components/TopBar";
import { GlassButton } from "../../components/GlassButton";

export function AdminAccount() {

 const settings = getData().settings;

  return `

  <div class="container">

    ${TopBar("حساب المدير")}

    <div class="glass-card">

      <div class="form-group">

        <label>اسم المستخدم</label>

        <input
          id="adminUsername"
          class="glass-input"
          value="${settings.admin.username}"
        >

      </div>

      <div class="form-group">

        <label>كلمة المرور الحالية</label>

        <input
          id="currentPassword"
          class="glass-input"
          type="password"
        >

      </div>

      <div class="form-group">

        <label>كلمة المرور الجديدة</label>

        <input
          id="newPassword"
          class="glass-input"
          type="password"
        >

      </div>

      <div class="form-group">

        <label>تأكيد كلمة المرور</label>

        <input
          id="confirmPassword"
          class="glass-input"
          type="password"
        >

      </div>

      ${GlassButton("حفظ", { id: "saveAdminAccount" })}

    </div>

  </div>

  `;
}