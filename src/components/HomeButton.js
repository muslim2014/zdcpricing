export function HomeButton({
  title = "العودة للرئيسية",
  content = '<i class="fa-solid fa-house" aria-hidden="true"></i>'
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