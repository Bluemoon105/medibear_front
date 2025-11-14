"use client";
import { useState, useRef, useEffect } from "react";
import axios from "../../config/setAxios";
import InputBar from "../../components/InputBar/InputBar";
import ReportButtonGroup from "../../components/Sleep/ReportButton";
import ChatMessageBubble from "../../components/ChatMessageBubble";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SleepChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const memberNo = 2;
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✨ LLM 메시지 전송
  const handleSend = async (data: any) => {
    if (!data.text.trim()) return;
    const userMessage = data.text.trim();

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await axios.post("/chat/message", {
        memberNo,
        message: userMessage,
      });

      const botResponse =
        res.data?.response || "LLM 응답을 가져오지 못했습니다.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: botResponse },
      ]);
    } catch (err) {
      console.error("LLM 대화 요청 실패:", err);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "서버 연결 중 오류가 발생했습니다." },
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
    <div className="flex h-screen bg-[#FFFCF6] text-black overflow-hidden">
      {/* 메인 영역 */}
      <main className="flex flex-col flex-1 items-center overflow-hidden">
        
        {/* 채팅 메시지 리스트 */}
        <div
          className="
            w-full max-w-[1027px] flex-1 
            px-4 md:px-6 lg:px-8 py-8 
            flex flex-col gap-3
            overflow-y-auto
          "
        >
          {messages.map((msg, idx) => (
            <ChatMessageBubble
              key={idx}
              from={msg.role === "user" ? "user" : "ai"}
              text={msg.content}
            />
          ))}

          {loading && (
            <ChatMessageBubble from="ai" text="응답 생성 중..." />
          )}

          <div ref={bottomRef} />
        </div>

        {/* 하단: 리포트 버튼 + 입력 */}
        <div
          className="
            w-full max-w-[1027px]
            flex flex-col gap-3
            pb-5 px-2
            flex-shrink-0
          "
        >
          <ReportButtonGroup memberNo={memberNo} onReport={handleReport} />
          <InputBar variant="sleep" onSend={handleSend} />
        </div>
      </main>
    </div>
  );
}