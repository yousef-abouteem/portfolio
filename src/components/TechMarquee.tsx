import { prisma } from "@/lib/prisma";

export default async function TechMarquee() {
  const groups = await prisma.skillGroup.findMany({
    orderBy: { sortOrder: "asc" },
    select: { skills: true },
  });

  const skills = Array.from(new Set(groups.flatMap((g) => g.skills)));
  if (skills.length === 0) return null;

  const items = skills.length < 12 ? [...skills, ...skills] : skills;

  return (
    <div
      dir="ltr"
      className="relative overflow-hidden border-y border-border py-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      <div className="marquee-track flex w-max animate-[marquee_40s_linear_infinite]">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 gap-3 pr-3"
          >
            {items.map((skill, i) => (
              <li
                key={`${skill}-${i}`}
                className="whitespace-nowrap rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
              >
                {skill}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
