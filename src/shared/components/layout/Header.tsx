"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, X, Menu } from "lucide-react";
import { useProjects } from "@features/projects/api/hooks";

type NavItem = { label: string; href: string };
const NAV: NavItem[] = [
  { label: "ABOUT", href: "/about" },
  { label: "PROJECTS", href: "/projects" },
  { label: "CONTACT", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"root" | "projects">("root");
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  // 프로젝트 목록 (API)
  const { data: projects, isLoading, isError, refetch } = useProjects();

  // 프리뷰(상단 썸네일) 상태
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewAlt, setPreviewAlt] = useState<string>("");

  const openMenu = () => {
    setView("root"); // ★ 먼저 루트로 세팅
    setOpen(true); // 그 다음 열기
  };
  const closeMenu = () => {
    setView("root"); // ★ 닫을 때도 루트로 리셋
    setOpen(false);
  };

  // 데이터가 들어오면 landCover 있는 첫 항목으로 초기화
  useEffect(() => {
    if (!projects?.length) return;
    const firstWithCover = projects.find((p) => !!p.landCover) ?? projects[0];
    setPreviewSrc(firstWithCover.landCover ?? null);
    setPreviewAlt(firstWithCover.name);
  }, [projects]);

  // 메뉴 열릴 때 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // ESC로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => firstLinkRef.current?.focus());
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const goProject = (id: number) => {
    setOpen(false);
    router.push(`/projects/${id}`);
  };

  const iconProps = {
    className: "h-5 w-5 [stroke-width:1.75] shrink-0",
    "aria-hidden": true as const,
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black text-white">
      <div className="mx-auto flex h-14 items-center justify-between px-layout-x-mobile md:px-layout-x-desktop">
        <Link href="/" className="font-extrabold tracking-wide text-24">
          DEEF
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-12 transition-colors ${isActive(item.href) ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => (open ? closeMenu() : openMenu())}
          className="relative -mr-1 inline-flex h-6 w-6 items-center justify-center md:hidden
                     rounded-md opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 cursor-pointer focus:ring-white/40"
        >
          <span className="sr-only">{open ? "메뉴 닫기" : "메뉴 열기"}</span>
          {open ? <X {...iconProps} /> : <Menu {...iconProps} />}
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        aria-hidden={!open}
        className={`md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          onClick={closeMenu}
          className={`fixed inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        />

        <nav
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          className={`fixed right-0 top-0 h-full w-[88%] max-w-[420px] bg-black/95 backdrop-blur transition-transform duration-200 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="relative h-full w-full overflow-hidden">
            {/* ROOT */}
            <section
              className={`absolute inset-0 px-2 transition-transform duration-200 ${
                view === "root" ? "translate-x-0" : "-translate-x-full"
              }`}
              aria-hidden={view !== "root"}
            >
              <div className="flex h-14 items-center justify-end px-2">
                <button
                  aria-label="메뉴 닫기"
                  className="h-6 w-6 opacity-80 hover:opacity-100 cursor-pointer"
                  onClick={closeMenu}
                >
                  <span className="sr-only">닫기</span>
                  <div className="relative mx-auto h-[2px] w-6 rotate-45 bg-white after:absolute after:left-0 after:top-0 after:h-[2px] after:w-6 after:-rotate-90 after:bg-white" />
                </button>
              </div>

              <ul className="mt-2 space-y-1">
                <li>
                  <Link
                    ref={firstLinkRef}
                    href="/about"
                    onClick={closeMenu}
                    className="block rounded px-4 py-4 tracking-wide opacity-80 hover:opacity-100"
                  >
                    ABOUT
                  </Link>
                </li>

                {/* PROJECTS → 서브패널 */}
                <li>
                  <button
                    onClick={() => setView("projects")}
                    className="flex w-full items-center justify-between rounded px-4 py-4 tracking-wide opacity-80 hover:opacity-100 cursor-pointer"
                    aria-haspopup="dialog"
                    aria-controls="mobile-panel-projects"
                  >
                    <span>PROJECTS</span>
                    <ChevronRight {...iconProps} />
                  </button>
                </li>

                <li>
                  <Link
                    href="/contact"
                    onClick={closeMenu}
                    className="block rounded px-4 py-4 tracking-wide opacity-80 hover:opacity-100"
                  >
                    CONTACT
                  </Link>
                </li>
              </ul>
            </section>

            {/* PROJECTS 서브패널 */}
            <section
              id="mobile-panel-projects"
              className={`absolute inset-0 transition-transform duration-200 ${
                view === "projects" ? "translate-x-0" : "translate-x-full"
              }`}
              aria-hidden={view !== "projects"}
            >
              {/* 상단 바 */}
              <div className="flex h-14 items-center justify-between px-3">
                <button
                  onClick={() => setView("root")}
                  aria-label="뒤로"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
                >
                  <ChevronLeft {...iconProps} />
                </button>
                <div className="text-17 font-bold tracking-widest">PROJECTS</div>
                <button
                  onClick={closeMenu}
                  aria-label="닫기"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
                >
                  <X {...iconProps} />
                </button>
              </div>

              {/* 썸네일 프리뷰 (landCover) */}
              <div className="px-3 pt-5 mt-10 border-t border-white">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {isLoading ? (
                    <div className="absolute inset-0 animate-pulse bg-white/5" />
                  ) : previewSrc ? (
                    <Image
                      src={previewSrc}
                      alt={previewAlt || "Project cover"}
                      fill
                      sizes="(max-width: 420px) 88vw, 420px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-12 text-white/50">
                      No cover
                    </div>
                  )}
                </div>
              </div>

              {/* 프로젝트 리스트 (API 데이터) */}
              <ul className="mt-4">
                {isLoading &&
                  Array.from({ length: 7 }).map((_, i) => (
                    <li key={i} className="px-3">
                      <div className="h-12 animate-pulse bg-white/5 rounded" />
                    </li>
                  ))}

                {isError && (
                  <li className="px-3">
                    <div className="flex items-center justify-between py-4 text-sm text-red-300">
                      <span>목록을 불러오지 못했어요.</span>
                      <button onClick={() => refetch()} className="underline">
                        다시 시도
                      </button>
                    </div>
                  </li>
                )}

                {projects?.map((p) => (
                  <li key={p.projectId} className="px-3">
                    <button
                      onClick={() => goProject(p.projectId)}
                      onMouseEnter={() => {
                        if (p.landCover) {
                          setPreviewSrc(p.landCover);
                          setPreviewAlt(p.name);
                        }
                      }}
                      onFocus={() => {
                        if (p.landCover) {
                          setPreviewSrc(p.landCover);
                          setPreviewAlt(p.name);
                        }
                      }}
                      className="flex w-full items-center justify-between py-4 text-left opacity-80 hover:opacity-100 cursor-pointer"
                    >
                      <span>{p.name}</span>
                      <ChevronRight {...iconProps} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </nav>
      </div>
    </header>
  );
}
