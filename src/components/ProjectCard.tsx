import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Props = {
  slug: string;
  title: string;
  summary: string;
  coverImage: string | null;
  techStack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  labels: { live: string; code: string; details: string };
};

export default function ProjectCard({
  slug,
  title,
  summary,
  coverImage,
  techStack,
  liveUrl,
  repoUrl,
  labels,
}: Props) {
  const href = `/projects/${slug}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-foreground/20">
      <Link
        href={href}
        className="relative block aspect-video overflow-hidden border-b border-border bg-muted"
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-5xl font-semibold text-muted-foreground/30">
            {title.charAt(0)}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">
            <Link href={href} className="transition hover:text-accent">
              {title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {summary}
          </p>
        </div>

        {techStack.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center gap-5 pt-2 text-sm font-medium">
          <Link href={href} className="transition hover:text-accent">
            {labels.details}{" "}
            <span className="inline-block rtl:-scale-x-100">→</span>
          </Link>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent transition hover:opacity-80"
            >
              {labels.live} ↗
            </a>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition hover:text-foreground"
            >
              {labels.code}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
