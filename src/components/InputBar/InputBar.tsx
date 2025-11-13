"use client";
import { useState, useRef, useEffect } from "react";
import { useExerciseMedia } from "../InputBar/ExerciseMediaInput";
import { useStressMedia } from "../InputBar/StressMediaInput";
import type { InputBarProps } from "../InputBar/types";

export default function InputBar({ variant, onSend }: InputBarProps) {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const exerciseMedia = useExerciseMedia({ onSend });
  const stressMedia = useStressMedia({ onSend });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 자동 높이 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend({ text });
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="
        w-full max-w-[1027px] mx-auto mt-5 p-4 rounded-2xl border border-black
        flex flex-wrap justify-between gap-3 bg-white
      "
    >
      {/* 왼쪽 입력 영역 */}
      <div className="flex flex-1 items-center gap-3 flex-wrap min-w-[200px]">
        {(variant === "exercise" || variant === "stress") && (
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setSelectedFileName("");
            }}
            className="
              px-3 py-2 rounded-lg border border-gray-300 bg-white text-black
              text-[clamp(12px,1.8vw,14px)]
            "
          >
            <option value="text">텍스트만</option>

            {variant === "exercise" && (
              <>
                <option value="image">이미지 업로드</option>
                <option value="video">동영상 업로드</option>
                <option value="webcam">웹캠 녹화</option>
              </>
            )}

            {variant === "stress" && <option value="audio">음성 업로드</option>}
          </select>
        )}

        {/* 텍스트 입력 */}
        <textarea
          ref={textareaRef}
          placeholder={
            variant === "sleep"
              ? "수면 관련 질문을 입력하세요"
              : variant === "exercise"
              ? "운동 관련 질문을 입력하세요"
              : "스트레스 관련 질문을 입력하세요"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="
            flex-1 min-w-[150px] bg-transparent resize-none overflow-hidden
            focus:outline-none text-[clamp(13px,2vw,15px)] text-black leading-[1.5]
          "
        />

        {/* 운동 미디어 */}
        {variant === "exercise" &&
          exerciseMedia.render(mode, setSelectedFileName, selectedFileName)}

        {/* 스트레스 미디어 */}
        {variant === "stress" &&
          stressMedia.render(mode, setSelectedFileName, selectedFileName)}
      </div>

      {/* 전송 버튼 */}
      <button
        onClick={handleSend}
        className="
          bg-[#D2B48C] font-semibold text-black border-none outline-none
          w-[clamp(70px,18vw,90px)] h-[clamp(45px,12vw,55px)]
          rounded-2xl cursor-pointer text-[clamp(13px,2vw,15px)]
          flex-shrink-0
        "
      >
        전송
      </button>
    </div>
  );
}
