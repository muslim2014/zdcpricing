import {
  addHomeCard,
  saveHomeCard,
  removeHomeCard
} from "../../pages/Admin/HomeCardsManager";

import {
  moveHomeCardUp,
  moveHomeCardDown,
  toggleHomeCardVisibility,
  toggleHomeCardFeatured
} from "../../api/homeCardsApi";

export function attachHomeCardsEvents(router) {

  document
    .querySelector("#homeCardsBtn")
    ?.addEventListener("click", () => {

      router.renderHomeCardsManager();

    });

  /* ========================= */

  document
    .querySelector("#addHomeCardBtn")
    ?.addEventListener("click", async () => {

      await addHomeCard();

      await router.renderHomeCardsManager();

    });

  /* ========================= */

  document
    .querySelectorAll(".save-home-card")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await saveHomeCard(btn.dataset.id);

        await router.renderHomeCardsManager();

      });

    });

  /* ========================= */

  document
    .querySelectorAll(".delete-home-card")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        if (!confirm("حذف الكارت؟")) return;

        await removeHomeCard(btn.dataset.id);

        await router.renderHomeCardsManager();

      });

    });

  /* ========================= */

  document
    .querySelectorAll(".toggle-home-visible")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await toggleHomeCardVisibility(
          Number(btn.dataset.id),
          btn.dataset.visible !== "true"
        );

        await router.renderHomeCardsManager();

      });

    });

  /* ========================= */

  document
    .querySelectorAll(".toggle-home-featured")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await toggleHomeCardFeatured(
          Number(btn.dataset.id),
          btn.dataset.featured !== "true"
        );

        await router.renderHomeCardsManager();

      });

    });

  /* ========================= */

  document
    .querySelectorAll(".move-home-up")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await moveHomeCardUp(
          Number(btn.dataset.id)
        );

        await router.renderHomeCardsManager();

      });

    });

  /* ========================= */

  document
    .querySelectorAll(".move-home-down")
    .forEach(btn => {

      btn.addEventListener("click", async () => {

        await moveHomeCardDown(
          Number(btn.dataset.id)
        );

        await router.renderHomeCardsManager();

      });

    });

}