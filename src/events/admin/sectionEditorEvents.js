import {
  getSections,
  createSection,
  saveSection
} from "../../api/sectionsApi";

import { showAlert } from "../../utils/dialogs";

export function attachSectionEditorEvents(router) {

  document
    .querySelector("#backToHomeSections")
    ?.addEventListener(
      "click",
      () => router.navigateBack(router.renderHomeSections)
    );

  document
    .querySelector("#saveSectionBtn")
    ?.addEventListener("click", async () => {

      try {

        const idRaw =
          document.querySelector("#saveSectionBtn").dataset.id;

        const id = idRaw ? Number(idRaw) : null;

        const sectionKey = document
          .querySelector("#sectionKey")
          .value
          .trim();

        if (!sectionKey) {

          showAlert("المفتاح (section_key) مطلوب");

          return;

        }

        const payload = {

          section_key: sectionKey,

          title: document
            .querySelector("#sectionTitle")
            .value
            .trim(),

          description: document
            .querySelector("#sectionDescription")
            .value
            .trim(),

          icon: document
            .querySelector("#sectionIcon")
            .value
            .trim(),

          button_text: document
            .querySelector("#sectionButtonText")
            .value
            .trim(),

          button_link: document
            .querySelector("#sectionButtonLink")
            .value
            .trim(),

          visible: document
            .querySelector("#sectionVisible")
            .checked

        };

        if (id) {

          await saveSection(id, payload);

        } else {

          const sections = await getSections("home");

          const nextSortOrder = sections.reduce(
            (max, section) =>
              Math.max(max, section.sort_order || 0),
            0
          ) + 1;

          await createSection({
            page: "home",
            ...payload,
            featured: false,
            sort_order: nextSortOrder
          });

        }

        showAlert(id ? "تم حفظ التعديلات" : "تمت إضافة الكارت");

        router.navigateBack(router.renderHomeSections);

      } catch (error) {

        console.error(error);

        showAlert(
          error?.message ||
          "حدث خطأ أثناء الحفظ"
        );

      }

    });

}