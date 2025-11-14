import type { ReactNode } from "react";

// 모든 미디어 payload의 공통 구조
export type MediaPayload = {
  base64Image?: string;
  base64Video?: string;
};

// InputBar 컴포넌트 props
export type InputBarProps = {
  variant: "sleep" | "exercise" | "stress";
  onSend: (data: { text?: string } & MediaPayload) => void;
};

// Exercise용 훅 (이미지/비디오)
export interface ExerciseMediaAPI {
  render: (
    mode: string,
    setSelectedFileName: (name: string) => void,
    selectedFileName: string
  ) => ReactNode; // ✅ JSX.Element → ReactNode 로 변경
  getPayload: () => { base64Image?: string; base64Video?: string };
  clear: () => void;
}

