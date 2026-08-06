import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { categories } from "../src/data/categories.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(join(__dirname, "..", ".env"), "utf8");
const getVar = (n) => raw.split(/\r?\n/).find((l) => l.startsWith(n + "="))?.split("=").slice(1).join("=").trim() || "";
const sb = createClient(getVar("VITE_SUPABASE_URL"), getVar("VITE_SUPABASE_ANON_KEY"));

const s = categories[0].services[0];

console.log("=== 1) المصدر (categories.js) — أول خدمة ===");
console.log("name:", s.name);
console.log("shortDescription:", JSON.stringify(s.shortDescription));
console.log("description:", JSON.stringify(s.description));
console.log("sessions:", JSON.stringify(s.sessions));
console.log("features:", JSON.stringify(s.features));

console.log("\n=== فحص الأعمدة في Supabase مباشرة ===");
const cols = ["short_description", "sessions", "features", "description", "duration"];
for (const col of cols) {
  const { error } = await sb.from("services").select(col).limit(1);
  console.log("  " + col, "=>", error ? "MISSING: " + error.message : "OK (موجود)");
}

console.log("\n=== 2) الـ payload المُرسل إلى Supabase (أول خدمة) ===");
const payload = {
  name: s.name,
  image: s.image,
  price: s.price,
  duration: s.duration || "",
  description: s.description,
  whatsapp_message: s.whatsappMessage || "",
  features: s.features || [],
  featured: s.featured,
  visible: s.visible,
  sort_order: 1,
  short_description: s.shortDescription || "",
  sessions: s.sessions || ""
};
console.log(JSON.stringify(payload, null, 2));
console.log("تحققات payload:");
console.log("  short_description فارغ؟:", payload.short_description === "");
console.log("  description فارغ؟:", payload.description === "");
console.log("  sessions فارغ؟:", payload.sessions === "");
console.log("  features عدد:", payload.features.length);