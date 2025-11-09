import { useState, useRef } from "react";

export default function InputBar({ onSend }: { onSend: (data: any) => void }) {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [recordedVideoBase64, setRecordedVideoBase64] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // ✅ 파일/Blob → Base64 변환
  const toBase64 = (file: Blob) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  // ✅ 이미지 업로드
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await toBase64(file);
    onSend({ text, base64Image: base64 });
    setText("");
  };

  // ✅ 동영상 업로드
  const handleVideoUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await toBase64(file);
    onSend({ text, base64Video: base64 });
    setText("");
  };

  // ✅ 웹캠 켜기
  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  // ✅ 웹캠 종료 (화면 제거 + 스트림 stop)
  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  // ✅ 녹화 시작
  const startRecording = () => {
    chunksRef.current = [];
    recorderRef.current = new MediaRecorder(streamRef.current!, {
      mimeType: "video/webm",
    });
    recorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorderRef.current.start();
  };

  // ✅ 녹화 종료 → Base64 변환 → state 저장 (전송은 나중에)
  const stopRecording = () => {
    return new Promise<void>((resolve) => {
      recorderRef.current!.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const base64 = await toBase64(blob);
        setRecordedVideoBase64(base64);
        resolve();
      };
      recorderRef.current?.stop();
    });
  };

  // ✅ 전송 버튼
  const handleSend = () => {
    onSend({
      text,
      base64Video: recordedVideoBase64 || null,
    });
    setText("");
    setRecordedVideoBase64(null); // 전송 후 초기화
  };

  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto 20px auto",
        display: "flex",
        alignItems: "center",
        gap: 15,
        padding: "14px 18px",
        borderRadius: 22,
        background: "#F2F2F2",
      }}
    >
      {/* 모드 선택 */}
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

      {/* 텍스트 입력창 */}
      <input
        placeholder="질문 내용 입력"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          border: "none",
          background: "transparent",
          fontSize: 14,
          outline: "none",
          color: "#000"  // ✅ 글자색을 검은색으로 지정
        }}
      />

      {/* 이미지 업로드 */}
      {mode === "image" && <input type="file" accept="image/*" onChange={handleImageUpload} />}

      {/* 동영상 업로드 */}
      {mode === "video" && <input type="file" accept="video/*" onChange={handleVideoUpload} />}

      {/* 웹캠 */}
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
            style={{ width: 120, height: 90, background: "#000", borderRadius: 8 }}
          />
        </div>
      )}

      {/* 전송 버튼 */}
      <button
        onClick={handleSend}
        style={{
          padding: "10px 20px",
          borderRadius: 18,
          background: "#6C5A58",
          color: "#FFF",
          fontWeight: 600,
          border: "none",
        }}
      >
        전송
      </button>
    </div>
  );
}
