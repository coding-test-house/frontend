'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Coins,
  Calendar,
  Filter,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import axios from 'axios';
import { useMemo } from 'react';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SettlementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('전체');
  const [selectedType, setSelectedType] = useState('전체');

  const [username, setUsername] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]); // 또는 타입을 따로 정의해도 됨
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('accessToken');
        if (!username || !token) {
          console.warn('사용자 정보 또는 토큰이 없습니다.');
          return;
        }

        const historyRes = await axios.get(`${baseURL}/user/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const histories: string[] = historyRes.data.data;
        console.log(histories);

        const mapped: any[] = [];

        // 1. 오래된 기록부터 balance 누적 계산
        histories
          .slice() // 원본 배열 복사 (직접 수정 방지)
          .sort(
            (a: any, b: any) =>
              new Date(a.createdAt || a.date).getTime() -
              new Date(b.createdAt || b.date).getTime()
          )
          .forEach((item: any, index: number) => {
            const amount =
              typeof item.amount === 'number'
                ? item.amount
                : Number(item.amount) || 0;

            const dateObj = new Date(item.time);
            const date = dateObj
              .toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/\. /g, '-')
              .replace('.', '');

            const time = dateObj.toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
            mapped.push({
              id: index + 1,
              date,
              time,
              type: item.type || '베팅',
              reason: item.reason || '상세 정보 없음',
              amount,
              category: item.category || getCategory(amount),
            });
          });

        // 2. 최신순 정렬 후 상위 20개만 잘라서 set
        const latest20 = mapped
          .slice() // 복사
          .reverse() // 최신순
          .slice(0, 20); // 상위 20개

        setTransactions(latest20);
      } catch (err) {
        console.error('문제 또는 해결 정보 불러오기 실패:', err);
      }
    };

    fetchHistoryData();
  }, []);

  const getCategory = (amount: number) => {
    if (amount > 0) return 'earn';
    if (amount < 0) return 'loss';
    return 'neutral';
  };

  const totalStats = useMemo(() => {
    let totalEarned = 0;
    let totalSpent = 0;
    let bettingSuccessCount = 0;
    let bettingFailCount = 0;
    transactions.forEach((t) => {
      if (typeof t.amount === 'number') {
        if (t.amount > 0) {
          totalEarned += t.amount;
        } else {
          totalSpent += Math.abs(t.amount);
        }
      }

      if (t.type === '베팅 성공') {
        bettingSuccessCount++;
      } else if (t.type === '베팅 실패') {
        bettingFailCount++;
      }

      if (t.type === '베팅 성공') {
        bettingSuccessCount++;
      } else if (t.type === '베팅 실패') {
        bettingFailCount++;
      }
    });

    const netProfit = totalEarned - totalSpent;
    const totalBetting = bettingSuccessCount + bettingFailCount;
    const winRate =
      totalBetting === 0 ? 0 : (bettingSuccessCount / totalBetting) * 100;

    return {
      totalEarned,
      totalSpent,
      netProfit,
      winRate: parseFloat(winRate.toFixed(1)), // 소수점 1자리
    };
  }, [transactions]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'GAME_WIN':
        return '게임승리';
      case 'GAME_LOSS':
        return '게임패배';
      case 'BETTING':
        return '베팅';
      case 'PROBLEM_SOLVED':
        return '문제해결';
      case 'ADMIN_ADJUSTMENT':
        return '관리자조정';
      default:
        return '기타';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GAME_WIN':
      case 'PROBLEM_SOLVED':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'GAME_LOSS':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'BETTING':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'ADMIN_ADJUSTMENT':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getAmountDisplay = (amount: number) => {
    const isPositive = amount > 0;
    return (
      <div
        className={`flex justify-end items-center space-x-2 font-bold ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span>
          {isPositive ? '+' : ''}
          {amount.toLocaleString()}P
        </span>
      </div>
    );
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const now = new Date();
      const dateStr = t.date || '';
      const timeStr = t.time || '00:00';

      // transactionDate를 UTC로 생성 (시간 없으면 00:00으로)
      const transactionDate = new Date(`${dateStr}T${timeStr}`);

      // 00:00:00 기준 날짜만 비교용 함수
      const normalizeDate = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate());

      // 날짜 필터 조건
      let dateMatch = true;
      if (selectedPeriod === '오늘') {
        dateMatch =
          normalizeDate(transactionDate).getTime() ===
          normalizeDate(now).getTime();
      } else if (selectedPeriod === '이번주') {
        // 이번주 시작 (일요일 0시)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // 이번주 끝 (토요일 23:59:59)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        dateMatch =
          transactionDate >= startOfWeek && transactionDate <= endOfWeek;
      } else if (selectedPeriod === '이번달') {
        dateMatch =
          transactionDate.getMonth() === now.getMonth() &&
          transactionDate.getFullYear() === now.getFullYear();
      }

      if (!dateMatch) return false;

      // 유형 필터 조건
      if (selectedType === '전체') return true;
      if (selectedType === '수익') return t.amount > 0;
      if (selectedType === '지출') return t.amount < 0;
      if (selectedType === '베팅') return t.type === 'BETTING';
      if (selectedType === '문제해결') return t.type === 'PROBLEM_SOLVED';

      return true;
    });
  }, [transactions, selectedPeriod, selectedType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="border-b border-purple-500/30 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-300 hover:text-purple-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  메인으로
                </Button>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                💰 정산 내역
              </h1>
            </div>
            {/* <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Download className="w-4 h-4 mr-2" />
              내역 다운로드
            </Button> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 border-2 border-green-400/50 shadow-lg shadow-green-400/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">💎</div>
              <div className="text-green-400 font-bold text-xl">
                +{totalStats.totalEarned.toLocaleString()}P
              </div>
              <div className="text-green-300 text-sm">총 수익</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-800/30 to-pink-800/30 border-2 border-red-400/50 shadow-lg shadow-red-400/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">💸</div>
              <div className="text-red-400 font-bold text-xl">
                -{totalStats.totalSpent.toLocaleString()}P
              </div>
              <div className="text-red-300 text-sm">총 지출</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-800/30 to-orange-800/30 border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-yellow-400 font-bold text-xl">
                +{totalStats.netProfit.toLocaleString()}P
              </div>
              <div className="text-yellow-300 text-sm">순 수익</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 border-2 border-blue-400/50 shadow-lg shadow-blue-400/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-blue-400 font-bold text-xl">
                {totalStats.winRate}%
              </div>
              <div className="text-blue-300 text-sm">승률</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-black/40 border border-purple-500/30 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-300">
              <Filter className="w-5 h-5" />
              <span>필터</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger className="w-32 bg-gray-800/50 border-gray-600/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="전체">전체</SelectItem>
                    <SelectItem value="오늘">오늘</SelectItem>
                    <SelectItem value="이번주">이번주</SelectItem>
                    <SelectItem value="이번달">이번달</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-gray-400" />
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32 bg-gray-800/50 border-gray-600/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="전체">전체</SelectItem>
                    <SelectItem value="수익">수익만</SelectItem>
                    <SelectItem value="지출">지출만</SelectItem>
                    <SelectItem value="베팅">베팅만</SelectItem>
                    <SelectItem value="문제해결">문제만</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Table */}
        <Card className="bg-black/40 border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/20">
          <CardHeader>
            <CardTitle className="text-cyan-300">거래 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600/50">
                    <th className="text-left py-3 px-2 text-gray-300 font-medium">
                      날짜/시간
                    </th>
                    <th className="text-left py-3 px-2 text-gray-300 font-medium">
                      유형
                    </th>
                    <th className="text-left py-3 px-2 text-gray-300 font-medium">
                      내용
                    </th>
                    <th className="text-right py-3 px-2 text-gray-300 font-medium">
                      포인트 변동
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-700/30 hover:bg-gray-800/20 transition-colors"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td className="py-4 px-2">
                        <div className="text-white font-medium">
                          {transaction.date}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {transaction.time}
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <Badge
                          className={`${getTypeColor(transaction.type)} border`}
                        >
                          {getTypeLabel(transaction.type)}
                        </Badge>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-white">{transaction.reason}</div>
                      </td>
                      <td className="py-4 px-2 text-right">
                        {getAmountDisplay(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Floating Chips Animation */}
        <div className="fixed bottom-4 right-4 pointer-events-none">
          <div className="animate-bounce">
            <div className="text-4xl">🪙</div>
          </div>
        </div>
      </div>
    </div>
  );
}
