import { supabase } from "../lib/supabase";

const TABLE = "settings";

export async function getSettings() {

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  if (data) {

    return {

      clinicName: data.clinic_name ?? "",

      doctorName: data.doctor_name ?? "",

      logo: data.logo ?? "",

      phone: data.phone ?? "",

      whatsapp: data.whatsapp ?? "",

      address: data.address ?? "",

      facebook: data.facebook ?? "",

      instagram: data.instagram ?? "",

      maps: data.maps ?? "",

      gallery: data.gallery ?? "",

      pricingTitle:
        data.pricing_title ??
        "خدمات وأسعار العيادة",

      pricingDescription:
        data.pricing_description ??
        "تعرف على جميع الخدمات والأسعار"

    };

  }

  const defaults = {

    clinic_name: "اسم العيادة",

    doctor_name: "اسم الطبيب",

    logo: "🦷",

    phone: "",

    whatsapp: "",

    address: "",

    facebook: "",

    instagram: "",

    maps: "",

    gallery: "",

    pricing_title: "خدمات وأسعار العيادة",

    pricing_description:
      "تعرف على جميع الخدمات والأسعار"

  };

  const {
    data: inserted,
    error: insertError
  } = await supabase
    .from(TABLE)
    .insert(defaults)
    .select()
    .single();

  if (insertError) throw insertError;

  return {

    clinicName: inserted.clinic_name,

    doctorName: inserted.doctor_name,

    logo: inserted.logo,

    phone: inserted.phone,

    whatsapp: inserted.whatsapp,

    address: inserted.address,

    facebook: inserted.facebook,

    instagram: inserted.instagram,

    maps: inserted.maps,

    gallery: inserted.gallery,

    pricingTitle:
      inserted.pricing_title,

    pricingDescription:
      inserted.pricing_description

  };

}

export async function saveSettings(settings) {

  const {
    data: current,
    error
  } = await supabase
    .from(TABLE)
    .select("id")
    .limit(1)
    .single();

  if (error) throw error;

  const payload = {

    clinic_name: settings.clinicName,

    doctor_name: settings.doctorName,

    logo: settings.logo,

    phone: settings.phone,

    whatsapp: settings.whatsapp,

    address: settings.address,

    facebook: settings.facebook,

    instagram: settings.instagram,

    maps: settings.maps,

    gallery: settings.gallery,

    pricing_title: settings.pricingTitle,

    pricing_description:
      settings.pricingDescription,

    updated_at:
      new Date().toISOString()

  };

  const {
    error: updateError
  } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", current.id);

  if (updateError) throw updateError;

}