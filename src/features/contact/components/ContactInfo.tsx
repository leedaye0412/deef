import Link from "next/link";

export default function ContactInfo() {
  return (
    <section className="w-full ">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="py-16 md:py-0 md:min-h-[80svh] md:grid md:place-content-center">
          <div className="space-y-5 md:space-y-8 text-start">
            {/* MOBILE 1 */}
            <div className="MOBILE1">
              <h3 className="uppercase tracking-widest font-extrabold md:text-18">MOBILE</h3>
              <div className="space-y-1.5">
                <p className="text-18 md:text-18">Sang-young Ko, Co-CEO</p>
                <a
                  href="tel:+821030216642"
                  className="inline-block opacity-90 hover:opacity-100 md:text-18"
                >
                  +82 10-3021-6642
                </a>
              </div>
            </div>

            {/* MOBILE 2 */}
            <div className="MOBILE2">
              <h3 className="uppercase tracking-widest font-extrabold md:text-18">MOBILE</h3>
              <div className="space-y-1.5">
                <p className="md:text-18">Young-sik Hyun, Co-CEO</p>
                <a
                  href="tel:+821044369699"
                  className="inline-block opacity-90 hover:opacity-100 md:text-18"
                >
                  +82 10-4436-9699
                </a>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="ADDRESS">
              <h3 className="uppercase tracking-widest font-extrabold md:text-18">ADDRESS</h3>
              <a
                href="https://map.naver.com/p/entry/place/1658806405?c=15.00,0,0,0,dh"
                className="inline-block opacity-90 hover:opacity-100 md:text-18"
                target="_blank"
                rel="noopener noreferrer"
              >
                4F, 413 Ttukseom-ro, Seongdong-gu
              </a>
            </div>

            {/* EMAIL */}
            <div className="EMAIL">
              <h3 className="uppercase tracking-widest font-extrabold md:text-18">EMAIL</h3>
              <a
                href="mailto:designstudio.DEEF@gmail.com"
                className="inline-block break-all opacity-90 hover:opacity-100 md:text-18"
              >
                designstudio.DEEF@gmail.com
              </a>
            </div>

            {/* INSTAGRAM */}
            <div className="INSTAGRAM">
              <h3 className="uppercase tracking-widest font-extrabold md:text-18">INSTAGRAM</h3>
              <Link
                href="https://instagram.com/designstudio.deef"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block opacity-90 hover:opacity-100 md:text-18"
              >
                instagram.com/designstudio.deef
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
