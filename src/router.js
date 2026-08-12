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
import { Search } from "./pages/Search";
import { HomeButton } from "./components/HomeButton";
import { TypographyManager } from "./pages/Admin/TypographyManager";
import { AdminLogin } from "./pages/Admin/Login";
import { AdminDashboard } from "./pages/Admin/Dashboard";
import { GeneralSettings } from "./pages/Admin/GeneralSettings";
import { CategoriesManager } from "./pages/Admin/CategoriesManager";
import { ServicesManager } from "./pages/Admin/ServicesManager";
import { CategoryServices } from "./pages/Admin/CategoryServices";
import { ServiceEditor } from "./pages/Admin/ServiceEditor";
import { BookingFieldsManager } from "./pages/Admin/BookingFieldsManager";
import { getCategories } from "./api/categoriesApi";

import { attachPublicEvents } from "./events/publicEvents";
import { attachAdminEvents } from "./events/adminEvents";
import { ThemeToggle } from "./components/ThemeToggle";
import { isLoggedIn } from "./pages/Admin/auth";

const app = document.querySelector("#app");

let currentCategoryId = null;
let currentServiceId = null;
let currentCertificateId = null;
let currentGalleryId = null;
let currentBookingId = null;

let restoring = false;

/* عاكس للـ History الخاص بالتطبيق: يسمح لأزرار الرجوع بالتفرّع
   هرميًا (Service → Services → Pricing → Home) دون push زائد */
let appStack = [];

