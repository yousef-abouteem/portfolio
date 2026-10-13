import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

  if (!session || session.user.email.toLowerCase() !== adminEmail) {
    redirect("/admin/login");
  }

  return session;
}