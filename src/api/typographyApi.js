import { supabase } from "../lib/supabase";
import { getFont } from "./fontsApi";

const TABLE = "typography";

export async function getTypography() {

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  if (data) {

    if (data.font_id) {

      try {

        data.customFont = await getFont(
          data.font_id
        );

      }

      catch (error) {

        console.error(error);

      }

    }

    return data;

  }

  const {
    data: inserted,
    error: insertError
  } = await supabase
    .from(TABLE)
    .insert({})
    .select()
    .single();

  if (insertError) throw insertError;

  if (inserted.font_id) {

    try {

      inserted.customFont =
        await getFont(
          inserted.font_id
        );

    }

    catch (error) {

      console.error(error);

    }

  }

  return inserted;

}

export async function saveTypography(updates) {

  const {
    data: current,
    error
  } = await supabase
    .from(TABLE)
    .select("id")
    .limit(1)
    .single();

  if (error) throw error;

  const {
    error: updateError
  } = await supabase
    .from(TABLE)
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", current.id);

  if (updateError) throw updateError;

}