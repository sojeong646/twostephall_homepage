'use client';

import { useState, useEffect, useRef } from 'react';

// 섹션 ID 정의
const SECTIONS = [
  { id: 'hero', label: '홈' },
  { id: 'branches', label: '지점소개' },
  { id: 'location', label: '위치안내' },
  { id: 'pricing', label: '가격안내' },
  { id: 'how-to', label: '대관방법' },
  { id: 'status', label: '대관현황' },
  { id: 'rules', label: '이용규정' },
  { id: 'refund', label: '환불규정' },
  { id: 'faq', label: 'FAQ' },
];

// 스크롤 시 나타나는 애니메이션 훅
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// 섹션 래퍼 컴포넌트
function Section({ id, className = '', children }: { id: string; className?: string; children: React.ReactNode }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <section id={id} ref={ref} className={`${className} ${isVisible ? 'fade-in-up' : 'opacity-0'}`}>
      {children}
    </section>
  );
}

// 섹션 제목 컴포넌트
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-[#B8956A] text-sm md:text-base">{subtitle}</p>}
    </div>
  );
}

// FAQ 아코디언 항목 (클릭 시 답변 펼침)
function FaqItem({ q, children }: { q: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-5 text-left"
      >
        <span className="text-base md:text-lg font-bold text-gray-900">
          <span className="text-[#B8956A]">Q.</span> {q}
        </span>
        <svg
          width="20" height="20" viewBox="0 0 20 20" fill="none"
          className={`shrink-0 text-[#B8956A] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm leading-relaxed text-gray-600">{children}</div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setNavOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FAF4EA] via-white to-[#F5EADB]">
      {/* 배경 글로우 — 예약 시스템과 동일 스타일 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#E3CFB4]/50 blur-3xl" />
        <div className="absolute top-40 -right-20 w-80 h-80 rounded-full bg-[#EADFCB]/60 blur-3xl" />
        <div className="absolute bottom-40 left-10 w-72 h-72 rounded-full bg-[#E3CFB4]/40 blur-3xl" />
        <div className="absolute top-[60%] right-[10%] w-64 h-64 rounded-full bg-[#EADFCB]/40 blur-3xl" />
      </div>

      {/* 네비게이션 */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-sm' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-symbol.png" alt="" className="h-7 w-auto" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wordmark.png" alt="투스텝홀" className="h-4 w-auto" />
          </button>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex gap-6">
            {SECTIONS.slice(1).map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* 모바일 햄버거 */}
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          >
            <span className="w-5 h-0.5 bg-[#8B6F47]" />
            <span className="w-5 h-0.5 bg-[#8B6F47]" />
            <span className="w-5 h-0.5 bg-[#8B6F47]" />
          </button>
        </div>

        {/* 모바일 드롭다운 */}
        {navOpen && (
          <div className="md:hidden glass-nav border-t border-white/40 px-4 py-3">
            {SECTIONS.slice(1).map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="block w-full text-left py-2.5 text-sm text-gray-500 hover:text-gray-900 font-medium"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* 히어로 섹션 */}
      <section id="hero" className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center rise-in">
          <div className="flex flex-col items-center mb-4 rise-in">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-symbol.png" alt="" className="h-28 md:h-36 w-auto mb-5" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wordmark.png" alt="투스텝홀" className="h-9 md:h-12 w-auto" />
          </div>
          <p className="text-xl md:text-3xl font-semibold text-[#B8956A] mb-2 rise-in-delay-1">
            무용연습실 투스텝홀
          </p>
          <p className="text-base md:text-lg text-gray-400 mb-10 rise-in-delay-2">
            한 번을 연습해도 제대로
          </p>
          <button
            onClick={() => scrollTo('branches')}
            className="rise-in-delay-3 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-[#EADBC4] to-[#D7BD96] text-gray-900 text-sm font-bold shadow-md hover:shadow-lg transition-shadow"
          >
            둘러보기
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M8 13l4-4M8 13l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* 지점소개 */}
      <Section id="branches" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="지점소개" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">방배점</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/branch-bangbae.jpg" alt="투스텝홀 방배점 내부" className="w-full h-56 object-cover rounded-2xl" />
              <ul className="mt-5 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-[#B8956A] font-bold shrink-0">✓</span>40평대 넓고 높은 단독홀</li>
                <li className="flex gap-2"><span className="text-[#B8956A] font-bold shrink-0">✓</span>최고급 댄스플로어 시공</li>
                <li className="flex gap-2"><span className="text-[#B8956A] font-bold shrink-0">✓</span>건물 앞 자주식 주차 한 대 가능</li>
                <li className="flex gap-2"><span className="text-[#B8956A] font-bold shrink-0">✓</span>쾌적한 대기공간과 탈의실</li>
                <li className="flex gap-2"><span className="text-[#B8956A] font-bold shrink-0">✓</span>탄쯔 발레바</li>
              </ul>
            </div>
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">서초점</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/branch-seocho.jpg" alt="투스텝홀 서초점 내부" className="w-full h-56 object-cover rounded-2xl" />
              <ul className="mt-5 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-[#B8956A] font-bold shrink-0">✓</span>50평대 넓고 높은 단독홀</li>
                <li className="flex gap-2"><span className="text-[#B8956A] font-bold shrink-0">✓</span>최고급 댄스플로어 시공</li>
                <li className="flex gap-2"><span className="text-[#B8956A] font-bold shrink-0">✓</span>건물 앞 자주식 주차 가능</li>
                <li className="flex gap-2"><span className="text-[#B8956A] font-bold shrink-0">✓</span>넓고 카페같은 대기공간과 탈의실</li>
                <li className="flex gap-2"><span className="text-[#B8956A] font-bold shrink-0">✓</span>깔끔한 내부 화장실</li>
                <li className="flex gap-2"><span className="text-[#B8956A] font-bold shrink-0">✓</span>파드샤 발레바</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* 위치안내 */}
      <Section id="location" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="위치안내" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-center tracking-tight">방배점</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/location-bangbae.png" alt="투스텝홀 방배점 찾아오는 길" className="w-full h-auto rounded-2xl" />
              <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-gray-600">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8956A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                서울특별시 서초구 효령로27길 41 지하1층
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <a
                  href="https://naver.me/GZZS7eVS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-br from-[#06CE63] to-[#02A24A] text-white text-xs font-bold shadow-sm hover:brightness-105 transition"
                >
                  네이버 지도
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a
                  href="https://kko.to/H1C4THn-W3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-br from-[#FFE94A] to-[#F4D200] text-[#3C1E1E] text-xs font-bold shadow-sm hover:brightness-105 transition"
                >
                  카카오맵
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a
                  href="https://tmap.life/0f774d2f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-br from-[#3385FF] to-[#0053DD] text-white text-xs font-bold shadow-sm hover:brightness-105 transition"
                >
                  T맵
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            </div>
            <div className="glass-card p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-center tracking-tight">서초점</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/location-seocho.png" alt="투스텝홀 서초점 찾아오는 길" className="w-full h-auto rounded-2xl" />
              <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-gray-600">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8956A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                서울특별시 서초구 서초중앙로12길 35 지하1층
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <a
                  href="https://naver.me/5KqdE3ql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-br from-[#06CE63] to-[#02A24A] text-white text-xs font-bold shadow-sm hover:brightness-105 transition"
                >
                  네이버 지도
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a
                  href="https://kko.to/9lwdmEgO0a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-br from-[#FFE94A] to-[#F4D200] text-[#3C1E1E] text-xs font-bold shadow-sm hover:brightness-105 transition"
                >
                  카카오맵
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a
                  href="https://tmap.life/f1b6d759"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gradient-to-br from-[#3385FF] to-[#0053DD] text-white text-xs font-bold shadow-sm hover:brightness-105 transition"
                >
                  T맵
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 가격안내 */}
      <Section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="가격안내" subtitle="시간당 대관료" />
          <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl mb-2">🌅</div>
              <div className="text-sm font-bold text-[#8B6F47]">오전</div>
              <div className="text-xs text-gray-400 mb-4">06시 ~ 12시</div>
              <div className="text-2xl font-bold text-gray-900">14,000<span className="text-base font-medium text-gray-500">원</span></div>
              <div className="text-xs text-gray-400 mt-1">시간당</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl mb-2">☀️</div>
              <div className="text-sm font-bold text-[#8B6F47]">오후</div>
              <div className="text-xs text-gray-400 mb-4">12시 ~ 24시</div>
              <div className="text-2xl font-bold text-gray-900">16,000<span className="text-base font-medium text-gray-500">원</span></div>
              <div className="text-xs text-gray-400 mt-1">시간당</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl mb-2">🌙</div>
              <div className="text-sm font-bold text-[#8B6F47]">새벽</div>
              <div className="text-xs text-gray-400 mb-4">00시 ~ 06시</div>
              <div className="text-2xl font-bold text-gray-900">10,000<span className="text-base font-medium text-gray-500">원</span></div>
              <div className="text-xs text-gray-400 mt-1">시간당</div>
            </div>
          </div>
          <div className="mt-6 glass-card p-6 space-y-2.5">
            <p className="flex gap-2 text-sm text-gray-600 break-keep md:break-normal">
              <span className="text-[#B8956A] font-bold">•</span>
              <span>기본 2시간 이상 예약 가능 <span className="text-gray-400">(단, 예약과 예약 사이 1시간은 가능)</span></span>
            </p>
            <p className="flex gap-2 text-sm text-gray-600 break-keep md:break-normal">
              <span className="text-[#B8956A] font-bold">•</span>
              <span>5인 초과 시 인당 · 시간당 <span className="font-semibold text-gray-800">2,000원</span> 추가</span>
            </p>
            <p className="flex gap-2 text-sm text-gray-600 break-keep md:break-normal">
              <span className="text-[#B8956A] font-bold">•</span>
              <span>장기대관, 상업용 촬영은 별도 문의</span>
            </p>
          </div>
        </div>
      </Section>

      {/* 대관방법 */}
      <Section id="how-to" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="대관방법" subtitle="이렇게 신청하세요" />
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="glass-card p-6 flex gap-4 items-start">
              <div className="shrink-0 w-9 h-9 rounded-full bg-[#E3CFB4] text-[#6B5336] font-bold flex items-center justify-center text-sm">1</div>
              <div className="flex-1 pt-1.5">
                <p className="font-semibold text-gray-900">실시간 예약현황 확인하기</p>
                <button
                  onClick={() => scrollTo('status')}
                  className="mt-3 inline-flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-br from-[#F2A45C] to-[#E27A4F] text-white text-xs font-bold shadow-md hover:shadow-lg transition-shadow"
                >
                  대관현황 확인하기
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>

            <div className="glass-card p-6 flex gap-4 items-start">
              <div className="shrink-0 w-9 h-9 rounded-full bg-[#E3CFB4] text-[#6B5336] font-bold flex items-center justify-center text-sm">2</div>
              <div className="flex-1 pt-1.5">
                <p className="font-semibold text-gray-900">아래에서 바로 대관 신청하기</p>
                <div className="mt-3 flex flex-col sm:flex-row items-start gap-3">
                  <a
                    href="https://status.twostephall.com/booking?branch=bangbae"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-full bg-gradient-to-br from-[#F2A45C] to-[#E27A4F] text-white text-xs font-bold shadow-md hover:shadow-lg transition-shadow"
                  >
                    방배점 대관신청하기
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                  <a
                    href="https://status.twostephall.com/booking?branch=seocho"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-full bg-gradient-to-br from-[#F2A45C] to-[#E27A4F] text-white text-xs font-bold shadow-md hover:shadow-lg transition-shadow"
                  >
                    서초점 대관신청하기
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 flex gap-4 items-start">
              <div className="shrink-0 w-9 h-9 rounded-full bg-[#E3CFB4] text-[#6B5336] font-bold flex items-center justify-center text-sm">3</div>
              <p className="flex-1 pt-1.5 font-semibold text-gray-900">안내받은 계좌로 대관료 입금하기</p>
            </div>

            <div className="glass-card p-6 flex gap-4 items-start">
              <div className="shrink-0 w-9 h-9 rounded-full bg-[#E3CFB4] text-[#6B5336] font-bold flex items-center justify-center text-sm">4</div>
              <div className="flex-1 pt-1.5">
                <p className="font-semibold text-gray-900">예약확정 및 캘린더 확인하기</p>
                <button
                  onClick={() => scrollTo('status')}
                  className="mt-3 inline-flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-br from-[#F2A45C] to-[#E27A4F] text-white text-xs font-bold shadow-md hover:shadow-lg transition-shadow"
                >
                  대관현황 확인하기
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>

            {/* 문의 안내 — 단계 박스 밖 */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">문의사항이 있으시면 카카오톡 채널로 문의해주세요.</p>
              <a
                href="https://pf.kakao.com/_xmTxgnK"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FEE500] text-[#3C1E1E] text-xs font-bold hover:brightness-95 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#3C1E1E"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7-.2.7-.7 2.6-.8 3-.1.5.2.5.4.4.2-.1 2.6-1.8 3.7-2.5.6.1 1.3.1 2 .1 5.5 0 10-3.6 10-8S17.5 3 12 3z"/></svg>
                카카오톡 채널 바로가기
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* 대관현황 */}
      <Section id="status" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <SectionTitle title="대관현황" subtitle="실시간 예약 현황을 확인하세요" />
          <div className="glass-card p-8 md:p-10 text-center">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-sm text-gray-600 leading-relaxed mb-7">
              방배점 · 서초점의 실시간 예약 현황을 확인하고<br />
              비어 있는 시간을 한눈에 볼 수 있어요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://status.twostephall.com/?branch=bangbae"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-gradient-to-br from-[#F2A45C] to-[#E27A4F] text-white text-sm font-bold shadow-md hover:shadow-lg transition-shadow"
              >
                방배점 대관현황
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <a
                href="https://status.twostephall.com/?branch=seocho"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-gradient-to-br from-[#F2A45C] to-[#E27A4F] text-white text-sm font-bold shadow-md hover:shadow-lg transition-shadow"
              >
                서초점 대관현황
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* 이용규정 */}
      <Section id="rules" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="이용규정" />
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="rounded-3xl bg-red-50 border border-red-200 p-5 flex gap-3 shadow-sm">
              <span className="text-lg shrink-0">⚠️</span>
              <p className="text-sm leading-relaxed text-gray-700 break-keep md:break-normal">
                홀 내 <strong className="font-semibold text-red-700">실외화 · 검정슈즈 · 송진가루 사용은 절대 금지</strong>입니다. 댄스플로어 손상 방지를 위한 조치이며, 위반 시 전문업체 기준으로 <strong className="font-semibold text-red-600">복구 비용 전액이 청구</strong>됩니다.
              </p>
            </div>
            <div className="glass-card p-6">
              <ul className="space-y-3.5 text-sm leading-relaxed text-gray-700 break-keep md:break-normal">
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-sm bg-[#B8956A] shrink-0" />그 외 물품 분실 및 파손 시 전액 배상 및 원상복구가 요구됩니다.</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-sm bg-[#B8956A] shrink-0" /><span>음료 외 음식물 반입은 금지됩니다. <span className="text-gray-400">(적발 시 즉시 퇴장)</span></span></li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-sm bg-[#B8956A] shrink-0" /><span>퇴실 시 다음 이용자를 위해 반드시 정리정돈을 해주세요. <span className="text-gray-400">(에어컨 OFF · 조명 OFF · 원상복구)</span></span></li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-sm bg-[#B8956A] shrink-0" />보안 및 사고 예방을 위해 실시간 CCTV가 설치되어 있습니다.</li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-sm bg-[#B8956A] shrink-0" />
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-2">
                    기타 문의는 카카오톡 채널로 연락 주세요.
                    <a
                      href="https://pf.kakao.com/_xmTxgnK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FEE500] text-[#3C1E1E] text-xs font-bold hover:brightness-95 transition"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="#3C1E1E"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7-.2.7-.7 2.6-.8 3-.1.5.2.5.4.4.2-.1 2.6-1.8 3.7-2.5.6.1 1.3.1 2 .1 5.5 0 10-3.6 10-8S17.5 3 12 3z"/></svg>
                      카카오톡 채널 바로가기
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* 환불규정 */}
      <Section id="refund" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="환불규정" subtitle="환불 · 변경 안내" />
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="glass-card p-5 flex items-center gap-4">
              <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold">✓</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">이용 72시간 전까지</p>
                <p className="text-sm text-gray-600 mt-0.5">전액 환불 및 일정 변경 가능</p>
              </div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 text-sm font-bold">△</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">이용 48시간 전까지</p>
                <p className="text-sm text-gray-600 mt-0.5">환불은 불가하나, 일정 변경은 1회 가능</p>
              </div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-bold">✕</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">당일 및 48시간 이내</p>
                <p className="text-sm text-gray-600 mt-0.5">환불 및 일정 변경 모두 불가</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="FAQ" subtitle="자주 묻는 질문" />
          <div className="max-w-2xl mx-auto space-y-3">
            <FaqItem q="주차가 가능한가요?">
              <p>네, 두 지점 모두 건물 앞 자주식 주차가 가능합니다.</p>
              <ul className="mt-2.5 space-y-1.5">
                <li className="flex gap-2"><span className="text-[#B8956A]">·</span><span><strong className="font-semibold text-gray-800">방배점</strong>: 1대까지 가능하며, 건물 특성상 주차 공간이 협소하니 양해 부탁드립니다.</span></li>
                <li className="flex gap-2"><span className="text-[#B8956A]">·</span><span><strong className="font-semibold text-gray-800">서초점</strong>: 건물 앞에 최대 6대까지 주차가 가능하나, 주차 여건은 <strong className="font-semibold text-gray-800">현장 상황에 따라 상이할 수 있습니다</strong>. 이용 전 참고해 주세요.</span></li>
              </ul>
            </FaqItem>

            <FaqItem q="30분 단위 예약도 가능한가요?">
              <p>예약은 정각 단위로만 가능합니다. 여러 이용자분들의 예약 운영상 부득이하게 설정된 점 양해 부탁드립니다.</p>
            </FaqItem>

            <FaqItem q="1시간만 대관도 가능한가요?">
              <p><strong className="font-semibold text-gray-800">기본 예약은 최소 2시간부터</strong> 가능합니다.</p>
              <p className="mt-2">단, 예약과 예약 사이에 1시간만 비는 경우라면 해당 시간대에 한해 1시간 단독 대관이 가능합니다.</p>
            </FaqItem>

            <FaqItem q="정기 대관 할인 혜택이 있나요?">
              <p>네, <strong className="font-semibold text-gray-800">한 달 기준 30시간 이상 대관 시 전체 금액의 10%를 할인</strong>해드립니다. 또한 인원 추가 요금 등을 유연하게 조율해드릴 수 있으니 언제든 문의해 주세요.</p>
            </FaqItem>

            <FaqItem q="환불이나 변경이 가능한가요?">
              <p>아래 기준에 따라 환불 및 변경이 가능합니다.</p>
              <ul className="mt-2.5 space-y-1.5">
                <li className="flex gap-2"><span className="text-[#B8956A]">·</span><span><strong className="font-semibold text-gray-800">이용 72시간 전까지</strong>: 전액 환불 및 일정 변경 가능</span></li>
                <li className="flex gap-2"><span className="text-[#B8956A]">·</span><span><strong className="font-semibold text-gray-800">이용 48시간 전까지</strong>: 환불은 불가하나, 일정 변경은 1회 가능</span></li>
              </ul>
              <p className="mt-2 text-gray-400">※ 당일 및 48시간 이내 취소는 환불 및 변경이 모두 불가합니다.</p>
            </FaqItem>

            <FaqItem q="홀 크기는 어떻게 되나요?">
              <ul className="space-y-1.5">
                <li className="flex gap-2"><span className="text-[#B8956A]">·</span><span><strong className="font-semibold text-gray-800">방배점</strong>: 약 40평 (132㎡)</span></li>
                <li className="flex gap-2"><span className="text-[#B8956A]">·</span><span><strong className="font-semibold text-gray-800">서초점</strong>: 약 50평 (165㎡)</span></li>
              </ul>
              <p className="mt-2">넓고 단정한 공간으로 다양한 예술 활동에 적합한 환경을 제공합니다.</p>
            </FaqItem>
          </div>
        </div>
      </Section>

      {/* 푸터 */}
      <footer className="py-12 px-4 border-t border-white/40">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-symbol.png" alt="" className="h-6 w-auto" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wordmark.png" alt="투스텝홀" className="h-3.5 w-auto" />
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 text-[11px] leading-relaxed text-gray-400 break-keep">
            <div className="text-center">
              <p className="font-semibold text-gray-500 mb-1">무용연습실 투스텝홀 방배점</p>              <p>사업자등록번호 271-02-03016</p>
              <p>서울특별시 서초구 효령로27길 41 지하1층</p>
              <p>대표번호 010-2026-7018</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-500 mb-1">무용연습실 투스텝홀 서초점</p>              <p>사업자등록번호 210-50-18723</p>
              <p>서울특별시 서초구 서초중앙로12길 35 지하1층</p>
              <p>대표번호 010-2026-7018</p>
            </div>
          </div>

          <p className="text-center text-[10px] text-gray-300 mt-7">© 2026 무용연습실 투스텝홀. All rights reserved.</p>
        </div>
      </footer>

      {/* 대관현황 플로팅 버튼 (좌측, 피어잇 실시간 공석현황 참고) */}
      <a
        href="https://status.twostephall.com/?branch=bangbae"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="대관현황 보러가기"
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#32322E]/[0.92] backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-xl hover:bg-[#32322E] transition-all whitespace-nowrap"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e]" />
        </span>
        <span className="text-xs font-extrabold tracking-wide text-[#22c55e]">LIVE</span>
        <span className="text-base font-bold text-white">대관현황 보러가기</span>
      </a>

      {/* 카카오톡 채널 플로팅 버튼 */}
      <a
        href="https://pf.kakao.com/_xmTxgnK"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오톡 채널 문의"
        className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#FEE500] shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#3C1E1E">
          <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7-.2.7-.7 2.6-.8 3-.1.5.2.5.4.4.2-.1 2.6-1.8 3.7-2.5.6.1 1.3.1 2 .1 5.5 0 10-3.6 10-8S17.5 3 12 3z"/>
        </svg>
      </a>
    </div>
  );
}
