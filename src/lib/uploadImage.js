import { supabase } from "./supabase";

const BUCKET = "clinic-images";

export async function uploadImage(
  file,
  folder = ""
) {

  const extension =
    file.name.split(".").pop();

  const fileName = folder
    ? `${folder}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${extension}`
    : `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${extension}`;

  const { error } = await supabase
    .storage
    .from(BUCKET)
    .upload(fileName, file, {
      upsert: false
    });

  if (error) {

    console.error(error);

    throw new Error(error.message);

  }

  const { data } = supabase
    .storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;

}