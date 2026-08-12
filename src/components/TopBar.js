import { BackButton } from "./BackButton";

function backTitle(content) {
  return content === "⎋" ? "تسجيل الخروج" : "العودة للرئيسية";
}

export function TopBar(
  title,
  backId = "backToDashboard",
  backContent = "←"
) {
  return `
    <div class="top-bar">

      ${BackButton({
        id: backId,
        title: backTitle(backContent),
        content: backContent
      })}

      <h2>${title}</h2>

    </div>
  `;
}