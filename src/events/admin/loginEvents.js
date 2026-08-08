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

        router.renderAdminDashboard();

      } else {

        document.querySelector("#loginError").style.display = "block";

      }

    });

  document
    .querySelector("#logoutBtn")
    ?.addEventListener("click", async () => {

      await logout();

      router.renderAdminLogin();

    });

  document
    .querySelector("#backToSiteBtn")
    ?.addEventListener("click", () => {

      router.renderHome();

    });

}