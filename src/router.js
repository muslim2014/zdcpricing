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
import { EquipmentManager } from "./pages/Admin/EquipmentManager";
import { EquipmentSectionEditor } from "./pages/Admin/EquipmentSectionEditor";
import { EquipmentCardEditor } from "./pages/Admin/EquipmentCardEditor";
import { Equipment } from "./pages/Equipment";
import { EquipmentDetails } from "./pages/EquipmentDetails";
import { getCategories } from "./api/categoriesApi";
import {
  getEquipmentSection,
  getEquipmentItem
} from "./api/equipmentApi";

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
let currentEquipmentSectionId = null;
let currentEquipmentCardId = null;

let restoring = false;

/* عاكس للـ History الخاص بالتطبيق: يسمح لأزرار الرجوع بالتفرّع
   هرميًا (Service → Services → Pricing → Home) دون push زائد */
let appStack = [];

/* ===========================
   Guard ضد الكتابة من render قديم (stale render):
   - renderSeq: جيل التنقل، يزداد عند بداية أي تنقل (pushPath / renderReplace / popstate)
   - أي render يكتمل بعد أن بدأ تنقل أحدث يُتجاهل ولن يكتب في #app
========================== */

let renderSeq = 0;

function isStaleRender(token) {
  return token !== renderSeq;
}

function setPage(token, html) {
  if (isStaleRender(token)) return false;
  app.innerHTML = html;
  return true;
}

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

export function getCurrentEquipmentSectionId() {
  return currentEquipmentSectionId;
}

export function getCurrentEquipmentCardId() {
  return currentEquipmentCardId;
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

  renderSeq++;

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
   عرض صفحة باستبدال إدخال الـ history الحالي
   (بدل إضافة إدخال جديد) — لمنع تراكم صفحات
   Admin/Login في الـ history أثناء الدخول/الخروج
   دون تغيير pushPath/onPopState.
========================== */

async function renderReplace(path, pageFn, needsAdmin = true) {

  const startedAt = renderSeq;

  if (needsAdmin && !(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  renderSeq++;

  const target = normalizePath(path);

  if (currentPath() !== target) {

    window.history.replaceState(null, "", target);

  }

  if (appStack.length) {

    appStack[appStack.length - 1] = target;

  } else {

    appStack.push(target);

  }

  /* إفراغ المحتوى الحالي قبل انتظار الصفحة الجديدة حتى لا يبقى
     محتوى الصفحة السابقة ظاهرًا أثناء التحميل (منع الـFlash) */
  const renderToken = renderSeq;

  app.innerHTML = "";

  if (!setPage(renderToken, await pageFn())) return;

  attachEvents();

}

export async function renderAdminDashboardReplace() {
  return renderReplace("/admin/dashboard", AdminDashboard);
}

export async function renderAdminLoginReplace() {
  return renderReplace("/admin/login", AdminLogin, false);
}

export async function renderHomeReplace() {
  return renderReplace("/", Home, false);
}

/* ===========================
   Public
========================== */

export async function renderHome() {

  pushPath("/");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await Home())) return;

  attachEvents();

}

export async function renderAbout() {

  pushPath("/about");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await About())) return;

  attachEvents();

}

export async function renderGallery() {

  pushPath("/gallery");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await Gallery())) return;

  attachEvents();

}

export async function renderBooking() {

  pushPath("/booking");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await Booking())) return;

  attachEvents();

}

export async function renderPricing() {

  pushPath("/pricing");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await Pricing())) return;

  attachEvents();

}

export async function renderSearch() {

  pushPath("/search");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await Search())) return;

  attachEvents();

}

export async function renderServices(categoryId) {

  currentCategoryId = Number(categoryId);

  pushPath(`/services/${categoryId}`);

  const renderToken = renderSeq;

  const categories = await getCategories();

  const category = categories.find(
    c => Number(c.id) === Number(categoryId)
  );

  if (!category) {

    setPage(renderToken,
      "<h2 style='color:var(--text);text-align:center'>القسم غير موجود</h2>");

    return;

  }

  if (!setPage(renderToken, await Services(category))) return;

  attachEvents();

}

export async function renderServiceDetails(categoryId, serviceId) {

  currentCategoryId = Number(categoryId);
  currentServiceId = Number(serviceId);

  pushPath(
    `/services/${categoryId}/service/${serviceId}`
  );

  const renderToken = renderSeq;

  const service = await getService(serviceId);

  if (!service) {

    setPage(renderToken,
      "<h2 style='color:var(--text);text-align:center'>الخدمة غير موجودة</h2>");

    return;

  }

  if (!setPage(renderToken, await ServiceDetails(service))) return;

  attachEvents();

}

export async function renderEquipment() {

  pushPath("/equipment");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await Equipment())) return;

  attachEvents();

}

