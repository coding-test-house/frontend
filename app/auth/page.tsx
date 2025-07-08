'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  Crown,
} from 'lucide-react';
import SignupGuideModal from '@/app/auth/SignupGuideModal';

import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import SessionSelectModal from './component/SessionSelectModal';
export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const { login } = useAuth();
  // Login state
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // Register state
  const [registerData, setRegisterData] = useState({
    bojId: '',
    password: '',
    confirmPassword: '',
    sessionNumber: '',
  });

  const [bojVerification, setBojVerification] = useState({
    isVerifying: false,
    isVerified: false,
    isError: false,
    message: '',
  });

  // Floating chips animation
  const [chips, setChips] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    // Generate floating chips
    const newChips = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setChips(newChips);
  }, []);

  const handleBojVerification = async () => {
    if (!registerData.bojId.trim()) return;

    setBojVerification({
      isVerifying: true,
      isVerified: false,
      isError: false,
      message: '',
    });

    // 백준 아이디 검증 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 랜덤하게 성공/실패 결정 (실제로는 백준 API 호출)
    // const isValid = false

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/confirm`,
        {
          method: 'POST',
          headers: {
            'content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: registerData.bojId,
            classes: registerData.sessionNumber,
          }),
        }
      );
      if (res.status != 200) {
        setBojVerification({
          isVerifying: false,
          isVerified: false,
          isError: true,
          message:
            '존재하지 않는 백준 아이디 또는 회차 설정을 하지 않은 계정입니다. 다시 확인해주세요',
        });
        throw new Error('인증 실패');
      } else {
        setBojVerification({
          isVerifying: false,
          isVerified: true,
          isError: false,
          message: '백준 아이디가 확인되었습니다! 🎉',
        });
      }
    } catch (err) {
      alert('인증 실패');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) return;
    console.log(loginData);
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: loginData.username,
            password: loginData.password,
          }),
        }
      );

      if (res.status != 200) throw new Error('로그인 실패');

      // 예: 토큰 처리 및 라우팅
      const data = await res.json();
      const accessToken = data.data.accessToken;
      console.log('로그인 성공:', data);
      login(accessToken, loginData.username);
      localStorage.setItem('username', loginData.username);
      localStorage.setItem('accessToken', accessToken);
      setIsEntering(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/');
    } catch (err) {
      console.log(err);
      alert('로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !bojVerification.isVerified ||
      !registerData.password ||
      !registerData.confirmPassword ||
      !registerData.sessionNumber
    ) {
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: registerData.bojId,
            password: registerData.password,
            classes: registerData.sessionNumber,
          }),
        }
      );

      if (!res.ok) throw new Error('회원가입 실패');

      const data = await res.json();
      console.log('회원가입 성공:', data);

      setIsEntering(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.reload();
    } catch (err: any) {
      alert(err.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEntering) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="text-8xl mb-8 animate-bounce">🎰</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4 animate-pulse">
            코테 하우스 입장 중...
          </h1>
          <div className="flex justify-center space-x-2">
            <div
              className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
        </div>

        {/* Floating chips during entrance */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s',
              }}
            >
              🪙
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background floating chips */}
      <div className="absolute inset-0 pointer-events-none">
        {chips.map((chip) => (
          <div
            key={chip.id}
            className="absolute text-2xl opacity-20 animate-pulse"
            style={{
              left: `${chip.x}%`,
              top: `${chip.y}%`,
              animationDelay: `${chip.delay}s`,
            }}
          >
            🪙
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="w-full max-w-md relative z-10">
        {/* Welcome message */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🎰</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
            코테 하우스에 오신 것을
          </h1>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
            환영합니다! 🎉
          </h1>
          <p className="text-gray-300">알고리즘과 베팅의 스릴을 경험하세요</p>
        </div>

        {/* Auth card */}
        <Card className="bg-black/40 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-400/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 text-cyan-300">
              <Crown className="w-6 h-6" />
              <span>VIP 입장</span>
              <Crown className="w-6 h-6" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-purple-500/50">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                >
                  로그인
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
                >
                  회원가입
                </TabsTrigger>
              </TabsList>
              {activeTab === 'register' && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md px-5 py-2 rounded-md"
                    onClick={() => setGuideOpen(true)}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    회원가입 방법 보기
                  </Button>
                </div>
              )}

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username" className="text-gray-300">
                      아이디
                    </Label>
                    <Input
                      id="login-username"
                      type="text"
                      value={loginData.username}
                      onChange={(e) =>
                        setLoginData({ ...loginData, username: e.target.value })
                      }
                      placeholder="아이디를 입력하세요"
                      className="bg-gray-800/50 border-purple-500/50 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-300">
                      비밀번호
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        placeholder="비밀번호를 입력하세요"
                        className="bg-gray-800/50 border-purple-500/50 text-white placeholder:text-gray-400 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      isLoading || !loginData.username || !loginData.password
                    }
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>입장 중...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>게임 시작!</span>
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="boj-id" className="text-gray-300">
                      백준 아이디 <span className="text-red-400">*</span>
                    </Label>
                    <div className="flex space-x-3">
                      <Input
                        id="boj-id"
                        type="text"
                        value={registerData.bojId}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            bojId: e.target.value,
                          })
                        }
                        placeholder="백준 아이디"
                        className="bg-gray-800/50 border-purple-500/50 text-white placeholder:text-gray-400"
                        disabled={bojVerification.isVerified}
                        required
                      />
                      <SessionSelectModal
                        sessionNumber={registerData.sessionNumber}
                        onChange={(selected) =>
                          setRegisterData({
                            ...registerData,
                            sessionNumber: selected,
                          })
                        }
                        disabled={bojVerification.isVerified}
                      />
                      <Button
                        type="button"
                        onClick={handleBojVerification}
                        disabled={
                          bojVerification.isVerifying ||
                          bojVerification.isVerified ||
                          !registerData.bojId.trim() ||
                          !registerData.sessionNumber
                        }
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50"
                      >
                        {bojVerification.isVerifying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : bojVerification.isVerified ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          '검증'
                        )}
                      </Button>
                    </div>
                    {bojVerification.message && (
                      <Alert
                        className={`${
                          bojVerification.isError
                            ? 'border-red-500/50 bg-red-900/20'
                            : 'border-green-500/50 bg-green-900/20'
                        }`}
                      >
                        <AlertDescription
                          className={
                            bojVerification.isError
                              ? 'text-red-200'
                              : 'text-green-200'
                          }
                        >
                          {bojVerification.isError ? (
                            <XCircle className="w-4 h-4 inline mr-2" />
                          ) : (
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                          )}
                          {bojVerification.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="space-y-2"></div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="register-password"
                      className="text-gray-300"
                    >
                      비밀번호 <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      placeholder="비밀번호를 입력하세요"
                      className="bg-gray-800/50 border-purple-500/50 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-300">
                      비밀번호 확인 <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="비밀번호를 다시 입력하세요"
                      className="bg-gray-800/50 border-purple-500/50 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      !bojVerification.isVerified ||
                      !registerData.password ||
                      !registerData.confirmPassword ||
                      !registerData.sessionNumber ||
                      registerData.password !== registerData.confirmPassword
                    }
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>가입 중...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Crown className="w-4 h-4" />
                        <span>VIP 회원가입</span>
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>🎲 행운을 빕니다! 책임감 있는 베팅을 하세요 🎲</p>
        </div>
        <SignupGuideModal open={guideOpen} onOpenChange={setGuideOpen} />
      </div>
    </div>
  );
}
