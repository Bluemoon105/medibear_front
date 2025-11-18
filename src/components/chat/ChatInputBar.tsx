import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { flushSync } from "react-dom";

type Props = {
  onSend: (text: string) => void;
};

export default function ChatInputBar({ onSend }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // ★ 한글 조합중 여부

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 자동 높이 조절
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [text]);

  // 전송
  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setSending(true);

    // ★ 한글 조합 상태 강제 종료 + 안전하게 초기화
    flushSync(() => {
      setText("");
    });

    await onSend(trimmed);

    setSending(false);
  };

  // Enter 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 조합중이면 Enter는 전송이 아니라 조합 완료 역할이라 막기
    if (isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-[1027px] flex justify-center px-4 pb-4">
      <div
        className="
        	w-full flex items-center gap-3 
        	bg-base-100 border border-gray-300 shadow-sm
        	px-4 py-3 rounded-full
        "
      >
        {/* 입력창 */}
        <textarea
          ref={textareaRef}
          placeholder="메시지를 입력하세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          
          // ★ 한글 조합 시작 / 종료 이벤트
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}

          onKeyDown={handleKeyDown}
          rows={1}
          className="
            flex-1 bg-transparent focus:outline-none
            resize-none text-[15px] leading-[1.5]
            max-h-[160px] overflow-y-auto
          "
        />

        {/* 전송 버튼 */}
        <button
          onClick={handleSend}
          disabled={sending}
          className="
            btn btn-circle btn-sm 
            bg-primary text-white border-none
            hover:bg-primary/80
          "
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
