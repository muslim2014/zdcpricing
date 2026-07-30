import { supabase } from "./supabase";

export async function uploadImage(
  file,
  bucket = "clinic-images",
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
    .from(bucket)
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(fileName);

  return data.publicUrl;

}