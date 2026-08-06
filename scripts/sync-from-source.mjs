import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { categories } from "../src/data/categories.js";

/*
 * Sync from source (مصدر الحقيقة الوحيد = src/data/categories.js)
 *
 * يقوم بعمل:
 *   1) التحقق من وجود الأعمدة المطلوبة (short_description, sessions, ...)
 *   2) قراءة كل الأقسام والخدمات من src/data/categories.js فقط
 *   3) إعادة مزامنة كاملة (حذف كل الصفوف ثم إدراجها من جديد)
 *   4) تقسيم وصف الخدمة (description) تلقائياً إلى الحقول:
 *        short_description, description, duration, sessions, features
 *      اعتماداً على الكلمات المفتاحية الموجودة في النص فقط (بدون تخمين)
 *   5) استبدال أي بيانات قديمة/تجريبية بالكامل
 *   6) تقرير نهائي بعدد الأقسام والخدمات وعدد الخدمات التي تحتوي كل حقل
 *
 * لا يعتمد على أي بيانات قديمة داخل قاعدة البيانات، ولا يُعدّل نصوصاً يدوياً.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const needsConfirm = !process.argv.includes("--yes");

const envPath = join(__dirname, "..", ".env");
const raw = readFileSync(envPath, "utf8");

function getVar(name) {
  const line = raw.split(/\r?\n/).find((l) => l.trim().startsWith(name + "="));
  if (!line) return "";
  return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

const url = getVar("VITE_SUPABASE_URL");
const anonKey = getVar("VITE_SUPABASE_ANON_KEY");

if (!url || !anonKey) {
  console.error("ERROR: missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, anonKey);

const SHORT_KEY = "وصف مختصر";
const DETAIL_KEY = "وصف تفصيلي";
const FEATURES_KEY = "مميزات الخدمة";
const DURATION_KEYS = ["مدة الجلسة", "مدة الجلسات", "المدة", "مدة"];
const SESSIONS_KEYS = ["عدد الزيارات", "عدد الجلسات", "عدد جلسات"];
const STRUCTURAL_LINE = /^[━─\-=•*✔]+$/;

function isMarker(text, keys) {
  return keys.some((k) => text === k);
}

function parseDescription(description) {
  const acc = { short: [], detail: [], sessions: [], duration: [], features: [] };
  const lines = String(description || "").split(/\r?\n/);
  let section = null;

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (STRUCTURAL_LINE.test(t)) continue;

    if (t === SHORT_KEY) { section = "short"; continue; }
    if (t === DETAIL_KEY) { section = "detail"; continue; }
    if (t === FEATURES_KEY) { section = "features"; continue; }
    if (isMarker(t, DURATION_KEYS)) { section = "duration"; continue; }
    if (isMarker(t, SESSIONS_KEYS)) { section = "sessions"; continue; }

    if (!section) continue;

    if (section === "features") {
      if (/^[•*✔\-▪]/.test(t)) {
        acc.features.push(t.replace(/^[•*✔\-▪]\s*/, "").trim());
      }
      continue;
    }

    if (acc[section]) acc[section].push(t);
  }

  return {
    short_description: acc.short.join(" ").trim(),
    description: acc.detail.join(" ").trim(),
    sessions: acc.sessions.join(" ").trim(),
    duration: acc.duration.join(" ").trim(),
    features: acc.features
  };
}

async function columnExists(column) {
  const { error } = await supabase
    .from("services")
    .select(column)
    .limit(1);
  return !(error && /column/i.test(error.message || ""));
}

// ============ 1) التحقق من الأعمدة ============
const REQUIRED_COLUMNS = ["short_description", "sessions"];
const missing = [];
for (const col of REQUIRED_COLUMNS) {
  const ok = await columnExists(col);
  console.log((ok ? "OK " : "MISSING ") + "column '" + col + "'");
  if (!ok) missing.push(col);
}

