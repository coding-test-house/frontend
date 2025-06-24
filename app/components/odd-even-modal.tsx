'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Coins, Users, Dice1, Dice2, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TopBetter {
  username: string;
  betAmount: number;
}

interface SideData {
  total: number;
  top: TopBetter[];
  betCount: number;
}

interface BetSummaryResponseDto {
  roundKey: string;
  even: {
    totalBet: number;
    topBettors: { username: string; amount: number }[];
  };
  odd: {
    totalBet: number;
    topBettors: { username: string; amount: number }[];
  };
  myBet: { betType: 'odd' | 'even'; betAmount: number } | null;
  resultType: 'odd' | 'even' | null;
}

interface OddEvenGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OddEvenGameModal({
  isOpen,
  onClose,
}: OddEvenGameModalProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [betAmount, setBetAmount] = useState<number | ''>('');
  const [selectedSide, setSelectedSide] = useState<'odd' | 'even' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gamePhase, setGamePhase] = useState<'betting' | 'rolling' | 'result'>(
    'betting'
  );
  const [userPoints, setUserPoints] = useState<number>(0);
  const [bettingPools, setBettingPools] = useState<{
    odd: SideData;
    even: SideData;
  }>({
    odd: { total: 0, top: [], betCount: 0 },
    even: { total: 0, top: [], betCount: 0 },
  });
  const [resultType, setResultType] = useState<'odd' | 'even' | null>(null);
  const [myBet, setMyBet] = useState<{
    betType: 'odd' | 'even';
    betAmount: number;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const previousPoolRef = useRef<{ oddTotal: number; evenTotal: number }>({
    oddTotal: 0,
    evenTotal: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  useEffect(() => {
    if (username && isOpen && !initialized) {
      fetchGameData();
      fetchUserPoints();
      setInitialized(true);
    }
  }, [username, isOpen, initialized]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  };

  const convertTopBettors = (
    topBettors: { username: string; amount: number }[]
  ): TopBetter[] =>
    topBettors.map(({ username, amount }) => ({ username, betAmount: amount }));

  const fetchUserPoints = useCallback(async () => {
    if (!username) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${username}/point`
      );
      if (!res.ok) throw new Error('포인트 로딩 실패');
      const data = await res.json();
      setUserPoints(data.point);
    } catch (error) {
      console.error(error);
      alert('유저 포인트를 불러오는 중 오류가 발생했습니다.');
    }
  }, [username]);

  const fetchGameData = useCallback(async () => {
    if (!username) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/oddeven/roundSummary/${username}`
      );
      if (!res.ok) throw new Error('게임 데이터 로드 실패');
      const data: BetSummaryResponseDto = await res.json();

      const newOddTotal = data.odd.totalBet;
      const newEvenTotal = data.even.totalBet;

      const { oddTotal, evenTotal } = previousPoolRef.current;

      const hasChanged = newOddTotal !== oddTotal || newEvenTotal !== evenTotal;

      if (hasChanged || !initialized) {
        previousPoolRef.current = {
          oddTotal: newOddTotal,
          evenTotal: newEvenTotal,
        };

        setBettingPools({
          odd: {
            total: newOddTotal,
            top: convertTopBettors(data.odd.topBettors),
            betCount: data.odd.topBettors.length,
          },
          even: {
            total: newEvenTotal,
            top: convertTopBettors(data.even.topBettors),
            betCount: data.even.topBettors.length,
          },
        });

        setMyBet(data.myBet);
        setResultType(data.resultType);
        setSelectedSide(data.myBet?.betType ?? null);
      }
    } catch (error) {
      console.error(error);
      alert('게임 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  }, [username, initialized]);

  useEffect(() => {
    if (gamePhase === 'result') {
      fetchGameData();
    }
  }, [gamePhase, fetchGameData]);

  useEffect(() => {
    if (!isOpen) return;
    const updateTimeLeft = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const currentTotalSeconds = minutes * 60 + seconds;

      if (minutes < 50) {
        const roundEndSeconds = 50 * 60;
        setTimeLeft(roundEndSeconds - currentTotalSeconds);
        setGamePhase('betting');
      } else {
        const nextHour = new Date(now);
        nextHour.setHours(now.getHours() + 1, 0, 0, 0);
        const nextRoundStartSeconds = Math.floor(
          (nextHour.getTime() - now.getTime()) / 1000
        );
        setTimeLeft(nextRoundStartSeconds);
        setGamePhase('result');
      }
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    const polling = setInterval(() => {
      fetchGameData();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(polling);
    };
  }, [isOpen, fetchGameData]);

  const handleBet = async () => {
    if (
      !username ||
      betAmount === '' ||
      !selectedSide ||
      betAmount <= 0 ||
      betAmount > userPoints
    ) {
      alert('유효한 베팅 금액과 선택을 해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/oddeven/bet/${username}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ betAmount, betType: selectedSide }),
        }
      );

      if (!res.ok) throw new Error('베팅 실패');

      await fetchUserPoints();
      alert(
        `${
          selectedSide === 'odd' ? '홀' : '짝'
        }에 ${betAmount.toLocaleString()}P 베팅 완료!`
      );
      setBetAmount('');
      fetchGameData();
    } catch (error) {
      console.error(error);
      alert('베팅 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResultMessage = () => {
    if (!resultType) return '결과 없음';
    if (!myBet)
      return `🎲 ${resultType === 'odd' ? '홀' : '짝'} 승리! (베팅하지 않음)`;

    const didWin = myBet.betType === resultType;
    const resultKor = resultType === 'odd' ? '홀' : '짝';
    return `🎲 ${resultKor} 승리! (${didWin ? '승리' : '패배'})`;
  };

  const getMyBetMessage = () => {
    if (!myBet) return '베팅 내역 없음';
    return `${
      myBet.betType === 'odd' ? '홀' : '짝'
    }에 ${myBet.betAmount.toLocaleString()}P 베팅함`;
  };

  const displayTimeText =
    gamePhase === 'betting' ? '베팅 마감까지' : '게임 오픈까지';
  const displayTimeValue =
    gamePhase === 'betting' ? formatTime(timeLeft) : formatTime(timeLeft);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-gray-900 via-purple-900 to-black border-2 border-red-500/50 shadow-2xl shadow-red-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            <div className="flex items-center space-x-2">
              <Dice1 className="w-8 h-8 text-red-400" />
              <span>🎲 홀짝 게임</span>
              <Dice2 className="w-8 h-8 text-red-400" />
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 게임 상태 표시 */}
          <Card className="bg-black/40 border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/20">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {displayTimeValue}
                    <div className="text-sm text-gray-300">
                      {displayTimeText}
                    </div>
                  </div>

                  {/* <div className="text-sm text-gray-300">
                    {gamePhase === 'betting'
                      ? '베팅 마감까지'
                      : gamePhase === 'result'
                      ? '게임 결과'
                      : '주사위 굴리는 중...'}
                  </div> */}
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-bold">내 포인트</div>
                  <div className="text-2xl font-bold text-white">
                    {userPoints.toLocaleString()}P
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-bold">내 베팅</div>
                  <div className="text-sm font-semibold text-white">
                    {getMyBetMessage()}
                  </div>
                </div>
              </div>

              {gamePhase === 'result' && (
                <Button
                  onClick={() => {
                    setGamePhase('betting');
                    setTimeLeft(45);
                    setSelectedSide(null);
                    setBetAmount('');
                    setResultType(null);
                    setMyBet(null);
                    fetchGameData();
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  다음 게임
                </Button>
              )}
            </CardContent>
          </Card>

          {/* 홀/짝 베팅 카드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(['odd', 'even'] as const).map((side) => {
              const isOdd = side === 'odd';
              const sideData = bettingPools[side];
              const isSelected = selectedSide === side;
              return (
                <Card
                  key={side}
                  className={`bg-gradient-to-br ${
                    isOdd
                      ? 'from-red-800/30 to-pink-800/30'
                      : 'from-blue-800/30 to-cyan-800/30'
                  } border-2 transition-all cursor-pointer ${
                    isSelected
                      ? `${
                          isOdd
                            ? 'border-red-400 shadow-lg shadow-red-400/30 scale-105'
                            : 'border-blue-400 shadow-lg shadow-blue-400/30 scale-105'
                        }`
                      : isOdd
                      ? 'border-red-600/50 hover:border-red-400/70'
                      : 'border-blue-600/50 hover:border-blue-400/70'
                  }`}
                  onClick={() =>
                    gamePhase === 'betting' && setSelectedSide(side)
                  }
                >
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center justify-between ${
                        isOdd ? 'text-red-300' : 'text-blue-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {isOdd ? (
                          <Dice1 className="w-6 h-6" />
                        ) : (
                          <Dice2 className="w-6 h-6" />
                        )}
                        <span>{isOdd ? '홀 (ODD)' : '짝 (EVEN)'}</span>
                      </div>
                      <Badge
                        className={`${
                          isOdd ? 'bg-red-600' : 'bg-blue-600'
                        } text-white`}
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {sideData.betCount}명
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div
                        className={`${
                          isOdd ? 'text-red-400' : 'text-blue-400'
                        } text-3xl font-bold`}
                      >
                        {sideData.total.toLocaleString()}P
                      </div>
                      <div
                        className={`${
                          isOdd ? 'text-red-300' : 'text-blue-300'
                        } text-sm`}
                      >
                        총 베팅액
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4
                        className={`font-medium flex items-center ${
                          isOdd ? 'text-red-300' : 'text-blue-300'
                        }`}
                      >
                        <Crown className="w-4 h-4 mr-1" />
                        베팅 상위 5명
                      </h4>
                      {sideData.top.slice(0, 5).map((better, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2 rounded ${
                            isOdd ? 'bg-red-900/20' : 'bg-blue-900/20'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                idx === 0
                                  ? 'bg-yellow-500 text-black'
                                  : isOdd
                                  ? 'bg-red-600 text-white'
                                  : 'bg-blue-600 text-white'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-white text-sm">
                              {better.username}
                            </span>
                          </div>
                          <span
                            className={`${
                              isOdd ? 'text-red-400' : 'text-blue-400'
                            } font-bold text-sm`}
                          >
                            {better.betAmount.toLocaleString()}P
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* 베팅 폼 */}
          {gamePhase === 'betting' && (
            <Card className="bg-black/40 border-2 border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-purple-300">💰 베팅하기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label
                      className="text-sm text-gray-300"
                      htmlFor="betAmount"
                    >
                      베팅액
                    </label>
                    <Input
                      id="betAmount"
                      type="number"
                      min={1}
                      max={userPoints}
                      value={betAmount === '' ? '' : betAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setBetAmount('');
                          return;
                        }
                        const num = Number(val);
                        if (!isNaN(num) && num >= 0) setBetAmount(num);
                      }}
                      placeholder="베팅할 포인트"
                      className="bg-gray-800/50 border-purple-500/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">선택</label>
                    <div className="text-white font-bold p-2 bg-gray-800/50 rounded border border-purple-500/50">
                      {selectedSide
                        ? selectedSide === 'odd'
                          ? '홀 (ODD)'
                          : '짝 (EVEN)'
                        : '선택하세요'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">액션</label>
                    <Button
                      onClick={handleBet}
                      disabled={
                        isSubmitting ||
                        betAmount === '' ||
                        !selectedSide ||
                        betAmount <= 0 ||
                        betAmount > userPoints
                      }
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>베팅 중...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Coins className="w-4 h-4" />
                          <span>베팅 확정</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>

                {/* 빠른 베팅 버튼 */}
                <div className="flex space-x-2">
                  <span className="text-sm text-gray-400 self-center">
                    빠른 베팅:
                  </span>
                  {[1000, 5000, 10000, '올인'].map((amount) => (
                    <Button
                      key={amount}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setBetAmount(
                          amount === '올인' ? userPoints : (amount as number)
                        )
                      }
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                    >
                      {amount === '올인'
                        ? '올인'
                        : `${(amount as number).toLocaleString()}P`}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 주사위 굴리는 중 애니메이션 */}
          {gamePhase === 'rolling' && (
            <Card className="bg-black/40 border-2 border-yellow-400/50">
              <CardContent className="p-8 text-center">
                <div className="text-8xl animate-bounce mb-4">🎲</div>
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  주사위를 굴리고 있습니다...
                </div>
                <div className="text-gray-300">잠시만 기다려주세요</div>
              </CardContent>
            </Card>
          )}

          {/* 결과 화면 */}
          {gamePhase === 'result' && (
            <Card className="bg-black/40 border-2 border-green-400/50">
              <CardContent className="p-8 text-center">
                <div className="text-8xl mb-4">🎲</div>
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {getResultMessage()}
                </div>
                <div className="text-xl text-gray-300">
                  {!myBet
                    ? '이번 라운드에 베팅하지 않았습니다.'
                    : myBet.betType === resultType
                    ? '🎉 축하합니다! 승리하셨습니다!'
                    : '😢 아쉽게도 패배하셨습니다.'}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