export function getCurrentCategoryId() {
  return currentCategoryId;
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
   History / URL helpers
========================== */

function normalizePath(path) {

  path = path || "/";

  return path.replace(/\/+$/, "") || "/";

}

function currentPath() {

  return normalizePath(
    window.location.pathname
  );

}

/* يسجّل الـ Route في الـ Browser History دون إعادة تحميل
   - pushState للمسارات الجديدة
   - replaceState للانتقال بين Service → Service (نفس صفحة التفاصيل بالداخل) */
function isServiceDetailsPath(path) {

  const parts =
    (path || "").split("/").filter(Boolean);

  return (
    parts.length === 4 &&
    parts[0] === "services" &&
    parts[2] === "service"
  );

}

function pushPath(path, replace = false) {

  if (restoring) return;

  const target = normalizePath(path);

  if (currentPath() === target) return;

  const replacingSibling =
    !replace &&
    isServiceDetailsPath(currentPath()) &&
    isServiceDetailsPath(target);

  if (replace || replacingSibling) {

    window.history.replaceState(
      null,
      "",
      target
    );

    if (appStack.length) {

      appStack[appStack.length - 1] = target;

    }

  } else {

    window.history.pushState(
      null,
      "",
      target
    );

    appStack.push(target);

  }

}

/* رجوع هرمي آمن:
   - إذا كان هناك سجل داخلي سابق → history.back() دون إنشاء entries جديدة
   - وإلا (deep-link / أول صفحة) → fallback */
export function navigateBack(fallback) {

  if (appStack.length > 1) {

    window.history.back();

    return;

  }

  if (typeof fallback === "function") fallback();

}

/* ===========================
   Public
========================== */

export async function renderHome() {

  pushPath("/");

  app.innerHTML = await Home();

  attachEvents();

}

export async function renderAbout() {

  pushPath("/about");

  app.innerHTML = await About();

  attachEvents();

}

export async function renderGallery() {

  pushPath("/gallery");

  app.innerHTML = await Gallery();

  attachEvents();

}

export async function renderBooking() {

  pushPath("/booking");

  app.innerHTML = await Booking();

  attachEvents();

}

export async function renderPricing() {

  pushPath("/pricing");

  app.innerHTML = await Pricing();

  attachEvents();

}

export async function renderSearch() {

  pushPath("/search");

  app.innerHTML = await Search();

  attachEvents();

}

export async function renderServices(categoryId) {

  currentCategoryId = Number(categoryId);

  pushPath(`/services/${categoryId}`);

  const categories = await getCategories();

  const category = categories.find(
    c => Number(c.id) === Number(categoryId)
  );

  if (!category) {

    app.innerHTML =
      "<h2 style='color:var(--text);text-align:center'>القسم غير موجود</h2>";

    return;

  }

  app.innerHTML = await Services(category);

  attachEvents();

}

export async function renderServiceDetails(categoryId, serviceId) {

  currentCategoryId = Number(categoryId);
  currentServiceId = Number(serviceId);

  pushPath(
    `/services/${categoryId}/service/${serviceId}`
  );

  const service = await getService(serviceId);

  if (!service) {

    app.innerHTML =
      "<h2 style='color:var(--text);text-align:center'>الخدمة غير موجودة</h2>";

    return;

  }

  app.innerHTML = await ServiceDetails(service);

  attachEvents();

}

/* ===========================
   Admin
========================== */

export async function renderAdminLogin() {

  pushPath("/admin/login");

  app.innerHTML = await AdminLogin();

  attachEvents();

}

/* يحمي كل صفحات الإدارة: يجب أن يكون المدير مسجلاً دخولًا */
async function ensureAdmin() {

  if (await isLoggedIn()) return true;

  window.history.replaceState(
    null,
    "",
    normalizePath("/admin/login")
  );

  await renderAdminLogin();

  return false;

}

export async function renderSocialLinksManager() {

  if (!(await ensureAdmin())) return;

  pushPath("/admin/social");

  app.innerHTML =
    await SocialLinksManager();

  attachEvents();

}

export async function renderAdminDashboard() {

  if (!(await ensureAdmin())) return;

  pushPath("/admin/dashboard");

  app.innerHTML = await AdminDashboard();

  attachEvents();

}

export async function renderTypographyManager() {

  if (!(await ensureAdmin())) return;

  pushPath("/admin/typography");

  app.innerHTML = await TypographyManager();

  attachEvents();

}

export async function renderGeneralSettings() {

  if (!(await ensureAdmin())) return;

  pushPath("/admin/settings");

  app.innerHTML = await GeneralSettings();

  attachEvents();

}

export async function renderCategoriesManager() {

  if (!(await ensureAdmin())) return;

  pushPath("/admin/categories");

  app.innerHTML = await CategoriesManager();

  attachEvents();

}

export async function renderServicesManager() {

  if (!(await ensureAdmin())) return;

  pushPath("/admin/services");

  app.innerHTML = await ServicesManager();

  attachEvents();

}

export async function renderCategoryServices(categoryId) {

  if (!(await ensureAdmin())) return;

  currentCategoryId = Number(categoryId);

  pushPath(`/admin/categories/${categoryId}`);

  app.innerHTML = await CategoryServices(categoryId);

  attachEvents();

}

export async function renderServiceEditor(categoryId, serviceId) {

  if (!(await ensureAdmin())) return;

  currentCategoryId = Number(categoryId);
  currentServiceId = Number(serviceId);

  pushPath(
    `/admin/services/${categoryId}/${serviceId}`
  );

  app.innerHTML = await ServiceEditor(
    categoryId,
    serviceId
  );

  attachEvents();

}

export async function renderAdminAccount() {

  if (!(await ensureAdmin())) return;

  pushPath("/admin/account");

  app.innerHTML = await AdminAccount();

  attachEvents();

}

export async function renderBookingFieldsManager() {

  if (!(await ensureAdmin())) return;

  pushPath("/admin/booking-fields");

  app.innerHTML = await BookingFieldsManager();

  attachEvents();

}

export async function renderHomeSections() {

  if (!(await ensureAdmin())) return;

  pushPath("/admin/home-sections");

  app.innerHTML = await HomeSections();

  attachEvents();

}

export async function renderSectionEditor(id) {

  if (!(await ensureAdmin())) return;

  pushPath(`/admin/home-sections/${id}`);

  app.innerHTML = await SectionEditor(id);

  attachEvents();

}

export async function renderDoctorProfile() {

  if (!(await ensureAdmin())) return;

  pushPath("/admin/doctor");

  app.innerHTML = await DoctorProfile();

  attachEvents();

}

export async function renderDoctorCertificates() {

  if (!(await ensureAdmin())) return;

  pushPath("/admin/doctor/certificates");

  app.innerHTML = await DoctorCertificates();

  attachEvents();

}

export async function renderCertificateEditor(id = null) {

  if (!(await ensureAdmin())) return;

  currentCertificateId = id;

  pushPath(
    id
      ? `/admin/doctor/certificates/${id}`
      : "/admin/doctor/certificates/new"
  );

  app.innerHTML = await CertificateEditor(id);

  attachEvents();

}

export async function renderGalleryManager() {

  if (!(await ensureAdmin())) return;

  pushPath("/admin/gallery");

  app.innerHTML = await GalleryManager();

  attachEvents();

}

export async function renderGalleryEditor(id = null) {

  if (!(await ensureAdmin())) return;

  currentGalleryId = id;

  pushPath(
    id
      ? `/admin/gallery/${id}`
      : "/admin/gallery/new"
  );

  app.innerHTML = await GalleryEditor(id);

  attachEvents();

}

export async function renderBookingsManager() {

  if (!(await ensureAdmin())) return;

  pushPath("/admin/bookings");

  app.innerHTML = await BookingsManager();

  attachEvents();

}

export async function renderBookingEditor(id) {

  if (!(await ensureAdmin())) return;

  currentBookingId = id;

  pushPath(`/admin/bookings/${id}`);

  app.innerHTML = await BookingEditor(id);

  attachEvents();

}

/* ===========================
   Browser History (Back / Forward)
========================== */

/* إعادة عرض الـ Route الحالي حسب عنوان الـ URL */
async function resolveCurrentRoute() {

  const path = normalizePath(
    window.location.pathname
  );

  const parts =
    path.split("/").filter(Boolean);

  /* الصفحة الرئيسية */
  if (parts.length === 0) {

    await renderHome();

    return;

  }

  /* الصفحات العامة */
  if (path === "/about") {

    await renderAbout();

    return;

  }

  if (path === "/gallery") {

    await renderGallery();

    return;

  }

  if (path === "/booking") {

    await renderBooking();

    return;

  }

  if (path === "/pricing") {

    await renderPricing();

    return;

  }

  if (path === "/search") {

    await renderSearch();

    return;

  }

  if (parts[0] === "services") {

    if (
      parts.length === 4 &&
      parts[2] === "service" &&
      Number.isFinite(Number(parts[1])) &&
      Number.isFinite(Number(parts[3]))
    ) {

      await renderServiceDetails(
        Number(parts[1]),
        Number(parts[3])
      );

      return;

    }

    if (
      parts.length === 2 &&
      Number.isFinite(Number(parts[1]))
    ) {

      await renderServices(Number(parts[1]));

      return;

    }

  }

  /* صفحات الإدارة */
  if (parts[0] === "admin") {

    if (parts[1] === "login") {

      await renderAdminLogin();

      return;

    }

    if (parts[1] === "social") {

      await renderSocialLinksManager();

      return;

    }

    if (parts[1] === "dashboard") {

      await renderAdminDashboard();

      return;

    }

    if (parts[1] === "typography") {

      await renderTypographyManager();

      return;

    }

    if (parts[1] === "settings") {

      await renderGeneralSettings();

      return;

    }

    if (parts[1] === "account") {

      await renderAdminAccount();

      return;

    }

    if (parts[1] === "booking-fields") {

      await renderBookingFieldsManager();

      return;

    }

    if (parts[1] === "home-sections") {

      if (
        parts.length === 3 &&
        Number.isFinite(Number(parts[2]))
      ) {

        await renderSectionEditor(Number(parts[2]));

        return;

      }

      await renderHomeSections();

      return;

    }

    if (parts[1] === "doctor") {

      if (
        parts.length >= 3 &&
        parts[2] === "certificates"
      ) {

        if (
          parts.length >= 4 &&
          isSafeOrNew(parts[3])
        ) {

          await renderCertificateEditor(
            parts[3] === "new"
              ? null
              : Number(parts[3])
          );

          return;

        }

        await renderDoctorCertificates();

        return;

      }

      await renderDoctorProfile();

      return;

    }

    if (parts[1] === "gallery") {

      if (
        parts.length === 3 &&
        isSafeOrNew(parts[2])
      ) {

        await renderGalleryEditor(
          parts[2] === "new"
            ? null
            : Number(parts[2])
        );

        return;

      }

      await renderGalleryManager();

      return;

    }

    if (parts[1] === "bookings") {

      if (
        parts.length === 3 &&
        Number.isFinite(Number(parts[2]))
      ) {

        await renderBookingEditor(Number(parts[2]));

        return;

      }

      await renderBookingsManager();

      return;

    }

    if (parts[1] === "categories") {

      if (
        parts.length === 3 &&
        Number.isFinite(Number(parts[2]))
      ) {

        await renderCategoryServices(
          Number(parts[2])
        );

        return;

      }

      await renderCategoriesManager();

      return;

    }

    if (parts[1] === "services") {

      if (
        parts.length === 4 &&
        Number.isFinite(Number(parts[2])) &&
        Number.isFinite(Number(parts[3]))
      ) {

        await renderServiceEditor(
          Number(parts[2]),
          Number(parts[3])
        );

        return;

      }

      await renderServicesManager();

      return;

    }

  }

  /* أي Route غير معروف → الصفحة الرئيسية */
  await renderHome();

}

function isSafeOrNew(value) {
  return value === "new" || Number.isFinite(Number(value));
}

/* معالجة Back / Forward من المتصفح دون إضافة History جديدة */
async function onPopState() {

  restoring = true;

  try {

    await resolveCurrentRoute();

  } finally {

    restoring = false;

    /* مزامنة appStack مع الموضع الفعلي للسجل بعد أي Back/Forward */
    const path = currentPath();

    const idx = appStack.lastIndexOf(path);

    if (idx === -1) {

      /* مسار غير معروف (deep-link أو صفحة قبل التطبيق) */
      appStack.push(path);

    } else {

      appStack.length = idx + 1;

    }

  }

}

/* تهيئة الـ Router: يفتح الـ Route الحالية من الـ URL */
export function initRouter() {

  if (typeof window !== "undefined") {

    window.addEventListener(
      "popstate",
      onPopState
    );

    resolveCurrentRoute();

    /* في أول تحميل: يعتبر المسار الحالي جذر المكدّس */
    if (!appStack.length) {

      appStack.push(currentPath());

    }

  }

}

/* ===========================
   Events
========================== */

function attachEvents() {

  ensureThemeToggle();

  ensureBackground();

  const router = {

    renderHome,
    renderAbout,
    renderGallery,
    renderBooking,
    renderPricing,
    renderSearch,
    renderServices,
    renderServiceDetails,

    navigateBack,

    renderAdminLogin,
    renderAdminDashboard,
    renderGeneralSettings,
    renderHomeSections,
    renderSectionEditor,
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
    renderBookingFieldsManager,

    getCurrentCategoryId,
    getCurrentServiceId,
    getCurrentCertificateId,
    getCurrentGalleryId,
    getCurrentBookingId,

  };

  attachPublicEvents(router);
  attachAdminEvents(router);

  ensureHomeNav(router);

}

/* يضيف زر الرئيسية (🏠) أسفل زر الرجوع في الصفحات العامة الداخلية
   دون إظهاره في الصفحة الرئيسية أو صفحات الإدارة */
function ensureHomeNav(router) {

  if (document.querySelector("#homeBtn")) return;

  const path = currentPath();

  if (path === "/") return;

  if (path.startsWith("/admin")) return;

  const backBtn = document.querySelector(".back-btn");

  if (!backBtn) return;

  backBtn.insertAdjacentHTML(
    "afterend",
    HomeButton()
  );

  document
    .querySelector("#homeBtn")
    ?.addEventListener(
      "click",
      router.renderHome
    );

}

function ensureThemeToggle() {

  if (document.querySelector("#themeToggle")) return;

  const topBar = document.querySelector(".top-bar");

  if (!topBar) return;

  topBar.insertAdjacentHTML(
    "beforeend",
    ThemeToggle()
  );

}

function ensureBackground() {

  if (document.querySelector(".background")) return;

  const app = document.querySelector("#app");

  if (!app) return;

  app.insertAdjacentHTML(
    "afterbegin",
    `
      <div class="background">
        <div class="blob blob1"></div>
        <div class="blob blob2"></div>
        <div class="blob blob3"></div>
      </div>
    `
  );

}