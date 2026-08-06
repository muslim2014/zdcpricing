export function TopBar(
  title,
  backId = "backToDashboard",
  backContent = "←"
) {
  return `
    <div class="top-bar">

      <button
        id="${backId}"
        class="back-btn"
      >
        ${backContent}
      </button>

      <h2>${title}</h2>

    </div>
  `;
}
