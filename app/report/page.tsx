'use client';

import type React from 'react';

import { useState } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  Send,
  Shield,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import axios from 'axios';

export default function ReportPage() {
  const [reportType, setReportType] = useState('cheating');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reportTypes = [
    { value: 'cheating', label: '부정행위 / 치팅', icon: '🚫' },
    { value: 'spam', label: '스팸 / 도배', icon: '📢' },
    { value: 'bug', label: '버그 / 오류 신고', icon: '🐛' },
    { value: 'other', label: '기타', icon: '❓' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportType || !email.trim() || !description.trim()) return;

    if (description.length > 200) {
      alert('상세 내용은 200자 이하로 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    const reportTypeEnum = {
      cheating: 'CHEATING',
      spam: 'SPAM',
      bug: 'BUG',
      other: 'ETC',
    }[reportType];

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/report`,
        {
          reportType: reportTypeEnum,
          email,
          content: description,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (!res.data.success) {
        throw new Error(res.data.message || '신고 제출에 실패했습니다.');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setReportType('cheating');
        setEmail('');
        setDescription('');
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('신고 제출 오류:', err);
      alert(
        `신고 제출 실패: ${
          axios.isAxiosError(err)
            ? err.response?.data?.message || '서버 응답 오류'
            : '알 수 없는 오류'
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="border-b border-red-500/30 bg-black/20 backdrop-blur-sm">
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                🚨 신고하기
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-red-300">
              <Shield className="w-5 h-5" />
              <span className="text-sm">안전한 게임 환경을 위해</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Warning Alert */}
        <Alert className="mb-6 bg-red-900/20 border-2 border-red-500/50 shadow-lg shadow-red-500/20">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            <strong>중요:</strong> 허위 신고는 계정 제재의 사유가 될 수
            있습니다. 신중하게 작성해주시고, 구체적인 증거와 함께 신고해주세요.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Form */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 border-2 border-red-400/50 shadow-lg shadow-red-400/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-300">
                  <MessageSquare className="w-5 h-5" />
                  <span>신고 내용 작성</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2">
                      신고가 접수되었습니다
                    </h3>
                    <p className="text-gray-300">
                      신고 내용을 검토한 후 적절한 조치를 취하겠습니다.
                      <br />
                      빠른 시일 내에 처리 결과를 알려드리겠습니다.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Report Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        신고 유형 <span className="text-red-400">*</span>
                      </label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="bg-gray-800/50 border-red-500/50 text-white">
                          <SelectValue placeholder="신고 유형을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center space-x-2">
                                <span>{type.icon}</span>
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        응답 받을 이메일 <span className="text-red-400">*</span>
                      </label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@example.com"
                        className="bg-gray-800/50 border-red-500/50 text-white"
                        required
                        type="email"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        상세 내용 <span className="text-red-400">*</span>
                      </label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="신고 내용을 구체적으로 작성해주세요. 언제, 어디서, 무엇이 일어났는지 자세히 설명해주시면 빠른 처리에 도움이 됩니다."
                        className="bg-gray-800/50 border-red-500/50 text-white min-h-32"
                        required
                      />
                      <div className="text-right text-sm text-gray-400 mt-1">
                        {description.length}/200
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={
                        !reportType || !description.trim() || isSubmitting
                      }
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>신고 제출 중...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="w-4 h-4" />
                          <span>신고 제출</span>
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Guidelines */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-b from-yellow-900/30 to-orange-900/30 border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-yellow-300">
                  <Eye className="w-5 h-5" />
                  <span>신고 가이드라인</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="text-lg">🎯</div>
                    <div>
                      <h4 className="font-medium text-yellow-200">
                        구체적으로 작성
                      </h4>
                      <p className="text-sm text-gray-300">
                        언제, 어디서, 무엇이 일어났는지 자세히
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-lg">📸</div>
                    <div>
                      <h4 className="font-medium text-yellow-200">증거 자료</h4>
                      <p className="text-sm text-gray-300">
                        스크린샷이나 채팅 로그 등 첨부
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-lg">⚡</div>
                    <div>
                      <h4 className="font-medium text-yellow-200">
                        신속한 신고
                      </h4>
                      <p className="text-sm text-gray-300">
                        문제 발생 즉시 신고할수록 효과적
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-blue-900/30 to-cyan-900/30 border-2 border-blue-400/50 shadow-lg shadow-blue-400/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-300">
                  <Shield className="w-5 h-5" />
                  <span>처리 절차</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <span className="text-blue-200">신고 접수 및 확인</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <span className="text-blue-200">관리팀 검토 및 조사</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <span className="text-blue-200">적절한 조치 시행</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <span className="text-blue-200">결과 통보</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Warning Icon */}
      <div className="fixed bottom-4 right-4 pointer-events-none">
        <div className="animate-pulse">
          <div className="text-4xl">🚨</div>
        </div>
      </div>
    </div>
  );
}
