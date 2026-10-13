import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import type { ProfileInput } from "@/lib/validations/profile";
import ProfileForm from "./ProfileForm";

type Locale = "en" | "ar" | "tr";

export default async function ProfilePage() {
  await requireAdmin();

  const profile = await prisma.profile.findUnique({
    where: { id: "main" },
    include: { translations: true },
  });

  const translationFor = (locale: Locale) => {
    const tr = profile?.translations.find((x) => x.locale === locale);
    return {
      headline: tr?.headline ?? "",
      bio: tr?.bio ?? "",
    };
  };

  const initialValues: ProfileInput = {
    email: profile?.email ?? "",
    githubUrl: profile?.githubUrl ?? "",
    linkedinUrl: profile?.linkedinUrl ?? "",
    cvUrl: profile?.cvUrl ?? "",
    translations: {
      en: translationFor("en"),
      ar: translationFor("ar"),
      tr: translationFor("tr"),
    },
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <ProfileForm initialValues={initialValues} />
    </main>
  );
}