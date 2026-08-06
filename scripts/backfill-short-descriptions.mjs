import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

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
  console.error("ERROR: missing env vars in .env");
  process.exit(1);
}

const supabase = createClient(url, anonKey);

function splitDescription(description) {
  const parts = String(description || "");
  const afterShort = parts.split("وصف مختصر")[1];
  const short = afterShort ? afterShort.split("---")[0].trim() : null;
  const afterDetail = parts.split("وصف تفصيلي")[1];
  const detail = afterDetail ? afterDetail.split("---")[0].trim() : null;
  const afterVisits = parts.split("عدد الزيارات")[1];
  const sessions = afterVisits ? afterVisits.split("---")[0].trim() : null;
  return { short, detail, sessions };
}

const { data: services, error: fetchError } = await supabase
  .from("services")
  .select("id, description");

if (fetchError) {
  console.error("SELECT failed:", fetchError.message);
  process.exit(1);
}

if (!services) {
  console.log("No services found.");
  process.exit(0);
}

let updated = 0;

for (const service of services) {
  const { short, detail, sessions } = splitDescription(service.description || "");

  if (!short && !detail && !sessions) {
    continue;
  }

  const payload = {};
  if (short) payload.short_description = short;
  if (detail) payload.description = detail;
  if (sessions) payload.sessions = sessions;

  const { error } = await supabase
    .from("services")
    .update(payload)
    .eq("id", service.id);

  if (error) {
    console.error("UPDATE failed for service", service.id, ":", error.message);
    process.exit(1);
  }

  updated++;
}

console.log("Updated " + updated + " of " + services.length + " services.");

if (updated > 0) {
  console.log("NOTE: Ensure the new columns exist (run the SQL migration first).");
}