'use client';

import { useState, useEffect } from 'react';
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

interface OddEvenGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
  onPointsUpdate: (points: number) => void;
}

export default function OddEvenGameModal({
  isOpen,
  onClose,
  userPoints,
  onPointsUpdate,
}: OddEvenGameModalProps) {
  const [betAmount, setBetAmount] = useState('');
  const [selectedSide, setSelectedSide] = useState<'odd' | 'even' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gamePhase, setGamePhase] = useState<'betting' | 'rolling' | 'result'>(
    'betting'
  );
  const [diceResult, setDiceResult] = useState<number | null>(null);

  // Mock data for betting pools
  const bettingPools = {
    odd: {
      totalAmount: 45680,
      betCount: 23,
      topBetters: [
        { user: '베팅마스터', amount: 8500 },
        { user: '올인각', amount: 7200 },
        { user: '홀수킹', amount: 6800 },
        { user: '도박러버', amount: 5500 },
        { user: '알고마스터', amount: 4200 },
      ],
    },
    even: {
      totalAmount: 38920,
      betCount: 19,
      topBetters: [
        { user: '짝수신', amount: 9200 },
        { user: '코딩킹', amount: 6700 },
        { user: '이븐마스터', amount: 5800 },
        { user: '포인트왕', amount: 4900 },
        { user: '베팅고수', amount: 3600 },
      ],
    },
  };

  const [timeLeft, setTimeLeft] = useState(45); // 45초 카운트다운

  useEffect(() => {
    if (isOpen && gamePhase === 'betting') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGamePhase('rolling');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, gamePhase]);

  useEffect(() => {
    if (gamePhase === 'rolling') {
      // 주사위 굴리기 애니메이션 시뮬레이션
      setTimeout(() => {
        const result = Math.floor(Math.random() * 6) + 1;
        setDiceResult(result);
        setGamePhase('result');
      }, 3000);
    }
  }, [gamePhase]);

  const handleBet = () => {
    if (!betAmount || !selectedSide || Number.parseInt(betAmount) > userPoints)
      return;

    setIsSubmitting(true);

    // 베팅 처리 시뮬레이션
    setTimeout(() => {
      const betValue = Number.parseInt(betAmount);
      onPointsUpdate(userPoints - betValue);
      setIsSubmitting(false);
      setBetAmount('');
      alert(
        `${selectedSide === 'odd' ? '홀' : '짝'}에 ${betValue.toLocaleString()}P 베팅 완료!`
      );
    }, 1000);
  };

  const resetGame = () => {
    setGamePhase('betting');
    setTimeLeft(45);
    setDiceResult(null);
    setSelectedSide(null);
    setBetAmount('');
  };

  const getResultMessage = () => {
    if (!diceResult) return '';
    const isOdd = diceResult % 2 === 1;
    const winner = isOdd ? '홀' : '짝';
    return `🎲 ${diceResult} - ${winner} 승리!`;
  };

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
          {/* Game Status */}
          <Card className="bg-black/40 border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">
                      {gamePhase === 'betting'
                        ? timeLeft
                        : gamePhase === 'rolling'
                          ? '🎲'
                          : getResultMessage()}
                    </div>
                    <div className="text-sm text-gray-300">
                      {gamePhase === 'betting'
                        ? '베팅 마감까지'
                        : gamePhase === 'rolling'
                          ? '주사위 굴리는 중...'
                          : '게임 결과'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold">내 포인트</div>
                    <div className="text-2xl font-bold text-white">
                      {userPoints.toLocaleString()}P
                    </div>
                  </div>
                </div>
                {gamePhase === 'result' && (
                  <Button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    다음 게임
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Odd Side */}
            <Card
              className={`bg-gradient-to-br from-red-800/30 to-pink-800/30 border-2 transition-all cursor-pointer ${
                selectedSide === 'odd'
                  ? 'border-red-400 shadow-lg shadow-red-400/30 scale-105'
                  : 'border-red-600/50 hover:border-red-400/70'
              }`}
              onClick={() => gamePhase === 'betting' && setSelectedSide('odd')}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-red-300">
                  <div className="flex items-center space-x-2">
                    <Dice1 className="w-6 h-6" />
                    <span>홀 (ODD)</span>
                  </div>
                  <Badge className="bg-red-600 text-white">
                    <Users className="w-3 h-3 mr-1" />
                    {bettingPools.odd.betCount}명
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">
                    {bettingPools.odd.totalAmount.toLocaleString()}P
                  </div>
                  <div className="text-sm text-red-300">총 베팅액</div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-red-300 flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    베팅 상위 5명
                  </h4>
                  {bettingPools.odd.topBetters.map((better, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-red-900/20 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0
                              ? 'bg-yellow-500 text-black'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="text-white text-sm">
                          {better.user}
                        </span>
                      </div>
                      <span className="text-red-400 font-bold text-sm">
                        {better.amount.toLocaleString()}P
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Even Side */}
            <Card
              className={`bg-gradient-to-br from-blue-800/30 to-cyan-800/30 border-2 transition-all cursor-pointer ${
                selectedSide === 'even'
                  ? 'border-blue-400 shadow-lg shadow-blue-400/30 scale-105'
                  : 'border-blue-600/50 hover:border-blue-400/70'
              }`}
              onClick={() => gamePhase === 'betting' && setSelectedSide('even')}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-blue-300">
                  <div className="flex items-center space-x-2">
                    <Dice2 className="w-6 h-6" />
                    <span>짝 (EVEN)</span>
                  </div>
                  <Badge className="bg-blue-600 text-white">
                    <Users className="w-3 h-3 mr-1" />
                    {bettingPools.even.betCount}명
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {bettingPools.even.totalAmount.toLocaleString()}P
                  </div>
                  <div className="text-sm text-blue-300">총 베팅액</div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-blue-300 flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    베팅 상위 5명
                  </h4>
                  {bettingPools.even.topBetters.map((better, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-blue-900/20 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0
                              ? 'bg-yellow-500 text-black'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="text-white text-sm">
                          {better.user}
                        </span>
                      </div>
                      <span className="text-blue-400 font-bold text-sm">
                        {better.amount.toLocaleString()}P
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Betting Controls */}
          {gamePhase === 'betting' && (
            <Card className="bg-black/40 border-2 border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-purple-300">💰 베팅하기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">베팅액</label>
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder="베팅할 포인트"
                      className="bg-gray-800/50 border-purple-500/50 text-white"
                      max={userPoints}
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
                        !betAmount ||
                        !selectedSide ||
                        Number.parseInt(betAmount) > userPoints ||
                        Number.parseInt(betAmount) <= 0 ||
                        isSubmitting
                      }
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

                {/* Quick Bet Buttons */}
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
                          amount === '올인'
                            ? userPoints.toString()
                            : amount.toString()
                        )
                      }
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                    >
                      {amount === '올인'
                        ? '올인'
                        : `${amount.toLocaleString()}P`}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rolling Animation */}
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

          {/* Result */}
          {gamePhase === 'result' && diceResult && (
            <Card className="bg-black/40 border-2 border-green-400/50">
              <CardContent className="p-8 text-center">
                <div className="text-8xl mb-4">🎲</div>
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {getResultMessage()}
                </div>
                <div className="text-xl text-gray-300">
                  {selectedSide &&
                  ((diceResult % 2 === 1 && selectedSide === 'odd') ||
                    (diceResult % 2 === 0 && selectedSide === 'even'))
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