export async function renderEquipmentDetails(sectionId, cardId) {

  currentEquipmentSectionId = Number(sectionId);
  currentEquipmentCardId = Number(cardId);

  pushPath(
    `/equipment/${sectionId}/card/${cardId}`
  );

  const renderToken = renderSeq;

  const [section, item] = await Promise.all([
    getEquipmentSection(sectionId),
    getEquipmentItem(cardId)
  ]);

  if (
    !section ||
    !section.visible ||
    !item ||
    item.visible === false ||
    Number(item.section_id) !== Number(sectionId)
  ) {

    setPage(renderToken,
      "<h2 style='color:var(--text);text-align:center'>الجهاز غير موجود</h2>");

    return;

  }

  if (!setPage(renderToken, await EquipmentDetails(section, item))) return;

  attachEvents();

}

/* ===========================
   Admin
========================== */

export async function renderAdminLogin() {

  pushPath("/admin/login");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await AdminLogin())) return;

  attachEvents();

}

/* يحمي كل صفحات الإدارة: يجب أن يكون المدير مسجلاً دخولًا */
async function ensureAdmin() {

  const startedAt = renderSeq;

  if (await isLoggedIn()) return true;

  /* انتقل المستخدم إلى مكان آخر أثناء فحص الجلسة → لا تُجبِر تسجيل دخول الآن */
  if (isStaleRender(startedAt)) return false;

  window.history.replaceState(
    null,
    "",
    normalizePath("/admin/login")
  );

  await renderAdminLogin();

  return false;

}

export async function renderSocialLinksManager() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/social");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await SocialLinksManager())) return;

  attachEvents();

}

export async function renderAdminDashboard() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/dashboard");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await AdminDashboard())) return;

  attachEvents();

}

export async function renderTypographyManager() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/typography");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await TypographyManager())) return;

  attachEvents();

}

export async function renderGeneralSettings() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/settings");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await GeneralSettings())) return;

  attachEvents();

}

export async function renderCategoriesManager() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/categories");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await CategoriesManager())) return;

  attachEvents();

}

export async function renderServicesManager() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/services");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await ServicesManager())) return;

  attachEvents();

}

export async function renderCategoryServices(categoryId) {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  currentCategoryId = Number(categoryId);

  pushPath(`/admin/categories/${categoryId}`);

  const renderToken = renderSeq;

  if (!setPage(renderToken, await CategoryServices(categoryId))) return;

  attachEvents();

}

export async function renderServiceEditor(categoryId, serviceId) {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  currentCategoryId = Number(categoryId);
  currentServiceId = Number(serviceId);

  pushPath(
    `/admin/services/${categoryId}/${serviceId}`
  );

  const renderToken = renderSeq;

  if (!setPage(renderToken, await ServiceEditor(
    categoryId,
    serviceId
  ))) return;

  attachEvents();

}

export async function renderAdminAccount() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/account");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await AdminAccount())) return;

  attachEvents();

}

export async function renderBookingFieldsManager() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/booking-fields");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await BookingFieldsManager())) return;

  attachEvents();

}

export async function renderEquipmentManager() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/equipment");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await EquipmentManager())) return;

  attachEvents();

}

export async function renderEquipmentSectionEditor(id = null) {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath(
    id
      ? `/admin/equipment/${id}`
      : "/admin/equipment/new"
  );

  const renderToken = renderSeq;

  if (!setPage(renderToken, await EquipmentSectionEditor(id))) return;

  attachEvents();

}

export async function renderEquipmentCardEditor(sectionId, cardId = null) {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  currentEquipmentSectionId = Number(sectionId);
  currentEquipmentCardId = cardId;

  pushPath(
    cardId
      ? `/admin/equipment/${currentEquipmentSectionId}/cards/${cardId}`
      : `/admin/equipment/${currentEquipmentSectionId}/cards/new`
  );

  const renderToken = renderSeq;

  if (!setPage(renderToken, await EquipmentCardEditor(
    currentEquipmentSectionId,
    cardId
  ))) return;

  attachEvents();

}

export async function renderHomeSections() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/home-sections");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await HomeSections())) return;

  attachEvents();

}

export async function renderSectionEditor(id = null) {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath(
    id
      ? `/admin/home-sections/${id}`
      : "/admin/home-sections/new"
  );

  const renderToken = renderSeq;

  if (!setPage(renderToken, await SectionEditor(id))) return;

  attachEvents();

}

export async function renderDoctorProfile() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/doctor");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await DoctorProfile())) return;

  attachEvents();

}

export async function renderDoctorCertificates() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/doctor/certificates");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await DoctorCertificates())) return;

  attachEvents();

}

export async function renderCertificateEditor(id = null) {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  currentCertificateId = id;

  pushPath(
    id
      ? `/admin/doctor/certificates/${id}`
      : "/admin/doctor/certificates/new"
  );

  const renderToken = renderSeq;

  if (!setPage(renderToken, await CertificateEditor(id))) return;

  attachEvents();

}

