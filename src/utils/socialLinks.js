import { socialIcons } from "../constants/socialIcons";

export function getSocialIcon(platform) {

  return socialIcons[platform]
    ?? "fa-solid fa-link";

}

export function buildSocialHref(link) {

  return link.url?.trim() || "#";

}