import {
  getGallery
} from "../api/galleryApi";
import { ThemeToggle } from "../components/ThemeToggle";
import { BackButton } from "../components/BackButton";

export async function Gallery() {

  const images = (await getGallery())
    .filter(image => image.visible);

  return `
    <div class="gallery-page">

      <div class="gallery-header">
        ${BackButton({
          id: "backToHome",
          title: "العودة للرئيسية"
        })}
        <h2>معرض الصور</h2>
        ${ThemeToggle()}
      </div>

      <div class="gallery-grid">
        ${images.map((image, index) => `
          <div class="gallery-card" data-index="${index}">
            <img
              src="${image.image}"
              class="gallery-card-img"
              loading="lazy"
              alt=""
            >
          </div>
        `).join("")}
      </div>

      <div id="galleryOverlay" class="gallery-overlay hidden">
        <button id="galleryCloseBtn" class="gallery-overlay-close">✖</button>
        <button id="galleryPrevBtn" class="gallery-nav-btn left">⬅</button>
        <img id="galleryFullImage" class="gallery-full-img" src="" alt="">
        <button id="galleryNextBtn" class="gallery-nav-btn right">➡</button>
      </div>

    </div>
  `;

}