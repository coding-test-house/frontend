"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Search,
  Users,
  FileText,
  Code,
  Eye,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
  Crown,
  Shield,
  Settings,
  TrendingUp,
  Coins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users")
  const [searchUser, setSearchUser] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [pointAdjustment, setPointAdjustment] = useState("")
  const [adjustmentReason, setAdjustmentReason] = useState("")

  // Notice state
  const [noticeTitle, setNoticeTitle] = useState("")
  const [noticeContent, setNoticeContent] = useState("")

  // Problem state
  const [problemNumber, setProblemNumber] = useState("")
  const [problemLink, setProblemLink] = useState("")

  // Mock data
  const users = [
    { id: 1, username: "알고마스터", bojId: "algo_master", points: 15420, status: "active", joinDate: "2024-01-10" },
    { id: 2, username: "코딩킹", bojId: "coding_king", points: 8750, status: "active", joinDate: "2024-01-12" },
    { id: 3, username: "베팅마스터", bojId: "bet_master", points: 23100, status: "suspended", joinDate: "2024-01-08" },
    { id: 4, username: "올인각", bojId: "all_in", points: 450, status: "active", joinDate: "2024-01-15" },
  ]

  const notices = [
    {
      id: 1,
      title: "오늘의 특별 이벤트",
      content: "첫 게임 승리 시 보너스 포인트 2배!",
      date: "2024-01-15",
      active: true,
    },
    {
      id: 2,
      title: "베팅 규칙 변경 안내",
      content: "최소 베팅 금액이 100P로 변경됩니다.",
      date: "2024-01-14",
      active: true,
    },
    { id: 3, title: "시스템 점검 안내", content: "매주 일요일 새벽 2시-4시 점검", date: "2024-01-13", active: false },
  ]

  const problems = [
    { id: 1, number: "1001", title: "A+B", difficulty: "브론즈V", points: 100, active: true },
    { id: 2, number: "2557", title: "Hello World", difficulty: "브론즈V", points: 100, active: true },
    { id: 3, number: "10950", title: "A+B - 3", difficulty: "브론즈III", points: 200, active: false },
  ]

  const handleUserSearch = () => {
    const user = users.find((u) => u.username.includes(searchUser) || u.bojId.includes(searchUser))
    setSelectedUser(user || null)
  }

  const handlePointAdjustment = () => {
    if (!selectedUser || !pointAdjustment || !adjustmentReason) return

    alert(`${selectedUser.username}의 포인트를 ${pointAdjustment}P 조정했습니다.\n사유: ${adjustmentReason}`)
    setPointAdjustment("")
    setAdjustmentReason("")
  }

  const handleNoticeSubmit = () => {
    if (!noticeTitle || !noticeContent) return

    alert(`공지사항이 등록되었습니다!\n제목: ${noticeTitle}`)
    setNoticeTitle("")
    setNoticeContent("")
  }

  const handleProblemSubmit = () => {
    if (!problemNumber && !problemLink) return

    alert(`문제가 등록되었습니다!\n번호: ${problemNumber || "링크에서 추출"}`)
    setProblemNumber("")
    setProblemLink("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-red-500/30 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  메인으로
                </Button>
              </Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                🎯 관리자 콘솔
              </h1>
              <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                ADMIN
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-red-300">
                <Shield className="w-5 h-5" />
                <span className="text-sm">딜러 모드</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-300">
                <Eye className="w-5 h-5" />
                <span className="text-sm">감시 중</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 border-2 border-blue-400/50 shadow-lg shadow-blue-400/20">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-blue-400 font-bold text-2xl">247</div>
              <div className="text-blue-300 text-sm">총 사용자</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 border-2 border-green-400/50 shadow-lg shadow-green-400/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-green-400 font-bold text-2xl">89</div>
              <div className="text-green-300 text-sm">활성 사용자</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-800/30 to-orange-800/30 border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/20">
            <CardContent className="p-4 text-center">
              <Coins className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <div className="text-yellow-400 font-bold text-2xl">1.2M</div>
              <div className="text-yellow-300 text-sm">총 포인트</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-800/30 to-pink-800/30 border-2 border-red-400/50 shadow-lg shadow-red-400/20">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-400" />
              <div className="text-red-400 font-bold text-2xl">3</div>
              <div className="text-red-300 text-sm">신고 대기</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Panel */}
        <Card className="bg-black/40 border-2 border-red-400/50 shadow-2xl shadow-red-400/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-300">
              <Settings className="w-6 h-6" />
              <span>관리자 제어판</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-red-500/50">
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
                >
                  <Users className="w-4 h-4 mr-2" />
                  사용자 관리
                </TabsTrigger>
                <TabsTrigger
                  value="notices"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  공지사항
                </TabsTrigger>
                <TabsTrigger
                  value="problems"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                >
                  <Code className="w-4 h-4 mr-2" />
                  문제 관리
                </TabsTrigger>
              </TabsList>

              {/* User Management Tab */}
              <TabsContent value="users" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Search */}
                  <Card className="bg-gray-800/30 border border-blue-500/50">
                    <CardHeader>
                      <CardTitle className="text-blue-300">🔍 사용자 검색</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          value={searchUser}
                          onChange={(e) => setSearchUser(e.target.value)}
                          placeholder="아이디 또는 백준 아이디 입력"
                          className="bg-gray-900/50 border-blue-500/50 text-white"
                        />
                        <Button onClick={handleUserSearch} className="bg-blue-600 hover:bg-blue-700">
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>

                      {selectedUser && (
                        <div className="p-4 bg-gray-900/50 rounded-lg border border-blue-400/30">
                          <h4 className="font-bold text-blue-300 mb-2">사용자 정보</h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="text-gray-400">아이디:</span> {selectedUser.username}
                            </p>
                            <p>
                              <span className="text-gray-400">백준 ID:</span> {selectedUser.bojId}
                            </p>
                            <p>
                              <span className="text-gray-400">포인트:</span>{" "}
                              <span className="text-yellow-400 font-bold">{selectedUser.points.toLocaleString()}P</span>
                            </p>
                            <p>
                              <span className="text-gray-400">상태:</span>
                              <Badge className={selectedUser.status === "active" ? "bg-green-600" : "bg-red-600"}>
                                {selectedUser.status === "active" ? "활성" : "정지"}
                              </Badge>
                            </p>
                            <p>
                              <span className="text-gray-400">가입일:</span> {selectedUser.joinDate}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Point Adjustment */}
                  <Card className="bg-gray-800/30 border border-yellow-500/50">
                    <CardHeader>
                      <CardTitle className="text-yellow-300">💰 포인트 조정</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">조정 포인트</Label>
                        <Input
                          value={pointAdjustment}
                          onChange={(e) => setPointAdjustment(e.target.value)}
                          placeholder="예: +1000 또는 -500"
                          className="bg-gray-900/50 border-yellow-500/50 text-white"
                          disabled={!selectedUser}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">조정 사유</Label>
                        <Textarea
                          value={adjustmentReason}
                          onChange={(e) => setAdjustmentReason(e.target.value)}
                          placeholder="포인트 조정 사유를 입력하세요"
                          className="bg-gray-900/50 border-yellow-500/50 text-white"
                          disabled={!selectedUser}
                        />
                      </div>
                      <Button
                        onClick={handlePointAdjustment}
                        disabled={!selectedUser || !pointAdjustment || !adjustmentReason}
                        className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                      >
                        <Coins className="w-4 h-4 mr-2" />
                        포인트 조정 실행
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* User List */}
                <Card className="bg-gray-800/30 border border-gray-600/50">
                  <CardHeader>
                    <CardTitle className="text-gray-300">👥 전체 사용자 목록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-600/50">
                            <th className="text-left py-2 text-gray-400">아이디</th>
                            <th className="text-left py-2 text-gray-400">백준 ID</th>
                            <th className="text-right py-2 text-gray-400">포인트</th>
                            <th className="text-center py-2 text-gray-400">상태</th>
                            <th className="text-center py-2 text-gray-400">액션</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-700/30 hover:bg-gray-800/20">
                              <td className="py-3 text-white">{user.username}</td>
                              <td className="py-3 text-gray-300">{user.bojId}</td>
                              <td className="py-3 text-right text-yellow-400 font-bold">
                                {user.points.toLocaleString()}P
                              </td>
                              <td className="py-3 text-center">
                                <Badge className={user.status === "active" ? "bg-green-600" : "bg-red-600"}>
                                  {user.status === "active" ? "활성" : "정지"}
                                </Badge>
                              </td>
                              <td className="py-3 text-center">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSelectedUser(user)}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notice Management Tab */}
              <TabsContent value="notices" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add Notice */}
                  <Card className="bg-gray-800/30 border border-green-500/50">
                    <CardHeader>
                      <CardTitle className="text-green-300">📢 공지사항 등록</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">제목</Label>
                        <Input
                          value={noticeTitle}
                          onChange={(e) => setNoticeTitle(e.target.value)}
                          placeholder="공지사항 제목을 입력하세요"
                          className="bg-gray-900/50 border-green-500/50 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">내용</Label>
                        <Textarea
                          value={noticeContent}
                          onChange={(e) => setNoticeContent(e.target.value)}
                          placeholder="공지사항 내용을 입력하세요"
                          className="bg-gray-900/50 border-green-500/50 text-white min-h-32"
                        />
                      </div>
                      <Button
                        onClick={handleNoticeSubmit}
                        disabled={!noticeTitle || !noticeContent}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        공지사항 업로드
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Notice Preview */}
                  <Card className="bg-gray-800/30 border border-gray-600/50">
                    <CardHeader>
                      <CardTitle className="text-gray-300">👁️ 미리보기</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {noticeTitle || noticeContent ? (
                        <div className="p-4 bg-gradient-to-r from-purple-800/50 to-blue-800/50 border-2 border-cyan-400/50 rounded-lg">
                          <h4 className="text-cyan-300 font-bold mb-2">{noticeTitle || "제목을 입력하세요"}</h4>
                          <p className="text-cyan-100 text-sm">{noticeContent || "내용을 입력하세요"}</p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          제목과 내용을 입력하면 미리보기가 표시됩니다
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Notice List */}
                <Card className="bg-gray-800/30 border border-gray-600/50">
                  <CardHeader>
                    <CardTitle className="text-gray-300">📋 기존 공지사항</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {notices.map((notice) => (
                        <div key={notice.id} className="p-4 bg-gray-900/50 rounded-lg border border-gray-600/30">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-white">{notice.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className={notice.active ? "bg-green-600" : "bg-gray-600"}>
                                {notice.active ? "활성" : "비활성"}
                              </Badge>
                              <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{notice.content}</p>
                          <p className="text-gray-500 text-xs">{notice.date}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Problem Management Tab */}
              <TabsContent value="problems" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add Problem */}
                  <Card className="bg-gray-800/30 border border-purple-500/50">
                    <CardHeader>
                      <CardTitle className="text-purple-300">🧩 문제 등록</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">백준 문제 번호</Label>
                        <Input
                          value={problemNumber}
                          onChange={(e) => setProblemNumber(e.target.value)}
                          placeholder="예: 1001"
                          className="bg-gray-900/50 border-purple-500/50 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">또는 백준 링크</Label>
                        <Input
                          value={problemLink}
                          onChange={(e) => setProblemLink(e.target.value)}
                          placeholder="https://www.acmicpc.net/problem/1001"
                          className="bg-gray-900/50 border-purple-500/50 text-white"
                        />
                      </div>
                      <Alert className="bg-purple-900/20 border-purple-500/50">
                        <AlertDescription className="text-purple-200">
                          문제 번호나 링크 중 하나만 입력하면 자동으로 문제 정보를 가져옵니다.
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={handleProblemSubmit}
                        disabled={!problemNumber && !problemLink}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Code className="w-4 h-4 mr-2" />
                        문제 추가
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Problem Stats */}
                  <Card className="bg-gray-800/30 border border-gray-600/50">
                    <CardHeader>
                      <CardTitle className="text-gray-300">📊 문제 통계</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">총 문제 수</span>
                          <span className="text-white font-bold">{problems.length}개</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">활성 문제</span>
                          <span className="text-green-400 font-bold">{problems.filter((p) => p.active).length}개</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">비활성 문제</span>
                          <span className="text-red-400 font-bold">{problems.filter((p) => !p.active).length}개</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Problem List */}
                <Card className="bg-gray-800/30 border border-gray-600/50">
                  <CardHeader>
                    <CardTitle className="text-gray-300">📝 등록된 문제 목록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-600/50">
                            <th className="text-left py-2 text-gray-400">번호</th>
                            <th className="text-left py-2 text-gray-400">제목</th>
                            <th className="text-left py-2 text-gray-400">난이도</th>
                            <th className="text-right py-2 text-gray-400">포인트</th>
                            <th className="text-center py-2 text-gray-400">상태</th>
                            <th className="text-center py-2 text-gray-400">액션</th>
                          </tr>
                        </thead>
                        <tbody>
                          {problems.map((problem) => (
                            <tr key={problem.id} className="border-b border-gray-700/30 hover:bg-gray-800/20">
                              <td className="py-3 text-white font-mono">#{problem.number}</td>
                              <td className="py-3 text-white">{problem.title}</td>
                              <td className="py-3">
                                <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
                                  {problem.difficulty}
                                </Badge>
                              </td>
                              <td className="py-3 text-right text-green-400 font-bold">{problem.points}P</td>
                              <td className="py-3 text-center">
                                <Badge className={problem.active ? "bg-green-600" : "bg-gray-600"}>
                                  {problem.active ? "활성" : "비활성"}
                                </Badge>
                              </td>
                              <td className="py-3 text-center">
                                <div className="flex justify-center space-x-1">
                                  <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Floating Admin Icon */}
      <div className="fixed bottom-4 right-4 pointer-events-none">
        <div className="animate-pulse">
          <div className="text-4xl">🕴️</div>
        </div>
      </div>
    </div>
  )
}
