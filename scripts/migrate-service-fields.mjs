import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

/*
 * Migration Script (تشغيل مرة واحدة فقط)
 *
 * يقرأ وصف كل خدمة (description) ويقسّمه تلقائياً إلى الحقول التالية
 * اعتماداً على الكلمات المفتاحية الموجودة داخل النص فقط (بدون AI أو تخمين):
 *
 *   - short_description  ← مقطع «وصف مختصر»
 *   - description        ← مقطع «وصف تفصيلي»
 *   - sessions           ← مقطع «عدد الزيارات» / «عدد الجلسات»
 *   - duration           ← مقطع «مدة الجلسة» / «مدة» (إن وُجد)
 *   - features           ← بندات «مميزات الخدمة»
 *
 * إذا لم يُعثر على قيمة فيكتب الحقل فارغاً ولا يُعدّل أي نص يدوياً.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const { data: services, error: fetchError } = await supabase
  .from("services")
  .select("id, description");

if (fetchError) {
  console.error("SELECT failed:", fetchError.message);
  process.exit(1);
}

if (!services || services.length === 0) {
  console.log("No services found.");
  process.exit(0);
}

const ALL_FIELDS = ["short_description", "description", "sessions", "duration", "features"];

let updated = 0;
let partial = 0;
const missingColumns = new Set();

for (const service of services) {
  const parsed = parseDescription(service.description || "");

  const nonEmpty = [];

  ["short_description", "description", "sessions", "duration"].forEach((f) => {
    if (parsed[f]) nonEmpty.push({ field: f, value: parsed[f] });
  });
  if (parsed.features && parsed.features.length) {
    nonEmpty.push({ field: "features", value: parsed.features });
  }

  if (nonEmpty.length === 0) continue;

  if (nonEmpty.length < ALL_FIELDS.length) partial++;

  let rowUpdated = false;

  for (const { field, value } of nonEmpty) {
    const payload = {};
    payload[field] = value;

    const { error } = await supabase
      .from("services")
      .update(payload)
      .eq("id", service.id);

    if (!error) {
      rowUpdated = true;
      continue;
    }

    const msg = error.message || "";
    if (/column/i.test(msg)) {
      missingColumns.add(field);
      continue;
    }

    console.error("UPDATE failed for service", service.id, field, ":", msg);
    process.exit(1);
  }

  if (rowUpdated) updated++;
}

console.log("");
console.log("=== تقرير الترحيل ===");
console.log("عدد الخدمات الكلي: " + services.length);
console.log("عدد الخدمات التي تم تحديثها: " + updated);
console.log("عدد الخدمات التي تعذّر استخراج بعض حقولها: " + partial);

if (missingColumns.size) {
  console.log("");
  console.log("تحذير: هذه الأعمدة غير موجودة في الجدول ولن تتم كتابتها حتى تُضاف:");
  missingColumns.forEach((c) => console.log("  - " + c));
  console.log("أضفها ثم أعد تشغيل السكربت ليستكمل هذه الحقول (لا يؤثر على المحدّث سابقاً).");
}

console.log("(انتهى — العملية كُتبت مرة واحدة على كل خدمة)");