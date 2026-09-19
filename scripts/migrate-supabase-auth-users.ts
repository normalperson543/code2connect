import { Client } from "pg";
import prisma from "../app/lib/db";

async function main() {
  const sourceUrl = process.env.SUPABASE_MIGRATION_DATABASE_URL;
  if (!sourceUrl) {
    throw new Error(
      "Set SUPABASE_MIGRATION_DATABASE_URL to your old Supabase Postgres database URL.",
    );
  }

  const client = new Client({ connectionString: sourceUrl });
  await client.connect();

  const result = await client.query(`
    SELECT
      id,
      email,
      email_confirmed_at,
      raw_user_meta_data ->> 'name' AS name,
      raw_user_meta_data ->> 'avatar_url' AS image
    FROM auth.users
  `);

  await client.end();

  const users = result.rows.map((row) => ({
    id: row.id as string,
    email: row.email as string,
    name: (row.name as string | null) ?? undefined,
    image: (row.image as string | null) ?? undefined,
    emailVerified: row.email_confirmed_at != null,
    createdAt: row.email_confirmed_at
      ? new Date(row.email_confirmed_at)
      : new Date(),
    updatedAt: new Date(),
  }));

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log(`Migrated ${users.length} Supabase auth users.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
