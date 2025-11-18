"use client";

import React from "react";
import MultiChatBubble from "./MultiChatBubble";

export type MultiMessage = {
  role: "user" | "assistant";
  content?: string;
  base64Image?: string;
  base64Video?: string;
};

interface MultiMessageListProps {
  messages: MultiMessage[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
  loading: boolean;
}

export default function MultiMessageList({ messages, bottomRef, loading }: MultiMessageListProps) {
  return (
    <div
      className="
        w-full max-w-[1027px] flex-1 
        px-4 md:px-6 lg:px-8 py-8 
        flex flex-col gap-3
        overflow-y-auto
      "
    >
      {messages.map((msg, idx) => {
        const isLastAssistant =
          msg.role === "assistant" && idx === messages.length - 1;

        return (
          <MultiChatBubble
            key={idx}
            from={msg.role}
            text={msg.content}
            image={msg.base64Image}
            video={msg.base64Video}
            isLast={isLastAssistant}
          />
        );
      })}

      {loading && (
        <div className="self-start bg-gray-200 p-3 rounded-xl">
          응답 생성 중...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
