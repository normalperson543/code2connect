import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import prisma from "@/app/lib/db";

async function generateUsername(email: string, name?: string | null) {
  const base = name
    ? name.toLowerCase().replace(/[^a-z0-9]/g, "")
    : email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");

  let username = base || "user";
  let suffix = 0;

  while (await prisma.profile.findUnique({ where: { username } })) {
    suffix += 1;
    username = `${base}${suffix}`;
  }

  return username;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: false,
  },
  accountLinking: {
    enabled: true,
    trustedProviders: ["github"],
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const existingProfile = await prisma.profile.findUnique({
            where: { id: user.id },
          });
          if (!existingProfile) {
            const username = await generateUsername(user.email, user.name);
            await prisma.profile.create({
              data: {
                id: user.id,
                username,
              },
            });
          }
        },
      },
    },
  },
  advanced: {
    database: {
      joins: true,
    },
  },
});
