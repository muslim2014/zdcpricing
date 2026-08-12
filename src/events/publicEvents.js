import {
  getSettings
} from "../api/settingsApi";

import {
  getServices
} from "../api/servicesApi";

import {
  getCategories
} from "../api/categoriesApi";

import {
  removeService
} from "../pages/Admin/serviceActions";

import {
  showAlert,
  showConfirmModal
} from "../utils/dialogs";

import {
  attachBookingEvents
} from "./public/bookingEvents";

import {
  initLightbox
} from "../utils/lightbox";

export function attachPublicEvents(router) {

  /* =========================
     الصفحة الرئيسية
  ========================= */

  document
    .querySelector("#adminBtn")
    ?.addEventListener(
      "click",
      router.renderAdminLogin
    );

  document
    .querySelector("#searchIconBtn")
    ?.addEventListener(
      "click",
      router.renderSearch
    );

  document
    .querySelector("#themeToggle")
    ?.addEventListener("click", () => {

      const html =
        document.documentElement;

      const current =
        html.getAttribute("data-theme") ||
        "light";

      const next =
        current === "light" ? "dark" : "light";

      html.setAttribute("data-theme", next);

      localStorage.setItem("theme", next);

      const icon =
        document.querySelector(
          "#themeToggle i"
        );

      if (icon) {

        icon.className = next === "dark"
          ? "fa-solid fa-sun"
          : "fa-solid fa-moon";

      }

    });

  document
    .querySelectorAll(".home-section-btn")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        const key = btn.dataset.key;

        await getSettings();

        switch (key) {

          case "pricing":

            router.renderPricing();

            break;

          case "about":

            router.renderAbout();

            break;

          case "booking":

            router.renderBooking();

            break;

          case "gallery":

            router.renderGallery();

            break;

        }

      });

    });

  /* =========================
     الأقسام
  ========================= */

  document
    .querySelectorAll(".category-card")
    .forEach(card => {

      card.addEventListener("click", () => {

        router.renderServices(
          Number(card.dataset.id)
        );

      });

    });

  /* =========================
     الخدمات
  ========================= */

  document
    .querySelectorAll(".service-card")
    .forEach(card => {

      card.addEventListener("click", () => {

        router.renderServiceDetails(
          Number(card.dataset.category),
          Number(card.dataset.id)
        );

      });

    });

  /* =========================
     حذف الخدمة من الكارت مباشرة (للمدير)
  ========================= */

  document
    .querySelectorAll(".service-card .service-delete-btn")
    .forEach(btn => {

      btn.addEventListener("click", async (event) => {

        event.stopPropagation();
        event.preventDefault();

        if (!(await showConfirmModal("حذف هذه الخدمة؟")))
          return;

        const card = btn.closest(".service-card");

        try {

          await removeService(
            Number(btn.dataset.category),
            Number(btn.dataset.id)
          );

          card?.remove();

        } catch (error) {

          console.error(error);

          showAlert(
            error?.message ||
            "حدث خطأ أثناء حذف الخدمة"
          );

        }

      });

    });

  /* =========================
     رجوع للرئيسية
  ========================= */

  document
    .querySelector("#backToHome")
    ?.addEventListener(
      "click",
      router.renderHome
    );

  const backBtn =
    document.querySelector(".back-btn");

  if (backBtn && !backBtn.id) {

    backBtn.addEventListener(
      "click",
      router.renderHome
    );

  }

  /* =========================
     رجوع للأقسام
  ========================= */

  document
    .querySelector("#backToCategories")
    ?.addEventListener(
      "click",
      router.renderPricing
    );

  /* =========================
     رجوع للخدمات
  ========================= */

  document
    .querySelector("#backToServices")
    ?.addEventListener("click", () => {

      router.renderServices(
        router.getCurrentCategoryId()
      );

    });

  document
    .querySelector("#bookServiceBtn")
    ?.addEventListener("click", () => {

      router.renderBooking();

    });

  /* =========================
     البحث في الخدمات
  ========================= */

  const publicServiceSearch =
    document.querySelector("#publicServiceSearch");

  const clearServiceSearch =
    document.querySelector("#clearServiceSearch");

  const noResults =
    document.querySelector("#noServicesFound");

  function applyServiceSearch(value) {

    let visible = 0;

    document
      .querySelectorAll(".service-card")
      .forEach(card => {

        const match =
          (card.textContent || "")
            .toLowerCase()
            .includes(value);

        card.style.display =
          match ? "" : "none";

        if (match) visible++;

      });

    if (noResults) {

      noResults.style.display =
        value && visible === 0
          ? ""
          : "none";

    }

  }

  if (publicServiceSearch) {

    publicServiceSearch.addEventListener("input", () => {

      const value =
        publicServiceSearch.value
          .trim()
          .toLowerCase();

      if (clearServiceSearch) {

        clearServiceSearch.style.display =
          value ? "flex" : "none";

      }

      applyServiceSearch(value);

    });

  }

  if (clearServiceSearch) {

    clearServiceSearch.addEventListener("click", () => {

      publicServiceSearch.value = "";

      clearServiceSearch.style.display = "none";

      applyServiceSearch("");

      publicServiceSearch.focus();

    });

  }

  /* =========================
     البحث في الأقسام (صفحة الأقسام)
  ========================= */

  const pricingCategorySearch =
    document.querySelector("#pricingCategorySearch");

  const clearPricingCategory =
    document.querySelector("#clearPricingCategory");

  function applyCategorySearch(value) {

    document
      .querySelectorAll(".category-card")
      .forEach(card => {

        card.style.display =
          (card.textContent || "")
            .toLowerCase()
            .includes(value)
            ? ""
            : "none";

      });

  }

  if (pricingCategorySearch) {

    pricingCategorySearch.addEventListener("input", () => {

      const value =
        pricingCategorySearch.value
          .trim()
          .toLowerCase();

      if (clearPricingCategory) {

        clearPricingCategory.style.display =
          value ? "flex" : "none";

      }

      applyCategorySearch(value);

    });

  }

  if (clearPricingCategory) {

    clearPricingCategory.addEventListener("click", () => {

      pricingCategorySearch.value = "";

      clearPricingCategory.style.display = "none";

      applyCategorySearch("");

      pricingCategorySearch.focus();

    });

  }

  /* =========================
     البحث في صفحة تفاصيل الخدمة (جميع الخدمات)
  ========================= */

  const detailServiceSearch =
    document.querySelector("#detailServiceSearch");

  const clearDetailService =
    document.querySelector("#clearDetailService");

  const detailResults =
    document.querySelector("#detailServiceResults");

  let allServicesCache = null;

  function renderDetailResults() {

    const value =
      detailServiceSearch.value
        .trim()
        .toLowerCase();

    if (!value) {

      detailResults.style.display = "none";

      detailResults.innerHTML = "";

      return;

    }

    const filtered =
      (allServicesCache || [])
        .filter(service =>
          (service.name || "")
            .toLowerCase()
            .includes(value)
        )
        .slice(0, 8);

    if (!filtered.length) {

      detailResults.innerHTML = `
        <p style="text-align:center;opacity:.8;padding:10px">
          لا توجد خدمات مطابقة.
        </p>
      `;

      detailResults.style.display = "";

      return;

    }

    detailResults.innerHTML =
      filtered.map(service => `

        <div
          class="admin-list-item"
          data-cat="${service.category_id}"
          data-id="${service.id}"
          style="cursor:pointer"
        >
          <strong>${service.name}</strong>
        </div>

      `).join("");

    detailResults.style.display = "";

  }

  if (detailServiceSearch) {

    detailServiceSearch.addEventListener("input", async () => {

      const value =
        detailServiceSearch.value.trim();

      clearDetailService.style.display =
        value ? "flex" : "none";

      if (!value) {

        renderDetailResults();

        return;

      }

      if (!allServicesCache) {

        allServicesCache =
          await getServices();

      }

      renderDetailResults();

    });

  }

  if (clearDetailService) {

    clearDetailService.addEventListener("click", () => {

      detailServiceSearch.value = "";

      clearDetailService.style.display = "none";

      renderDetailResults();

      detailServiceSearch.focus();

    });

  }

  if (detailResults) {

    detailResults.addEventListener("click", (event) => {

      const item =
        event.target.closest(".admin-list-item");

      if (!item) return;

      router.renderServiceDetails(
        Number(item.dataset.cat),
        Number(item.dataset.id)
      );

    });

  }

  /* =========================
     البحث الشامل (جميع الخدمات الظاهرة)
  ========================= */

  const globalSearchInput =
    document.querySelector("#globalSearchInput");

  const clearGlobalSearchBtn =
    document.querySelector("#clearGlobalSearchBtn");

  const globalResults =
    document.querySelector("#globalSearchResults");

  const globalNoResults =
    document.querySelector("#noGlobalResults");

  let globalServicesCache = null;

  let globalCategoryNames = {};

  async function loadGlobalSearchData() {

    if (globalServicesCache) return;

    const [services, categories] = await Promise.all([
      getServices(null, true),
      getCategories(true)
    ]);

    globalServicesCache = services;

    globalCategoryNames = {};

    categories.forEach(category => {
      globalCategoryNames[Number(category.id)] = category.name;
    });

  }

  function renderGlobalResults() {

    const value =
      globalSearchInput.value
        .trim()
        .toLowerCase();

    if (!value) {

      globalResults.style.display = "none";

      globalResults.innerHTML = "";

      globalNoResults.style.display = "none";

      return;

    }

    const filtered =
      (globalServicesCache || [])
        .filter(service =>
          (service.name || "")
            .toLowerCase()
            .includes(value)
        );

    if (!filtered.length) {

      globalResults.style.display = "none";

      globalResults.innerHTML = "";

      globalNoResults.style.display = "";

      return;

    }

    globalResults.innerHTML =
      filtered.map(service => `

        <div
          class="admin-list-item"
          data-cat="${service.category_id}"
          data-id="${service.id}"
          style="cursor:pointer;align-items:center;gap:12px"
        >

          ${
            service.image
              ? `
                <img
                  src="${service.image}"
                  alt="${service.name}"
                  style="
                    width:44px;
                    height:44px;
                    border-radius:10px;
                    object-fit:cover;
                  "
                >
              `
              : `
                <div
                  style="
                    width:44px;
                    height:44px;
                    border-radius:10px;
                    background:var(--glass-strong);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:20px;
                  "
                >
                  🦷
                </div>
              `
          }

          <div style="flex:1;min-width:0">

            <strong>${service.name}</strong>

            <div
              style="
                font-size:13px;
                opacity:.8;
                margin-top:2px;
              "
            >
              ${
                globalCategoryNames[Number(service.category_id)] || ""
              }
            </div>

          </div>

        </div>

      `).join("");

    globalResults.style.display = "";

    globalNoResults.style.display = "none";

  }

  if (globalSearchInput) {

    globalSearchInput.addEventListener("input", async () => {

      const value = globalSearchInput.value.trim();

      if (clearGlobalSearchBtn) {

        clearGlobalSearchBtn.style.display =
          value ? "flex" : "none";

      }

      if (value) {

        await loadGlobalSearchData();

        renderGlobalResults();

      } else {

        renderGlobalResults();

      }

    });

  }

  if (clearGlobalSearchBtn) {

    clearGlobalSearchBtn.addEventListener("click", () => {

      globalSearchInput.value = "";

      clearGlobalSearchBtn.style.display = "none";

      renderGlobalResults();

      globalSearchInput.focus();

    });

  }

  if (globalResults) {

    globalResults.addEventListener("click", (event) => {

      const item =
        event.target.closest(".admin-list-item");

      if (!item) return;

      router.renderServiceDetails(
        Number(item.dataset.cat),
        Number(item.dataset.id)
      );

    });

  }

  document
    .querySelector("#closeSearchBtn")
    ?.addEventListener(
      "click",
      router.renderHome
    );

