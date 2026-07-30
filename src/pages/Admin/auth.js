import { getData } from "../../data/dataProvider";

const SESSION_KEY = "clinic_admin_session";

export function login(username, password) {

  const admin = getData().settings.admin;

  if (
    username === admin.username &&
    password === admin.password
  ) {

    localStorage.setItem(SESSION_KEY, "true");

    return true;

  }

  return false;

}

export function logout() {

  localStorage.removeItem(SESSION_KEY);

}

export function isLoggedIn() {

  return localStorage.getItem(SESSION_KEY) === "true";

}