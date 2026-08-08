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

      logoWidth: data.logo_width ?? 180,

      pricingTitle:
        data.pricing_title ??
        "خدمات وأسعار العيادة",

      pricingDescription:
        data.pricing_description ??
        "تعرف على جميع الخدمات والأسعار",

      categoriesPageTitle:
        data.categories_page_title ??
        "أقسام العيادة",

      whatsappNumber:
        data.whatsapp_number ?? ""

    };

  }

  return {

    clinicName: "اسم العيادة",

    doctorName: "اسم الطبيب",

    logo: "",

    logoWidth: 180,

    pricingTitle: "خدمات وأسعار العيادة",

    pricingDescription:
      "تعرف على جميع الخدمات والأسعار",

    categoriesPageTitle:
      "أقسام العيادة",

    whatsappNumber: ""

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

    updated_at:
      new Date().toISOString()

  };

  if (settings.clinicName !== undefined) {

    payload.clinic_name = settings.clinicName;

  }

  if (settings.doctorName !== undefined) {

    payload.doctor_name = settings.doctorName;

  }

  if (settings.logo !== undefined) {

    payload.logo = settings.logo;

  }

  if (settings.logoWidth !== undefined) {

    payload.logo_width = settings.logoWidth;

  }

  if (settings.pricingTitle !== undefined) {

    payload.pricing_title = settings.pricingTitle;

  }

  if (settings.pricingDescription !== undefined) {

    payload.pricing_description =
      settings.pricingDescription;

  }

  if (settings.categoriesPageTitle !== undefined) {

    payload.categories_page_title =
      settings.categoriesPageTitle;

  }

  if (settings.whatsappNumber !== undefined) {

    payload.whatsapp_number =
      settings.whatsappNumber;

  }

  const response = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", current.id);

  if (response.error) throw response.error;

  return response;

}