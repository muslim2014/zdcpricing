import "./style.css";

import { renderHome } from "./router";

import { testCategories } from "./api/categoriesApi";

import { seedCategories } from "./seed/seedCategories";
import { seedServices } from "./seed/seedServices";

async function init() {

  await seedCategories();

  await seedServices();

  await renderHome();

  testCategories();

}

init();