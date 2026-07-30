export function CategoryCard(category) {
  return `
    <div class="category-card" data-id="${category.id}">
      
      <div class="category-image">
        ${
          category.image
            ? `<img src="${category.image}" alt="${category.name}">`
            : "🦷"
        }
      </div>

      <h3>${category.name}</h3>

    </div>
  `;
}