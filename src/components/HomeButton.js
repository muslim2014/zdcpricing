export function HomeButton({
  title = "العودة للرئيسية",
  content = "🏠"
} = {}) {
  return `
    <button
      id="homeBtn"
      class="back-btn home-btn"
      type="button"
      title="${title}"
      aria-label="${title}"
    >
      ${content}
    </button>
  `;
}