"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, TrendingUp, TrendingDown, Coins, Calendar, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import axios from "axios"
import { useMemo } from 'react';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SettlementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("전체")
  const [selectedType, setSelectedType] = useState("전체")

  const [username, setUsername] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]); // 또는 타입을 따로 정의해도 됨
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const storageUsername = localStorage.getItem("username") || null;
        setUsername(storageUsername);
        const historyRes = await axios.get(`${baseURL}/history/${storageUsername}`);
        
        const histories: string[] = historyRes.data;
        console.log(histories)

        const mapped: any[] = [];
        let runningBalance = 0;

        // 1. 오래된 기록부터 balance 누적 계산
        histories
          .slice() // 원본 배열 복사 (직접 수정 방지)
          .sort((a: any, b: any) => new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime())
          .forEach((item: any, index: number) => {
            const amount = typeof item.amount === 'number' ? item.amount : Number(item.amount) || 0;
            runningBalance += amount;

            mapped.push({
              id: index + 1,
              date: item.time.slice(0, 10),
              time: item.time.slice(11, 16) || '00:30',
              type: item.type || "기타",
              description: item.description || "상세 정보 없음",
              amount,
              balance: runningBalance,
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
    if (amount > 0) return "earn";
    if (amount < 0) return "loss";
    return "neutral";
  };

  const totalStats = useMemo(() => {
    let totalEarned = 0;
    let totalSpent = 0;
  
    transactions.forEach((t) => {
      if (typeof t.amount === 'number') {
        if (t.amount > 0) {
          totalEarned += t.amount;
        } else {
          totalSpent += Math.abs(t.amount);
        }
      }
    });
  
    const netProfit = totalEarned - totalSpent;
  
    return {
      totalEarned,
      totalSpent,
      netProfit,
      winRate: 68.5, // 임시 고정
    };
  }, [transactions]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "게임승리":
      case "문제해결":
      case "보너스":
        return "text-green-400 bg-green-400/10 border-green-400/30"
      case "게임패배":
        return "text-red-400 bg-red-400/10 border-red-400/30"
      case "베팅":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/30"
    }
  }

  const getAmountDisplay = (amount: number) => {
    const isPositive = amount > 0
    return (
      <div className={`flex items-center space-x-2 font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>
          {isPositive ? "+" : ""}
          {amount.toLocaleString()}P
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="border-b border-purple-500/30 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200">
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
              <div className="text-green-400 font-bold text-xl">+{totalStats.totalEarned.toLocaleString()}P</div>
              <div className="text-green-300 text-sm">총 수익</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-800/30 to-pink-800/30 border-2 border-red-400/50 shadow-lg shadow-red-400/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">💸</div>
              <div className="text-red-400 font-bold text-xl">-{totalStats.totalSpent.toLocaleString()}P</div>
              <div className="text-red-300 text-sm">총 지출</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-800/30 to-orange-800/30 border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-yellow-400 font-bold text-xl">+{totalStats.netProfit.toLocaleString()}P</div>
              <div className="text-yellow-300 text-sm">순 수익</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 border-2 border-blue-400/50 shadow-lg shadow-blue-400/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-blue-400 font-bold text-xl">{totalStats.winRate}%</div>
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
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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
                    <th className="text-left py-3 px-2 text-gray-300 font-medium">날짜/시간</th>
                    <th className="text-left py-3 px-2 text-gray-300 font-medium">유형</th>
                    <th className="text-left py-3 px-2 text-gray-300 font-medium">내용</th>
                    <th className="text-right py-3 px-2 text-gray-300 font-medium">포인트 변동</th>
                    <th className="text-right py-3 px-2 text-gray-300 font-medium">잔액</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-700/30 hover:bg-gray-800/20 transition-colors"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td className="py-4 px-2">
                        <div className="text-white font-medium">{transaction.date}</div>
                        <div className="text-gray-400 text-sm">{transaction.time}</div>
                      </td>
                      <td className="py-4 px-2">
                        <Badge className={`${getTypeColor(transaction.type)} border`}>{transaction.type}</Badge>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-white">{transaction.description}</div>
                      </td>
                      <td className="py-4 px-2 text-right">{getAmountDisplay(transaction.amount)}</td>
                      <td className="py-4 px-2 text-right">
                        <div className="text-yellow-400 font-bold">{transaction.balance.toLocaleString()}P</div>
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
  )
}
