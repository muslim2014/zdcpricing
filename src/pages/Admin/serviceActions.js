import {
  getServices,
  getService,
  createService as createServiceApi,
  updateService,
  deleteService
} from "../../api/servicesApi";

import {
  deleteImageByUrl
} from "../../lib/storage";

/* ========================= */

export async function saveService(categoryId, serviceId, serviceData) {

  await updateService(serviceId, {

    name: serviceData.name,
    price: serviceData.price,
    short_description:
      serviceData.short_description,
    description: serviceData.description,
    sessions: serviceData.sessions,
    features: serviceData.features,
    image: serviceData.image

  });

}

/* ========================= */

export async function removeService(categoryId, serviceId) {

  const service = await getService(serviceId);

  await deleteService(serviceId);

  if (service?.image) {

    try {

      await deleteImageByUrl(service.image);

    } catch (error) {

      console.error("فشل حذف صورة الخدمة:", error);

    }

  }

}

/* ========================= */

export async function createService(categoryId) {

  const services = await getServices(categoryId);

  await createServiceApi({

    category_id: Number(categoryId),

    name: "خدمة جديدة",

    price: "",

    short_description: "",

    description: "",

    sessions: "",

    image: "",

    duration: "",

    whatsapp_message: "",

    features: [],

    featured: false,

    visible: true,

    sort_order: services.length + 1

  });

}