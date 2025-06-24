'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface RankingData {
  username: string;
  point: number;
  rank: number;
  classes: string;
}

export default function RankingCard() {
  const [selectedTab, setSelectedTab] = useState('전체');
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRankings = async (tab: string) => {
    setLoading(true);
    setError(null);

    try {
      let url = '';
      if (tab === '전체') {
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/toprank/all`;
      } else {
        // 이번 회차의 경우 클래스명을 어떻게 결정할지에 따라 수정 필요
        // 예시로 특정 클래스명을 사용하거나, 현재 사용자의 클래스를 사용할 수 있습니다
        const className = '11회차'; // 실제 구현에서는 적절한 클래스명으로 변경
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/toprank/class/${className}`;
      }

      // const response = await axios.get<RankingData[]>(url);
      const response = await axios.get(url);
      console.log(response.data);
      setRankings(response.data.data);
    } catch (err) {
      setError('랭킹 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings(selectedTab);
  }, [selectedTab]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <Card className="bg-gradient-to-b from-yellow-900/30 to-orange-900/30 border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-yellow-300">
          <Trophy className="w-5 h-5" />
          <span>실시간 랭킹</span>
        </CardTitle>
        <div className="flex space-x-2">
          {['전체', '이번 회차'].map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={selectedTab === tab ? 'default' : 'ghost'}
              onClick={() => handleTabChange(tab)}
              className={
                selectedTab === tab
                  ? 'bg-yellow-600 text-black'
                  : 'text-yellow-300'
              }
            >
              {tab}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center text-yellow-300 py-4">로딩 중...</div>
        )}

        {error && <div className="text-center text-red-400 py-4">{error}</div>}

        {!loading && !error && (
          <div className="space-y-2">
            {rankings.map((rankData) => (
              <div
                key={rankData.rank}
                className="flex items-center justify-between p-2 bg-black/30 rounded border border-yellow-600/30"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      rankData.rank === 1
                        ? 'bg-yellow-500 text-black'
                        : rankData.rank === 2
                        ? 'bg-gray-400 text-black'
                        : rankData.rank === 3
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}
                  >
                    {rankData.rank}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-white font-medium">
                      {rankData.username}
                    </span>
                    {rankData.classes && (
                      <span className="text-gray-400 text-xs">
                        {rankData.classes}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 font-bold text-sm">
                    {rankData.point.toLocaleString()}P
                  </span>
                  {/* 순위 변동 정보가 API에서 제공되지 않아 임시로 제거 */}
                  {/* 필요시 별도 API나 로직으로 구현 */}
                </div>
              </div>
            ))}

            {rankings.length === 0 && !loading && (
              <div className="text-center text-gray-400 py-4">
                랭킹 데이터가 없습니다.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
