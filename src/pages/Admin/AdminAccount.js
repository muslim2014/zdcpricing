import { getData } from "../../data/dataProvider";

export function AdminAccount() {

 const settings = getData().settings;

  return `

  <div class="container">

    <div class="top-bar">

      <button
        id="backToDashboard"
        class="back-btn"
      >
        ←
      </button>

      <h2>حساب المدير</h2>

    </div>

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

      <button
        id="saveAdminAccount"
        class="glass-button"
      >

        حفظ

      </button>

    </div>

  </div>

  `;
}