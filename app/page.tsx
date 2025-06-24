'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  Trophy,
  MessageCircle,
  User,
  Coins,
  TrendingUp,
  TrendingDown,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from './auth/AuthContext';
import { AuthProvider } from './auth/AuthContext';
import RealTimeChat from './components/RealTimeChat';
import Link from 'next/link';
import OddEvenGameModal from './components/odd-even-modal';
import axios from 'axios';
import TodayNotice from './components/TodayNotice';
import RankingCard from './components/RankingCard';
import Navbar from './components/Navbar';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CoteHouse() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userPoints, setUserPoints] = useState(15420);
  const [selectedTab, setSelectedTab] = useState('전체');
  const [isOddEvenModalOpen, setIsOddEvenModalOpen] = useState(false);  
  const [username, setUsername] = useState<string | null>(null);

  interface Problem {
    id: number;
    title: string;
    difficulty: string;
    points: number;
    checked: boolean;
  }

  const [problemsState, setProblemsState] = useState<Problem[]>([]);
  // const userId = '6658f86789d4af26695f8910'

  const { user, logout, isAuthenticated } = useAuth();
  
  useEffect(() => {
    const saved = localStorage.getItem("username") || null;
    setUsername(saved);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const problemRes = await axios.get(`${baseURL}/admin/problem/${today}`);
        const problemList = problemRes.data.data;
        console.log(problemList)
  
        const problems = problemList.map((p: any) => ({
          id: Number(p.problemNumber),
          title: p.title,
          difficulty: p.difficulty,
          points: p.point,
          checked: false,
        }));
  
        const storageUsername = localStorage.getItem("username");
        setUsername(storageUsername);

        const solvedRes = await axios.get(`${baseURL}/users/${storageUsername}/solved`);
        const solvedIds: string[] = solvedRes.data;
  
        const updated = problems.map((problem: Problem) =>
          solvedIds.includes(problem.id.toString())
            ? { ...problem, checked: true }
            : problem
        );        
  
        setProblemsState(updated);
      } catch (err) {
        console.error('문제 또는 해결 정보 불러오기 실패:', err);
      }
    };
  
    fetchData(); 
  }, []);
  

  const handleProblemCheckClick = async (problemId: number) => {
    try {
      const response = await axios.get(`${baseURL}/solvedCheck/check`, {
        params: {
          user: username,
          problem: problemId,
        },
      });

      const result = response.data;
      if (result === true) {
        // 문제 점수 찾아서 delta 설정
        const delta = problemsState.find((p) => p.id === problemId)?.points ?? 0;

        // 1. solved 기록 등록
        await axios.post(`${baseURL}/users/${username}/solved/${problemId}`);

        // 2. 포인트 증가 요청
        const userScoreRequestData = {
          username: username,
          delta: delta,
        };

        await axios.patch(`${baseURL}/admin/points`, userScoreRequestData);

        // 3. 상태 업데이트
        const updated = problemsState.map((problem) =>
          problem.id === problemId ? { ...problem, checked: true } : problem
        );
        setProblemsState(updated);

        alert('풀이 성공! 포인트가 반영되었습니다.');
      } else {
        alert('문제를 풀고 체크해주세요!');
      }
    } catch (error) {
      console.error('요청 실패:', error);
      alert('오류가 발생했습니다.');
    }
  }

  // useEffect(() => {
  //   console.log('🔁 상태 변경됨:', problemsState);
  // }, [problemsState]);
  

  const games = [
    {
      id: 1,
      name: '홀짝 게임',
      time: '14:00',
      status: 'active',
      thumbnail: '🎲',
    },
    {
      id: 2,
      name: '알고리즘 배틀',
      time: '16:00',
      status: 'upcoming',
      thumbnail: '⚔️',
    },
    {
      id: 3,
      name: '데이터구조 퀴즈',
      time: '18:00',
      status: 'upcoming',
      thumbnail: '🧩',
    },
    {
      id: 4,
      name: 'DP 마스터',
      time: '20:00',
      status: 'upcoming',
      thumbnail: '🎯',
    },
  ];

  const handleGameClick = (gameId: number) => {
    if (gameId === 1) {
      setIsOddEvenModalOpen(true);
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Notice Section */}
              <TodayNotice />

              {/* Today's Problems */}
              <Card className="bg-black/40 border-2 border-green-400/50 shadow-lg shadow-green-400/20">
                <CardHeader>
                  <CardTitle className="text-green-300">
                    📚 오늘의 백준 문제
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {problemsState.map((problem) => (
                      <div
                        key={problem.id}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600/50 hover:border-green-400/50 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-400 font-mono">
                            #{problem.id}
                          </span>
                          <span className="text-white font-medium">
                            {problem.title}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-yellow-400 border-yellow-400/50"
                          >
                            {problem.difficulty}
                          </Badge>
                          <span className="text-green-400 font-bold">
                            {problem.points}P
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          className={`transition-all ${
                            problem.checked
                              ? 'bg-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                          }`}
                          onClick={() => handleProblemCheckClick(problem.id)}
                          disabled={problem.checked}
                        >
                          {problem.checked ? '제출완료' : '제출 ㄱ?'}
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
                      game.status === 'active'
                        ? 'bg-gradient-to-br from-green-800/50 to-emerald-800/50 border-2 border-green-400 shadow-lg shadow-green-400/30 animate-pulse'
                        : 'bg-gray-800/30 border border-gray-600/50'
                    }`}
                  >
                    {game.status === 'upcoming' && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 backdrop-blur-sm">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🔒</div>
                          <div className="text-yellow-400 font-bold text-lg">
                            {game.time} 공개
                          </div>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6 text-center">
                      <div className="text-6xl mb-4">{game.thumbnail}</div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {game.name}
                      </h3>
                      <p className="text-gray-300">시작 시간: {game.time}</p>
                      {game.status === 'active' && (
                        <Button
                          onClick={() => handleGameClick(game.id)}
                          className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold"
                        >
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
              <RankingCard />
              <RealTimeChat />
            </div>
          </div>
        </div>

        {/* Odd Even Game Modal */}
        <OddEvenGameModal
          isOpen={isOddEvenModalOpen}
          onClose={() => setIsOddEvenModalOpen(false)}
        />
      </div>
    </AuthProvider>
  );
}
