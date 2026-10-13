import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
          if (!adminEmail || user.email.toLowerCase() !== adminEmail) {
            console.warn(`[auth] Blocked sign-in attempt: ${user.email}`);
            return false;
          }
          return { data: user };
        },
      },
    },
  },

  plugins: [nextCookies()],
});