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
      <h2 className="text-2xl md:text-3xl font-bold text-[#8B6F47]">{title}</h2>
      {subtitle && <p className="mt-2 text-[#B8956A] text-sm md:text-base">{subtitle}</p>}
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
    <div className="relative">
      {/* 배경 블러 글로우 */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#E3CFB4]/20 blur-[100px]" />
        <div className="absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#E3CFB4]/15 blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-[#B8956A]/10 blur-[100px]" />
      </div>

      {/* 네비게이션 */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-sm' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => scrollTo('hero')} className="font-bold text-lg text-[#8B6F47]">
            투스텝홀
          </button>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex gap-6">
            {SECTIONS.slice(1).map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-sm text-[#8B6F47]/70 hover:text-[#8B6F47] transition-colors"
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
            <span className={`w-5 h-0.5 bg-[#8B6F47] transition-all ${navOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`w-5 h-0.5 bg-[#8B6F47] transition-all ${navOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-[#8B6F47] transition-all ${navOpen ? '-rotate-45 -translate-y-1' : ''}`} />
          </button>
        </div>

        {/* 모바일 드롭다운 */}
        {navOpen && (
          <div className="md:hidden glass-nav border-t border-[#E3CFB4]/20 px-4 py-3">
            {SECTIONS.slice(1).map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="block w-full text-left py-2.5 text-sm text-[#8B6F47]/80 hover:text-[#8B6F47]"
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
          <h1 className="text-4xl md:text-6xl font-bold text-[#8B6F47] mb-4 rise-in">
            투스텝홀
          </h1>
          <p className="text-lg md:text-xl text-[#B8956A] mb-2 rise-in-delay-1">
            무용연습실 대관
          </p>
          <p className="text-sm md:text-base text-[#B8956A]/70 mb-10 rise-in-delay-2">
            방배점 · 서초점
          </p>
          <button
            onClick={() => scrollTo('branches')}
            className="rise-in-delay-3 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B6F47] text-white text-sm font-medium hover:bg-[#6B5535] transition-colors"
          >
            둘러보기
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M8 13l4-4M8 13l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* 지점소개 */}
      <Section id="branches" className="py-20 px-4 section-beige">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="지점소개" subtitle="두 개의 공간, 하나의 투스텝홀" />
          <div className="grid md:grid-cols-2 gap-6">
            {/* 방배점 */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-[#8B6F47] mb-4">방배점</h3>
              <div className="h-48 bg-[#E3CFB4]/30 rounded-2xl flex items-center justify-center text-[#B8956A] text-sm">
                사진/내용 영역
              </div>
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>내용이 들어갈 자리입니다</p>
              </div>
            </div>
            {/* 서초점 */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold text-[#8B6F47] mb-4">서초점</h3>
              <div className="h-48 bg-[#E3CFB4]/30 rounded-2xl flex items-center justify-center text-[#B8956A] text-sm">
                사진/내용 영역
              </div>
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>내용이 들어갈 자리입니다</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 위치안내 */}
      <Section id="location" className="py-20 px-4 section-white">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="위치안내" subtitle="오시는 길" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-[#8B6F47] mb-3">방배점</h3>
              <div className="h-48 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm mb-4">
                지도 영역
              </div>
              <p className="text-sm text-gray-600">주소가 들어갈 자리입니다</p>
            </div>
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-[#8B6F47] mb-3">서초점</h3>
              <div className="h-48 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm mb-4">
                지도 영역
              </div>
              <p className="text-sm text-gray-600">주소가 들어갈 자리입니다</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 가격안내 */}
      <Section id="pricing" className="py-20 px-4 section-beige">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="가격안내" subtitle="합리적인 대관료" />
          <div className="glass-card p-8">
            <div className="text-center text-sm text-gray-500 py-12">
              가격표가 들어갈 자리입니다
            </div>
          </div>
        </div>
      </Section>

      {/* 대관방법 */}
      <Section id="how-to" className="py-20 px-4 section-white">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="대관방법" subtitle="간편한 예약 프로세스" />
          <div className="glass-card p-8">
            <div className="text-center text-sm text-gray-500 py-12">
              대관 방법 안내가 들어갈 자리입니다
            </div>
          </div>
        </div>
      </Section>

      {/* 대관현황 */}
      <Section id="status" className="py-20 px-4 section-beige">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="대관현황" subtitle="실시간 예약 현황을 확인하세요" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 overflow-hidden">
              <h3 className="text-lg font-bold text-[#8B6F47] mb-4 text-center">방배점</h3>
              <iframe
                src="https://twostephall-admin-fkcc.vercel.app/status?branch=bangbae"
                className="w-full h-[500px] rounded-xl border-0"
                title="방배점 대관현황"
              />
            </div>
            <div className="glass-card p-6 overflow-hidden">
              <h3 className="text-lg font-bold text-[#8B6F47] mb-4 text-center">서초점</h3>
              <iframe
                src="https://twostephall-admin-fkcc.vercel.app/status?branch=seocho"
                className="w-full h-[500px] rounded-xl border-0"
                title="서초점 대관현황"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* 이용규정 */}
      <Section id="rules" className="py-20 px-4 section-white">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="이용규정" />
          <div className="glass-card p-8">
            <div className="text-center text-sm text-gray-500 py-12">
              이용규정 내용이 들어갈 자리입니다
            </div>
          </div>
        </div>
      </Section>

      {/* 환불규정 */}
      <Section id="refund" className="py-20 px-4 section-beige">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="환불규정" />
          <div className="glass-card p-8">
            <div className="text-center text-sm text-gray-500 py-12">
              환불규정 내용이 들어갈 자리입니다
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="py-20 px-4 section-white">
        <div className="max-w-5xl mx-auto">
          <SectionTitle title="FAQ" subtitle="자주 묻는 질문" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#8B6F47]">Q. 질문이 들어갈 자리입니다 {i}</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#B8956A]">
                    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 푸터 */}
      <footer className="py-12 px-4 text-center border-t border-[#E3CFB4]/30">
        <p className="text-[#8B6F47] font-bold mb-2">투스텝홀</p>
        <p className="text-xs text-gray-400">무용연습실 대관 | 방배점 · 서초점</p>
      </footer>
    </div>
  );
}
