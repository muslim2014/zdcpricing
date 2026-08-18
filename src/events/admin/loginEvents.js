import {
  login,
  logout
} from "../../pages/Admin/auth";

export function attachLoginEvents(router) {

  document
    .querySelector("#adminLoginBtn")
    ?.addEventListener("click", async () => {

      const email =
        document.querySelector("#adminEmail").value.trim();

      const password =
        document.querySelector("#adminPassword").value;

      if (await login(email, password)) {

        router.renderAdminDashboardReplace();

      } else {

        document.querySelector("#loginError").style.display = "block";

      }

    });

  document
    .querySelector("#logoutBtn")
    ?.addEventListener("click", async () => {

      await logout();

      router.renderAdminLoginReplace();

    });

  document
    .querySelector("#backToSiteBtn")
    ?.addEventListener("click", () => {

      router.renderHomeReplace();

    });

}