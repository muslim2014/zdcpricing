import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { CATS as C1 } from "./content-part1.mjs";
import { CATS as C2 } from "./content-part2.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const all = [...C1, ...C2];

// ====== تحقق ======
const total = all.reduce((n, c) => n + c.services.length, 0);
console.log("categories:", all.length, "services:", total);

let missing = 0;
for (const c of all) {
  for (const s of c.services) {
    const [name, , short, detail, sessions, features] = s;
    const ok =
      name && short && detail && sessions &&
      Array.isArray(features) && features.length >= 3;
    if (!ok) {
      missing++;
      console.error("NON-OK:", c.name, "->", name);
    }
  }
}
if (missing) {
  console.error("FOUND", missing, "service(s) missing fields. Aborting.");
  process.exit(1);
}

// ====== إعادة بناء ids (1..n لكل قسم) ======
all.forEach((c, ci) => {
  c.services.forEach((s, i) => (s[0] = { id: i + 1, name: s[0] }));
});

function jsString(v) {
  return JSON.stringify(v);
}

const lines = [];
lines.push("export const categories = [");
all.forEach((c, ci) => {
  lines.push(" {");
  lines.push(`  id: ${ci + 1},`);
  lines.push(`  name: ${jsString(c.name)},`);
  lines.push("  image: \"\",");
  lines.push(`  featured: ${c.featured === true},`);
  lines.push("");
  lines.push("  services: [");
  c.services.forEach((s, si) => {
    const comma = si < c.services.length - 1 ? "," : "";
    lines.push("    {");
    lines.push(`      id: ${s[0].id},`);
    lines.push(`      name: ${jsString(s[0].name)},`);
    lines.push("      price: \"\",");
    lines.push("      image: \"\",");
    lines.push("      duration: \"\",");
    lines.push(`      shortDescription: ${jsString(s[2])},`);
    lines.push(`      description: ${jsString(s[3])},`);
    lines.push(`      sessions: ${jsString(s[4])},`);
    lines.push(`      features: ${jsString(s[5])},`);
    lines.push("      whatsappMessage: \"\",");
    lines.push(`      featured: ${s[1] === true},`);
    lines.push("      visible: true");
    lines.push("    }" + comma);
  });
  lines.push("  ]");
  lines.push(" },");
});
lines.push("];");
lines.push("");

writeFileSync(join(__dirname, "..", "src", "data", "categories.js"), lines.join("\n"), "utf8");
console.log("written src/data/categories.js (" + all.length + " cats, " + total + " services)");