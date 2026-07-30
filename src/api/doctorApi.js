import { supabase } from "../lib/supabase";

/* ========================= */
/* Doctor Profile */
/* ========================= */

export async function getDoctorProfile() {

  const { data, error } = await supabase
    .from("doctor_profile")
    .select("*")
    .limit(1)
    .single();

  if (error) throw error;

  return data;

}

export async function updateDoctorProfile(updates) {

  const profile = await getDoctorProfile();

  const { data, error } = await supabase
    .from("doctor_profile")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", profile.id)
    .select()
    .single();

  if (error) throw error;

  return data;

}

/* ========================= */
/* Certificates */
/* ========================= */

export async function getCertificates() {

  const { data, error } = await supabase
    .from("doctor_certificates")
    .select("*")
    .order("sort_order", {
      ascending: true
    });

  if (error) throw error;

  return data;

}

export async function getCertificate(id) {

  const { data, error } = await supabase
    .from("doctor_certificates")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;

}

export async function createCertificate(certificate) {

  const { data, error } = await supabase
    .from("doctor_certificates")
    .insert([certificate])
    .select()
    .single();

  if (error) throw error;

  return data;

}

export async function updateCertificate(id, updates) {

  const { data, error } = await supabase
    .from("doctor_certificates")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;

}

export async function deleteCertificate(id) {

  const { error } = await supabase
    .from("doctor_certificates")
    .delete()
    .eq("id", id);

  if (error) throw error;

}

export async function toggleCertificateVisibility(id, visible) {

  return updateCertificate(id, {
    visible
  });

}

export async function moveCertificateUp(id) {

  const current = await getCertificate(id);

  const { data: previous } = await supabase
    .from("doctor_certificates")
    .select("*")
    .lt("sort_order", current.sort_order)
    .order("sort_order", {
      ascending: false
    })
    .limit(1);

  if (!previous?.length) return;

  await updateCertificate(current.id, {
    sort_order: previous[0].sort_order
  });

  await updateCertificate(previous[0].id, {
    sort_order: current.sort_order
  });

}

export async function moveCertificateDown(id) {

  const current = await getCertificate(id);

  const { data: next } = await supabase
    .from("doctor_certificates")
    .select("*")
    .gt("sort_order", current.sort_order)
    .order("sort_order", {
      ascending: true
    })
    .limit(1);

  if (!next?.length) return;

  await updateCertificate(current.id, {
    sort_order: next[0].sort_order
  });

  await updateCertificate(next[0].id, {
    sort_order: current.sort_order
  });

}