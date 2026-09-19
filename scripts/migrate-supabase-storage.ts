import { Client } from "pg";
import { createClient } from "@supabase/supabase-js";
import { uploadProjectFileByKey } from "../lib/storage";

async function main() {
  const databaseUrl = process.env.SUPABASE_MIGRATION_DATABASE_URL;
  const supabaseUrl = process.env.SUPABASE_MIGRATION_URL;
  const supabaseServiceKey = process.env.SUPABASE_MIGRATION_SERVICE_KEY;

  if (!databaseUrl || !supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Set SUPABASE_MIGRATION_DATABASE_URL, SUPABASE_MIGRATION_URL, and SUPABASE_MIGRATION_SERVICE_KEY.",
    );
  }

  const pgClient = new Client({ connectionString: databaseUrl });
  await pgClient.connect();

  const result = await pgClient.query(
    `SELECT name FROM storage.objects WHERE bucket_id = 'projects'`,
  );

  await pgClient.end();

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  const objects = result.rows.map((row) => row.name as string);
  console.log(`Found ${objects.length} objects to migrate.`);

  for (const key of objects) {
    const { data, error } = await supabase.storage
      .from("projects")
      .download(key);

    if (error || !data) {
      console.error(`Failed to download ${key}:`, error);
      continue;
    }

    const content = await data.text();
    await uploadProjectFileByKey(key, content);
    console.log(`Migrated ${key}`);
  }

  console.log("Storage migration complete.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
