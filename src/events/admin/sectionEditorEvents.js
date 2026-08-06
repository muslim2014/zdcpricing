import {
  saveSection
} from "../../api/sectionsApi";

import { showAlert } from "../../utils/dialogs";

export function attachSectionEditorEvents(router) {

  document
    .querySelector("#backToHomeSections")
    ?.addEventListener(
      "click",
      router.renderHomeSections
    );

  document
    .querySelector("#saveSectionBtn")
    ?.addEventListener("click", async () => {

      try {

        const id = Number(
          document.querySelector("#saveSectionBtn").dataset.id
        );

        await saveSection(id, {

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
            .trim()

        });

        showAlert("تم حفظ التعديلات");

        await router.renderHomeSections();

      } catch (error) {

        console.error(error);

        showAlert("حدث خطأ أثناء الحفظ");

      }

    });

}