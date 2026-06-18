import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import companyLogo from '../assets/images/company_logo1_1780221044248.png';
import { 
  Lock, Check, Trash2, Edit2, Play, Plus, X, 
  ChevronRight, Calendar, User, PhoneCall, 
  Layers, Wallet, Compass, FileText, CheckCircle2, RotateCcw,
  Image, Upload, AlertCircle
} from 'lucide-react';
import { PortfolioItem, Consultation } from '../types';
import { DEFAULT_PORTFOLIOS } from '../data/defaultPortfolios';
import { getYouTubeId, getYouTubeThumbnailUrl } from '../utils/youtube';
import { fetchPortfolios, replaceAllPortfolios, adminSignIn, adminSignOut, getActiveSession } from '../lib/content';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPortfolioChange: () => void; // Trigger homepage update
  customLogo: string | null;
  onLogoChange: (newLogo: string | null) => void;
  customMiniLogo: string | null;
  onMiniLogoChange: (newMiniLogo: string | null) => void;
  subscribers: string;
  videos: string;
  views: string;
  onStatsChange: (stats: { subscribers: string; videos: string; views: string }) => void;
}

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  onPortfolioChange, 
  customLogo, 
  onLogoChange,
  customMiniLogo,
  onMiniLogoChange,
  subscribers,
  videos,
  views,
  onStatsChange
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
  } | null>(null);
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState<'portfolio' | 'consulting' | 'site_settings'>('portfolio');
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [consultationList, setConsultationList] = useState<Consultation[]>([]);
  
  // Portfolio Modal Edit Form states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  
  // Portfolio form fields
  const [pTitle, setPTitle] = useState('');
  const [pCategory, setPCategory] = useState<'shorts' | 'production' | 'shooting' | 'planning' | 'management'>('production');
  const [pThumbnail, setPThumbnail] = useState('');
  const [pVideoUrl, setPVideoUrl] = useState('');
  const [pStats, setPStats] = useState('');
  const [pHighlightsRaw, setPHighlightsRaw] = useState(''); // Comma separated
  const [pClientName, setPClientName] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pIsFeatured, setPIsFeatured] = useState(false);

  // Stats management locally
  const [localSubscribers, setLocalSubscribers] = useState(subscribers);
  const [localVideos, setLocalVideos] = useState(videos);
  const [localViews, setLocalViews] = useState(views);
  const [statsSavedSuccess, setStatsSavedSuccess] = useState(false);

  // Sync states when props change
  useEffect(() => {
    setLocalSubscribers(subscribers);
  }, [subscribers]);

  useEffect(() => {
    setLocalVideos(videos);
  }, [videos]);

  useEffect(() => {
    setLocalViews(views);
  }, [views]);

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    onStatsChange({
      subscribers: localSubscribers,
      videos: localVideos,
      views: localViews
    });
    setStatsSavedSuccess(true);
    setTimeout(() => {
      setStatsSavedSuccess(false);
    }, 3050);
  };

  const handleLogoUpload = (newLogo: string | null) => {
    onLogoChange(newLogo);
  };

  const handleMiniLogoUpload = (newMiniLogo: string | null) => {
    onMiniLogoChange(newMiniLogo);
  };

  // Selected Consultation Detail overlay
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  // Load datasets
  useEffect(() => {
    if (isOpen) {
      // 이미 로그인된 세션이 있으면 자동으로 대시보드 진입
      getActiveSession().then((session) => {
        if (session) {
          setIsAuthenticated(true);
          loadData();
        }
      });
    }
  }, [isOpen]);

  const loadData = async () => {
    // 포트폴리오: 중앙 DB(Supabase)에서 로드
    const items = await fetchPortfolios();
    setPortfolios(items);

    // 상담 문의: 현재 상담 폼이 점검 중이라 비어 있음 (추후 DB 연동 예정)
    const savedC = localStorage.getItem('moapic_consultations');
    if (savedC) {
      setConsultationList(JSON.parse(savedC));
    } else {
      setConsultationList([]);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMsg('');
    const { error } = await adminSignIn(email.trim(), password);
    setIsLoggingIn(false);
    if (error) {
      setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    setIsAuthenticated(true);
    setPassword('');
    loadData();
  };

  const handleLogout = async () => {
    await adminSignOut();
    setIsAuthenticated(false);
    setPassword('');
  };

  // Portfolio actions
  const handleOpenAddForm = () => {
    setEditingItem(null);
    setPTitle('');
    setPCategory('production');
    setPThumbnail('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');
    setPVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ');
    setPStats('조회수 100만 돌파');
    setPHighlightsRaw('빠른 템포 편집, 고퀄리티 자막, 썸네일 기획');
    setPClientName('');
    setPDescription('');
    setPIsFeatured(false);
    setIsFormModalOpen(true);
  };

  const handleOpenEditForm = (item: PortfolioItem) => {
    setEditingItem(item);
    setPTitle(item.title);
    setPCategory(item.category);
    setPThumbnail(item.thumbnailUrl);
    setPVideoUrl(item.videoUrl);
    setPStats(item.stats);
    setPHighlightsRaw(item.highlights.join(', '));
    setPClientName(item.clientName);
    setPDescription(item.description);
    setPIsFeatured(item.isFeatured || false);
    setIsFormModalOpen(true);
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle.trim() || !pClientName.trim() || !pDescription.trim()) {
      alert('필수 입력 항목을 채워주세요.');
      return;
    }

    const itemHighlights = pHighlightsRaw
      .split(',')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const finalVideoUrl = pVideoUrl.trim() || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    const ytId = getYouTubeId(finalVideoUrl);
    const resolvedVideoUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : finalVideoUrl;
    
    // Automatically generate thumbnail for YouTube if not customized or belongs to YouTube CDN/Unsplash defaults
    let resolvedThumbnail = pThumbnail.trim();
    if (ytId) {
      resolvedThumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    } else if (!resolvedThumbnail) {
      resolvedThumbnail = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
    }

    const updatedList = [...portfolios];

    if (editingItem) {
      // Edit
      const index = updatedList.findIndex((item) => item.id === editingItem.id);
      if (index !== -1) {
        updatedList[index] = {
          ...editingItem,
          title: pTitle,
          category: pCategory,
          thumbnailUrl: resolvedThumbnail,
          videoUrl: resolvedVideoUrl,
          stats: pStats || '분석 성과 우수',
          highlights: itemHighlights,
          clientName: pClientName,
          description: pDescription,
          isFeatured: pIsFeatured,
        };
      }
    } else {
      // Add
      const newItem: PortfolioItem = {
        id: 'p_' + Date.now().toString(36),
        title: pTitle,
        category: pCategory,
        thumbnailUrl: resolvedThumbnail,
        videoUrl: resolvedVideoUrl,
        stats: pStats || '분석 성과 우수',
        highlights: itemHighlights,
        clientName: pClientName,
        description: pDescription,
        createdAt: new Date().toISOString().split('T')[0],
        isFeatured: pIsFeatured,
      };
      updatedList.unshift(newItem);
    }

    setPortfolios(updatedList);
    try {
      await replaceAllPortfolios(updatedList);
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다. 로그인이 유지되고 있는지 확인 후 다시 시도해 주세요.');
      return;
    }
    setIsFormModalOpen(false);
    onPortfolioChange();
  };

  const handleDeletePortfolio = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: '포트폴리오 삭제',
      message: '이 포트폴리오를 삭제하시겠습니까? 삭제된 정보는 되돌릴 수 없습니다.',
      confirmText: '삭제',
      cancelText: '취소',
      isDanger: true,
      onConfirm: async () => {
        const updatedList = portfolios.filter((item) => item.id !== id);
        setPortfolios(updatedList);
        try {
          await replaceAllPortfolios(updatedList);
        } catch (err) {
          console.error(err);
          alert('삭제 중 오류가 발생했습니다.');
        }
        onPortfolioChange();
        setConfirmModal(null);
      }
    });
  };

  const handleResetPortfolios = () => {
    setConfirmModal({
      isOpen: true,
      title: '포트폴리오 초기화',
      message: '포트폴리오 목록을 기본 모아픽 수치로 초기화하시겠습니까? (커스텀 데이터 전체 손실)',
      confirmText: '초기화',
      cancelText: '취소',
      isDanger: true,
      onConfirm: async () => {
        setPortfolios(DEFAULT_PORTFOLIOS);
        try {
          await replaceAllPortfolios(DEFAULT_PORTFOLIOS);
        } catch (err) {
          console.error(err);
          alert('초기화 중 오류가 발생했습니다.');
        }
        onPortfolioChange();
        setConfirmModal(null);
      }
    });
  };

  // Consultation actions
  const handleDeleteConsultation = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: '견적 문의 자료 삭제',
      message: '이 견적 및 상담 접수 내역을 완전히 삭제하시겠습니까? 삭제된 정보는 복구할 수 없습니다.',
      confirmText: '영구 삭제',
      cancelText: '취소',
      isDanger: true,
      onConfirm: () => {
        const updatedList = consultationList.filter((item) => item.id !== id);
        setConsultationList(updatedList);
        localStorage.setItem('moapic_consultations', JSON.stringify(updatedList));
        if (selectedConsultation?.id === id) {
          setSelectedConsultation(null);
        }
        setConfirmModal(null);
      }
    });
  };

  const handleUpdateStatus = (id: string, newStatus: 'pending' | 'reviewed' | 'completed') => {
    const updatedList = consultationList.map((item) => {
      if (item.id === id) {
        const up = { ...item, status: newStatus };
        if (selectedConsultation?.id === id) {
          setSelectedConsultation(up);
        }
        return up;
      }
      return item;
    });
    setConsultationList(updatedList);
    localStorage.setItem('moapic_consultations', JSON.stringify(updatedList));
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-3xl min-h-[500px] shadow-26 flex flex-col overflow-hidden text-white my-8">
        
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/40">
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md text-xs font-mono text-[#4B89FF] font-bold uppercase tracking-wider">
              Admin Mode
            </div>
            <h2 className="text-lg font-black tracking-tight">모아픽 통합 관리 시스템</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition p-1.5 rounded-full hover:bg-neutral-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Login Form screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-[#4B89FF] mb-4 border border-blue-500/20">
              <Lock size={20} />
            </div>

            <h3 className="text-xl font-bold mb-2">관리자 보안 인증</h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              모아픽의 포트폴리오 관리 및 접수된 견적 문의 DB에 권한 액세스하기 위해 관리자 이메일과 비밀번호를 입력해 주세요.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="관리자 이메일 입력"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-center text-white placeholder-neutral-700 focus:outline-hidden focus:border-[#4B89FF] transition"
                  autoFocus
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="관리자 패스워드 입력"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-center text-white placeholder-neutral-700 tracking-widest focus:outline-hidden focus:border-[#4B89FF] transition"
                />
              </div>

              {errorMsg && (
                <p className="text-xs font-bold text-rose-500 bg-rose-500/5 border border-rose-500/20 py-2 rounded-lg">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#4B89FF] hover:bg-[#3b75e0] text-black py-3 rounded-xl text-sm font-black transition shadow-[0_0_15px_rgba(75,137,255,0.3)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? '인증 중...' : '인증 완료 및 대시보드 진입'}
              </button>
            </form>
          </div>
        ) : (
          /* Real Admin dashboard console */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[500px]">
            {/* Sidebar navigation */}
            <div className="w-full md:w-56 bg-neutral-950/70 border-r border-neutral-800 p-4 shrink-0 flex flex-col justify-between">
              <div className="space-y-1.5">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-3 pl-2">
                  System Database Menu
                </p>

                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2.5 transition ${
                    activeTab === 'portfolio'
                      ? 'bg-blue-600/10 border border-blue-500/20 text-[#4B89FF]'
                      : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                  }`}
                >
                  <Layers size={16} />
                  <span>포트폴리오 관리</span>
                  <span className="ml-auto text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded-md text-neutral-400">
                    {portfolios.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('consulting')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2.5 transition ${
                    activeTab === 'consulting'
                      ? 'bg-blue-600/10 border border-blue-500/20 text-[#4B89FF]'
                      : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                  }`}
                >
                  <FileText size={16} />
                  <span>견적 신청 현황</span>
                  <span className="ml-auto text-[10px] bg-[#4B89FF] text-black font-bold px-1.5 py-0.5 rounded-md">
                    {consultationList.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('site_settings')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2.5 transition ${
                    activeTab === 'site_settings'
                      ? 'bg-blue-600/10 border border-blue-500/20 text-[#4B89FF]'
                      : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                  }`}
                >
                  <Image size={16} />
                  <span>홈 로고 관리</span>
                  <span className="ml-auto text-[10px] bg-neutral-800 px-2 py-0.5 rounded-md text-neutral-400 font-bold">
                    {customLogo ? '설정됨' : '기본'}
                  </span>
                </button>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-900 space-y-2">
                <div className="pl-2">
                  <p className="text-xs font-semibold text-neutral-400">마스터 세션</p>
                  <p className="text-[9px] text-neutral-600 font-mono">Status: Connected</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-neutral-900 hover:bg-neutral-800/80 text-rose-500 border border-rose-500/10 rounded-xl px-3 py-2 text-xs font-extrabold transition text-center"
                >
                  보안 로그아웃
                </button>
              </div>
            </div>

            {/* Display content base */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[600px]">
              
              {/* PORTFOLIO TAB */}
              {activeTab === 'portfolio' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-extrabold text-white">포트폴리오 리스트 관리</h3>
                      <p className="text-xs text-neutral-400">웹사이트 갤러리에 노출되는 실시간 포트폴리오를 추가하거나 관리합니다.</p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handleResetPortfolios}
                        title="기본 포트폴리오 데이터로 리셋"
                        className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 p-2.5 rounded-xl text-neutral-300 transition cursor-pointer"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={handleOpenAddForm}
                        className="bg-[#4B89FF] hover:bg-[#3b75e0] text-black font-black px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_12px_rgba(75,137,255,0.3)] transition cursor-pointer"
                      >
                        <Plus size={14} className="stroke-[3]" />
                        <span>신규 등록</span>
                      </button>
                    </div>
                  </div>

                  {/* Portfolio table/grid */}
                  <div className="space-y-2.5">
                    {portfolios.length === 0 ? (
                      <div className="border border-dashed border-neutral-800 rounded-2xl p-12 text-center text-neutral-500">
                        등록된 모아픽 포트폴리오가 없습니다. 신규 등록 구도를 시작해 보세요.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {portfolios.map((item) => (
                          <div 
                            key={item.id} 
                            className="p-4 bg-neutral-950/50 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-700 transition"
                          >
                            <div className="flex items-center space-x-4">
                              <img 
                                src={getYouTubeThumbnailUrl(item.videoUrl, item.thumbnailUrl)} 
                                alt={item.title} 
                                className="w-16 h-12 object-cover rounded-lg bg-neutral-800 shrink-0 border border-neutral-800"
                              />
                              <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md text-[#4B89FF] font-bold uppercase">
                                    {item.category === 'shorts' ? '쇼츠(세로)' : 
                                     item.category === 'production' ? '영상제작' : 
                                     item.category === 'shooting' ? '촬영' : 
                                     item.category === 'planning' ? '기획' : '매니지먼트'}
                                  </span>
                                  {item.isFeatured && (
                                    <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md text-amber-400 font-extrabold flex items-center gap-0.5">
                                      ★ 대표작품
                                    </span>
                                  )}
                                  <span className="text-xs text-amber-400 font-bold tracking-tight">
                                    {item.stats}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-neutral-200 mt-1 line-clamp-1">{item.title}</h4>
                                <p className="text-[11px] text-neutral-400 mt-0.5">{item.clientName}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                              <button
                                onClick={() => handleOpenEditForm(item)}
                                className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeletePortfolio(item.id)}
                                className="p-2 bg-neutral-900 hover:bg-neutral-800/80 border border-rose-500/10 rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CONSULTATION MANAGEMENT TAB */}
              {activeTab === 'consulting' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-white">견적 및 상담 접수 보드</h3>
                    <p className="text-xs text-neutral-400">대화형 진단 폼에서 고객이 전송한 상세 기획안 리스너입니다.</p>
                  </div>

                  {consultationList.length === 0 ? (
                    <div className="border border-dashed border-neutral-800 rounded-2xl p-12 text-center text-neutral-500">
                      아직 제출된 고객 상담 의뢰가 없습니다. 웹사이트에서 상담 양식을 테스트 입력하면 여기에 실시간으로 기록됩니다.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {consultationList.map((c) => {
                        const statusColors = {
                          pending: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
                          reviewed: 'bg-blue-500/10 border-blue-500/30 text-[#4B89FF]',
                          completed: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        };

                        return (
                          <div 
                            key={c.id}
                            className={`p-4 bg-neutral-950/50 border rounded-2xl flex items-start justify-between gap-4 cursor-pointer transition ${
                              selectedConsultation?.id === c.id ? 'border-[#4B89FF] bg-[#4B89FF]/5' : 'border-neutral-800 hover:border-neutral-700'
                            }`}
                            onClick={() => setSelectedConsultation(c)}
                          >
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusColors[c.status]}`}>
                                  {c.status === 'pending' ? '미해결 신규' : c.status === 'reviewed' ? '검토 완료' : '상담 완료'}
                                </span>
                                <span className="text-[10px] font-mono text-neutral-500 flex items-center">
                                  <Calendar size={10} className="mr-1" />
                                  {c.submittedAt.split('T')[0]} {c.submittedAt.split('T')[1]?.slice(0, 5) || ''}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-y-1 text-xs">
                                <div className="text-neutral-400">
                                  성함/사: <span className="text-white font-bold">{c.clientName}</span>
                                </div>
                                <div className="text-neutral-400">
                                  연락처: <span className="text-white font-semibold font-mono">{c.contact}</span>
                                </div>
                                <div className="text-neutral-400 col-span-2 line-clamp-1">
                                  목적: <span className="text-blue-300">{c.purpose}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 shrink-0" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => handleDeleteConsultation(c.id)}
                                className="p-2 bg-neutral-900 hover:bg-neutral-800/80 rounded-lg text-rose-500 hover:bg-rose-500/10 border border-rose-500/10 transition cursor-pointer"
                                title="상담 기록 삭제"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Consultation Detail overlay pane */}
                  {selectedConsultation && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-5 bg-neutral-950 border border-neutral-800 rounded-2xl relative"
                    >
                      <button 
                        onClick={() => setSelectedConsultation(null)}
                        className="absolute top-4 right-4 text-neutral-500 hover:text-white"
                      >
                        <X size={16} />
                      </button>

                      <h4 className="text-sm font-extrabold text-white flex items-center space-x-1.5 mb-4 border-b border-neutral-900 pb-2.5">
                        <span>프로젝트 의뢰 상세 정보</span>
                        <span className="text-xs text-neutral-500 font-mono">ID: {selectedConsultation.id}</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-neutral-400 w-20">성함/담당자:</span>
                            <span className="text-white font-bold text-sm bg-neutral-900 px-2 py-1 rounded">{selectedConsultation.clientName}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-neutral-400 w-20">소속/채널:</span>
                            <span className="text-white bg-neutral-900 px-2 py-1 rounded">{selectedConsultation.companyOrChannel}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-neutral-400 w-20">가장 빠른 연락:</span>
                            <span className="text-[#4B89FF] bg-neutral-900 px-2 py-1 rounded font-mono font-bold">{selectedConsultation.contact}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-neutral-400 w-20">매칭 예산군:</span>
                            <span className="text-amber-400 bg-neutral-900 px-2 py-1 rounded font-semibold">{selectedConsultation.budgetRange}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-neutral-400 w-20">요청 일정:</span>
                            <span className="text-emerald-400 bg-neutral-900 px-2 py-1 rounded font-semibold">{selectedConsultation.timeline}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-neutral-400 w-20">제작 규격:</span>
                            <span className="text-white bg-neutral-900 px-2 py-1 rounded font-semibold">{selectedConsultation.videoLengthAndFrequency}</span>
                          </div>
                        </div>

                        <div className="col-span-2 space-y-1">
                          <p className="text-neutral-400 font-bold block">진행 목적 및 핵심 분야</p>
                          <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-emerald-300 font-semibold text-xs text-justify whitespace-pre-wrap">
                            {selectedConsultation.purpose}
                          </div>
                        </div>

                        {selectedConsultation.referenceUrl && (
                          <div className="col-span-2 space-y-1">
                            <p className="text-neutral-400 font-bold block">벤치마킹 타겟 레퍼런스 URL</p>
                            <a 
                              href={selectedConsultation.referenceUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[#4B89FF] hover:underline break-all block p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg font-mono text-xs"
                            >
                              {selectedConsultation.referenceUrl}
                            </a>
                          </div>
                        )}

                        <div className="col-span-2 space-y-1">
                          <p className="text-neutral-400 font-bold block">상세 요구 메모</p>
                          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg whitespace-pre-wrap leading-relaxed text-neutral-300">
                            {selectedConsultation.memo || '추가 건의 메모가 기재되지 않았습니다.'}
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions Panel */}
                      <div className="mt-5 pt-4 border-t border-neutral-900 flex flex-wrap justify-between items-center gap-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-neutral-500 font-bold">진행 상태 조율:</span>
                          <div className="inline-flex rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 p-0.5">
                            {(['pending', 'reviewed', 'completed'] as const).map((st) => {
                              const isSel = selectedConsultation.status === st;
                              const labelMap = { pending: '보류/중요', reviewed: '검토 완료', completed: '상담 완료' };
                              return (
                                <button
                                  key={st}
                                  onClick={() => handleUpdateStatus(selectedConsultation.id, st)}
                                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                                    isSel 
                                      ? 'bg-[#4B89FF] text-black shadow-[0_0_8px_rgba(75,137,255,0.3)]' 
                                      : 'text-neutral-400 hover:text-white'
                                  }`}
                                >
                                  {labelMap[st]}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              alert(`고객 연락처 [ ${selectedConsultation.contact} ]가 복사되었습니다. 소통 절차를 이어서 진행해 주십시오.`);
                            }}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 border border-neutral-700/60 transition cursor-pointer"
                          >
                            <PhoneCall size={12} />
                            <span>연락처 복사</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* SITE SETTINGS TAB */}
              {activeTab === 'site_settings' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-extrabold text-white">홈페이지 브랜드 로고 및 아이콘 관리</h3>
                    <p className="text-xs text-neutral-400">웹사이트 곳곳에 적용되는 모아픽의 다양한 로고 규격을 실시간으로 변경하고 제어합니다.</p>
                  </div>

                  {/* SECTION 1: MAIN HERO LOGO */}
                  <div className="p-6 bg-neutral-950/50 border border-neutral-800 rounded-2xl space-y-4">
                    <div className="border-b border-neutral-900 pb-3">
                      <h4 className="text-sm font-extrabold text-white">1. 메인 대형 로고 (홈페이지 중앙 노출)</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">홈페이지 메인 헤더 중심부에 크게 렌더링되는 마스터 심볼 이미지입니다.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
                      {/* Main Logo Preview */}
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-mono font-bold text-[#4B89FF] tracking-wider uppercase block">현재 적용된 상태</label>
                        <div className="bg-black/80 aspect-video rounded-xl border border-neutral-800/80 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                          <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(59,130,246,0.06), transparent 70%) pointer-events-none" />
                          <div className="relative z-10 w-full max-w-[180px] h-24 flex items-center justify-center">
                            {customLogo ? (
                              <img 
                                src={customLogo} 
                                alt="Custom Logo" 
                                className="max-w-full max-h-full object-contain drop-shadow-2xl select-none"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="text-neutral-500 font-mono text-xs flex flex-col items-center space-y-1">
                                <svg viewBox="0 0 120 130" className="w-12 h-12 stroke-neutral-950 stroke-[0.5] mb-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <polygon points="60,10 85,25 60,40 35,25" fill="#E5E5E5" />
                                  <polygon points="35,25 60,40 60,70 35,55" fill="#A3A3A3" />
                                  <polygon points="60,40 85,25 85,55 60,70" fill="#737373" />
                                </svg>
                                <span>기본 수치 로고</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Main Logo Control */}
                      <div className="space-y-4">
                        <label className="text-[11px] font-mono font-bold text-[#4B89FF] tracking-wider uppercase block font-sans">새 이미지 파일 업로드</label>
                        
                        <div className="border border-dashed border-neutral-800 rounded-xl p-5 text-center bg-neutral-950/20 hover:border-[#4B89FF]/50 transition duration-300 relative group">
                          <input 
                            type="file" 
                            accept="image/*"
                            id="logo-file-picker"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 2 * 1024 * 1024) {
                                alert('파일 크기가 너무 큽니다. 2MB 이하의 이미지를 사용해 주십시오.');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                handleLogoUpload(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                          <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                            <Upload size={14} className="text-[#4B89FF] group-hover:scale-110 transition-transform" />
                            <p className="text-xs font-bold text-neutral-200">여기 클릭하여 기기에서 선택</p>
                            <p className="text-[9px] text-neutral-500 leading-normal">PNG, JPG, WEBP (최대 2MB)</p>
                          </div>
                        </div>

                        {customLogo && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('메인 대형 로고를 원래 기본 모아픽 공식 3D 큐브 심볼로 복원하시겠습니까?')) {
                                handleLogoUpload(null);
                              }
                            }}
                            className="w-full bg-neutral-900 hover:bg-neutral-800 text-rose-500 hover:text-rose-450 border border-rose-500/10 text-xs font-bold py-2 rounded-xl transition"
                          >
                            메인 대형 로고 복원 (기본 심볼 사용)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: TOP NAV MINI LOGO */}
                  <div className="p-6 bg-neutral-950/50 border border-neutral-800 rounded-2xl space-y-4">
                    <div className="border-b border-neutral-900 pb-3">
                      <h4 className="text-sm font-extrabold text-white">2. 상단 바 미니 로고 (메뉴바 MOAPIC 왼쪽에 표시)</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">상단 고정 흰색 내비게이션 바 내부의 'MOAPIC' 텍스트 바로 왼쪽에 렌더링되는 작고 디테일한 아이콘 이미지입니다.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
                      {/* Mini Logo Preview */}
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-mono font-bold text-[#4B89FF] tracking-wider uppercase block">현재 적용된 상태 (미니 프리뷰)</label>
                        <div className="bg-neutral-200 aspect-video rounded-xl border border-neutral-300/60 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                          <div className="relative z-10 bg-white/90 shadow-md border border-neutral-300/80 py-2.5 px-4 rounded-full flex items-center space-x-1">
                            <img 
                              src={customMiniLogo || customLogo || companyLogo} 
                              alt="Navbar Logo Mock" 
                              className="h-8 w-auto max-w-[80px] object-contain block"
                              referrerPolicy="no-referrer"
                            />
                            <span className="font-mono font-extrabold text-xs text-neutral-905 tracking-wider font-bold animate-pulse">MOAPIC</span>
                          </div>
                          <span className="text-[9px] text-neutral-500 font-bold block mt-3 select-none">
                            {customMiniLogo ? '🔥 직접 등록한 전용 미니 로고 적용 중' : (customLogo ? '⚠️ 메인 로고 이미지를 공통 가이드로 축소 적용 중' : '기본 시스템 탑재 아이콘 노출 중')}
                          </span>
                        </div>
                      </div>

                      {/* Mini Logo Control */}
                      <div className="space-y-4">
                        <label className="text-[11px] font-mono font-bold text-[#4B89FF] tracking-wider uppercase block font-sans">새 미니 바 로고 파일 업로드</label>
                        
                        <div className="border border-dashed border-neutral-800 rounded-xl p-5 text-center bg-neutral-950/20 hover:border-[#4B89FF]/50 transition duration-300 relative group">
                          <input 
                            type="file" 
                            accept="image/*"
                            id="mini-logo-file-picker"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 1 * 1024 * 1024) {
                                alert('가볍고 선명한 로딩을 위해 미니 로고는 1MB 이하의 고화질 PNG 파일을 권장합니다.');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                handleMiniLogoUpload(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                          <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                            <Upload size={14} className="text-[#4B89FF] group-hover:scale-110 transition-transform" />
                            <p className="text-xs font-bold text-neutral-200">여기 클릭하여 미니 아이콘 등록</p>
                            <p className="text-[9px] text-neutral-500 leading-normal">정방형 PNG or 가로형 투명 이미지 최적 (최대 1MB)</p>
                          </div>
                        </div>

                        {customMiniLogo && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('상단 바 전용 미니 로고를 비활성화하고, 메인 로고와 동일하거나 기본 제공 아이콘으로 동기화하시겠습니까?')) {
                                handleMiniLogoUpload(null);
                              }
                            }}
                            className="w-full bg-neutral-900 hover:bg-neutral-800 text-rose-500 hover:text-rose-400 border border-rose-500/10 text-xs font-bold py-2 rounded-xl transition"
                          >
                            미니 로고 복원 (메인 로고 공용 사용 또는 기본값)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: HOME PAGE STATS EDITING */}
                  <div className="p-6 bg-neutral-950/50 border border-neutral-800 rounded-2xl space-y-4">
                    <div className="border-b border-neutral-900 pb-3">
                      <h4 className="text-sm font-extrabold text-white">3. 홈페이지 대표 실적 수치 관리</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">웹사이트 메인의 신뢰 지표 영역에 실시간으로 표시될 누적 통계 수치를 직접 수정하고 조율합니다.</p>
                    </div>

                    <form onSubmit={handleSaveStats} className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-mono font-bold text-[#4B89FF] tracking-wider uppercase block">
                            누적 구독자 수 (현재: {subscribers})
                          </label>
                          <input 
                            type="text"
                            value={localSubscribers}
                            onChange={(e) => setLocalSubscribers(e.target.value)}
                            placeholder="예: 7,120,000+"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#4B89FF]"
                          />
                          <p className="text-[9px] text-neutral-500 font-medium">숫자 뒤에 +, 명 등 원하는 기호를 자유롭게 붙여 완성하세요.</p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-mono font-bold text-[#4B89FF] tracking-wider uppercase block">
                            누적 편집 영상 수 (현재: {videos})
                          </label>
                          <input 
                            type="text"
                            value={localVideos}
                            onChange={(e) => setLocalVideos(e.target.value)}
                            placeholder="예: 531개"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#4B89FF]"
                          />
                          <p className="text-[9px] text-neutral-500 font-medium">숫자 뒤에 개, 편 등 단위 기호를 붙여 완성하세요.</p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-mono font-bold text-[#4B89FF] tracking-wider uppercase block">
                            누적 조회수 (현재: {views})
                          </label>
                          <input 
                            type="text"
                            value={localViews}
                            onChange={(e) => setLocalViews(e.target.value)}
                            placeholder="예: 84,230,000+"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#4B89FF]"
                          />
                          <p className="text-[9px] text-neutral-500 font-medium">숫자 뒤에 +, 회, 뷰 등 원하는 단위 기호를 붙여 완성하세요.</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                        <div className="text-[10px] text-neutral-500 font-medium max-w-md">
                          💡 입력된 숫자는 메인 홈에서 자연스럽게 올라가는 실시간 숫자 카운트 애니메이션 효과와 연동됩니다.
                        </div>

                        <div className="flex items-center space-x-3 self-end sm:self-auto">
                          {statsSavedSuccess && (
                            <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1 animate-pulse">
                              <span>✓ 실적 수치 저장 완료</span>
                            </span>
                          )}
                          <button
                            type="submit"
                            className="bg-[#4B89FF] hover:bg-[#3b75e0] text-black font-black px-5 py-2 rounded-xl text-xs shadow-md transition cursor-pointer"
                          >
                            수치 변경 적용하기
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="text-[11px] text-neutral-400 leading-relaxed font-medium bg-neutral-950/40 p-4 rounded-xl border border-neutral-900 flex items-start space-x-2 text-justify">
                    <span className="text-[#4B89FF] font-extrabold shrink-0 mt-0.5">ℹ️</span>
                    <span>
                      <strong>로고 별도 지정 및 고도화 가이드:</strong><br />
                      상단 바 로고는 작게 표시되므로 배경이 투명한 가벼운 PNG나 깔끔한 실루엣 이미지를 추천합니다. 본 시스템에 직접 등록하신 모든 커스텀 이미지 데이터는 이용하시는 디바이스의 내장 스토리지 보안 영역에 엄격하게 관리되어 로딩 속도가 지연되거나 소실될 염려가 전혀 없습니다.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PORTFOLIO EDIT & CREATION FORM MODAL (Nested overlay) */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/80 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-white max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-neutral-800">
                <h3 className="text-base font-black flex items-center space-x-1.5">
                  <span>{editingItem ? '포트폴리오 정보 수정' : '신규 포트폴리오 등록'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="text-neutral-400 hover:text-white bg-neutral-800 p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSavePortfolio} className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5 font-bold">
                    대표 고객명 / 채널명 (필수)
                  </label>
                  <input
                    type="text"
                    required
                    value={pClientName}
                    onChange={(e) => setPClientName(e.target.value)}
                    placeholder="예: IT 테크튜브 (구독자 85만)"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#4B89FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5 font-bold">
                    대표 타이틀 (필수)
                  </label>
                  <input
                    type="text"
                    required
                    value={pTitle}
                    onChange={(e) => setPTitle(e.target.value)}
                    placeholder="예: 성장 마인드셋 & 제테크 채널 컨설팅 및 기획"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#4B89FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5 font-bold">
                      세부 카테고리
                    </label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#4B89FF]"
                    >
                      <option value="shorts">유튜브 쇼츠</option>
                      <option value="production">영상 제작</option>
                      <option value="shooting">촬영</option>
                      <option value="planning">기획</option>
                      <option value="management">매니지먼트</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5 font-bold">
                      주요 가상 성과 표시 (자랑 수치)
                    </label>
                    <input
                      type="text"
                      value={pStats}
                      onChange={(e) => setPStats(e.target.value)}
                      placeholder="예: 조회수 235만회 달성"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#4B89FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5 font-bold">
                    재생 영상 임베딩 (또는 유튜브 링크)
                  </label>
                  <input
                    type="text"
                    value={pVideoUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPVideoUrl(val);
                      // Auto extract thumbnail if YouTube link is pasted
                      const ytId = getYouTubeId(val);
                      if (ytId) {
                        const ytThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                        if (!pThumbnail || pThumbnail.includes('unsplash.com') || pThumbnail === 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80') {
                          setPThumbnail(ytThumb);
                        }
                      }
                    }}
                    placeholder="예: https://youtu.be/... 또는 https://www.youtube.com/watch?v=..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#4B89FF]"
                  />
                  <p className="text-[10px] text-[#4B89FF] font-bold mt-1">
                    💡 유튜브 주소 입력 시 최적화된 고화질 영상 썸네일과 임베딩 플레이어가 웹사이트 전반에 자동 연동됩니다.
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5 font-bold">
                    대표 썸네일 이미지 URL (유튜브 등록 시 자동 매칭되므로 비워두거나 무시하셔도 무방합니다)
                  </label>
                  <input
                    type="text"
                    value={pThumbnail}
                    onChange={(e) => setPThumbnail(e.target.value)}
                    placeholder="기본 또는 외부 커스텀 썸네일 URL"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#4B89FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5 font-bold">
                    핵심 강점 & 디자인 포커스 태그 (콤마 구분)
                  </label>
                  <input
                    type="text"
                    value={pHighlightsRaw}
                    onChange={(e) => setPHighlightsRaw(e.target.value)}
                    placeholder="예: 빠른 컷 편집, 모션 타이포, ASMR 엔지니어링"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#4B89FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5 font-bold">
                    상세 연출 기획 설명 (필수)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={pDescription}
                    onChange={(e) => setPDescription(e.target.value)}
                    placeholder="구도의 기획 의도 및 자막 템포, 썸네일 클릭률 등을 매칭하여 기록해 주세요."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-[#4B89FF] resize-none"
                  />
                </div>

                {/* Home Featured item toggle */}
                <div className="flex items-center justify-between p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl">
                  <div className="flex flex-col pr-4">
                    <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                      <span className="text-amber-400">★</span> 홈 화면 대표작품 설정
                    </span>
                    <span className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
                      활성화하면 홈 화면 최하단의 '모아픽 대표작품' 영상 슬라이드 영역에 노출됩니다.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPIsFeatured(!pIsFeatured)}
                    className={`w-11 h-6 rounded-full p-0.5 shrink-0 transition-colors duration-200 outline-none ${
                      pIsFeatured ? 'bg-[#4B89FF]' : 'bg-neutral-800'
                    }`}
                  >
                    <div 
                      className={`bg-neutral-950 w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                        pIsFeatured ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    이전
                  </button>
                  <button
                    type="submit"
                    className="bg-[#4B89FF] hover:bg-[#3b75e0] text-black font-black px-5 py-2 rounded-xl text-xs shadow-md transition"
                  >
                    저장하기
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirm Modal */}
      <AnimatePresence>
        {confirmModal && confirmModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center space-y-5 shadow-2xl relative"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  confirmModal.isDanger 
                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-500' 
                    : 'bg-[#4B89FF]/10 border border-[#4B89FF]/20 text-[#4B89FF]'
                }`}>
                  <AlertCircle size={22} className="stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-white pt-2">{confirmModal.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-semibold">
                  {confirmModal.message}
                </p>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {confirmModal.cancelText || '취소'}
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition cursor-pointer shadow-md ${
                    confirmModal.isDanger 
                      ? 'bg-rose-500 hover:bg-rose-600 font-extrabold text-white shadow-rose-500/10' 
                      : 'bg-[#4B89FF] hover:bg-[#3b75e0] text-black shadow-blue-500/10'
                  }`}
                >
                  {confirmModal.confirmText || '확인'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
