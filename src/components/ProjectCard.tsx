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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-foreground/20">
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
                className="cursor-default rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground transition duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-muted hover:text-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-sm font-medium">
          <Link
            href={href}
            className="group/link inline-flex items-center gap-2 rounded-full bg-foreground px-3.5 py-1.5 text-background transition hover:opacity-90"
          >
            {labels.details}
            <span className="inline-block transition group-hover/link:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover/link:-translate-x-0.5">→</span>
          </Link>
          {liveUrl && (
            <a href={liveUrl} className="group/link inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 transition hover:border-foreground/20 hover:bg-muted">
              <svg className="size-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              {labels.live}
            </a>
          )}
          {repoUrl && (
            <a href={repoUrl} className="group/link inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 transition hover:border-foreground/20 hover:bg-muted">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
              </svg>
              {labels.code}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
