import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';

interface ConsultingFormProps {
  onSuccess: () => void;
}

export default function ConsultingForm({ onSuccess }: ConsultingFormProps) {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-neutral-950/80 border border-neutral-900 shadow-2xl shadow-black/50 p-8 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 py-8">

        {/* 아이콘 */}
        <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <Lock size={32} className="text-amber-400" />
        </div>

        {/* 텍스트 */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white tracking-normal">
            현재 상담 페이지 점검 중입니다.
          </h3>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-sm mx-auto">
            보안 인증서 발급 절차 진행으로 인해<br />
            일시적으로 상담 접수가 중단되었습니다.<br />
            빠른 시일 내에 정상 운영될 예정입니다.
          </p>
        </div>

        {/* 안내 박스 */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl px-6 py-4 max-w-sm w-full">
          <p className="text-xs text-amber-300/80 leading-relaxed">
            긴급 문의는 SNS DM으로 연락해 주시면<br />
            빠르게 답변 드리겠습니다. 😊
          </p>
        </div>

        {/* 홈으로 돌아가기 버튼 */}
        <button
          type="button"
          onClick={onSuccess}
          className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-600 text-white rounded-xl px-6 py-3 text-sm font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>홈으로 돌아가기</span>
        </button>

      </div>
    </div>
  );
}
