import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.profile.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      githubUrl: "https://github.com/YousefAbouteem",
      translations: {
        create: [
          {
            locale: "en",
            headline: "Frontend Developer",
            bio: "Software engineering graduate building modern web apps with React, Next.js and TypeScript.",
          },
          {
            locale: "ar",
            headline: "مطوّر واجهات أمامية",
            bio: "خريج هندسة برمجيات، أبني تطبيقات ويب حديثة باستخدام React وNext.js وTypeScript.",
          },
          {
            locale: "tr",
            headline: "Frontend Geliştirici",
            bio: "React, Next.js ve TypeScript ile modern web uygulamaları geliştiren yazılım mühendisliği mezunu.",
          },
        ],
      },
    },
  });

  await prisma.project.upsert({
    where: { slug: "gym-booking" },
    update: {},
    create: {
      slug: "gym-booking",
      techStack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL"],
      published: true,
      featured: true,
      sortOrder: 1,
      translations: {
        create: [
          {
            locale: "en",
            title: "Gym Class Booking Platform",
            summary: "A multi-gym platform where members book class spots.",
            description: "Full-stack platform where each gym owner manages their own classes and members book available spots.",
          },
          {
            locale: "ar",
            title: "منصة حجز كلاسات الجيم",
            summary: "منصة لعدة صالات رياضية يحجز فيها الأعضاء أماكنهم في الكلاسات.",
            description: "منصة متكاملة يدير فيها كل صاحب جيم كلاساته، ويحجز الأعضاء الأماكن المتاحة.",
          },
          {
            locale: "tr",
            title: "Spor Salonu Ders Rezervasyon Platformu",
            summary: "Üyelerin derslerde yer ayırttığı çoklu spor salonu platformu.",
            description: "Her spor salonu sahibinin kendi derslerini yönettiği ve üyelerin boş yerleri ayırttığı full-stack platform.",
          },
        ],
      },
    },
  });

  console.log("Seed completed ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());