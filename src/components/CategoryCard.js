export function CategoryCard(category) {
  return `
    <div class="category-card" data-id="${category.id}">

      <div class="category-image">
        ${
          category.image
            ? `<img src="${category.image}" alt="${category.name}">`
            : `
              <div class="category-placeholder">
                🦷
              </div>
            `
        }
      </div>

      <div class="category-info">

        <h3>${category.name}</h3>

        <span class="category-link">عرض التفاصيل ←</span>

      </div>

    </div>
  `;
}
