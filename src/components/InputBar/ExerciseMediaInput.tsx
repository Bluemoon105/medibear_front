import { useRef, useState } from "react";

type MediaPayload = {
  base64Image?: string;
  base64Video?: string;
};

export function useExerciseMedia({ onSend:_onSend }: { onSend: (data: any) => void }) {
  // ✅ 내부에 보관해둘 base64 상태
  const [base64Image, setBase64Image] = useState<string | undefined>();
  const [base64Video, setBase64Video] = useState<string | undefined>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const toBase64 = (file: Blob) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string); // data:*;base64,.... 형태
      reader.readAsDataURL(file);
    });

  // ✅ 파일 업로드 시: onSend 호출 ❌ / 내부 state에만 저장 ⭕
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await toBase64(file);
    if (type === "image") {
      setBase64Image(b64);
      setBase64Video(undefined);
    } else {
      setBase64Video(b64);
      setBase64Image(undefined);
    }
  };

  // --- 웹캠 ---
  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    recorderRef.current = new MediaRecorder(streamRef.current, { mimeType: "video/webm" });
    recorderRef.current.ondataavailable = (e) => e.data && chunksRef.current.push(e.data);
    recorderRef.current.start();
  };

  // ✅ 녹화 종료 시도 마찬가지로 onSend 호출 ❌ / 내부 state에만 저장 ⭕
  const stopRecording = () =>
    new Promise<void>((resolve) => {
      if (!recorderRef.current) return resolve();
      recorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const b64 = await toBase64(blob);
        setBase64Video(b64);
        setBase64Image(undefined);
        resolve();
      };
      recorderRef.current.stop();
    });

  // ✅ InputBar에서 꺼내 쓰는 payload 제공
  const getPayload = (): MediaPayload => ({
    base64Image,
    base64Video,
  });

  // ✅ 전송 후 상태 초기화용
  const clear = () => {
    setBase64Image(undefined);
    setBase64Video(undefined);
  };

  const render = (
    mode: string,
    setSelectedFileName: (name: string) => void,
    selectedFileName: string
  ) => {
    if (mode === "image" || mode === "video") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label
            style={{
              border: "1.5px solid #D2B48C",
              borderRadius: 8,
              padding: "6px 12px",
              background: "#FAF3E0",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {mode === "image" ? "이미지 선택" : "동영상 선택"}
            <input
              type="file"
              accept={mode === "image" ? "image/*" : "video/*"}
              onChange={(e) => {
                setSelectedFileName(e.target.files?.[0]?.name || "");
                handleFileUpload(e, mode as "image" | "video");
              }}
              style={{ display: "none" }}
            />
          </label>
          {selectedFileName && (
            <span style={{ fontSize: 13, color: "#6B4E2E" }}>{selectedFileName}</span>
          )}
        </div>
      );
    }

    if (mode === "webcam") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { label: "웹캠 켜기", onClick: startWebcam },
              { label: "녹화 시작", onClick: startRecording },
              { label: "녹화 종료", onClick: stopRecording },
              { label: "웹캠 종료", onClick: stopWebcam },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                style={{
                  border: "1.5px solid #D2B48C",
                  borderRadius: 8,
                  padding: "6px 10px",
                  background: "#FFF",
                  cursor: "pointer",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "clamp(120px, 25vw, 180px)",
              height: "clamp(80px, 18vw, 120px)",
              background: "#000",
              borderRadius: 8,
              marginTop: 4,
            }}
          />
        </div>
      );
    }

    return null;
  };

  // ✅ 이제 render + getPayload + clear 모두 반환
  return { render, getPayload, clear };
}
