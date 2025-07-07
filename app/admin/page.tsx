'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';
import Link from 'next/link';
import { useEffect } from 'react';

type Problem = {
  title: string;
  problemNumber: string;
  url: string;
  difficulty: string;
  point: number;
  day: string;
};

type User = {
  username: string;
  classes: string;
  point: number;
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [searchUser, setSearchUser] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pointAdjustment, setPointAdjustment] = useState('');

  // Notice state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeInfo, setNoticeInfo] = useState('');

  // Problem state
  const [problemNumber, setProblemNumber] = useState('');
  const [problemLink, setProblemLink] = useState('');
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDay, setProblemDay] = useState('');
  const [problemDifficulty, setProblemDifficulty] = useState('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchProblems = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/problem`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      if (res.data.success) {
        setProblems(res.data.data); // 응답의 data가 배열
      }
    } catch (err) {
      console.error('문제 목록 불러오기 실패', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('사용자 목록 불러오기 실패', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProblems();
  }, []);

  const handleUserSearch = () => {
    const user = users.find((u) => u.username.includes(searchUser));
    setSelectedUser(user || null);
  };

  const handlePointAdjustment = async () => {
    if (!selectedUser || !pointAdjustment) return;

    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/points`,
        {
          username: selectedUser.username,
          delta: pointAdjustment,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (res.data.success) {
        alert(`${res.data.message}`);
        fetchUsers();
        setPointAdjustment('');
      } else {
        alert(`포인트 조정 실패: ${res.data.message}`);
      }
    } catch (err) {
      console.error('포인트 조정 실패', err);
      alert('포인트 조정 중 오류가 발생했습니다.');
    }
  };

  const handleNoticeSubmit = async () => {
    if (!noticeTitle || !noticeContent || !noticeInfo) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/notice`,
        {
          title: noticeTitle,
          content: noticeContent,
          gameInfo: noticeInfo,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (res.data.success) {
        alert(res.data.message); // "공지사항 수정 완료"
        setNoticeTitle('');
        setNoticeContent('');
        setNoticeInfo('');
      } else {
        alert(`등록 실패: ${res.data.message}`);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(`${err.response.data.message}`);
      } else {
        alert('알 수 없는 오류 발생');
      }
      console.error(err);
    }
  };

  const handleProblemSubmit = async () => {
    if (!problemTitle || (!problemNumber && !problemLink) || !problemDay) {
      alert('문제에 대한 모든 정보를 입력해주세요.');
      return;
    }

    console.log('BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/problem`,
        {
          title: problemTitle,
          problemNumber,
          url: problemLink,
          difficulty: problemDifficulty,
          day: problemDay,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (res.data.success) {
        alert(`${res.data.message}`);
        setProblemTitle('');
        setProblemNumber('');
        setProblemLink('');
        setProblemDay('');
        fetchProblems();
      } else {
        alert(`등록 실패: ${res.data.message}`);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(`${err.response.data.message}`);
      } else {
        alert('알 수 없는 오류 발생');
      }
      console.error(err);
    }
  };

  const handleDeleteProblem = async (problemNumber: string) => {
    if (!confirm(`문제 #${problemNumber}를 삭제하시겠습니까?`)) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/problem/${problemNumber}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (res.data.success) {
        alert(res.data.message); // "문제 삭제 성공"
        fetchProblems(); // 목록 갱신
      } else {
        alert(`삭제 실패: ${res.data.message}`);
      }
    } catch (err) {
      console.error('문제 삭제 중 오류 발생', err);
      alert('문제 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-red-500/30 bg-black/40 backdrop-blur-sm">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                🎯 관리자 모드
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
        {/* Main Admin Panel */}
        <Card className="bg-black/40 border-2 border-red-400/50 shadow-2xl shadow-red-400/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-300">
              <Settings className="w-6 h-6" />
              <span>관리자 제어판</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
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
                      <CardTitle className="text-blue-300">
                        🔍 사용자 검색
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          value={searchUser}
                          onChange={(e) => setSearchUser(e.target.value)}
                          placeholder="아이디 또는 백준 아이디 입력"
                          className="bg-gray-900/50 border-blue-500/50 text-white"
                        />
                        <Button
                          onClick={handleUserSearch}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>

                      {selectedUser && (
                        <div className="p-4 bg-gray-900/50 rounded-lg border border-blue-400/30">
                          <h4 className="font-bold text-blue-300 mb-2">
                            사용자 정보
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="text-gray-400">백준 ID:</span>{' '}
                              {selectedUser.username}
                            </p>
                            <p>
                              <span className="text-gray-400">회차:</span>{' '}
                              {selectedUser.round}
                            </p>

                            <p>
                              <span className="text-gray-400">포인트:</span>{' '}
                              <span className="text-yellow-400 font-bold">
                                {selectedUser.point.toLocaleString()}P
                              </span>
                            </p>
                            <p>
                              <span className="text-gray-400">가입일:</span>{' '}
                              {selectedUser.joinDate}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Point Adjustment */}
                  <Card className="bg-gray-800/30 border border-yellow-500/50">
                    <CardHeader>
                      <CardTitle className="text-yellow-300">
                        💰 포인트 조정
                      </CardTitle>
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
                      <Button
                        onClick={handlePointAdjustment}
                        disabled={!selectedUser || !pointAdjustment}
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
                    <CardTitle className="text-gray-300">
                      👥 전체 사용자 목록
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-600/50">
                            <th className="text-left py-2 text-gray-400">
                              백준 ID
                            </th>
                            <th className="text-center py-2 text-gray-400">
                              회차
                            </th>
                            <th className="text-right py-2 text-gray-400">
                              포인트
                            </th>
                            <th className="text-center py-2 text-gray-400">
                              선택
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr
                              key={user.username}
                              className="border-b border-gray-700/30 hover:bg-gray-800/20"
                            >
                              <td className="py-3 text-gray-300">
                                {user.username}
                              </td>
                              <td className="py-3 text-center text-gray-300">
                                {user.classes}
                              </td>
                              <td className="py-3 text-right text-yellow-400 font-bold">
                                {user.point.toLocaleString()}P
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
                      <CardTitle className="text-green-300">
                        📢 공지사항 등록
                      </CardTitle>
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
                      <div className="space-y-2">
                        <Label className="text-gray-300">게임 정보</Label>
                        <Textarea
                          value={noticeInfo}
                          onChange={(e) => setNoticeInfo(e.target.value)}
                          placeholder="게임 정보를 입력하세요"
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
                      <CardTitle className="text-gray-300">
                        👁️ 미리보기
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {noticeTitle || noticeContent || noticeInfo ? (
                        <div className="p-4 bg-gradient-to-r from-purple-800/50 to-blue-800/50 border-2 border-cyan-400/50 rounded-lg">
                          <h4 className="text-cyan-300 font-bold mb-2">
                            {noticeTitle || '제목을 입력하세요'}
                          </h4>
                          <p className="text-cyan-100 text-sm">
                            {noticeContent || '내용을 입력하세요'}
                          </p>
                          <p className="text-cyan-100 text-sm">
                            {noticeInfo || '게임 정보를 입력하세요'}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          제목과 내용을 입력하면 미리보기가 표시됩니다
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Problem Management Tab */}
              <TabsContent value="problems" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add Problem */}
                  <Card className="bg-gray-800/30 border border-purple-500/50">
                    <CardHeader>
                      <CardTitle className="text-purple-300">
                        🧩 문제 등록
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">문제 제목</Label>
                        <Input
                          value={problemTitle}
                          onChange={(e) => setProblemTitle(e.target.value)}
                          placeholder="예: A+B"
                          className="bg-gray-900/50 border-purple-500/50 text-white"
                        />
                      </div>
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
                        <Label className="text-gray-300">백준 링크</Label>
                        <Input
                          value={problemLink}
                          onChange={(e) => setProblemLink(e.target.value)}
                          placeholder="예: https://www.acmicpc.net/problem/1001"
                          className="bg-gray-900/50 border-purple-500/50 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">난이도</Label>
                        <Input
                          value={problemDifficulty}
                          onChange={(e) => setProblemDifficulty(e.target.value)}
                          placeholder="예: B1, S2"
                          className="bg-gray-900/50 border-purple-500/50 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">날짜</Label>
                        <Input
                          value={problemDay}
                          onChange={(e) => setProblemDay(e.target.value)}
                          placeholder="예: 2025-07-02"
                          className="bg-gray-900/50 border-purple-500/50 text-white"
                        />
                      </div>
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
                      <CardTitle className="text-gray-300">
                        📊 문제 통계
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">총 문제 수</span>
                          <span className="text-white font-bold">
                            {problems.length}개
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Problem List */}
                <Card className="bg-gray-800/30 border border-gray-600/50">
                  <CardHeader>
                    <CardTitle className="text-gray-300">
                      📝 등록된 문제 목록
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-600/50">
                            <th className="text-left py-2 text-gray-400">
                              번호
                            </th>
                            <th className="text-left py-2 text-gray-400">
                              제목
                            </th>
                            <th className="text-left py-2 text-gray-400">
                              난이도
                            </th>
                            <th className="text-center py-2 text-gray-400">
                              날짜
                            </th>
                            <th className="text-right py-2 text-gray-400">
                              포인트
                            </th>
                            <th className="text-center py-2 text-gray-400">
                              삭제
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {problems.map((problem, index) => (
                            <tr key={index} className="hover:bg-gray-800/20">
                              <td className="py-3 text-white font-mono">
                                #{problem.problemNumber}
                              </td>
                              <td className="py-3 text-white">
                                {problem.title}
                              </td>
                              <td className="py-3 text-gray-300">
                                {problem.difficulty}
                              </td>
                              <td className="py-3 text-center text-white">
                                {problem.day}
                              </td>
                              <td className="py-3 text-right text-green-400 font-bold">
                                {problem.point}
                              </td>{' '}
                              <td className="py-3 text-center">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() =>
                                    handleDeleteProblem(problem.problemNumber)
                                  }
                                >
                                  <Trash2 className="w-4 h-4" />
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
  );
}
