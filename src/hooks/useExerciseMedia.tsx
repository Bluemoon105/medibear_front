"use client";

import { useState, useRef } from "react";

export function useExerciseMedia() {
  // --- 상태 ---
  const [base64Image, setBase64Image] = useState<string | undefined>();
  const [base64Video, setBase64Video] = useState<string | undefined>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // ============================
  // 🔥 Blob → Base64 변환 (핵심)
  // ============================
  const toBase64 = (file: Blob): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string); // data:*/*;base64...
      reader.readAsDataURL(file); // 반드시 readAsDataURL
    });

  // ============================
  // 🔥 이미지 업로드
  // ============================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const b64 = await toBase64(file);
    setBase64Image(b64);
    setBase64Video(undefined);

    e.target.value = "";
  };

  // ============================
  // 🔥 동영상 업로드
  // ============================
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/") || file.type === "video/quicktime") {
      alert("⚠️ .mov(quicktime) 영상은 지원되지 않습니다. mp4 형식으로 변환해주세요.");
    return;
}
    console.log("업로드한 파일:", file);

    const b64 = await toBase64(file);
    setBase64Video(b64);
    console.log("변환된 base64 동영상:", b64);
    setBase64Image(undefined);
    
      e.target.value = "";
  };

  // ============================
  // 🔥 웹캠 켜기
  // ============================
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("웹캠 실행 실패:", err);
    }
  };

  // 웹캠 종료
  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  // ============================
  // 🔥 녹화 시작
  // ============================
  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];

    try {
      const recorder = new MediaRecorder(streamRef.current, {
        mimeType: "video/webm; codecs=vp9",
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      recorderRef.current = recorder;
    } catch (err) {
      console.error("녹화 시작 에러:", err);
    }
  };

  // ============================
  // 🔥 녹화 종료 -> base64 변환
  // ============================
  const stopRecording = async () => {
    return new Promise<void>((resolve) => {
      const rec = recorderRef.current;
      if (!rec) return resolve();

      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });

        if (blob.size === 0) {
          console.warn("⚠️ 녹화된 영상 blob이 비어 있음");
          return resolve();
        }

        const b64 = await toBase64(blob);
        setBase64Video(b64);
        setBase64Image(undefined);

        resolve();
      };

      rec.stop();
    });
  };

  // ============================
  // 🔥 최종 payload 가져오기
  // ============================
  const getPayload = () => ({
    base64Image,
    base64Video,
  });

  // ============================
  // 🔥 삭제/초기화
  // ============================
  const clearImage = () => setBase64Image(undefined);
  const clearVideo = () => setBase64Video(undefined);

  const clear = () => {
    setBase64Image(undefined);
    setBase64Video(undefined);
  };

  return {
    // refs
    videoRef,

    // 상태
    base64Image,
    base64Video,

    // 업로드
    handleImageUpload,
    handleVideoUpload,

    // 웹캠 + 녹화
    startWebcam,
    stopWebcam,
    startRecording,
    stopRecording,

    // payload / clear
    getPayload,
    clear,
    clearImage,
    clearVideo,
  };
}
