'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  user: string;
  message: string;
  time: string;
}

export default function RealTimeChat() {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null); // ✅ 추가
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) return;

    setUsername(storedUsername);

    let socket: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/chat`);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('🔌 WebSocket 연결됨');
      };

      socket.onmessage = (event) => {
        const text = event.data;
        const [user, msg] = text.split(': ');
        const newMessage: ChatMessage = {
          user,
          message: msg,
          time: new Date().toLocaleTimeString(),
        };
        setChatMessages((prev) => [...prev, newMessage]);
      };

      socket.onclose = () => {
        console.log('❌ WebSocket 연결 종료. 2초 후 재연결 시도...');
        reconnectTimer = setTimeout(connect, 2000); // 2초 후 재연결 시도
      };

      socket.onerror = (error) => {
        console.error('⚠️ WebSocket 오류 발생', error);
        socket.close(); // 에러 시 소켓 닫고 onclose로 넘어감
      };
    };

    connect(); // 초기 연결

    return () => {
      clearTimeout(reconnectTimer); // 재연결 타이머 정리
      socket?.close(); // 소켓 종료
    };
  }, []);

  const chatBoxRef = useRef<HTMLDivElement | null>(null); // ✅ 채팅창 컨테이너 참조

  useEffect(() => {
    // 채팅이 추가될 때 채팅창만 스크롤
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!message.trim() || !username || !socketRef.current) return;

    const fullMessage = `${username}: ${message}`;
    socketRef.current.send(fullMessage);

    setMessage('');
  };

  return (
    <Card className="bg-black/40 border-2 border-blue-400/50 shadow-lg shadow-blue-400/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-300">
          <MessageCircle className="w-5 h-5" />
          <span>실시간 채팅</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chatBoxRef} className="space-y-3 h-64 overflow-y-auto">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className="p-2 bg-gray-800/30 rounded border-l-2 border-blue-400/50"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-300 font-medium text-sm">
                  {msg.user}
                </span>
                <span className="text-gray-400 text-xs">{msg.time}</span>
              </div>
              <p className="text-gray-200 text-sm">{msg.message}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              username ? '메시지를 입력하세요...' : '로그인 후 사용 가능합니다'
            }
            className="bg-gray-900/50 border-blue-500/50 text-white"
            disabled={!username}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return; // ✅ 한글 조합 중이면 무시
              if (e.key === 'Enter') {
                e.preventDefault(); // ✅ 줄바꿈 방지
                handleSend();
              }
            }}
          />
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSend}
            disabled={!username}
          >
            전송
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
