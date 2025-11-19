import { useState, useRef, useEffect } from "react";
import { Send, Plus } from "lucide-react";
import { flushSync } from "react-dom";

type Props = {
  onSend: (text: string) => void;
  onReport: (type: "daily" | "weekly") => Promise<void>;
};

export default function ChatInputBar({ onSend, onReport }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [text]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setSending(true);
    flushSync(() => setText(""));

    await onSend(trimmed);

    setSending(false);
  };

  // 🔥 dropdown 닫기 함수
  const closeDropdown = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur(); // DaisyUI dropdown 자동 닫힘
    }
  };

  return (
    <div className="w-full max-w-[1027px] mx-auto px-4 pb-4">
      <div className="relative flex items-center gap-3 bg-white border border-gray-300 px-4 py-3 rounded-full">

        {/* + 버튼 */}
        <div className="dropdown dropdown-top">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm rounded-full">
            <Plus size={20} />
          </div>

          <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow">

            {/* 일간 리포트 */}
            <li>
              <button
                onClick={() => {
                  onReport("daily");
                  closeDropdown(); // 🔥 클릭 후 드롭다운 닫힘
                }}
              >
                📅 일간 리포트
              </button>
            </li>

            {/* 주간 리포트 */}
            <li>
              <button
                onClick={() => {
                  onReport("weekly");
                  closeDropdown(); // 🔥 클릭 후 드롭다운 닫힘
                }}
              >
                📊 주간 리포트
              </button>
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
          onKeyDown={(e) => {
            if (isComposing) return;
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          className="flex-1 bg-transparent resize-none focus:outline-none text-[15px] leading-[1.5] max-h-[160px] overflow-y-auto"
        />

        {/* 전송 버튼 */}
        <button
          onClick={handleSend}
          disabled={sending}
          className="btn btn-circle btn-sm bg-primary text-white border-none hover:bg-primary/80"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
