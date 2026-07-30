import {
  updateDoctorProfile
} from "../../api/doctorApi";

import {
  uploadImage
} from "../../lib/uploadImage";

export function attachDoctorProfileEvents(router) {

  console.log("Doctor Profile Events Attached");

  document
    .querySelector("#backToDashboard")
    ?.addEventListener(
      "click",
      router.renderAdminDashboard
    );

  const imageInput =
    document.querySelector("#doctorImage");

  const preview =
    document.querySelector("#doctorImagePreview");

  imageInput?.addEventListener("change", () => {

    const file = imageInput.files?.[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);

  });

  const saveBtn =
    document.querySelector("#saveDoctorProfile");

  console.log(saveBtn);

  saveBtn?.addEventListener("click", async () => {

    console.log("Save Button Clicked");

    try {

      let image = preview?.src || "";

      const file = imageInput?.files?.[0];

      if (file) {

        console.log("Uploading image...");

        image = await uploadImage(
          file,
          "doctor"
        );

        console.log("Uploaded:", image);

      }

      console.log("Saving profile...");

      await updateDoctorProfile({

        image,

        name: document
          .querySelector("#doctorName")
          .value
          .trim(),

        title: document
          .querySelector("#doctorTitle")
          .value
          .trim(),

        specialty: document
          .querySelector("#doctorSpecialty")
          .value
          .trim(),

        experience: document
          .querySelector("#doctorExperience")
          .value
          .trim(),

        full_bio: document
          .querySelector("#doctorFullBio")
          .value
          .trim()

      });

      console.log("Saved Successfully");

      alert("تم حفظ البيانات");

      await router.renderDoctorProfile();

    } catch (error) {

      console.error(error);

      alert(error.message);

    }

  });

}