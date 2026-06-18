import { useState, useEffect } from 'react';
import { Sparkles, ArrowDown, HelpCircle, Layers, MessageSquare, Play, Check } from 'lucide-react';
import { PortfolioItem } from './types';
import { DEFAULT_PORTFOLIOS } from './data/defaultPortfolios';
import { getYouTubeThumbnailUrl } from './utils/youtube';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrustSection from './components/TrustSection';
import ServicesSection from './components/ServicesSection';
import PortfolioSection from './components/PortfolioSection';
import ConsultingForm from './components/ConsultingForm';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import FaqSection from './components/FaqSection';
import ServiceLandingPage from './components/ServiceLandingPage';

export default function App() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'portfolio' | 'service' | 'consulting'>('home');
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [customMiniLogo, setCustomMiniLogo] = useState<string | null>(null);

  // Custom landing page trust statistics state
  const [subscribers, setSubscribers] = useState<string>('7,120,000+');
  const [videos, setVideos] = useState<string>('531개');
  const [views, setViews] = useState<string>('84,230,000+');

  // Load portfolios, custom logo, and statistics from localStorage on mount (seed if empty)
  useEffect(() => {
    loadLocalPortfolios();
    const savedLogo = localStorage.getItem('moapic_custom_logo');
    if (savedLogo) {
      setCustomLogo(savedLogo);
    }
    const savedMini = localStorage.getItem('moapic_custom_mini_logo');
    if (savedMini) {
      setCustomMiniLogo(savedMini);
    }
    const savedSubs = localStorage.getItem('moapic_stat_subscribers');
    if (savedSubs) {
      setSubscribers(savedSubs);
    }
    const savedVideos = localStorage.getItem('moapic_stat_videos');
    if (savedVideos) {
      setVideos(savedVideos);
    }
    const savedViews = localStorage.getItem('moapic_stat_views');
    if (savedViews) {
      setViews(savedViews);
    }
  }, []);

  const handleStatsChange = (newStats: { subscribers: string; videos: string; views: string }) => {
    setSubscribers(newStats.subscribers);
    setVideos(newStats.videos);
    setViews(newStats.views);
    localStorage.setItem('moapic_stat_subscribers', newStats.subscribers);
    localStorage.setItem('moapic_stat_videos', newStats.videos);
    localStorage.setItem('moapic_stat_views', newStats.views);
  };

  const loadLocalPortfolios = () => {
    const saved = localStorage.getItem('moapic_portfolios');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length < DEFAULT_PORTFOLIOS.length) {
        setPortfolios(DEFAULT_PORTFOLIOS);
        localStorage.setItem('moapic_portfolios', JSON.stringify(DEFAULT_PORTFOLIOS));
      } else {
        setPortfolios(parsed);
      }
    } else {
      setPortfolios(DEFAULT_PORTFOLIOS);
      localStorage.setItem('moapic_portfolios', JSON.stringify(DEFAULT_PORTFOLIOS));
    }
  };

  const handleLogoChange = (newLogo: string | null) => {
    setCustomLogo(newLogo);
    if (newLogo) {
      localStorage.setItem('moapic_custom_logo', newLogo);
    } else {
      localStorage.removeItem('moapic_custom_logo');
    }
  };

  const handleMiniLogoChange = (newMiniLogo: string | null) => {
    setCustomMiniLogo(newMiniLogo);
    if (newMiniLogo) {
      localStorage.setItem('moapic_custom_mini_logo', newMiniLogo);
    } else {
      localStorage.removeItem('moapic_custom_mini_logo');
    }
  };

  const handleNavigate = (view: 'home' | 'portfolio' | 'service' | 'consulting', targetElementId?: string) => {
    setCurrentView(view);
    
    if (targetElementId) {
      setTimeout(() => {
        const target = document.getElementById(targetElementId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    } else {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 80);
    }
  };

  const featuredPortfolios = portfolios.filter(item => item.isFeatured === true);
  const marqueeItems = featuredPortfolios.length > 0 ? featuredPortfolios : portfolios;
  const marqueeDuration = marqueeItems.length > 0 ? Math.max(15, marqueeItems.length * 7.5) : 45;

  return (
    <div className="bg-[#050505] text-neutral-100 min-h-screen font-sans selection:bg-[#4B89FF]/35 selection:text-white antialiased overflow-x-hidden">
      
      {/* Premium Navbar */}
      <Navbar 
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
        customLogo={customLogo}
        customMiniLogo={customMiniLogo}
      />

      {/* Main presentation blocks with fluid animated viewport controls */}
      <main className="pt-[56px]">
        {currentView === 'home' ? (
          <>
            {/* Section 1: Hero Showcase */}
            <HeroSection 
              onScrollToPortfolio={() => handleNavigate('portfolio')}
              onScrollToConsulting={() => handleNavigate('consulting')}
              customLogo={customLogo}
              customMiniLogo={customMiniLogo}
            />

            {/* Section 2: Trust and Proof (Counters and partners) */}
            <TrustSection 
              subscribers={subscribers}
              videos={videos}
              views={views}
              onScrollToConsulting={() => handleNavigate('consulting')}
            />            {/* Section 2.5: Dynamic Representative Works Grid with Seamless Infinite Scroll & Pause-on-Hover */}
            <section className="bg-black py-12 relative overflow-hidden border-b border-neutral-900" id="representative-works-section">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#4B89FF]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="max-w-7xl mx-auto mb-8 px-6 text-center space-y-2 relative z-10">
                <span className="text-[10px] md:text-xs font-black text-[#4B89FF]/95 bg-[#4B89FF]/10 border border-[#4B89FF]/30 px-3 py-1 rounded-full tracking-widest uppercase inline-block font-sans">
                  실제 운영 및 제작 사례
                </span>
                <h2 className="text-2.5xl md:text-3.5xl font-bold text-white tracking-normal pt-1.5 font-display">
                  모아픽 대표작품
                </h2>
                <p className="text-xs text-neutral-400 max-w-xl mx-auto font-medium">
                  실제 기획부터 촬영, 편집까지 올인원으로 진행되어 뛰어난 가치와 성과를 낸 모아픽의 대표 레퍼런스입니다.
                </p>
              </div>

              {/* Infinite Horizontal Marquee Stream Wrapper with Vignette Edge Masks for Premium Cinematic Layout */}
              <div 
                className="relative w-full overflow-hidden py-4 z-10 group"
                style={{
                  maskImage: 'linear-gradient(to right, transparent, white 25%, white 75%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, white 25%, white 75%, transparent)'
                }}
              >
                <style>{`
                  @keyframes marquee-infinite {
                    0% {
                      transform: translateX(0);
                    }
                    100% {
                      transform: translateX(calc(-50% - 10px));
                    }
                  }
                  .marquee-stream {
                    display: flex;
                    width: max-content;
                    animation: marquee-infinite 45s linear infinite;
                    will-change: transform;
                  }
                  /* Seamless interactive pause of the continuous scroll when selecting a masterpiece */
                  .marquee-stream:hover {
                    animation-play-state: paused;
                  }
                `}</style>

                {/* Duplicated portfolios list renders twice for complete endless loop coverage */}
                <div 
                  className="marquee-stream flex gap-5"
                  style={{ animationDuration: `${marqueeDuration}s` }}
                >
                  {[...marqueeItems, ...marqueeItems].map((item, index) => (
                    <div 
                       key={`${item.id}-marquee-${index}`} 
                      className="w-[245px] md:w-[310px] shrink-0 aspect-[16/10] bg-neutral-950 border border-neutral-900 rounded-xl relative overflow-hidden group/item cursor-pointer hover:border-[#4B89FF]/55 hover:scale-[1.03] transition-all duration-355 shadow-md shadow-neutral-950/50"
                      onClick={() => handleNavigate('portfolio')}
                    >
                      {/* Background thumbnail image with smooth hover zoom */}
                      <img 
                        src={getYouTubeThumbnailUrl(item.videoUrl, item.thumbnailUrl)} 
                        alt={item.title} 
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover group-hover/item:scale-110 group-hover/item:opacity-95 transition-all duration-500 opacity-75"
                      />
                      
                      {/* Dark gradient overlay for legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent opacity-95" />
                      
                      {/* Main play icon centerpiece */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full border border-white/10 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white shadow-md group-hover/item:bg-[#4B89FF] group-hover/item:text-white group-hover/item:scale-115 group-hover/item:shadow-[0_0_15px_rgba(75,137,255,0.4)] transition-all duration-300">
                          <Play size={16} className="fill-current translate-x-0.5" />
                        </div>
                      </div>
                      
                      {/* Overlay info text */}
                      <div className="absolute bottom-2 left-3 right-3 flex flex-col justify-end">
                        <p className="text-[9px] font-mono font-bold text-[#4B89FF] truncate tracking-tight">{item.clientName}</p>
                        <p className="text-[10px] font-bold text-white truncate leading-tight mt-0.5">{item.title}</p>
                      </div>

                      {/* Stats milestone badge */}
                      <div className="absolute top-2 right-2 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded text-[8px] font-bold text-amber-500 uppercase tracking-tight">
                        {item.stats}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 2.7: 왜 MOAPIC인가 (Why MOAPIC) */}
            <section className="bg-transparent py-14 md:py-20 relative overflow-hidden border-b border-neutral-900" id="why-moapic-section">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#4B89FF]/3 rounded-full blur-3xl pointer-events-none" />
              
              <div className="max-w-7xl mx-auto mb-10 px-6 text-center space-y-3.5 relative z-10">
                <span className="text-xs md:text-sm font-black text-[#4B89FF] uppercase tracking-widest font-sans">
                  WHY MOAPIC
                </span>
                <h2 className="text-3.5xl md:text-[45px] font-black text-white tracking-tight leading-tight font-display">
                  왜 MOAPIC인가
                </h2>
                <p className="text-xs text-neutral-400 max-w-xl mx-auto font-medium">
                  단순 외주 편집 대행을 넘어 마스터 브랜드 자산으로서 유튜브 채널을 성장시키는 모아픽의 프리미엄 차별화 전략입니다.
                </p>
              </div>

              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
                {[
                  {
                    title: "채널 맞춤 전략 설계",
                    desc: "브랜드 경쟁력과 타겟 분석을 바탕으로, 단기 유행을 넘어 장기적 고속 성장이 가능한 맞춤형 로드맵을 설계합니다.",
                    specs: ["브랜드 분석", "타겟 오디언스", "성장 로드맵"]
                  },
                  {
                    title: "데이터 기반 콘텐츠 분석",
                    desc: "클릭률(CTR)과 시청지속시간(AVD)을 정밀 분석하여, 조회수 유입과 이탈을 방지하는 최적의 공식으로 기획에 반영합니다.",
                    specs: ["CTR 성과 분석", "AVD 유지율", "알고리즘 반영"]
                  },
                  {
                    title: "기획부터 업로드까지 원스톱 지원",
                    desc: "트렌드 기획, 시나리오 작성, 촬영 가이드 및 영상 편집, 고품질 썸네일 제작까지 전 과정을 올인원으로 책임집니다.",
                    specs: ["시나리오 극본", "프리미엄 편집", "썸네일 전담"]
                  },
                  {
                    title: "10년 이상의 유튜브 생태계 경험",
                    desc: "유튜브 태동기부터 실전 숏폼 트렌드까지, 10년 이상의 풍부한 실무 경험과 성공 레퍼런스를 갖춘 전문가가 투입됩니다.",
                    specs: ["10년 실무 연륜", "숏폼 트렌드 분석", "분야별 맞춤 리더"]
                  },
                  {
                    title: "운영과 제작을 동시에 지원",
                    desc: "단순 리소스 제공을 넘어 브랜드 비즈니스와의 정교한 시너지를 도모해 채널의 장기적인 운영 및 성장을 적극 견인합니다.",
                    specs: ["비즈니스 연동", "채널 매니지먼트", "동반 성장 시너지"]
                  }
                ].map((item, idx) => {
                  const isFeatured = idx === 1; // "데이터 기반 콘텐츠 분석" 카드를 미세하게 강조
                  return (
                    <div 
                      key={idx} 
                      className={`border rounded-2xl p-7 md:p-8 hover:-translate-y-1 transition duration-400 relative overflow-hidden group flex flex-col justify-between ${
                        isFeatured 
                          ? 'border-[#4B89FF]/30 bg-neutral-950 shadow-md shadow-[#4B89FF]/5 hover:border-[#4B89FF]/50 hover:shadow-lg hover:shadow-[#4B89FF]/10 text-white' 
                          : 'border-neutral-900 bg-neutral-950/50 hover:bg-neutral-950 hover:border-[#4B89FF]/30 hover:shadow-xs text-white'
                      }`}
                    >
                      {/* Subtle aesthetic gradient hotspot */}
                      <div className={`absolute -top-10 -left-10 w-36 h-36 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${
                        isFeatured ? 'bg-[#4B89FF]/12 group-hover:bg-[#4B89FF]/18' : 'bg-[#4B89FF]/4 group-hover:bg-[#4B89FF]/8'
                      }`} />
                      
                      <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                        <div className="space-y-4">
                          {/* Premium Circle Icon Container with Check badge */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isFeatured 
                              ? 'bg-[#4B89FF]/15 border border-[#4B89FF]/25 text-[#4B89FF]' 
                              : 'bg-neutral-900 border border-neutral-900 text-neutral-400 group-hover:text-[#4B89FF] group-hover:bg-[#4B89FF]/10 group-hover:border-[#4B89FF]/20'
                          }`}>
                            <Check size={18} className="stroke-[2.5]" />
                          </div>
                          
                          <div className="space-y-3">
                            <h3 className="text-xl md:text-[22px] font-black tracking-normal leading-tight font-display text-white">
                              {item.title}
                            </h3>
                            <p className="text-[12.5px] font-medium leading-[1.7] tracking-wide text-justify text-neutral-400">
                              {item.desc}
                            </p>
                          </div>
                        </div>


                        <div className={`pt-5 border-t mt-2 ${
                          isFeatured ? 'border-[#4B89FF]/15' : 'border-neutral-900'
                        }`}>
                          <div className="flex flex-wrap gap-x-2 gap-y-1.5 text-xs font-bold text-neutral-400">
                            {item.specs.map((spec, sIdx) => (
                              <span key={sIdx} className="flex items-center gap-1 bg-neutral-900/60 text-neutral-300 px-2 py-0.5 rounded border border-[#4B89FF]/30 hover:border-[#4B89FF]/60 transition-colors duration-200">
                                <span className="text-[#4B89FF] font-black text-[10px]">✓</span> {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 2.9: FAQ Section */}
            <FaqSection />

            {/* Interim conversion nudge banner - Polished with cards & subtle ambient glow */}
            <section className="relative py-16 px-4 md:px-0 bg-black overflow-hidden" id="premium-conversion-block">
              {/* Dynamic subtle blue background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#4B89FF]/5 rounded-full blur-[120px] pointer-events-none" />
              
              <div className="max-w-7xl mx-auto px-6">
                <div className="relative bg-neutral-950/80 border border-neutral-900 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden group">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4B89FF]/20 to-transparent" />
                  
                  {/* Badge */}
                  <div className="flex justify-center mb-5">
                    <div className="inline-flex items-center space-x-2 bg-[#4B89FF]/5 border border-[#4B89FF]/15 px-3.5 py-1.5 rounded-full">
                      <Sparkles size={11} className="text-[#4B89FF]" />
                      <span className="text-[10px] font-mono font-black text-[#4B89FF] tracking-widest uppercase">
                        MOAPIC CONVERSION OPTIMIZATION
                      </span>
                    </div>
                  </div>

                  {/* Main Header & Body */}
                  <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug font-display break-keep sm:whitespace-nowrap">
                      귀사의 영상이 시청되도록, 데이터로 증명하는 구조 설계
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
                      성공하는 채널은 한 장의 썸네일, 첫 3초의 인트로, 그리고 한 주 동안의 업로드 빈도마저 고도로 계산되어 있습니다. 모아픽이 귀사의 영상 가치를 업그레이드하기 위해 최정예 마케팅 기획을 도입하겠습니다.
                    </p>
                  </div>

                  {/* 3 Premium Pillar Blocks */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                    {/* Pillar 1 */}
                    <div className="bg-neutral-900/30 border border-neutral-900/60 rounded-2xl p-5 hover:border-[#4B89FF]/25 transition-all duration-300">
                      <div className="flex items-center space-x-2 mb-2.5">
                        <span className="w-1.5 h-1.5 bg-[#4B89FF] rounded-full" />
                        <span className="text-[10px] font-mono font-bold tracking-wider text-[#4B89FF]">01. VISUAL STRATEGY</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1.5 font-display">한 장의 썸네일</h4>
                      <p className="text-[11px] text-neutral-550 font-medium leading-relaxed">
                        시청자의 시선을 순식간에 사로잡고 실제 클릭으로 이어지는 최적의 컬러와 구도를 설계합니다.
                      </p>
                    </div>

                    {/* Pillar 2 */}
                    <div className="bg-neutral-900/30 border border-neutral-900/60 rounded-2xl p-5 hover:border-[#4B89FF]/25 transition-all duration-300">
                      <div className="flex items-center space-x-2 mb-2.5">
                        <span className="w-1.5 h-1.5 bg-[#4B89FF] rounded-full" />
                        <span className="text-[10px] font-mono font-bold tracking-wider text-[#4B89FF]">02. ATTENTION RETENTION</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1.5 font-display">첫 3초의 인트로</h4>
                      <p className="text-[11px] text-neutral-550 font-medium leading-relaxed">
                        초반 이탈을 철저히 방지하고 끝까지 몰입할 수 있도록 뇌 과학 기반의 오프닝 연출을 구현합니다.
                      </p>
                    </div>

                    {/* Pillar 3 */}
                    <div className="bg-neutral-900/30 border border-neutral-900/60 rounded-2xl p-5 hover:border-[#4B89FF]/25 transition-all duration-300">
                      <div className="flex items-center space-x-2 mb-2.5">
                        <span className="w-1.5 h-1.5 bg-[#4B89FF] rounded-full" />
                        <span className="text-[10px] font-mono font-bold tracking-wider text-[#4B89FF]">03. ALGORITHM FREQUENCY</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1.5 font-display">업로드 주기 및 빈도</h4>
                      <p className="text-[11px] text-neutral-550 font-medium leading-relaxed">
                        단순한 업로드가 아닌, 활성 시청층의 알고리즘 유입 타이밍을 분석한 정교한 배치를 집행합니다.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          </>
        ) : currentView === 'portfolio' ? (
          <div className="py-10 animate-fade-in" key="portfolio-page">
            {/* Section 4: Dynamic Portfolio Grid with Tab filters & Hover Cursor Effects */}
            <PortfolioSection items={portfolios} />
          </div>
        ) : currentView === 'service' ? (
          <div className="animate-fade-in" key="service-page">
            <ServiceLandingPage 
              onScrollToConsulting={() => handleNavigate('consulting')}
              onScrollToPortfolio={() => handleNavigate('portfolio')}
            />
          </div>
        ) : (
          <div className="py-10 animate-fade-in" key="consulting-page">
            {/* Section 5: Step-by-Step interactive Consulting questionnaire */}
            <section id="consulting-section" className="bg-black py-4 relative overflow-hidden">
              {/* Neon Point blur glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
              
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3.5">
                  <div className="inline-flex items-center space-x-1.5 bg-neutral-900/80 px-3.5 py-1 rounded-full border border-neutral-800">
                    <MessageSquare size={13} className="text-[#4B89FF]" />
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      INTERACTIVE CONSULTING STEPPER
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-4.5xl font-bold text-white tracking-normal font-display">
                    맞춤형 대화지 견적 상담 시스템
                  </h2>
                  <p className="text-sm text-neutral-400 font-medium">
                    원하는 요구사항을 한 단계씩 선택하시면, 모아픽 전담 디렉터가 <br />
                    직접 채널 진단 리포트와 예산 맞춤 사양의 패키지 가이드를 24시간 이내에 발송해 드립니다.
                  </p>
                </div>

                {/* Render form structure */}
                <ConsultingForm onSuccess={() => {
                  // Can hook extra feedback if requested
                }} />

              </div>
            </section>
          </div>
        )}

        {/* 🚀 Premium Bottom Conversion CTA Section */}
        {currentView !== 'consulting' && (
          <section className="bg-black py-20 px-6 border-t border-neutral-900 relative overflow-hidden select-none">
            {/* Subtle gradient glow spot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-[#4B89FF]/3 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-6 text-center relative z-10 space-y-7">
              <div className="inline-flex items-center space-x-1.5 bg-neutral-900/60 border border-neutral-800/80 px-3 py-1 rounded-full text-xs font-bold text-neutral-400">
                <Sparkles size={11} className="text-[#4B89FF] animate-pulse" />
                <span className="text-[10px] tracking-wider uppercase font-mono">GROW YOUR CHANNEL</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-normal leading-snug whitespace-pre-line font-display">
                유튜브 채널 성장,{"\n"}혼자 고민하지 마세요.
              </h2>
              
              <p className="text-xs md:text-sm text-neutral-400 max-w-xl mx-auto font-medium leading-relaxed whitespace-pre-line">
                MOAPIC이 제작부터 운영까지 함께합니다.{"\n"}귀사 채널의 가치를 높일 혁신적인 전략을 제공해 드립니다.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => handleNavigate('consulting')}
                  className="px-8 py-3.5 rounded-xl text-xs sm:text-sm font-black bg-[#4B89FF] text-black hover:bg-[#3b75e0] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xl shadow-[#4B89FF]/15"
                >
                  무료 상담 신청
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Corporate Site Footer */}
      <Footer 
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollToConsulting={() => handleNavigate('consulting')}
        onScrollToPortfolio={() => handleNavigate('portfolio')}
      />

      {/* Password Secured Admin Control Center Panel */}
      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onPortfolioChange={loadLocalPortfolios} // Refresh homepage portfolio grid dynamically
        customLogo={customLogo}
        onLogoChange={handleLogoChange}
        customMiniLogo={customMiniLogo}
        onMiniLogoChange={handleMiniLogoChange}
        subscribers={subscribers}
        videos={videos}
        views={views}
        onStatsChange={handleStatsChange}
      />

    </div>
  );
}
