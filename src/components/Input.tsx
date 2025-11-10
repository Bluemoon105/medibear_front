"use client";
import { useState, useRef, useEffect } from "react";

export type InputBarProps = {
  variant: "sleep" | "exercise";
  onSend: (data: any) => void;
};

export default function InputBar({ variant, onSend }: InputBarProps) {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [recordedVideoBase64, setRecordedVideoBase64] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  //자동 높이 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [text]);

  // 파일 → Base64 변환
  const toBase64 = (file: Blob) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  // 이미지 업로드
  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    onSend({ text, base64Image: base64 });
    setText("");
  };

  // 동영상 업로드
  const handleVideoUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    onSend({ text, base64Video: base64 });
    setText("");
  };

  // 웹캠 관련
  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const startRecording = () => {
    chunksRef.current = [];
    recorderRef.current = new MediaRecorder(streamRef.current!, {
      mimeType: "video/webm",
    });
    recorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorderRef.current.start();
  };

  const stopRecording = () =>
    new Promise<void>((resolve) => {
      recorderRef.current!.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const base64 = await toBase64(blob);
        setRecordedVideoBase64(base64);
        resolve();
      };
      recorderRef.current?.stop();
    });

  // 전송 처리
  const handleSend = () => {
    if (!text.trim()) return;
    onSend({ text, base64Video: recordedVideoBase64 || null });
    setText("");
    setRecordedVideoBase64(null);
  };

  // Enter/Shift+Enter 동작
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        width: "1027px",
        minHeight: "100px",
        border: "1px solid black",
        borderRadius: 20,
        background: "#FFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        margin: "20px auto",
        boxSizing: "border-box",
      }}
    >
      {/* 왼쪽 영역 */}
      <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 10 }}>
        {variant === "exercise" && (
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #ccc",
              background: "#FFF",
              color: "black",
            }}
          >
            <option value="text">텍스트만</option>
            <option value="image">이미지 업로드</option>
            <option value="video">동영상 업로드</option>
            <option value="webcam">웹캠 녹화</option>
          </select>
        )}

        {/* textarea 입력창 (자동 높이 + shift+enter 줄바꿈) */}
        <textarea
          ref={textareaRef}
          placeholder={
            variant === "sleep"
              ? "수면 관련 질문을 입력하세요"
              : "운동 관련 질문을 입력하세요"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            fontSize: 14,
            outline: "none",
            resize: "none",
            overflow: "hidden", // 스크롤 없이 자동 높이 확장
            color: "#000",
          }}
          rows={1}
        />

        {/* 이미지 / 비디오 업로드 / 웹캠 */}
        {mode === "image" && (
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        )}
        {mode === "video" && (
          <input type="file" accept="video/*" onChange={handleVideoUpload} />
        )}
        {mode === "webcam" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={startWebcam}>웹캠 켜기</button>
            <button onClick={startRecording}>녹화 시작</button>
            <button onClick={stopRecording}>녹화 종료</button>
            <button onClick={stopWebcam}>웹캠 종료</button>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: 120,
                height: 90,
                background: "#000",
                borderRadius: 8,
              }}
            />
          </div>
        )}
      </div>

      {/* 전송 버튼 */}
      <button
        onClick={handleSend}
        style={{
          backgroundColor: "#D2B48C",
          fontWeight: 600,
          border: "none",
          outline:"none",
          width: "85px",
          height: "55px",
          borderRadius: "20px",
          cursor: "pointer",
          color: "#",
        }}
      >
        전송
      </button>
    </div>
  );
}
