// app/projects/[id]/page.tsx
import { use } from "react";
import ProjectDetailClient from "./ProjectDetailClient";


type Params = { id: string };
export default function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = use(params);
  return <ProjectDetailClient id={Number(id)} />;
}
