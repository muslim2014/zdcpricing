import { Gallery } from "./pages/Gallery";
import { Booking } from "./pages/Booking";
import { GalleryManager } from "./pages/Admin/GalleryManager";
import { GalleryEditor } from "./pages/Admin/GalleryEditor";
import { BookingsManager } from "./pages/Admin/BookingsManager";
import { SectionEditor } from "./pages/Admin/SectionEditor";
import { HomeSections } from "./pages/Admin/HomeSections";
import { DoctorProfile } from "./pages/Admin/DoctorProfile";
import { DoctorCertificates } from "./pages/Admin/DoctorCertificates";
import { CertificateEditor } from "./pages/Admin/CertificateEditor";
import { BookingEditor } from "./pages/Admin/BookingEditor";
import { About } from "./pages/About";
import { SocialLinksManager } from "./pages/Admin/SocialLinksManager";
import { getService } from "./api/servicesApi";
import { AdminAccount } from "./pages/Admin/AdminAccount";
import { Home } from "./pages/Home";
import { Pricing } from "./pages/Pricing";
import { Services } from "./pages/Services";
import { ServiceDetails } from "./pages/ServiceDetails";
import { TypographyManager } from "./pages/Admin/TypographyManager";
import { AdminLogin } from "./pages/Admin/Login";
import { AdminDashboard } from "./pages/Admin/Dashboard";
import { GeneralSettings } from "./pages/Admin/GeneralSettings";
import { CategoriesManager } from "./pages/Admin/CategoriesManager";
import { ServicesManager } from "./pages/Admin/ServicesManager";
import { CategoryServices } from "./pages/Admin/CategoryServices";
import { ServiceEditor } from "./pages/Admin/ServiceEditor";
import { HomeCardsManager } from "./pages/Admin/HomeCardsManager";
import { FontsManager } from "./pages/Admin/FontsManager";
import { getCategories } from "./api/categoriesApi";

import { attachPublicEvents } from "./events/publicEvents";
import { attachAdminEvents } from "./events/adminEvents";

const app = document.querySelector("#app");

let currentCategoryId = null;
let currentServiceId = null;
let currentCertificateId = null;
let currentGalleryId = null;
let currentBookingId = null;

export function getCurrentCategoryId() {
  return currentCategoryId;
}

export async function renderFontsManager() {

  app.innerHTML = await FontsManager();

  attachEvents();

}

export function getCurrentServiceId() {
  return currentServiceId;
}

export function getCurrentCertificateId() {
  return currentCertificateId;
}

export function getCurrentGalleryId() {
  return currentGalleryId;
}

export function getCurrentBookingId() {
  return currentBookingId;
}

/* ===========================
   Public
=========================== */

export async function renderHome() {

  app.innerHTML = await Home();

  attachEvents();

}

export async function renderAbout() {

  app.innerHTML = await About();

  attachEvents();

}

export async function renderGallery() {

  app.innerHTML = await Gallery();

  attachEvents();

}

export async function renderBooking() {

  app.innerHTML = await Booking();

  attachEvents();

}

export async function renderPricing() {

  app.innerHTML = await Pricing();

  attachEvents();

}

export async function renderServices(categoryId) {

  currentCategoryId = Number(categoryId);

  const categories = await getCategories();

  const category = categories.find(
    c => Number(c.id) === Number(categoryId)
  );

  if (!category) {

    app.innerHTML =
      "<h2 style='color:white;text-align:center'>القسم غير موجود</h2>";

    return;

  }

  app.innerHTML = await Services(category);

  attachEvents();

}

export async function renderServiceDetails(categoryId, serviceId) {

  currentCategoryId = Number(categoryId);
  currentServiceId = Number(serviceId);

  const service = await getService(serviceId);

  if (!service) {

    app.innerHTML =
      "<h2 style='color:white;text-align:center'>الخدمة غير موجودة</h2>";

    return;

  }

  app.innerHTML = await ServiceDetails(service);

  attachEvents();

}

/* ===========================
   Admin
=========================== */

export async function renderAdminLogin() {

  app.innerHTML = await AdminLogin();

  attachEvents();

}

export async function renderSocialLinksManager() {

  app.innerHTML =
    await SocialLinksManager();

  attachEvents();

}

export async function renderAdminDashboard() {

  app.innerHTML = await AdminDashboard();

  attachEvents();

}

export async function renderTypographyManager() {

  app.innerHTML = await TypographyManager();

  attachEvents();

}

export async function renderGeneralSettings() {

  app.innerHTML = await GeneralSettings();

  attachEvents();

}

export async function renderCategoriesManager() {

  app.innerHTML = await CategoriesManager();

  attachEvents();

}

export async function renderServicesManager() {

  app.innerHTML = await ServicesManager();

  attachEvents();

}

export async function renderCategoryServices(categoryId) {

  currentCategoryId = Number(categoryId);

  app.innerHTML = await CategoryServices(categoryId);

  attachEvents();

}

export async function renderServiceEditor(categoryId, serviceId) {

  currentCategoryId = Number(categoryId);
  currentServiceId = Number(serviceId);

  app.innerHTML = await ServiceEditor(
    categoryId,
    serviceId
  );

  attachEvents();

}

export async function renderAdminAccount() {

  app.innerHTML = await AdminAccount();

  attachEvents();

}

export async function renderHomeCardsManager() {

  app.innerHTML = await HomeCardsManager();

  attachEvents();

}

export async function renderHomeSections() {

  app.innerHTML = await HomeSections();

  attachEvents();

}

export async function renderSectionEditor(id) {

  app.innerHTML = await SectionEditor(id);

  attachEvents();

}

export async function renderDoctorProfile() {

  app.innerHTML = await DoctorProfile();

  attachEvents();

}

export async function renderDoctorCertificates() {

  app.innerHTML = await DoctorCertificates();

  attachEvents();

}

export async function renderCertificateEditor(id = null) {

  currentCertificateId = id;

  app.innerHTML = await CertificateEditor(id);

  attachEvents();

}

export async function renderGalleryManager() {

  app.innerHTML = await GalleryManager();

  attachEvents();

}

export async function renderGalleryEditor(id = null) {

  currentGalleryId = id;

  app.innerHTML = await GalleryEditor(id);

  attachEvents();

}

export async function renderBookingsManager() {

  app.innerHTML = await BookingsManager();

  attachEvents();

}

export async function renderBookingEditor(id) {

  currentBookingId = id;

  app.innerHTML = await BookingEditor(id);

  attachEvents();

}

/* ===========================
   Events
=========================== */

function attachEvents() {

  const router = {

    renderHome,
    renderAbout,
    renderGallery,
    renderBooking,
    renderPricing,
    renderServices,
    renderServiceDetails,

    renderAdminLogin,
    renderAdminDashboard,
    renderGeneralSettings,
    renderHomeSections,
    renderSectionEditor,
    renderFontsManager,
    renderDoctorProfile,
    renderDoctorCertificates,
    renderCertificateEditor,
    renderTypographyManager,
    renderGalleryManager,
    renderGalleryEditor,
    renderSocialLinksManager,
    renderBookingsManager,
    renderBookingEditor,
    renderAdminAccount,
    renderCategoriesManager,
    renderServicesManager,
    renderCategoryServices,
    renderServiceEditor,
    renderHomeCardsManager,

    getCurrentCategoryId,
    getCurrentServiceId,
    getCurrentCertificateId,
    getCurrentGalleryId,
    getCurrentBookingId,

  };

  attachPublicEvents(router);
  attachAdminEvents(router);

}