"use client"

import { useState } from "react"
import { ArrowLeft, TrendingUp, TrendingDown, Coins, Calendar, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function SettlementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("전체")
  const [selectedType, setSelectedType] = useState("전체")

  const totalStats = {
    totalEarned: 45680,
    totalSpent: 32140,
    netProfit: 13540,
    winRate: 68.5,
  }

  const transactions = [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:30",
      type: "게임승리",
      description: "스피드 코딩 - 1등",
      amount: +8500,
      balance: 23940,
      category: "earn",
    },
    {
      id: 2,
      date: "2024-01-15",
      time: "14:00",
      type: "베팅",
      description: "스피드 코딩 참가비",
      amount: -2000,
      balance: 15440,
      category: "bet",
    },
    {
      id: 3,
      date: "2024-01-15",
      time: "10:15",
      type: "문제해결",
      description: "백준 #1001 정답",
      amount: +150,
      balance: 17440,
      category: "earn",
    },
    {
      id: 4,
      date: "2024-01-14",
      time: "20:45",
      type: "게임패배",
      description: "DP 마스터 - 탈락",
      amount: -5000,
      balance: 17290,
      category: "loss",
    },
    {
      id: 5,
      date: "2024-01-14",
      time: "20:00",
      type: "베팅",
      description: "DP 마스터 참가비",
      amount: -5000,
      balance: 22290,
      category: "bet",
    },
    {
      id: 6,
      date: "2024-01-14",
      time: "16:30",
      type: "게임승리",
      description: "알고리즘 배틀 - 2등",
      amount: +3200,
      balance: 27290,
      category: "earn",
    },
    {
      id: 7,
      date: "2024-01-14",
      time: "16:00",
      type: "베팅",
      description: "알고리즘 배틀 참가비",
      amount: -1500,
      balance: 24090,
      category: "bet",
    },
    {
      id: 8,
      date: "2024-01-13",
      time: "18:20",
      type: "보너스",
      description: "연속 승리 보너스",
      amount: +1000,
      balance: 25590,
      category: "earn",
    },
  ]

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
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Download className="w-4 h-4 mr-2" />
              내역 다운로드
            </Button>
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
