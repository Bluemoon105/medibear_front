"use client";

import { useRef, useState } from "react";

export function useExerciseMedia() {
  // 내부 상태
  const [base64Image, setBase64Image] = useState<string>();
  const [base64Video, setBase64Video] = useState<string>();

  // webcam refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const clearImage = () => setBase64Image(undefined);
  const clearVideo = () => setBase64Video(undefined);


  const toBase64 = (file: Blob) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  // 이미지 / 비디오 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const b64 = await toBase64(file);
    setBase64Image(b64);
    setBase64Video(undefined);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const b64 = await toBase64(file);
    setBase64Video(b64);
    setBase64Image(undefined);
  };

  // webcam
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
    recorderRef.current = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm",
    });

    recorderRef.current.ondataavailable = (e) => {
      if (e.data) chunksRef.current.push(e.data);
    };

    recorderRef.current.start();
  };

  const stopRecording = async () => {
    return new Promise<void>((resolve) => {
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
  };

  const getPayload = () => ({
    base64Image,
    base64Video,
  });

  const clear = () => {
    setBase64Image(undefined);
    setBase64Video(undefined);
  };

  return {
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
  };
}
