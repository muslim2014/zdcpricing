export function BackButton({
  id = "",
  title = "العودة",
  content = "←"
} = {}) {
  const idAttr = id ? ` id="${id}"` : "";

  return `
    <button
      ${idAttr}
      class="back-btn"
      type="button"
      title="${title}"
      aria-label="${title}"
    >
      ${content}
    </button>
  `;
}