if (missing.length) {
  console.log("");
  console.log("الأعمدة التالية غير موجودة. لديك خياران:");
  console.log("  - نفّذ ملف scripts/add-new-columns.sql في محرر SQL في Supabase.");
  console.log("  - ثم أعد تشغيل هذا السكربت ليستكمل.");
  console.log("الأعمدة الناقصة: " + missing.join(", "));
  process.exit(1);
}

// ============ 2) بناء البيانات من المصدر ============
const EXPECTED_CATEGORIES = categories.length;
const EXPECTED_SERVICES = categories.reduce((n, c) => n + c.services.length, 0);

if (needsConfirm) {
  console.log("");
  console.log("سيتم DELETE كل صفوف 'services' و 'categories' ثم إدراج:");
  console.log("  " + EXPECTED_CATEGORIES + " قسم / " + EXPECTED_SERVICES + " خدمة");
  console.log("أعد التشغيل مع --yes للتنفيذ.");
  process.exit(0);
}

// ============ 3-5) إعادة المزامنة الكاملة ============
console.log("\n>> حذف جميع الخدمات...");
const { error: delServError } = await supabase.from("services").delete().gte("id", 0);
if (delServError) {
  console.error("DELETE services failed:", delServError.message);
  process.exit(1);
}

console.log(">> حذف جميع الأقسام...");
const { error: delCatError } = await supabase.from("categories").delete().gte("id", 0);
if (delCatError) {
  console.error("DELETE categories failed:", delCatError.message);
  process.exit(1);
}

console.log(">> إدراج الأقسام...");
const { data: insertedCategories, error: insCatError } = await supabase
  .from("categories")
  .insert(
    categories.map((category, index) => ({
      name: category.name,
      image: category.image,
      featured: category.featured,
      visible: true,
      sort_order: index + 1
    }))
  )
  .select("id, name");
if (insCatError) {
  console.error("INSERT categories failed:", insCatError.message);
  process.exit(1);
}

const categoryIdByName = {};
insertedCategories.forEach((c) => {
  categoryIdByName[c.name] = c.id;
});

console.log(">> إدراج الخدمات (من الحقول الجديدة في المصدر)...");
const services = [];
categories.forEach((category) => {
  const categoryId = categoryIdByName[category.name];
  if (!categoryId) {
    console.error("Missing category id for: " + category.name);
    process.exit(1);
  }
  category.services.forEach((service, index) => {
    services.push({
      category_id: categoryId,
      name: service.name,
      image: service.image,
      price: service.price,
      duration: service.duration || "",
      description: service.description,
      whatsapp_message: service.whatsappMessage || "",
      features: service.features || [],
      featured: service.featured,
      visible: service.visible,
      sort_order: index + 1,
      short_description: service.shortDescription || "",
      sessions: service.sessions || ""
    });
  });
});

const { error: insServError } = await supabase.from("services").insert(services);
if (insServError) {
  console.error("INSERT services failed:", insServError.message);
  process.exit(1);
}

// ============ 6) التقرير ============
function countField(rows, field) {
  return rows.filter((r) => {
    const v = r[field];
    if (field === "features") return Array.isArray(v) && v.length;
    return Boolean(v) && String(v).trim() !== "";
  }).length;
}

const { data: finalServices, error: selError } = await supabase
  .from("services")
  .select("id, short_description, description, duration, sessions, features");
if (selError) {
  console.error("SELECT after sync failed:", selError.message);
  process.exit(1);
}

const catsCount = insertedCategories.length;
const { count: servCount, error: countError } = await supabase
  .from("services")
  .select("*", { count: "exact", head: true });
if (countError) {
  console.error("COUNT services failed:", countError.message);
  process.exit(1);
}

console.log("");
console.log("=== تقرير المزامنة (المصدر: src/data/categories.js) ===");
console.log("عدد الأقسام: " + catsCount);
console.log("عدد الخدمات: " + servCount);
console.log("عدد الخدمات التي تحتوي:");
console.log("  - short_description : " + countField(finalServices, "short_description"));
console.log("  - description       : " + countField(finalServices, "description"));
console.log("  - duration          : " + countField(finalServices, "duration"));
console.log("  - sessions          : " + countField(finalServices, "sessions"));
console.log("  - features          : " + countField(finalServices, "features"));