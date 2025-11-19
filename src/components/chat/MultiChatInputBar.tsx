"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Send, X } from "lucide-react";
import { flushSync } from "react-dom";
import { useExerciseMedia } from "../../hooks/useExerciseMedia";

type Props = {
  onSend: (args: {
    text?: string;
    base64Image?: string;
    base64Video?: string;
  }) => void;
};

export default function ChatInputBar({ onSend }: Props) {
  const [text, setText] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    videoRef,
    base64Image,
    base64Video,
    handleImageUpload,
    handleVideoUpload,
    startWebcam,
    stopWebcam,
    startRecording,
    stopRecording,

    getPayload,
    clear,
    clearImage,
    clearVideo,
  } = useExerciseMedia();

  // textarea auto-resize
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [text]);

  const handleSend = async () => {
    const trimmed = text.trim();
    const payload = getPayload();

    if (!trimmed && !payload.base64Image && !payload.base64Video) return;

    flushSync(() => setText(""));

    await onSend({
      text: trimmed || undefined,
      base64Image: payload.base64Image,
      base64Video: payload.base64Video,
    });

    clear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-[1027px] mx-auto px-4 pb-4">

      {/* 🔥🔥🔥 PREVIEW 영역 */}
      {(base64Image || base64Video) && (
        <div className="mb-3 flex justify-start">
          <div className="relative bg-base-100 border border-base-300 shadow-md rounded-xl p-2 max-w-[240px]">

            {/* 이미지 프리뷰 */}
            {base64Image && (
              <img
                key={base64Image}        // ★ 이미지 리렌더 보장
                src={base64Image}
                className="rounded-lg max-h-[200px] object-cover"
              />
            )}

            {/* 비디오 프리뷰 */}
            {base64Video && (
              <video
                key={base64Video}        // ★ 영상 리렌더 보장 (핵심)
                src={base64Video}
                controls
                className="rounded-lg max-h-[200px]"
              />
            )}

            {/* 삭제버튼 */}
            <button
              onClick={() => {
                clearImage();
                clearVideo();
              }}
              className="btn btn-xs btn-circle absolute -top-2 -right-2 bg-error text-white hover:bg-error/80"
            >
              <X size={14} />
            </button>

          </div>
        </div>
      )}

      {/* 🔥🔥🔥 INPUT BAR 본체 */}
      <div className="relative flex items-center gap-3 border border-gray-300 bg-white px-4 py-3 rounded-full">

        {/* ★ Dropdown */}
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
            className="dropdown-content menu bg-base-100 rounded-box w-48 p-2 shadow"
          >

            {/* 이미지 선택 */}
            <li>
              <label className="cursor-pointer">
                <span>📸 이미지 선택</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </li>

            {/* 동영상 선택 */}
            <li>
              <label className="cursor-pointer">
                <span>🎥 동영상 선택</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
              </label>
            </li>

            {/* 웹캠 녹화 */}
            <li>
              <a
                onClick={() =>
                  (document.getElementById("modal_webcam") as HTMLDialogElement)?.showModal()
                }
              >
                🎬 영상 촬영(웹캠)
              </a>
            </li>
          </ul>

        </div>

        {/* textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          placeholder="무엇이든 입력하세요..."
          className="flex-1 bg-transparent resize-none text-sm focus:outline-none leading-[1.5]"
          rows={1}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
        />

        {/* send button */}
        <button
          onClick={handleSend}
          className="btn btn-circle btn-sm bg-primary text-white"
        >
          <Send size={18} />
        </button>
      </div>

      {/* ★ Modal: 웹캠 */}
      <dialog id="modal_webcam" className="modal">
        <div className="modal-box flex flex-col gap-3">
          <h3 className="font-bold text-lg">🎥 웹캠 녹화</h3>

          <div className="flex flex-wrap gap-2">
            <button className="btn btn-sm btn-outline" onClick={startWebcam}>
              ▶ 웹캠 켜기
            </button>
            <button className="btn btn-sm btn-primary" onClick={startRecording}>
              🔴 녹화 시작
            </button>
            <button className="btn btn-sm btn-warning" onClick={stopRecording}>
              ⏹ 녹화 종료
            </button>
            <button className="btn btn-sm btn-outline" onClick={stopWebcam}>
              ❌ 웹캠 종료
            </button>
          </div>

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-48 bg-black rounded-lg border"
          />

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">닫기</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
