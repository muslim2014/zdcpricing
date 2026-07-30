import { settings } from "./settings";
import { categories } from "./categories";
import { loadData, saveData } from "./storage";

const defaultData = {
  settings,
  categories,
};

export function getData() {
  return loadData(defaultData);
}

export function setData(data) {
  saveData(data);
}

/* ===========================
   Settings
=========================== */

export function getSettings() {
  return getData().settings;
}

export function saveSettings(newSettings) {

  const data = getData();

  data.settings = {

    ...data.settings,

    ...newSettings

  };

  setData(data);

}

/* ===========================
   Categories
=========================== */

export function getCategories() {
  return getData().categories;
}

export function saveCategories(newCategories) {
  const data = getData();
  data.categories = newCategories;
  setData(data);
}

/* ===========================
   Services
=========================== */

export function getCategory(categoryId) {
  return getCategories().find(
    c => Number(c.id) === Number(categoryId)
  );
}

export function getService(categoryId, serviceId) {
  const category = getCategory(categoryId);

  if (!category) return null;

  return category.services.find(
    s => Number(s.id) === Number(serviceId)
  );
}

export function addService(categoryId, service) {
  const data = getData();

  const category = data.categories.find(
    c => Number(c.id) === Number(categoryId)
  );

  if (!category) return;

  category.services.push(service);

  setData(data);
}

export function updateService(categoryId, serviceId, updatedService) {
  const data = getData();

  const category = data.categories.find(
    c => Number(c.id) === Number(categoryId)
  );

  if (!category) return;

  const index = category.services.findIndex(
    s => Number(s.id) === Number(serviceId)
  );

  if (index === -1) return;

  category.services[index] = updatedService;

  setData(data);
}

export function deleteService(categoryId, serviceId) {
  const data = getData();

  const category = data.categories.find(
    c => Number(c.id) === Number(categoryId)
  );

  if (!category) return;

  category.services = category.services.filter(
    s => Number(s.id) !== Number(serviceId)
  );

  setData(data);
}