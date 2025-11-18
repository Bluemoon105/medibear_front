import React, { useState, useRef, useEffect } from "react";
import { Send, Plus } from "lucide-react"; // ★ Plus 추가 (아이콘 통일)
import { flushSync } from "react-dom";

type Props = {
  onSend: (text: string) => void;
};

export default function ChatInputBar({ onSend }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

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

    flushSync(() => setText(""));

    await onSend(trimmed);

    setSending(false);
  };

  // Enter 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-[1027px] mx-auto px-4 pb-4">
      <div
        className="
          relative flex items-center gap-3
          bg-white border border-gray-300 px-4 py-3 rounded-full
        "
      >
        {/* + 버튼 (첫 번째 컴포넌트 UI와 동일 스타일) */}
        <div className="dropdown dropdown-top">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-sm rounded-full"
          >
            <Plus size={20} />
          </div>

          <ul
            tabIndex={-1}
            className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow"
          >
            <li>
              <a>📁 기능 1</a>
            </li>
            <li>
              <a>📄 기능 2</a>
            </li>
          </ul>
        </div>

        {/* 입력창 */}
        <textarea
          ref={textareaRef}
          placeholder="메시지를 입력하세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="
            flex-1 bg-transparent resize-none 
            focus:outline-none text-[15px] leading-[1.5]
            max-h-[160px] overflow-y-auto
          "
        />

        {/* 전송 버튼 (첫 번째 컴포넌트 스타일 적용) */}
        <button
          onClick={handleSend}
          disabled={sending}
          className="
            btn btn-circle btn-sm bg-primary text-white border-none
            hover:bg-primary/80
          "
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
