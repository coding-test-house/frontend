'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';

interface NoticeData {
  title: string;
  content: string;
  gameInfo: string;
  updatedAt: string;
}

export default function TodayNotice() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notice, setNotice] = useState<NoticeData | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/notice`
        );
        if (res.data.success) {
          setNotice(res.data.data);
        }
      } catch (err) {
        console.error('공지사항 불러오기 실패:', err);
      }
    };

    fetchNotice();
  }, []);

  return (
    <Card className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-cyan-300">
          <Bell className="w-5 h-5 animate-bounce" />
          <span>{notice ? notice.title : '오늘의 게임 공지'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-cyan-100">
            🕐 현재 시간:{' '}
            <span className="text-yellow-400 font-mono">
              {currentTime.toLocaleTimeString()}
            </span>
          </p>
          <p className="text-orange-300">
            ⚠️{' '}
            {notice
              ? notice.content
              : '베팅은 신중하게! 포인트 관리에 유의하세요.'}
          </p>
          <p className="text-green-300">
            🎯{' '}
            {notice
              ? notice.gameInfo
              : '오늘의 특별 이벤트: 첫 게임 승리 시 보너스 포인트 2배!'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
