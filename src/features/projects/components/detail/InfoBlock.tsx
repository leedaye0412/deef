"use client";

import type { ProjectDetail } from "@/features/projects/api/client";
import Link from "next/link";

type Props = { project: ProjectDetail };

const Row = ({ label, value }: { label: string; value?: string | number | null }) =>
  value ? (
    <p className="text-12 leading-relaxed">
      <span >{label}</span>
      <span className="mx-1">|</span>
      <span >{value}</span>
    </p>
  ) : null;

export default function InfoBlock({ project }: Props) {
  return (
    <section className="text-start md:text-center mb-20 ">
      <div className="mx-auto max-w-[1400px] py-6 sm:py-8">
        <div className="grid">
          <Row label="project" value={project.name ?? null} />
          <Row label="type" value={project.type ?? null} />
          <Row label="year" value={project.year ?? null} />
          <Row label="area" value={project.area ? `${project.area}py` : null} />
          <Row label="photo" value={project.photo ?? null} />
          <Row label="location" value={project.location ?? null} />
          {project.blogUrl ? (
            <p className="text-12">
              <span>blog</span>
              <span className="mx-1 ">|</span>
              <Link href={project.blogUrl} target="_blank" className=" hover:decoration-white">
                deefdesignstudio
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
