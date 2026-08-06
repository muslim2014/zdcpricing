import {
  getSettings
} from "../api/settingsApi";

import {
  getServices
} from "../api/servicesApi";

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
      router.renderPricing
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

  if (

    backBtn &&

    !document.querySelector("#backToHome") &&
    !document.querySelector("#backToCategories") &&
    !document.querySelector("#backToServices") &&
    !document.querySelector("#backToDashboard") &&
    !document.querySelector("#logoutBtn")

  ) {

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

  /* =========================
     صفحة الحجز
  ========================= */

  attachBookingEvents(router);

}