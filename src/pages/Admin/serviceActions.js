import {
  getServices,
  createService as createServiceApi,
  updateService,
  deleteService
} from "../../api/servicesApi";

/* ========================= */

export async function saveService(categoryId, serviceId, serviceData) {

  await updateService(serviceId, {

    name: serviceData.name,
    price: serviceData.price,
    description: serviceData.description,
    image: serviceData.image

  });

}

/* ========================= */

export async function removeService(categoryId, serviceId) {

  await deleteService(serviceId);

}

/* ========================= */

export async function createService(categoryId) {

  const services = await getServices(categoryId);

  await createServiceApi({

    category_id: Number(categoryId),

    name: "خدمة جديدة",

    price: "",

    description: "",

    image: "",

    duration: "",

    whatsapp_message: "",

    features: [],

    featured: false,

    visible: true,

    sort_order: services.length + 1

  });

}