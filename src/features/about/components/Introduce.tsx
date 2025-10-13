import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "DEEF의 방향과 디자인 철학",
};

export default function Introduce() {
  const aboutImg = "/people.jpg";

  return (
    <main>
      <section>
        <div className="flex flex-col-reverse my-10 md:my-10 md:flex-row gap-5 md:gap-50 font-pretendard">
          <article className="flex flex-1">
            <div className="text-11 leading-[22px] space-y-6 text-justify">
              <p>공간디자인스튜디오 DEEF 고상영, 현영식 대표 입니다.</p>
              <p>
                돌이켜보니 우리는 ‘클라이언트만의 이야기’가 담긴 공간을 내어드릴 때 가장 큰 보람을
                느꼈던 것 같습니다. 단순히 키워드로만 존재하는 것이 아니라 그 공간만이 가질 수 있는
                풍성하고 고유한 이야기라고 설명을 덧붙일 수 있겠습니다. 물론 미적으로, 기능적으로
                만족을 드리는 것은 기본적으로 저 희가 이뤄내는 일이라고 말할 수 있어야 합니다.
              </p>
              <p>
                우리는 추상적이거나 간접적인 이미지들에 매력을 느꼈고, 공간을 경험하며, 그
                이미지들이 중첩되어 보이길 바랐습니다. 공간을 목격하기 전, 진입하는 동선, 머무르는
                순간 그리고 공간을 나가고 회상하는 등 이 모든 과정에 대해 고민하고 연계하여
                디자인한다면, 분명히 깊은 여운과 울림 그리고 감동이 형성될 것이라 확신했습니다.
              </p>
              <p>
                상상만으로도 행복한, 우리가 만들고 싶었던 공간을 요약해 보니 ‘기승전결’의 흐름이
                있는 공간이라고 표현할 수 있었습니다. 그 순간 우리는 브랜드 아이덴티티를 Direction
                guidance, Expending, Ending hint and Finding(기승전결)으로 설정했고 단어별 앞 글자를
                따서 DEEF(디프) 라는 상호를 만들게 되었습니다. 사실 기승전결을 영어 사전에 검색하면
                위와 다른 문장이 나오지만, 의미가 같은 단어를 수백 가지 나열 하여 우리의 분위기와
                어울리는 브랜드명을 창조했습니다.
              </p>
              <p>
                최근 다양한 클라이언트를 만나며 ‘사람마다, 공간마다 다 다르구나’를 느낍니다. 그
                덕분에 ‘우리가 써 내려갈 이야기들이 참 많겠구나’라고 생각되어 기쁩니다. 그리고
                우리의 디자인 접근 방식은 그들의 공간에 강하게 몰입하는 타입이기에 클라이언트와의
                유대감이나 연대감 역시 끈끈하게 형성되어 즐거움도 큽니다.
              </p>
              <p>
                디자인에 정답은 없기에 우리는 이러한 공간을 사랑하고 꾸준히 만들어 갈 것이며,
                클라이언트와 더 많은 공감대를 형성하고 싶다는 말을 전하고 싶습니다. 앞으로도
                진심으로 진정성 있는 이야기와 매력적인 디자인들로 겸손하게 작업 이어가겠습니다.
              </p>
            </div>
          </article>

          <figure className="flex-1 items-center justify-center">
            <Image
              src={aboutImg}
              width={2048}
              height={1365}
              alt="DEEF Studio"
              className="w-full h-auto rounded-md bg-neutral-900"
              priority
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </figure>
        </div>
      </section>
    </main>
  );
}
