export function initLightbox({

  cardsSelector,
  imgSelector,
  overlaySelector,
  fullImageSelector,
  closeBtnSelector,
  prevBtnSelector,
  nextBtnSelector

}) {

  const overlay =
    document.querySelector(overlaySelector);

  const fullImg =
    document.querySelector(fullImageSelector);

  if (!overlay || !fullImg) return;

  const closeBtn =
    document.querySelector(closeBtnSelector);

  const prevBtn =
    document.querySelector(prevBtnSelector);

  const nextBtn =
    document.querySelector(nextBtnSelector);

  const cards =
    document.querySelectorAll(cardsSelector);

  let currentIndex = -1;

  const images = [];

  cards.forEach((card, i) => {

    const img = card.querySelector(imgSelector);

    if (!img) return;

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

  function closeOverlay() {

    overlay.classList.add("hidden");

  }

  prevBtn?.addEventListener("click", (e) => {

    e.stopPropagation();

    showImage(currentIndex - 1);

  });

  nextBtn?.addEventListener("click", (e) => {

    e.stopPropagation();

    showImage(currentIndex + 1);

  });

  closeBtn?.addEventListener("click", closeOverlay);

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
