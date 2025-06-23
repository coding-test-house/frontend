'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

export default function RankingCard() {
  const [selectedTab, setSelectedTab] = useState('전체');

  const rankings = [
    { rank: 1, user: '알고마스터', points: 89420, change: 'up' },
    { rank: 2, user: '코딩킹', points: 76830, change: 'up' },
    { rank: 3, user: '백준러버', points: 65240, change: 'down' },
    { rank: 4, user: '알고리즘신', points: 58910, change: 'up' },
    { rank: 5, user: '코테왕', points: 52340, change: 'down' },
  ];

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
              onClick={() => setSelectedTab(tab)}
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
        <div className="space-y-2">
          {rankings.map((rank) => (
            <div
              key={rank.rank}
              className="flex items-center justify-between p-2 bg-black/30 rounded border border-yellow-600/30"
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    rank.rank === 1
                      ? 'bg-yellow-500 text-black'
                      : rank.rank === 2
                        ? 'bg-gray-400 text-black'
                        : rank.rank === 3
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-600 text-white'
                  }`}
                >
                  {rank.rank}
                </span>
                <span className="text-white font-medium">{rank.user}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 font-bold text-sm">
                  {rank.points.toLocaleString()}P
                </span>
                {rank.change === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
