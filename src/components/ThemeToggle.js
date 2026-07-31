export function ThemeToggle() {

  const savedTheme =
    localStorage.getItem("theme") || "light";

  const themeIcon = savedTheme === "dark"
    ? "fa-sun"
    : "fa-moon";

  return `
    <button
      id="themeToggle"
      class="theme-btn"
      title="تبديل الوضع الليلي"
    >
      <i class="fa-solid ${themeIcon}"></i>
    </button>
  `;

}