export async function renderGalleryManager() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/gallery");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await GalleryManager())) return;

  attachEvents();

}

export async function renderGalleryEditor(id = null) {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  currentGalleryId = id;

  pushPath(
    id
      ? `/admin/gallery/${id}`
      : "/admin/gallery/new"
  );

  const renderToken = renderSeq;

  if (!setPage(renderToken, await GalleryEditor(id))) return;

  attachEvents();

}

export async function renderBookingsManager() {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  pushPath("/admin/bookings");

  const renderToken = renderSeq;

  if (!setPage(renderToken, await BookingsManager())) return;

  attachEvents();

}

export async function renderBookingEditor(id) {

  const startedAt = renderSeq;

  if (!(await ensureAdmin())) return;

  if (isStaleRender(startedAt)) return;

  currentBookingId = id;

  pushPath(`/admin/bookings/${id}`);

  const renderToken = renderSeq;

  if (!setPage(renderToken, await BookingEditor(id))) return;

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

  if (parts[0] === "equipment") {

    if (
      parts.length === 4 &&
      parts[2] === "card" &&
      Number.isFinite(Number(parts[1])) &&
      Number.isFinite(Number(parts[3]))
    ) {

      await renderEquipmentDetails(
        Number(parts[1]),
        Number(parts[3])
      );

      return;

    }

    if (parts.length === 1) {

      await renderEquipment();

      return;

    }

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

    if (parts[1] === "equipment") {

      if (
        parts.length === 5 &&
        parts[3] === "cards" &&
        Number.isFinite(Number(parts[2])) &&
        isSafeOrNew(parts[4])
      ) {

        await renderEquipmentCardEditor(
          Number(parts[2]),
          parts[4] === "new"
            ? null
            : Number(parts[4])
        );

        return;

      }

      if (
        parts.length === 3 &&
        isSafeOrNew(parts[2])
      ) {

        await renderEquipmentSectionEditor(
          parts[2] === "new"
            ? null
            : Number(parts[2])
        );

        return;

      }

      await renderEquipmentManager();

      return;

    }

    if (parts[1] === "home-sections") {

      if (
        parts.length === 3 &&
        isSafeOrNew(parts[2])
      ) {

        await renderSectionEditor(
          parts[2] === "new"
            ? null
            : Number(parts[2])
        );

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

  renderSeq++;

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
    renderEquipment,
    renderEquipmentDetails,

    navigateBack,

    renderAdminLogin,
    renderAdminDashboard,
    renderAdminDashboardReplace,
    renderAdminLoginReplace,
    renderHomeReplace,
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
    renderEquipmentManager,
    renderEquipmentSectionEditor,
    renderEquipmentCardEditor,

    getCurrentCategoryId,
    getCurrentServiceId,
    getCurrentCertificateId,
    getCurrentGalleryId,
    getCurrentBookingId,
    getCurrentEquipmentSectionId,
    getCurrentEquipmentCardId,

  };

  attachPublicEvents(router);

  /* أحداث الإدارة تُربط على صفحات الإدارة فقط، حتى لا تتسرب معالجات
     Admin إلى صفحات عامة (مثل زر الرجوع الخاص بمحررات Equipment) */
  if (currentPath().startsWith("/admin")) {

    attachAdminEvents(router);

  }

  ensureHomeNav(router);

}

/* يضيف زر الرئيسية (🏠) في كل صفحات الموقع بنفس الشكل والزجاجية والأيقونة:
   - Public → الصفحة الرئيسية العامة (/) بشكل مباشر
   - Admin → لوحة التحكم (/admin/dashboard) بشكل مباشر
   مكانه أسفل زر الرجوع مباشرة، ويُضاف مرة واحدة لكل صفحة.
   لا يظهر في الصفحة الرئيسية نفسها ولا في صفحة تسجيل الدخول.
   Home هو Shortcut مباشر (ليس Back) ولا يستخدم navigateBack. */
function ensureHomeNav(router) {

  if (document.querySelector("#homeBtn")) return;

  const path = currentPath();

  if (path === "/") return;

  if (path === "/admin/login") return;

  const isAdmin = path.startsWith("/admin");

  const homeTarget =
    isAdmin
      ? router.renderAdminDashboardReplace
      : router.renderHomeReplace;

  const homeTitle =
    isAdmin
      ? "العودة للوحة التحكم"
      : "العودة للرئيسية";

  const backBtn = document.querySelector(".back-btn");

  if (!backBtn) return;

  backBtn.insertAdjacentHTML(
    "afterend",
    HomeButton({ title: homeTitle })
  );

  document
    .querySelector("#homeBtn")
    ?.addEventListener(
      "click",
      homeTarget
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