import { attachHomeSectionsEvents } from "./admin/homeSectionsEvents";
import { attachSectionEditorEvents } from "./admin/sectionEditorEvents";

import { attachDoctorProfileEvents } from "./admin/doctorProfileEvents";
import { attachCertificateEditorEvents } from "./admin/certificateEditorEvents";
import { attachSocialLinksEvents }
from "./admin/socialLinksEvents";
import { attachGalleryEvents } from "./admin/galleryEvents";
import { attachGalleryEditorEvents } from "./admin/galleryEditorEvents";
import { attachBookingsEvents } from "./admin/bookingsEvents";
import { attachTypographyEvents } from "./admin/typographyEvents";
import { attachLoginEvents } from "./admin/loginEvents";
import { attachSettingsEvents } from "./admin/settingsEvents";
import { attachCategoriesEvents } from "./admin/categoriesEvents";
import { attachServicesEvents } from "./admin/servicesEvents";
import { attachBookingFieldsEvents } from "./admin/bookingFieldsEvents";

export function attachAdminEvents(router) {

  attachLoginEvents(router);

  attachSettingsEvents(router);

  attachCategoriesEvents(router);

  attachServicesEvents(router);

  attachBookingFieldsEvents(router);

  attachHomeSectionsEvents(router);

  attachSectionEditorEvents(router);

  attachDoctorProfileEvents(router);

  attachCertificateEditorEvents(router);

  attachGalleryEvents(router);

  attachGalleryEditorEvents(router);

  attachBookingsEvents(router);

  attachSocialLinksEvents(router);

  attachTypographyEvents(router);
}