import { Mail, MapPin, Lock, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onScrollToConsulting: () => void;
  onScrollToPortfolio: () => void;
}

export default function Footer({ onOpenAdmin, onScrollToConsulting, onScrollToPortfolio }: FooterProps) {
  return (
    <footer className="bg-black border-t-2 border-[#4B89FF]/10 py-16 text-neutral-400 relative overflow-hidden select-none font-sans">
      
      {/* Background soft blue ambient glow in the bottom-right corner */}
      <div className="absolute -bottom-10 right-0 w-[450px] h-[450px] bg-[#4B89FF]/5 rounded-full blur-[120px] pointer-events-none" />
      {/* Additional subtle left-side glow for balance */}
      <div className="absolute -top-10 left-0 w-[300px] h-[300px] bg-[#4B89FF]/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Main info branding column (span 7) */}
          <div className="space-y-5 md:col-span-7">
            <div className="flex items-center">
              <span className="font-extrabold text-lg text-[#4B89FF] tracking-wider font-display">
                MOAPIC
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-md font-medium">
              단순한 편집을 넘어, 브랜드의 성장을 설계합니다.<br />
              기획부터 촬영, 편집, 운영까지 함께하는 유튜브 성장 파트너 모아픽.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-1.5 text-neutral-400">
              <a 
                href="mailto:moapicad1@gmail.com" 
                className="hover:text-[#4B89FF] transition flex items-center space-x-2 text-xs font-medium w-fit"
              >
                <div className="p-1 px-1.5 rounded-md bg-neutral-900 border border-neutral-800/80">
                  <Mail size={12} className="text-[#4B89FF]" />
                </div>
                <span>moapicad1@gmail.com</span>
              </a>
              <span className="hidden sm:inline text-neutral-800 font-medium">|</span>
              <span className="flex items-center space-x-2 text-xs font-medium">
                <div className="p-1 px-1.5 rounded-md bg-neutral-900 border border-neutral-800/80">
                  <MapPin size={12} className="text-[#4B89FF]" />
                </div>
                <span>강원 강릉시 하평길55, 205동 1004호</span>
              </span>
            </div>
          </div>

          {/* Quick link anchors column (span 5) */}
          <div className="space-y-4 md:col-span-5 md:pl-8">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4B89FF]/80" />
              <h4 className="text-xs font-bold tracking-widest text-neutral-200 uppercase font-display">
                Moapic Services
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button 
                  onClick={onScrollToPortfolio}
                  className="hover:text-[#4B89FF] transition flex items-center space-x-1 group text-neutral-400 hover:translate-x-0.5 transform duration-200 cursor-pointer text-left"
                >
                  <span className="text-neutral-700 group-hover:text-[#4B89FF]/60 transition-colors">·</span>
                  <span>포트폴리오 아카이브</span>
                  <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-neutral-500" />
                </button>
              </li>
              <li>
                <button 
                  onClick={onScrollToConsulting}
                  className="hover:text-[#4B89FF] transition flex items-center space-x-1 group text-neutral-400 hover:translate-x-0.5 transform duration-200 cursor-pointer text-left"
                >
                  <span className="text-neutral-700 group-hover:text-[#4B89FF]/60 transition-colors">·</span>
                  <span>1:1 맞춤형 대화지 진단 견적</span>
                  <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-neutral-500" />
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Corporate Legal Footer details block */}
        <div className="pt-8 border-t border-neutral-900/80 flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-500 gap-4 font-medium">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} MOAPIC Studio Co., Ltd. All Rights Reserved.</span>
            <span className="hidden sm:inline text-neutral-800">|</span>
            <span>사업자등록번호: 827-43-01279</span>
            <span className="hidden sm:inline text-neutral-800">|</span>
            <span>대표 디렉터: 정민성</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[9px] font-mono border border-neutral-900 bg-neutral-950/80 rounded-md px-2 py-0.5 text-neutral-500 flex items-center gap-1">
              <ShieldCheck size={10} className="text-[#4B89FF]" />
              <span>Preview • Updating</span>
            </span>
            <button
              onClick={onOpenAdmin}
              className="text-neutral-500 hover:text-neutral-300 font-medium transition flex items-center space-x-1 cursor-pointer"
              title="관리자 모드 실행"
            >
              <span>[관리자 콘솔]</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
