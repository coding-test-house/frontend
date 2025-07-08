'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';

interface SignupGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SignupGuideModal({
  open,
  onOpenChange,
}: SignupGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[900px] max-w-[95vw] bg-[#1e1e2f] text-white border border-gray-600 shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-blue-400">
            <HelpCircle className="w-6 h-6 text-blue-400" />
            회원가입 방법 안내
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-base mt-4">
          <p>
            아래 이미지처럼{' '}
            <span className="text-yellow-300 font-semibold">
              백준 상태 메시지
            </span>
            에<br />
            <span className="text-green-300 font-semibold">회차 번호</span>를
            정확히 입력해야 인증이 완료됩니다!
          </p>

          <div className="w-full flex justify-center">
            <img
              src="/image.png"
              alt="회원가입 안내 이미지"
              className="rounded-lg border border-gray-700 shadow-lg w-full max-w-[800px] h-[500px] object-contain"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
