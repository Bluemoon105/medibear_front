"use client";
import { useState, useRef, useEffect } from "react";
import { useExerciseMedia } from "../InputBar/ExerciseMediaInput";
import { useStressMedia } from "../InputBar/StressMediaInput";
import type { InputBarProps } from "../InputBar/types";

type Mode = "text" | "image" | "video" | "webcam";

export default function InputBar({ variant, onSend }: InputBarProps) {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [sending, setSending] = useState(false);

  // textarea 자동 높이 조절
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [text]);

  // media hooks (getPayload/clear를 제공한다고 가정)
  const exerciseMedia = useExerciseMedia({ onSend });
  const stressMedia   = useStressMedia({ onSend });

  // 전송 버튼 눌렀을 때 
  const handleSend = async () => {
    const trimmed = text.trim();

    // 텍스트 모드에서는 빈 문자열이면 전송하지 않음
    if (!trimmed && mode === "text") return;

    // 현재 variant(exercise)에 맞게 미디어 payload 수집
    const mediaPayload =
      variant === "exercise"
        ? (exerciseMedia.getPayload?.() ?? {})  // getPayload로 base64Image 또는 base64Video를 mediaPayload에 저장
        : {};

    // 미디어 모드 가드: 파일이 없으면 전송 막기
    if ((mode === "image" || mode === "video") &&
        !mediaPayload.base64Image && !mediaPayload.base64Video) {
      alert("파일을 선택해주세요.");
      return;
    }

    setSending(true);
    try {
      // onSend 호출 : 부모 컴포넌트(ExerciseChat에 text, 미디어 전송)
      await onSend({ text: trimmed, ...mediaPayload }); 
      // 성공 시 입력/미디어 상태 초기화
      setText("");
      setSelectedFileName("");
      if (variant === "exercise") exerciseMedia.clear?.();
      // 전송 후 텍스트 모드로 복귀:
      setMode("text");
    } finally {
      setSending(false);
    }
  };

  // Enter로 전송
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
              const next = e.target.value as Mode;
              setMode(next);
              setSelectedFileName("");
              // 모드 변경 시 기존 미디어 초기화
              if (variant === "exercise") exerciseMedia.clear?.();
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
        {sending ? "전송중..." : "전송"}
      </button>
    </div>
  );
}
