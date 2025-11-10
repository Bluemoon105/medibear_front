"use client";
import { useState, useRef, useEffect } from "react";
import axios from "../config/setAxios";
import Sidebar from "../components/Sidebar";
import InputBar from "../components/Input";
import ReportButtonGroup from "../components/Sleep/ReportButton";
import ChatMessageBubble from "../components/ChatMessageBubble";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SleepChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const userId = 1;
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null); // ✅ 추가

  // 메시지가 변경될 때마다 맨 아래로 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 일반 LLM 대화
  const handleSend = async (data: any) => {
    if (!data.text.trim()) return;
    const userMessage = data.text.trim();

    // 사용자 메시지 먼저 추가
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await axios.post("/chat/message", {
        user_id: userId,
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

  // 리포트 결과 받기
  const handleReport = (type: "daily" | "weekly", content: string) => {
    const title = type === "daily" ? "일간 리포트" : "주간 리포트";
    setMessages((prev) => [
      ...prev,
      { role: "user", content: title },
      { role: "assistant", content },
    ]);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#FFFCF6",
        color: "#000",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "180px",
          minWidth: "180px",
          borderRight: "1px solid #E5E5E5",
          background: "#FFFFFF",
          height: "100%",
        }}
      >
        <Sidebar />
      </aside>

      {/* 채팅 영역 */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* 대화 내용 */}
        <div
          style={{
            width: "1027px",
            flex: 1,
            padding: "40px 0",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            overflowY: "auto",
          }}
        >
          {messages.map((msg, idx) => (
            <ChatMessageBubble
              key={idx}
              from={msg.role === "user" ? "user" : "ai"}
              text={msg.content}
            />
          ))}

          {loading && <ChatMessageBubble from="ai" text="응답 생성 중..." />}

          {/* 맨 아래로 스크롤 anchor */}
          <div ref={bottomRef} />
        </div>

        {/* 하단: 리포트 버튼 + 인풋바 */}
        <div
          style={{
            width: "1027px",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            padding: "0 0 20px",
            gap: "12px",
          }}
        >
          <ReportButtonGroup userId={userId} onReport={handleReport} />
          <InputBar variant="sleep" onSend={handleSend} />
        </div>
      </main>
    </div>
  );
}
