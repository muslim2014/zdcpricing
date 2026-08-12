import { ThemeToggle } from "../components/ThemeToggle";

export function Search() {
  return `
    <div class="container search-page">

      <div class="top-bar">

        <button
          class="back-btn"
          type="button"
          title="العودة للرئيسية"
        >
          ←
        </button>

        <h2>البحث في الخدمات</h2>

        ${ThemeToggle()}

        <button
          id="closeSearchBtn"
          class="admin-btn"
          type="button"
          title="إغلاق البحث والعودة للرئيسية"
          style="top:70px;right:18px;left:auto"
        >
          ✕
        </button>

      </div>

      <div style="position:relative;margin-bottom:20px">

        <input
          id="globalSearchInput"
          class="glass-input"
          placeholder="ابحث في جميع الخدمات..."
          style="padding-left:40px"
        >

        <button
          id="clearGlobalSearchBtn"
          type="button"
          style="
            position:absolute;
            top:50%;
            left:12px;
            transform:translateY(-50%);
            width:26px;
            height:26px;
            border-radius:50%;
            border:none;
            background:var(--border-hover);
            color:var(--text);
            cursor:pointer;
            font-size:14px;
            line-height:1;
            display:none;
            align-items:center;
            justify-content:center;
          "
        >
          ✕
        </button>

      </div>

      <div
        id="globalSearchResults"
        class="glass-card"
        style="display:none;margin-bottom:20px;padding:8px"
      ></div>

      <div
        id="noGlobalResults"
        style="display:none"
      >
        <div class="glass-card">
          <p style="text-align:center;opacity:.8">
            عذرًا، لم نجد خدمة مطابقة لبحثك.
          </p>
        </div>
      </div>

    </div>
  `;
}