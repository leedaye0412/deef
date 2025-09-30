import { Instagram } from "lucide-react";
import Image from "next/image";

type Cta = { label: string; href: string };

const INFO: Cta[] = [
  {
    label: "VISIT STUDIO",
    href: "https://map.naver.com/p/entry/place/1658806405?c=15.00,0,0,0,dh",
  },
  { label: "EMAIL US", href: "mailto:designstudio.DEEF@gmail.com" },
];

const SOCIAL: Cta[] = [
  {
    label: "FOLLOW ON INSTAGRAM",
    href: "https://www.instagram.com/designstudio.deef/",
  },
  {
    label: "WATCH ON YOUTUBE",
    href: "https://www.youtube.com/channel/UCjdMYkq5E_TjJmFwDu2nwBQ",
  },
  { label: "READ THE BLOG", href: "https://blog.naver.com/deefdesignstudio" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-black text-white px-layout-x-mobile md:px-layout-x-desktop">
      <div className="py-10 md:py-14">
        {/* info */}
        <div className="flex flex-col text-center gap-10 md:text-start">
          <div className="flex flex-col">
            {INFO.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-12 tracking-widest opacity-90 transition-opacity hover:opacity-100"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* socials */}
          <div className="flex flex-col">
            {SOCIAL.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-12 tracking-widest opacity-90 transition-opacity hover:opacity-100"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Center logo bar */}
        <div className="mt-10 rounded-sm bg-black">
          <div className="flex h-20 items-center justify-center">
            <span className="text-2xl font-extrabold tracking-wide md:text-3xl">DEEF</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#333]">
        <div className="mx-auto flex justify-between gap-4 py-6 text-xs">
          <p>© {year}, DEEF All Rights Reserved.</p>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/designstudio.deef/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCjdMYkq5E_TjJmFwDu2nwBQ"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <Image src="/youtube.png" alt="YouTube" width={16} height={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
