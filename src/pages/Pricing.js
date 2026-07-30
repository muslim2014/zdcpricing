import { CategoryCard } from "../components/CategoryCard";
import { getCategories } from "../api/categoriesApi";

export async function Pricing() {

  const categories = await getCategories(true);

  return `
    <div class="container">

      <div class="top-bar">
        <button class="back-btn" type="button">
          ←
        </button>

        <h2>تسعير الخدمات</h2>
      </div>

      <div class="categories">
        ${categories.map(category => CategoryCard(category)).join("")}
      </div>

    </div>
  `;
}