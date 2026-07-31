import { supabase } from "../lib/supabase";

const TABLE = "fonts";
const BUCKET = "fonts";

export async function getFonts() {

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("name");

  if (error) throw error;

  return data;

}

export async function uploadFont(file) {

  const fileName =
    `${Date.now()}-${file.name}`;

  const { error: uploadError } =
    await supabase.storage
      .from(BUCKET)
      .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } =
    supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

  const publicUrl = data.publicUrl;

  const name =
    file.name.replace(/\.[^.]+$/, "");

  const { error } = await supabase
    .from(TABLE)
    .insert({

      name,

      file_url: publicUrl,

      is_system: false

    });

  if (error) throw error;

}

export async function deleteFont(id) {

  const { data } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (!data) return;

  const fileName =
    data.file_url.split("/").pop();

  await supabase.storage
    .from(BUCKET)
    .remove([fileName]);

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;


}

  export async function getFont(id) {

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;

}

export async function setCurrentFont(fontId) {

  const { error } = await supabase
    .from("typography")
    .update({
      font_id: fontId,
      updated_at: new Date().toISOString()
    })
    .eq("id", 1);

  if (error) throw error;

}

export async function getCurrentFont() {

  const { data, error } = await supabase
    .from("typography")
    .select("font_id")
    .limit(1)
    .single();

  if (error) throw error;

  return data.font_id;

}