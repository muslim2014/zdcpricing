export function showAlert(message) {
  alert(message);
}

export function showConfirm(message) {
  return confirm(message);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================
   نافذة تأكيد منبثقة متوافقة مع نمط Glassmorphism
   - تُرجع Promise<boolean>
   - Escape / النقر خارج النافذة / زر الإلغاء → false
   - زر تأكيد الحذف → true
   - تُلحق بالـ body وتُحذف بعد الإغلاق
========================= */

export function showConfirmModal(message) {

  return new Promise((resolve) => {

    const overlay = document.createElement("div");

    overlay.className = "confirm-overlay hidden";

    overlay.innerHTML = `

      <div class="glass-card confirm-box">

        <p class="confirm-text">
          ${escapeHtml(message)}
        </p>

        <div class="confirm-actions">

          <button
            id="confirmCancelBtn"
            class="glass-button confirm-cancel"
            type="button"
          >
            إلغاء
          </button>

          <button
            id="confirmOkBtn"
            class="glass-button confirm-ok"
            type="button"
          >
            تأكيد الحذف
          </button>

        </div>

      </div>

    `;

    document.body.appendChild(overlay);

    /* تأخير بسيط لتشغيل انتقال الظهور */
    requestAnimationFrame(() => {
      overlay.classList.remove("hidden");
    });

    let settled = false;

    function close(result) {

      if (settled) return;

      settled = true;

      overlay.classList.add("hidden");

      document.removeEventListener(
        "keydown",
        onKeyDown
      );

      setTimeout(() => {
        overlay.remove();
      }, 250);

      resolve(result);

    }

    function onKeyDown(e) {

      if (e.key === "Escape") close(false);

    }

    overlay.querySelector("#confirmCancelBtn")
      .addEventListener("click", () => close(false));

    overlay.querySelector("#confirmOkBtn")
      .addEventListener("click", () => close(true));

    overlay.addEventListener("click", (e) => {

      if (e.target === overlay) close(false);

    });

    document.addEventListener("keydown", onKeyDown);

  });

}