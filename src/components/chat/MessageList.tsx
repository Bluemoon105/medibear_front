import React from "react";
import ChatMessageBubble from "./ChatBubble";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface Props {
  messages: Message[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
  loading: boolean;
}


export default function MessageList({ messages, bottomRef, loading }: Props) {
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
          <ChatMessageBubble
            key={idx}
            from={msg.role === "user" ? "user" : "ai"}
            text={msg.content}
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
