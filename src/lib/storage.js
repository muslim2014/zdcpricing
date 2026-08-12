import { supabase } from "./supabase";
import { uploadImage } from "./uploadImage";

const BUCKET = "clinic-images";

const PUBLIC_MARKER =
  "/storage/v1/object/public/clinic-images/";

/* =========================
   استخراج مسار الملف من URL عام لـ clinic-images
   - يحافظ على التعامل مع ? و # في نهاية الرابط
   - يرجع "" إذا لم يكن الملف تابعًا لـ clinic-images
========================= */

export function extractStoragePath(imageUrl) {

  if (typeof imageUrl !== "string") return "";

  const index =
    imageUrl.indexOf(PUBLIC_MARKER);

  if (index === -1) return "";

  let path = imageUrl
    .slice(index + PUBLIC_MARKER.length);

  path = path.split("?")[0];

  path = path.split("#")[0];

  return path || "";

}

/* =========================
   حذف ملف من Storage بأمان
   - URL فارغ / placeholder / غير تابع لـ clinic-images → لا يحذف شيئًا
   - فشل الحذف → يرمي خطأ (ليقرر المتصل: تجاهله أو منع العملية)
   ========================= */

export async function deleteImageByUrl(imageUrl) {

  const path = extractStoragePath(imageUrl);

  if (!path) {

    if (imageUrl) {

      console.warn(
        "deleteImageByUrl: لم يتم استخراج path من oldUrl",
        { oldUrl: imageUrl }
      );

    }

    return;

  }

  const { data, error } = await supabase
    .storage
    .from(BUCKET)
    .remove([path]);

  if (error) {

    console.error(
      "deleteImageByUrl: فشل حذف الصورة القديمة من Storage",
      {
        oldUrl: imageUrl,
        path,
        error: {
          message: error.message,
          status: error.status,
          statusCode: error.statusCode,
          code: error.code,
          details: error.details,
          hint: error.hint
        }
      }
    );

    const err = new Error(
      "فشل حذف الصورة القديمة من التخزين: " +
      error.message
    );

    err.oldUrl = imageUrl;

    err.path = path;

    err.cause = error;

    throw err;

  }

  console.log(
    "Old image deleted successfully:",
    path
  );

  return data;

}

/* =========================
   استبدال صورة بترتيب آمن:
   1) رفع الصورة الجديدة (فشله يوقف كل شيء بدون لمس DB)
   2) تحديث DB بالرابط الجديد عبر callback (فشله يُوقف بدون حذف القديمة)
   3) بعد نجاح DB → حذف القديمة (فشله يظهر في console.error ويُرمى خطأ
      حتى لا تبدو العملية ناجحة والصورة القديمة ما زالت في Storage)
   ========================= */

export async function uploadAndReplace(
  file,
  folder,
  currentUrl,
  saveToDb
) {

  const newUrl =
    await uploadImage(file, folder);

  if (
    typeof saveToDb === "function"
  ) {

    await saveToDb(newUrl);

  }

  if (
    currentUrl &&
    currentUrl !== newUrl
  ) {

    const path = extractStoragePath(currentUrl);

    if (!path) {

      console.warn(
        "uploadAndReplace: currentUrl موجود لكن extractStoragePath لم يستطع استخراج path",
        { currentUrl }
      );

    }

    try {

      await deleteImageByUrl(currentUrl);

    } catch (error) {

      console.error(
        "uploadAndReplace: فشل حذف الصورة القديمة بعد حفظ DB",
        {
          oldUrl: currentUrl,
          path,
          error: {
            message: error?.message,
            status: error?.status,
            statusCode: error?.statusCode,
            code: error?.code,
            details: error?.details,
            hint: error?.hint,
            cause: error?.cause
          }
        }
      );

      throw error;

    }

  }

  return newUrl;

}