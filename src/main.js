import "./style.css";

import { renderHome } from "./router";

import { testCategories } from "./api/categoriesApi";

import { seedCategories } from "./seed/seedCategories";
import { seedServices } from "./seed/seedServices";

async function init() {

  try {

    await seedCategories();

    await seedServices();

    await renderHome();

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