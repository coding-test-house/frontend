"use client"

import { useState, useEffect } from "react"
import { Bell, Trophy, MessageCircle, User, Coins, TrendingUp, TrendingDown, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CoteHouse() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [userPoints, setUserPoints] = useState(15420)
  const [selectedTab, setSelectedTab] = useState("전체")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const problems = [
    { id: 1001, title: "A+B", difficulty: "브론즈V", points: 100, betAmount: "" },
    { id: 2557, title: "Hello World", difficulty: "브론즈V", points: 100, betAmount: "" },
    { id: 10950, title: "A+B - 3", difficulty: "브론즈III", points: 200, betAmount: "" },
    { id: 1008, title: "A/B", difficulty: "브론즈IV", points: 150, betAmount: "" },
    { id: 10998, title: "A×B", difficulty: "브론즈V", points: 100, betAmount: "" },
  ]

  const games = [
    { id: 1, name: "스피드 코딩", time: "14:00", status: "active", thumbnail: "🚀" },
    { id: 2, name: "알고리즘 배틀", time: "16:00", status: "upcoming", thumbnail: "⚔️" },
    { id: 3, name: "데이터구조 퀴즈", time: "18:00", status: "upcoming", thumbnail: "🧩" },
    { id: 4, name: "DP 마스터", time: "20:00", status: "upcoming", thumbnail: "🎯" },
  ]

  const rankings = [
    { rank: 1, user: "알고마스터", points: 89420, change: "up" },
    { rank: 2, user: "코딩킹", points: 76830, change: "up" },
    { rank: 3, user: "백준러버", points: 65240, change: "down" },
    { rank: 4, user: "알고리즘신", points: 58910, change: "up" },
    { rank: 5, user: "코테왕", points: 52340, change: "down" },
  ]

  const chatMessages = [
    { user: "베팅마스터", message: "다들 몇 포 걸었냐?", time: "13:45" },
    { user: "올인각", message: "이번엔 올인 각이야 ㅋㅋ", time: "13:46" },
    { user: "알고킹", message: "DP 문제 나오면 무조건 승부", time: "13:47" },
    { user: "코딩도박사", message: "포인트 2만개 걸었다", time: "13:48" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Navbar */}
      <nav className="border-b border-purple-500/30 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
              🎰 코테 하우스
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/settlement">
              <Button variant="ghost" className="text-green-400 hover:text-green-300 hover:bg-green-400/10">
                정산내역
              </Button>
            </Link>
            <Link href="/report">
              <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                신고하기
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-400 hover:bg-red-500/10 border border-red-500/30"
              >
                <Crown className="w-4 h-4 mr-2" />
                관리자
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold">
                  <User className="w-4 h-4 mr-2" />
                  로그인 / 회원가입
                </Button>
              </Link>

              {/* 로그인 후에는 이 부분이 표시됩니다 */}
              <div className="hidden items-center space-x-3 bg-purple-800/30 px-4 py-2 rounded-lg border border-purple-500/50">
                <User className="w-4 h-4 text-purple-300" />
                <span className="text-purple-200">알고마스터</span>
                <div className="flex items-center space-x-1">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{userPoints.toLocaleString()}P</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Notice Section */}
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
                    🕐 현재 시간: <span className="text-yellow-400 font-mono">{currentTime.toLocaleTimeString()}</span>
                  </p>
                  <p className="text-orange-300">⚠️ 베팅은 신중하게! 포인트 관리에 유의하세요.</p>
                  <p className="text-green-300">🎯 오늘의 특별 이벤트: 첫 게임 승리 시 보너스 포인트 2배!</p>
                </div>
              </CardContent>
            </Card>

            {/* Today's Problems */}
            <Card className="bg-black/40 border-2 border-green-400/50 shadow-lg shadow-green-400/20">
              <CardHeader>
                <CardTitle className="text-green-300">📚 오늘의 백준 문제</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {problems.map((problem) => (
                    <div
                      key={problem.id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/50 hover:border-green-400/50 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-400 font-mono">#{problem.id}</span>
                        <span className="text-white font-medium">{problem.title}</span>
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
                          {problem.difficulty}
                        </Badge>
                        <span className="text-green-400 font-bold">{problem.points}P</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="베팅 포인트"
                          className="w-32 bg-gray-900/50 border-purple-500/50 text-white"
                        />
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          베팅
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Game Cards */}
            <div className="grid grid-cols-2 gap-4">
              {games.map((game) => (
                <Card
                  key={game.id}
                  className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                    game.status === "active"
                      ? "bg-gradient-to-br from-green-800/50 to-emerald-800/50 border-2 border-green-400 shadow-lg shadow-green-400/30 animate-pulse"
                      : "bg-gray-800/30 border border-gray-600/50"
                  }`}
                >
                  {game.status === "upcoming" && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🔒</div>
                        <div className="text-yellow-400 font-bold text-lg">{game.time} 공개</div>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4">{game.thumbnail}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                    <p className="text-gray-300">시작 시간: {game.time}</p>
                    {game.status === "active" && (
                      <Button className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold">
                        게임 참여하기
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rankings */}
            <Card className="bg-gradient-to-b from-yellow-900/30 to-orange-900/30 border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-yellow-300">
                  <Trophy className="w-5 h-5" />
                  <span>실시간 랭킹</span>
                </CardTitle>
                <div className="flex space-x-2">
                  {["전체", "이번 회차"].map((tab) => (
                    <Button
                      key={tab}
                      size="sm"
                      variant={selectedTab === tab ? "default" : "ghost"}
                      onClick={() => setSelectedTab(tab)}
                      className={selectedTab === tab ? "bg-yellow-600 text-black" : "text-yellow-300"}
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
                              ? "bg-yellow-500 text-black"
                              : rank.rank === 2
                                ? "bg-gray-400 text-black"
                                : rank.rank === 3
                                  ? "bg-orange-600 text-white"
                                  : "bg-gray-600 text-white"
                          }`}
                        >
                          {rank.rank}
                        </span>
                        <span className="text-white font-medium">{rank.user}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400 font-bold text-sm">{rank.points.toLocaleString()}P</span>
                        {rank.change === "up" ? (
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

            {/* Chat */}
            <Card className="bg-black/40 border-2 border-blue-400/50 shadow-lg shadow-blue-400/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-300">
                  <MessageCircle className="w-5 h-5" />
                  <span>실시간 채팅</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 h-64 overflow-y-auto">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className="p-2 bg-gray-800/30 rounded border-l-2 border-blue-400/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-blue-300 font-medium text-sm">{msg.user}</span>
                        <span className="text-gray-400 text-xs">{msg.time}</span>
                      </div>
                      <p className="text-gray-200 text-sm">{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex space-x-2">
                  <Input
                    placeholder="메시지를 입력하세요..."
                    className="bg-gray-900/50 border-blue-500/50 text-white"
                  />
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    전송
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
