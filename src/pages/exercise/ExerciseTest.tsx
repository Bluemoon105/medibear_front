"use client";

import { useRef, useState } from "react";
import MultiChatLayout from "../../layouts/ChatBotLayout";
import MultiMessageList from "../../components/chat/MultiMessageList";
import type { MultiMessage } from "../../components/chat/MultiMessageList";

import MultiChatInputBar from "../../components/chat/MultiChatInputBar";
import { getUserEmail } from "../../utils/getUserEmail";
import { autoRefreshCheck } from "../../utils/TokenUtils";

const API_URL = "http://localhost:8080/exercise/analyze";

type SendArgs = {
  text?: string;
  base64Image?: string;
  base64Video?: string;
};

async function sendToServer({ text, base64Image, base64Video }: SendArgs) {
  const email = getUserEmail();

  const payload: any = {
    userId: email,
    message: text ?? "",
  };

  if (base64Image) payload.image = base64Image;
  if (base64Video) payload.video = base64Video;

  const res = await autoRefreshCheck({
    url: API_URL,
    method: "POST",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  return res.data;
}

export default function ExerciseChatPage() {
  const [messages, setMessages] = useState<MultiMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const onSend = async ({ text, base64Image, base64Video }: SendArgs) => {
    const trimmed = text?.trim();
    const hasMedia = !!(base64Image || base64Video);

    // 1) 사용자 메시지 화면에 추가
    if (trimmed || hasMedia) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: trimmed,
          base64Image,
          base64Video,
        },
      ]);
    }

    try {
      setLoading(true);

      // 2) 서버 호출
      const data = await sendToServer({
        text: trimmed,
        base64Image,
        base64Video,
      });

      // 3) 서버 응답에서 답변 추출
      const answer =
        data?.answer ??
        data?.detected_exercise ??
        (typeof data === "string" ? data : JSON.stringify(data));

      // 4) AI 메시지 추가
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `에러 발생: ${e.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MultiChatLayout>
      <MultiMessageList messages={messages} loading={loading} bottomRef={bottomRef} />
      <MultiChatInputBar onSend={onSend} />
    </MultiChatLayout>
  );
}
