import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import companyLogo from '../assets/images/company_logo1_1780221044248.png';

interface NavbarProps {
  currentView: 'home' | 'portfolio' | 'service' | 'consulting';
  onNavigate: (view: 'home' | 'portfolio' | 'service' | 'consulting', targetElementId?: string) => void;
  onOpenAdmin: () => void;
  customLogo?: string | null;
  customMiniLogo?: string | null;
}

export default function Navbar({ currentView, onNavigate, onOpenAdmin, customLogo, customMiniLogo }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const paperTextureStyle = {
    backgroundColor: '#F9F9F6', // Elegant bright white drawing paper base color from the corporate business card
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.035'/%3E%3C/svg%3E")`,
  };

  return (
    <header 
      style={paperTextureStyle}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'border-neutral-200/90 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.06),_0_1px_3px_rgba(0,0,0,0.02)]' 
          : 'border-neutral-200/50 py-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)]'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
        
        {/* Left Aligned Isometric Logo */}
        <div 
          className="flex items-center space-x-1 group cursor-pointer" 
          onClick={() => onNavigate('home')}
          id="navbar-logo"
        >
          {/* Minimized isometric cube with premium hover grow */}
          <div className="transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
            <img 
              src={customMiniLogo || customLogo || companyLogo} 
              alt="MOAPIC Mini Logo" 
              className="h-9 w-auto max-w-[120px] object-contain block"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-extrabold text-[15px] text-neutral-900 tracking-widest font-mono transition-colors group-hover:text-[#4B89FF] hidden sm:inline-block">
            MOAPIC
          </span>
        </div>

        {/* Right Aligned Navigation Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button 
              onClick={() => onNavigate('home')}
              className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs transition-all duration-300 cursor-pointer rounded-full font-medium ${
                currentView === 'home' 
                  ? 'text-white bg-[#4B89FF] shadow-sm shadow-[#4B89FF]/30 font-semibold' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              id="nav-home"
            >
              홈
            </button>
            <button 
              onClick={() => onNavigate('service')}
              className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs transition-all duration-300 cursor-pointer rounded-full font-medium ${
                currentView === 'service' 
                  ? 'text-white bg-[#4B89FF] shadow-sm shadow-[#4B89FF]/30 font-semibold' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              id="nav-service"
            >
              서비스
            </button>
            <button 
              onClick={() => onNavigate('portfolio')}
              className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs transition-all duration-300 cursor-pointer rounded-full font-medium ${
                currentView === 'portfolio' 
                  ? 'text-white bg-[#4B89FF] shadow-sm shadow-[#4B89FF]/30 font-semibold' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              id="nav-portfolio"
            >
              포트폴리오
            </button>
            <button 
              onClick={() => onNavigate('consulting')}
              className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs transition-all duration-300 cursor-pointer rounded-full font-medium ${
                currentView === 'consulting' 
                  ? 'text-white bg-[#4B89FF] shadow-sm shadow-[#4B89FF]/30 font-semibold' 
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              id="nav-consulting"
            >
              견적상담
            </button>
          </nav>
        </div>

      </div>
    </header>
  );
}
