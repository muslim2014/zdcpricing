import {
  login,
  logout
} from "../../pages/Admin/auth";

export function attachLoginEvents(router) {

  document
    .querySelector("#adminLoginBtn")
    ?.addEventListener("click", async () => {

      const username =
        document.querySelector("#adminUsername").value.trim();

      const password =
        document.querySelector("#adminPassword").value;

      if (await login(username, password)) {

        router.renderAdminDashboard();

      } else {

        document.querySelector("#loginError").style.display = "block";

      }

    });

  document
    .querySelector("#logoutBtn")
    ?.addEventListener("click", () => {

      logout();

      router.renderHome();

    });

}