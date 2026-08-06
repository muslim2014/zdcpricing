import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.join(__dirname, "..", ".env");

if (!fs.existsSync(envPath)) {
  console.error(".env not found at", envPath);
  process.exit(1);
}

const env = fs.readFileSync(envPath, "utf8");

const url = env.match(/VITE_SUPABASE_URL=(.+)/)?.[1]?.trim();
const anonKey = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.error(
    "Missing service role key. Run with:\n" +
    "  $env:SUPABASE_SERVICE_ROLE_KEY=\"<key>\"  ;  node scripts/create-buckets.mjs"
  );
  process.exit(1);
}

const sb = createClient(url, serviceKey, {
  auth: { persistSession: false }
});

const buckets = ["services", "categories"];

for (const bucket of buckets) {

  const exists = await sb.storage.getBucket(bucket);

  if (exists.data) {

    console.log(`[${bucket}] already exists`);

  } else {

    const created = await sb.storage.createBucket(bucket, {
      public: true
    });

    if (created.error) {
      console.error(`[${bucket}] create failed:`, created.error.message);
    } else {
      console.log(`[${bucket}] created (public)`);
    }

  }

  const bucketId = bucket;

  const policies = [
    {
      name: `${bucket}_anon_insert`,
      bucket_id: bucketId,
      roles: ["anon"],
      operation: "INSERT",
      definition: null,
      check_expression: JSON.stringify({ "bucket_id": bucketId })
    },
    {
      name: `${bucket}_anon_select`,
      bucket_id: bucketId,
      roles: ["anon"],
      operation: "SELECT",
      definition: JSON.stringify({ "bucket_id": bucketId }),
      check_expression: null
    },
    {
      name: `${bucket}_anon_update`,
      bucket_id: bucketId,
      roles: ["anon"],
      operation: "UPDATE",
      definition: null,
      check_expression: JSON.stringify({ "bucket_id": bucketId })
    },
    {
      name: `${bucket}_anon_delete`,
      bucket_id: bucketId,
      roles: ["anon"],
      operation: "DELETE",
      definition: JSON.stringify({ "bucket_id": bucketId }),
      check_expression: null
    }
  ];

  for (const p of policies) {

    const { error } = await sb
      .from("storage.policies")
      .insert([p]);

    if (error) {

      if (error.code === "23505") {
        console.log(`[${bucket}] policy ${p.name} already exists`);
      } else {
        console.error(`[${bucket}] policy ${p.name} failed:`, error.message);
      }

    } else {
      console.log(`[${bucket}] policy ${p.name} added`);
    }

  }

}

console.log("\nDone. anonKey public read check:");

const anon = createClient(url, anonKey);

for (const bucket of buckets) {

  const res = await anon.storage.from(bucket).upload(
    "test-" + Date.now() + ".txt",
    new Blob(["ok"]),
    { contentType: "text/plain" }
  );

  console.log(`[${bucket}] anon upload ->`, res.error
    ? res.error.message
    : "OK");
}