/* =========================
     Certificates Fullscreen
  ========================= */

  /* =========================
     Lightbox (معرض الصور + الشهادات)
  ========================= */

  initLightbox({
    cardsSelector: ".gallery-card",
    imgSelector: ".gallery-card-img",
    overlaySelector: "#galleryOverlay",
    fullImageSelector: "#galleryFullImage",
    closeBtnSelector: "#galleryCloseBtn",
    prevBtnSelector: "#galleryPrevBtn",
    nextBtnSelector: "#galleryNextBtn"
  });

  initLightbox({
    cardsSelector: ".about-cert-card",
    imgSelector: ".about-cert-img",
    overlaySelector: "#certOverlay",
    fullImageSelector: "#certFullImage",
    closeBtnSelector: "#certCloseBtn",
    prevBtnSelector: "#certPrevBtn",
    nextBtnSelector: "#certNextBtn"
  });

  initLightbox({
    cardsSelector: ".detail-image",
    imgSelector: ".detail-image img",
    overlaySelector: "#serviceImageOverlay",
    fullImageSelector: "#serviceFullImage",
    closeBtnSelector: "#serviceImageCloseBtn",
    prevBtnSelector: "#serviceImageNoPrevBtn",
    nextBtnSelector: "#serviceImageNoNextBtn"
  });

  /* =========================
     صفحة الحجز
  ========================= */

  attachBookingEvents(router);

}