import "./style.css";

import { initRouter } from "./router";

import { testCategories } from "./api/categoriesApi";

function applyTheme() {

  const theme =
    localStorage.getItem("theme") || "light";

  document.documentElement
    .setAttribute("data-theme", theme);

}

applyTheme();

async function init() {

  try {

    initRouter();

    testCategories();

  }

  catch (error) {

    console.error(error);

    console.log(error.message);
    console.log(error.details);
    console.log(error.hint);
    console.log(error.code);

  }

}

init();