// ExerciseChat.tsx
import { useState } from "react";
import ChatMessageBubble_exercise from "../../components/ChatMessageBubble_exercise";
import InputBar from "../../components/InputBar/InputBar";

// 파일(Image/Video)을 base64(dataURL)로 변환하는 함수 : 현재 사용x 
// const fileToBase64 = (file: File): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const r = new FileReader();
//     r.onload = () => resolve(r.result as string); // "data:...;base64,AAAA..."
//     r.onerror = reject;
//     r.readAsDataURL(file);
//   });

// 서버 한 곳으로 통일 (FastAPI) 
const API_URL = "http://localhost:5000/analyze";

type SendArgs = { text?: string; base64Image?: string; base64Video?: string };
// userId값 임의로 'user1' 이라고 넣었음 > 나중에 수정필요
async function sendToServer({ text, base64Image, base64Video }: SendArgs) {
  const payload: any = { userId: "user1", message: text ?? "" };
  if (base64Image) payload.image = base64Image;
  if (base64Video) payload.video = base64Video;

  // 서버에 post 요청
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // 서버 응답 처리
  const body = await res.text();
  let json: any;
  try { json = JSON.parse(body); } catch { json = { raw: body }; }

  if (!res.ok) throw new Error(json?.detail ?? `HTTP ${res.status}`);
  return json;
}

// 메인 컴포넌트 : React 화면을 그리는 컴포넌트
export default function ExerciseChat() {
  type ChatMessage = {
  from: "user" | "ai";
  text?: string;
  base64Image?: string;
  base64Video?: string;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const onSend = async ({ text, base64Image, base64Video }: SendArgs) => {
  const trimmed = (text ?? "").trim();
  const hasMedia = !!(base64Image || base64Video);


  // 1) 사용자 버블 생성 (텍스트 + 이미지 + 영상)
  if (trimmed || hasMedia) {
    setMessages(prev => [
      ...prev,
      {
        from: "user",
        text: trimmed,
        base64Image,
        base64Video,
      },
    ]);
  }

  try {
    // 2) 서버에 전송 (텍스트 + 미디어 그대로)
    const data = await sendToServer({ text: trimmed, base64Image, base64Video });

    const answer =
      data?.answer ??
      data?.detected_exercise ??
      (typeof data === "string" ? data : JSON.stringify(data));

    // 3) AI 응답 추가 (텍스트만)
    setMessages(prev => [
      ...prev,
      {
        from: "ai",
        text: answer,
      },
    ]);
  } catch (e: any) {
    setMessages(prev => [
      ...prev,
      {
        from: "ai",
        text: `에러: ${e.message}`,
      },
    ]);
  }
};

  return (
    <div style={{ display: "flex", height: "100vh", background: "#FFF" }}>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 80px" }}>
        {/* 채팅 영역 */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 40 }}>
          {messages.length === 0 && (
            <div style={{ width: 420, height: 120, background: "#FAF3E0", borderRadius: 22, padding: 26 }}>
              대화 내용
            </div>
          )}
          {messages.map((m, i) => <ChatMessageBubble_exercise key={i} text={m.text} from={m.from} 
          base64Image={m.base64Image} base64Video={m.base64Video}/>)}
        </div>

        {/* 입력 바: onSend에 text + base64(있으면) 넘겨야 함 */}
        <div style={{ marginTop: 20 }}>
          <InputBar variant="exercise" onSend={onSend} />
        </div>
      </main>
    </div>
  );
}
