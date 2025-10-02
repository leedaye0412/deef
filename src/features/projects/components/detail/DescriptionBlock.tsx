"use client";

import type { ProjectDetail } from "@/features/projects/api/client";

type Props = { project: ProjectDetail };

export default function DescriptionBlock({ project }: Props) {
  if (!project.description) return null;

  return (
    <section>
      <div className="mx-auto max-w-[1000px] px-6 sm:px-10 py-10 sm:py-14">
        <p
          className="text-center text-white/90 text-base sm:text-lg leading-7 sm:leading-8 tracking-wide whitespace-pre-line"
          style={{ letterSpacing: "0.02em" }}
        >
          {project.description}
        </p>
      </div>
    </section>
  );
}
