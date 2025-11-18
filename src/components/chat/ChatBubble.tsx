import { useEffect, useRef } from "react";
import TypeIt from "typeit";

interface Props {
  from: "user" | "ai";
  text: string;
  isLast: boolean; // 마지막 assistant 메시지 여부
}

export default function ChatMessageBubble({ from, text, isLast }: Props) {
  const isUser = from === "user";
  const typeRef = useRef<HTMLDivElement>(null);

  // TypeIt 애니메이션 (assistant + 마지막 메시지에서만 실행)
  useEffect(() => {
    if (!isUser && isLast && typeRef.current) {
      typeRef.current.innerHTML = ""; // 초기화 (중복 렌더 방지)
      new TypeIt(typeRef.current, {
        speed: 10,
        waitUntilVisible: true,
		cursor: false,
      })
        .type(text)
        .go();
    }
  }, [isUser, isLast, text]);

  return (
    <div
      className={`w-full flex mb-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-[480px] px-4 py-3 rounded-2xl shadow-sm text-black text-[15px] leading-snug whitespace-pre-wrap
          ${isUser ? "bg-[#D2B48C]" : "bg-[#FAF3E0]"}
        `}
      >
        {/* User → 즉시 출력 / Assistant → 마지막 메시지만 typing */}
        {isUser ? (
          text
        ) : isLast ? (
          <div ref={typeRef}></div>
        ) : (
          text
        )}
      </div>
    </div>
  );
}
