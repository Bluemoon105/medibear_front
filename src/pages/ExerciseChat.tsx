import Sidebar from "../components/Sidebar";
import ChatMessageBubble from "../components/ChatMessageBubble";
import InputBar from "../components/InputBar";
import { useState } from "react";

export default function ExerciseChat() {
  const [messages, setMessages] = useState<{ from: "user" | "ai"; text: string }[]>([]);

  const sendToServer = async ({ text, base64Image, base64Video }: any) => {
    const payload: any = { userId: "user1", message: text };
    if (base64Image) payload.image = base64Image;
    if (base64Video) payload.video = base64Video;

    const res = await fetch("http://localhost:5000/analyze_and_chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const answer = data?.answer || "응답 없음";

    setMessages((prev) => [
      ...prev,
      ...(text ? [{ from: "user" as const, text }] : []),
      { from: "ai" as const, text: String(answer) },
    ]);
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#FFF" }}>
      <Sidebar />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "40px 80px",
          background: "#FFFFFF",
        }}
      >
        {/* 채팅 메시지 영역 */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "40px",
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                width: 420,
                height: 120,
                background: "#D9D9D9",
                borderRadius: 22,
                padding: 26,
                color: "#555",
              }}
            >
              대화 내용
            </div>
          )}

          {messages.map((m, i) => (
            <ChatMessageBubble key={i} text={m.text} from={m.from} />
          ))}
        </div>

        {/* 입력 바 */}
        <div style={{ marginTop: 20 }}>
          <InputBar onSend={sendToServer} />
        </div>
      </main>
    </div>
  );
}
