import { CategoryCard } from "../components/CategoryCard";
import { getCategories } from "../api/categoriesApi";
import { getSettings } from "../api/settingsApi";
import { ThemeToggle } from "../components/ThemeToggle";

export async function Pricing() {

  const [categories, settings] = await Promise.all([
    getCategories(true),
    getSettings()
  ]);

  const title =
    settings.categoriesPageTitle ||
    "أقسام العيادة";

  return `
    <div class="container">

      <div class="top-bar">
        <button class="back-btn" type="button">
          ←
        </button>

        <h2>${title}</h2>

        ${ThemeToggle()}
      </div>

      <div style="position:relative;margin-bottom:20px">

        <input
          id="pricingCategorySearch"
          class="glass-input"
          placeholder="ابحث عن قسم..."
          style="padding-left:40px"
        >

        <button
          id="clearPricingCategory"
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

      <div class="categories">
        ${categories.map(category => CategoryCard(category)).join("")}
      </div>

    </div>
  `;
}