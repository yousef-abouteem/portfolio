import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.experience.upsert({
    where: { id: "education-nisantasi" },
    update: {},
    create: {
      id: "education-nisantasi",
      type: "education",
      startDate: new Date("2021-10-01"),
      endDate: new Date("2026-07-01"),
      translations: {
        create: [
          {
            locale: "en",
            title: "B.Sc. Software Engineering",
            organization: "Nişantaşı University",
            location: "Istanbul, Türkiye",
          },
          {
            locale: "ar",
            title: "بكالوريوس هندسة البرمجيات",
            organization: "جامعة نيشانتاشي",
            location: "إسطنبول، تركيا",
          },
          {
            locale: "tr",
            title: "Yazılım Mühendisliği Lisans",
            organization: "Nişantaşı Üniversitesi",
            location: "İstanbul, Türkiye",
          },
        ],
      },
    },
  });

  const groups = [
    {
      id: "frontend",
      sortOrder: 1,
      skills: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML & CSS"],
      names: { en: "Frontend", ar: "الواجهات الأمامية", tr: "Ön Yüz" },
    },
    {
      id: "backend",
      sortOrder: 2,
      skills: ["Node.js", "Express", "PostgreSQL", "Prisma", "REST APIs"],
      names: { en: "Backend & Data", ar: "الخلفية وقواعد البيانات", tr: "Arka Uç ve Veri" },
    },
    {
      id: "tools",
      sortOrder: 3,
      skills: ["Git", "GitHub", "Vercel", "VS Code"],
      names: { en: "Tools", ar: "الأدوات", tr: "Araçlar" },
    },
  ] as const;

  for (const group of groups) {
    await prisma.skillGroup.upsert({
      where: { id: group.id },
      update: {},
      create: {
        id: group.id,
        sortOrder: group.sortOrder,
        skills: [...group.skills],
        translations: {
          create: (["en", "ar", "tr"] as const).map((locale) => ({
            locale,
            name: group.names[locale],
          })),
        },
      },
    });
  }

  console.log("About seed completed ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
