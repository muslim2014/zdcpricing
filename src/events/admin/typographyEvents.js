import {
  saveTypography
} from "../../api/typographyApi";

export function attachTypographyEvents(router) {

  document
    .querySelector("#saveTypography")
    ?.addEventListener("click", async () => {

      try {

        await saveTypography({

          font_family:
            document.querySelector("#fontFamily").value,

          logo_size:
            Number(document.querySelector("#logoSize").value),

          clinic_name_size:
            Number(document.querySelector("#clinicNameSize").value),

          doctor_name_size:
            Number(document.querySelector("#doctorNameSize").value),

          card_title_size:
            Number(document.querySelector("#cardTitleSize").value),

          card_description_size:
            Number(document.querySelector("#cardDescriptionSize").value),

          card_icon_size:
            Number(document.querySelector("#cardIconSize").value),

          social_icon_size:
            Number(document.querySelector("#socialIconSize").value)

        });

        alert("تم حفظ التعديلات");

        router.renderTypographyManager();

      }

      catch (error) {

        console.error(error);

        alert(error.message);

      }

    });

}