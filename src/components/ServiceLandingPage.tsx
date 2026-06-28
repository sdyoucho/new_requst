import { motion } from 'motion/react';
import { BarChart3, Database, ChevronRight, Target, Check } from 'lucide-react';

interface ServiceLandingPageProps {
  onScrollToConsulting: () => void;
  onScrollToPortfolio: () => void;
}

export default function ServiceLandingPage({ onScrollToConsulting, onScrollToPortfolio }: ServiceLandingPageProps) {
  
  // 2. Why MOAPIC Items
  const whyMoapicList = [
    {
      title: "데이터 기반 분석",
      desc: "클릭률(CTR)과 시청지속시간(AVD) 등 핵심 알고리즘 데이터를 정교하게 분석하여 성공 비결을 도출합니다.",
      specs: ["CTR 성과 분석", "AVD 유지 역량", "유입 키워드 SEO", "알고리즘 분석"],
      icon: <BarChart3 className="text-[#4B89FF] stroke-[2.2]" size={22} />
    },
    {
      title: "채널 맞춤 전략",
      desc: "단순한 일회성 모방을 넘어 파트너 브랜드의 타겟 오디언스 특성과 핵심 가치를 전략적으로 결합합니다.",
      specs: ["브랜드 분석", "타겟 오디언스", "지속 성장 설계", "전략 로드맵"],
      icon: <Target className="text-[#4B89FF] stroke-[2.2]" size={22} />
    },
    {
      title: "올인원 제작 시스템",
      desc: "트렌드 기획, 전문 작가의 시나리오 시놉시스, 촬영 가이딩, 영상 편집까지 한 번의 계약으로 책임집니다.",
      specs: ["공감형 작사·극본", "프리미엄 컷·사운드", "고감도 썸네일", "올인원 채널 운영"],
      icon: <Database className="text-[#4B89FF] stroke-[2.2]" size={22} />
    }
  ];

  // 3. 핵심 서비스
  const coreServices = [
    {
      title: "유튜브 콘텐츠 제작",
      subtitle: "채널 성장을 위한 프리미엄 영상 제작 서비스",
      desc: "귀사 브랜드 자산에 부합하는 고감도 영상 연출과 정교한 호흡의 편집을 통해 시청 지속 시간(AVD)을 극대화하고 이탈을 확실하게 차단합니다.",
      details: [
        "시청 지속시간 최적화",
        "전문 컬러 그레이딩",
        "고품질 모션그래픽",
        "트렌디한 인트로 설계"
      ]
    },
    {
      title: "채널 컨설팅",
      subtitle: "성장 전략 기반 맞춤 채널 진단",
      desc: "10년 이상의 플랫폼 생태계 분석 연륜을 가진 실무진이 귀사 채널의 현 성능을 정밀 진단하고 명확한 성과 중심의 맞춤 로드맵을 수립합니다.",
      details: [
        "시장 및 경쟁사 분석",
        "시청 시간 입체 극대화",
        "비즈니스 매출 전환",
        "실시간 채널 모니터링"
      ]
    },
    {
      title: "채널 매니지먼트",
      subtitle: "운영부터 성과 관리까지 통합 지원",
      desc: "채널 운영과 자산 관리를 완벽하게 전담하여 리소스 낭비를 없애며, 자동 예약 배포 및 알고리즘 입체 모니터링을 밀착 수행합니다.",
      details: [
        "기획 일정 및 시나리오",
        "최적 업로드 연동 관리",
        "소통 매뉴얼 및 피드백",
        "전담 핫라인 밀착 소통"
      ]
    }
  ];

  // 4. 진행 절차 Steps
  const processSteps = [
    {
      step: "01",
      title: "상담",
      lines: ["채널 진단", "1:1 맞춤 상담"]
    },
    {
      step: "02",
      title: "분석",
      lines: ["데이터 분석", "트렌드 분석"]
    },
    {
      step: "03",
      title: "전략 수립",
      lines: ["성장 로드맵 제시", "맞춤 전략 구축"]
    },
    {
      step: "04",
      title: "제작",
      lines: ["콘텐츠 제작", "고품질 편집"]
    },
    {
      step: "05",
      title: "운영",
      lines: ["채널 모니터링", "성과 최적화"]
    }
  ];

  return (
    <div className="bg-[#050505] text-neutral-100 relative min-h-screen">
      
      {/* 1. Hero Section: 전환 중심 헤드라인 */}
      <section className="relative pt-12 pb-16 md:pb-20 px-4 md:px-0 overflow-hidden border-b border-neutral-900" id="service-hero">
        {/* Radial subtle blue spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#4B89FF]/3 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-[10px] md:text-xs font-black text-[#4B89FF] bg-[#4B89FF]/10 border border-[#4B89FF]/20 px-3 py-1.5 rounded-full tracking-widest uppercase inline-block font-sans">
            TAILORED VALUE LANDING
          </span>

          <h1 className="text-3xl sm:text-4.5xl md:text-5.5xl font-black text-white tracking-tight leading-snug font-display">
            채널마다 필요한 전략은 다릅니다.
          </h1>
          
          <p className="text-xs sm:text-sm text-neutral-400 font-medium max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
            정답이 정해져 있지 않은 유튜브 생태계에서 단순 반복 촬영·편집 대행을 넘어{"\n"}
            귀사의 타겟 오디언스를 완벽히 공략하고 매출과 브랜드 자산을 견인하는 입체 전략을 가동합니다.
          </p>

          {/* Core Strategy Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto pt-3">
            {["기획", "촬영", "편집", "썸네일", "채널 운영"].map((item, idx) => (
              <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-neutral-950/60 border border-[#4B89FF]/30 text-neutral-300 text-xs font-semibold cursor-default hover:border-[#4B89FF] hover:text-white hover:shadow-xs transition duration-200">
                {item}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* 2. Why MOAPIC Section: 고유 강점 및 신뢰 구축 */}
      <section className="bg-black/30 py-16 md:py-20 relative overflow-hidden border-b border-neutral-900" id="service-why-moapic">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#4B89FF]/1.5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-3.5 mb-14">
            <span className="text-xs md:text-sm font-black text-[#4B89FF] uppercase tracking-widest font-sans">
              WHY BUILD WITH MOAPIC
            </span>
            <h2 className="text-3.5xl md:text-[45px] font-black text-white tracking-tight leading-tight font-display">
              왜 모아픽인가
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto font-medium leading-[1.6]">
              단순 조회수 증대를 넘어 채널 자립 설계부터 비즈니스 가치 확장까지, 비즈니스 성장에 최적화된 맞춤 성과 로드맵을 선사합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyMoapicList.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="border rounded-2xl p-8 md:p-9 hover:-translate-y-1 transition duration-400 relative group overflow-hidden flex flex-col justify-between border-neutral-900 bg-neutral-950/50 hover:bg-neutral-950 hover:border-[#4B89FF]/30 hover:shadow-xs text-white"
                >
                  {/* Subtle hotspot glow */}
                  <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full blur-3xl pointer-events-none transition-all duration-500 bg-[#4B89FF]/1 group-hover:bg-[#4B89FF]/2" />

                  <div className="relative z-10 flex flex-col justify-between h-full space-y-7">
                    <div className="space-y-5">
                      {/* Standard Big Icon Container for Premium Presence */}
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 bg-[#4B89FF]/5 border border-[#4B89FF]/15 text-[#4B89FF]/95 group-hover:text-[#4B89FF] group-hover:bg-[#4B89FF]/10">
                        {item.icon}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight font-display">
                          {item.title}
                        </h3>
                        <p className="text-xs text-neutral-400 font-semibold leading-[1.72] text-justify">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Checklist of 3~4 핵심 키워드 added at bottom of each card */}
                    <div className="pt-6 border-t border-neutral-900 mt-2">
                      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs md:text-[13px] font-bold text-neutral-400">
                        {item.specs.map((spec, sIdx) => (
                          <span key={sIdx} className="flex items-center gap-1.5 bg-neutral-900/60 text-neutral-300 px-2 py-0.5 rounded border border-neutral-800 shadow-2xs">
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
        </div>
      </section>

      {/* 3. 핵심 서비스 Section: 프리미엄 라인업 디테일 */}
      <section className="bg-transparent py-16 md:py-20 relative overflow-hidden border-b border-neutral-900" id="service-core-lineup">
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-3.5 mb-14">
            <span className="text-xs md:text-sm font-black text-[#4B89FF] uppercase tracking-widest font-sans">
              CORE SERVICES
            </span>
            <h2 className="text-3.5xl md:text-[45px] font-black text-white tracking-tight leading-tight font-display">
              성장 맞춤형 핵심 서비스 라인업
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto font-medium">
              채널 자산 자립과 전환을 위해 최고 전문가 그룹이 지원하는 맞춤 설계 패키지입니다.
            </p>
          </div>

          <div className="space-y-10">
            {coreServices.map((service, idx) => (
              <div 
                key={idx}
                className="border border-[#4B89FF]/10 bg-neutral-950/60 hover:bg-neutral-950/85 rounded-2xl p-6 sm:p-9 md:p-14 md:py-16 hover:border-[#4B89FF]/20 hover:shadow-lg transition duration-300 relative group overflow-hidden"
              >
                {/* 5. 서비스 번호 강조: 거대한 배경 워터마크 배치 */}
                <div className="absolute right-8 md:right-12 bottom-4 text-[110px] md:text-[150px] font-black pointer-events-none select-none text-[#4B89FF]/[0.012] leading-none font-sans z-0">
                  0{idx + 1}
                </div>

                <div className="absolute -top-10 -right-10 w-56 h-56 bg-[#4B89FF]/1 rounded-full blur-3xl pointer-events-none group-hover:bg-[#4B89FF]/2 transition duration-500" />
                
                {/* 7. 시선 흐름 개선: 서비스 번호 -> 서비스 제목 -> 한 줄 요약 -> 설명 -> 핵심 제공 서비스 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center relative z-10">
                  
                  {/* Left Column: Title, Subtitle, Info Description */}
                  <div className="col-span-1 md:col-span-7 flex flex-col justify-between h-full space-y-6 md:space-y-8">
                     <div className="space-y-3.5">
                      <span className="text-[11px] md:text-[13px] font-black tracking-[0.2em] text-[#4B89FF] font-mono block uppercase">
                        0{idx + 1} SERVICE PILLAR
                      </span>
                      
                      {/* 1. 서비스 제목 강조 (크기 확대, 굵기 강조) */}
                      <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight font-display">
                        {service.title}
                      </h3>
                      
                      {/* 제목 아래 서비스를 한 줄로 설명하는 부제목 추가 */}
                      <p className="text-[13px] min-[375px]:text-[14px] sm:text-base md:text-[18px] font-bold text-[#4B89FF] tracking-tight">
                        {service.subtitle}
                      </p>
                    </div>

                    {/* 2. 본문 가독성 향상 */}
                    <div className="pt-2">
                      <p className="text-[12.5px] md:text-[13.5px] leading-[1.8] text-neutral-400 font-medium text-justify max-w-xl">
                        {service.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: 핵심 제공 서비스 (Checklist) */}
                  <div className="col-span-1 md:col-span-5 border-t md:border-t-0 md:border-l border-neutral-900 pt-8 md:pt-0 md:pl-12">
                     {/* 6. 핵심 서비스 영역 강화: 제목 변경 및 세련된 포인트 라인 */}
                    <div className="mb-5">
                      <span className="text-xs md:text-[14px] font-extrabold text-[#4B89FF] tracking-wider uppercase block">
                        핵심 제공 서비스
                      </span>
                      <div className="w-6 h-[2px] bg-[#4B89FF]/60 mt-2" />
                    </div>

                    {/* 체크리스트 간격 확대 및 중요 키워드 강조 */}
                    <ul className="space-y-4">
                      {service.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-3 font-semibold leading-relaxed text-neutral-300">
                          <Check size={16} className="text-[#4B89FF] shrink-0 stroke-[3]" />
                          <span className="text-[13.5px] md:text-[14.5px] leading-relaxed">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 진행 절차 Section: 투명한 안심 체계 */}
      <section className="bg-black/30 py-16 md:py-20 relative overflow-hidden border-b border-neutral-900" id="service-process-line">
        <div className="max-w-4xl mx-auto px-4 md:px-0 relative z-10">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[10px] md:text-xs font-black text-[#4B89FF] uppercase tracking-widest font-sans">
              TRUSTED WORKFLOW
            </span>
            <h2 className="text-2.5xl md:text-3.5xl font-black text-white tracking-normal font-display">
              차근차근, 투명하게 완성되는 진행 절차
            </h2>
            <p className="text-xs text-neutral-400 max-w-xl mx-auto font-medium">
              모아픽의 모든 비즈니스 여정은 100% 무상 분석 상담을 거쳐 명확하고 체계적으로 진행됩니다.
            </p>
          </div>

          {/* Sleek Line Connection Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4.5 relative">
            
            {/* Horizontal progress connector lines (Desktop only) */}
            <div className="absolute top-[41px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#4B89FF] via-[#4B89FF]/20 to-neutral-950 hidden md:block z-0" />

            {processSteps.map((item, idx) => {
              const isLast = idx === processSteps.length - 1;
              const isStep05 = item.step === "05";

              return (
                <div key={idx} className="relative group z-10">
                  {/* For Desktop: Connecting chevron arrow on the right of each card (except last) */}
                  {!isLast && (
                    <div className="hidden md:flex absolute top-[41px] -right-3 -translate-y-1/2 z-20 items-center justify-center bg-neutral-950 border border-neutral-800 rounded-full w-6 h-6 shadow-sm group-hover:border-[#4B89FF]/40 transition duration-300">
                      <ChevronRight size={12} className="text-[#4B89FF] stroke-[3.5]" />
                    </div>
                  )}

                  {/* For Mobile: Connecting line down the left side (positioned relative to the card's dot/marker) */}
                  {!isLast && (
                    <div className="md:hidden absolute left-[31px] top-[46px] bottom-[-24px] w-[2px] bg-gradient-to-b from-[#4B89FF] to-neutral-800 z-0" />
                  )}

                  <div 
                    className={`border rounded-2xl p-6.5 md:p-7 pt-7 pb-8.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full select-none ${
                      isStep05 
                        ? 'border-[#4B89FF]/40 bg-neutral-950 shadow-md shadow-[#4B89FF]/5 hover:shadow-lg hover:border-[#4B89FF]/60 text-white' 
                        : 'border-neutral-900 bg-neutral-950/50 hover:bg-neutral-955 hover:border-[#4B89FF]/20 text-white'
                    }`}
                  >

                    <div className="space-y-4 relative z-10 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-[10.5px] font-black text-[#4B89FF] font-mono bg-[#4B89FF]/10 px-2.5 py-1 rounded-md border border-[#4B89FF]/20 tracking-widest">
                          STEP {item.step}
                        </span>
                        
                        {/* Dot indicator matching the connecting layout line */}
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isStep05 ? 'bg-[#4B89FF] animate-pulse shadow-sm shadow-[#4B89FF]/30' : 'bg-[#4B89FF]/80'}`} />
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-base sm:text-[17px] font-black text-white tracking-tight font-display">
                          {item.title}
                        </h4>
                        
                        {/* 3. 카드 정보 단순화 및 170% 수준 줄간격 */}
                        <div className="space-y-2.5 pt-1">
                          {item.lines.map((line, lIdx) => (
                            <div key={lIdx} className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors duration-200">
                              <span className="text-[#4B89FF] font-bold text-xs select-none">→</span>
                              <span className="text-xs md:text-[13px] font-semibold tracking-tight leading-[1.7]">{line}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
