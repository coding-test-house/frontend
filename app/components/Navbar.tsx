'use client';

import Link from 'next/link';
import { useAuth } from '@/app/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { User, Coins, Crown } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="border-b border-purple-500/30 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
            🎰 코테 하우스
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/settlement">
            <Button
              variant="ghost"
              className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
            >
              정산내역
            </Button>
          </Link>
          <Link href="/report">
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
            >
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
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 bg-purple-800/30 px-4 py-2 rounded-lg border border-purple-500/50">
                <User className="w-4 h-4 text-purple-300" />
                <span className="text-purple-200">{user?.username}</span>
                <div className="flex items-center space-x-1">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">
                    hardcoded point
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="text-red-300 hover:text-white"
                  onClick={logout}
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold">
                  <User className="w-4 h-4 mr-2" />
                  로그인 / 회원가입
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
