import {
  getSettings
} from "../api/settingsApi";

import {
  attachBookingEvents
} from "./public/bookingEvents";

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

/* =========================
     Certificates Fullscreen
  ========================= */

  const certOverlay = document.querySelector("#certOverlay");
  const certFullImg = document.querySelector("#certFullImage");
  const certCloseBtn = document.querySelector("#certCloseBtn");
  const certPrevBtn = document.querySelector("#certPrevBtn");
  const certNextBtn = document.querySelector("#certNextBtn");

  if (certOverlay && certFullImg) {

    const cards = document.querySelectorAll(".about-cert-card");
    let currentIndex = -1;
    let certImages = [];

    cards.forEach((card, i) => {
      const img = card.querySelector(".about-cert-img");
      certImages.push(img.src);
      card.addEventListener("click", () => {
        currentIndex = i;
        certFullImg.src = certImages[currentIndex];
        certOverlay.classList.remove("hidden");
      });
    });

    function showCert(index) {
      if (index < 0) index = certImages.length - 1;
      if (index >= certImages.length) index = 0;
      currentIndex = index;
      certFullImg.src = certImages[currentIndex];
    }

    if (certPrevBtn) {
      certPrevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showCert(currentIndex - 1);
      });
    }

    if (certNextBtn) {
      certNextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showCert(currentIndex + 1);
      });
    }

    function closeCertOverlay() {
      certOverlay.classList.add("hidden");
    }

    if (certCloseBtn) {
      certCloseBtn.addEventListener("click", closeCertOverlay);
    }

    certOverlay.addEventListener("click", (e) => {
      if (e.target === certOverlay) closeCertOverlay();
    });

    document.addEventListener("keydown", (e) => {
      if (certOverlay.classList.contains("hidden")) return;
      if (e.key === "Escape") closeCertOverlay();
      if (e.key === "ArrowLeft") showCert(currentIndex - 1);
      if (e.key === "ArrowRight") showCert(currentIndex + 1);
    });

  }

  /* =========================
     Gallery Fullscreen
  ========================= */

  const overlay = document.querySelector("#galleryOverlay");
  const fullImg = document.querySelector("#galleryFullImage");
  const closeBtn = document.querySelector("#galleryCloseBtn");
  const prevBtn = document.querySelector("#galleryPrevBtn");
  const nextBtn = document.querySelector("#galleryNextBtn");

  if (overlay && fullImg) {

    const cards = document.querySelectorAll(".gallery-card");
    let currentIndex = -1;
    let images = [];

    cards.forEach((card, i) => {
      const img = card.querySelector(".gallery-card-img");
      images.push(img.src);
      card.addEventListener("click", () => {
        currentIndex = i;
        fullImg.src = images[currentIndex];
        overlay.classList.remove("hidden");
      });
    });

    function showImage(index) {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      currentIndex = index;
      fullImg.src = images[currentIndex];
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
      });
    }

    function closeOverlay() {
      overlay.classList.add("hidden");
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeOverlay);
    }

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeOverlay();
    });

    document.addEventListener("keydown", (e) => {
      if (overlay.classList.contains("hidden")) return;
      if (e.key === "Escape") closeOverlay();
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
    });

  }

  /* =========================
     صفحة الحجز
  ========================= */

  attachBookingEvents(router);

}