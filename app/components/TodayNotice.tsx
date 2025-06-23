import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TodayNotice() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-cyan-300">
          <Bell className="w-5 h-5 animate-bounce" />
          <span>오늘의 게임 공지</span>
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
            ⚠️ 베팅은 신중하게! 포인트 관리에 유의하세요.
          </p>
          <p className="text-green-300">
            🎯 오늘의 특별 이벤트: 첫 게임 승리 시 보너스 포인트 2배!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
