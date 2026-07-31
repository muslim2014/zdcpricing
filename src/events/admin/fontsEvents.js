import {
  uploadFont,
  deleteFont,
  setCurrentFont
} from "../../api/fontsApi";

export function attachFontsEvents(router) {

  document
    .querySelector("#fontsBtn")
    ?.addEventListener(
      "click",
      router.renderFontsManager
    );

  document
    .querySelector("#backToDashboard")
    ?.addEventListener(
      "click",
      router.renderAdminDashboard
    );

  /* ==========================
     رفع خط
  ========================== */

  document
    .querySelector("#uploadFont")
    ?.addEventListener("click", async () => {

      const file =
        document.querySelector("#fontFile")
          ?.files?.[0];

      if (!file) {

        alert("اختر ملف الخط");

        return;

      }

      try {

        await uploadFont(file);

        alert("تم رفع الخط");

        router.renderFontsManager();

      }

      catch (error) {

        console.error(error);

        alert(error.message);

      }

    });

  /* ==========================
     استخدام الخط
  ========================== */

  document
    .querySelectorAll(".use-font")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        try {

          await setCurrentFont(
            Number(btn.dataset.id)
          );

          alert("تم تغيير الخط");

          router.renderHome();

        }

        catch (error) {

          console.error(error);

          alert(error.message);

        }

      });

    });

  /* ==========================
     حذف خط
  ========================== */

  document
    .querySelectorAll(".delete-font")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        if (!confirm("حذف الخط؟"))
          return;

        try {

          await deleteFont(
            Number(btn.dataset.id)
          );

          router.renderFontsManager();

        }

        catch (error) {

          console.error(error);

          alert(error.message);

        }

      });

    });

}