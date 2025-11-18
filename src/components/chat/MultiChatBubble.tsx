"use client";

import { useEffect, useRef } from "react";
import TypeIt from "typeit";

interface MultiChatBubbleProps {
  from: "user" | "assistant";
  text?: string;
  image?: string;       // base64 이미지
  video?: string;       // base64 비디오
  isLast: boolean;      // 마지막 assistant 메시지 여부
}

export default function MultiChatBubble({ from, text, image, video, isLast }: MultiChatBubbleProps) {
  const isUser = from === "user";
  const typeRef = useRef<HTMLDivElement>(null);

  // 마지막 assistant 메시지에만 타이핑 애니메이션 적용
  useEffect(() => {
    if (!isUser && isLast && typeRef.current && text) {
      typeRef.current.innerHTML = "";
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
    <div className={`w-full flex mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[520px] px-4 py-3 rounded-2xl shadow-sm text-black text-[15px] leading-snug whitespace-pre-wrap
          ${isUser ? "bg-[#D2B48C]" : "bg-[#FAF3E0]"}
        `}
      >
        {/* 텍스트 */}
        {text && (
          isUser ? (
            <div>{text}</div>
          ) : isLast ? (
            <div ref={typeRef}></div>
          ) : (
            <div>{text}</div>
          )
        )}

        {/* 이미지 */}
        {image && (
          <div className={text ? "mt-2" : ""}>
            <img
              src={image}
              alt="사용자 업로드 이미지"
              className="rounded-xl max-h-[260px] object-contain border border-base-300"
            />
          </div>
        )}

        {/* 비디오 */}
        {video && (
          <div className={text || image ? "mt-2" : ""}>
            <video
              src={video}
              controls
              className="rounded-xl max-h-[260px] border border-base-300"
            />
          </div>
        )}
      </div>
    </div>
  );
}
