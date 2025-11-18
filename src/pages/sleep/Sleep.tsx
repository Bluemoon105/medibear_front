"use client";
import { useState, useRef, useEffect } from "react";
import { getUserEmail } from "../../utils/getUserEmail";
import { autoRefreshCheck} from "../../utils/TokenUtils";
import ReportButtonGroup from "../../components/Sleep/ReportButton";
import ChatLayout from "../../layouts/ChatBotLayout";
import ChatInputBar from "../../components/chat/ChatInputBar";
import MessageList from "../../components/chat/MessageList";
interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SleepChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const email = getUserEmail();
  
  // // 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✨ LLM 메시지 전송
  const handleSend = async (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return;
  const userMessage = trimmed;
  const email = getUserEmail();

  if (!email) {
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: "로그인이 필요합니다." }
    ]);
    return;
  }

  setMessages(prev => [...prev, { role: "user", content: userMessage }]);
  setLoading(true);

  try {
    const res = await autoRefreshCheck({
      url: "/chat/message",
      method: "POST",
      data: { email, message: userMessage }
    });

    const botResponse = res.data?.response || "LLM 응답을 가져오지 못했습니다.";

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: botResponse }
    ]);
  } catch (err) {
    console.error("LLM 대화 요청 실패:", err);

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: "서버 연결 중 오류가 발생했습니다." }
    ]);
  } finally {
    setLoading(false);
  }
};
  // ✨ 리포트 버튼 클릭 시
  const handleReport = (type: "daily" | "weekly", content: string) => {
    const title = type === "daily" ? "일간 리포트" : "주간 리포트";
    setMessages((prev) => [
      ...prev,
      { role: "user", content: title },
      { role: "assistant", content },
    ]);
  };

  return (
    <ChatLayout>
      <MessageList messages={messages} loading={loading} bottomRef={bottomRef} />
      <ReportButtonGroup email={email} onReport={handleReport} />
      <ChatInputBar onSend={handleSend}/>
    </ChatLayout>
  )
}