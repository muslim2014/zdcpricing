import { supabase } from "../lib/supabase";

const TABLE = "typography";

export async function getTypography() {

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data || {};

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
