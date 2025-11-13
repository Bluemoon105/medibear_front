import axios from "../../config/setAxios";

// ===== Types =====
export type ReportPayload = {
  sleepHours: number;
  activityLevel: number;
  caffeineCups: number;
  primaryEmotion: string; 
  comment?: string;
};

export type ReportResult = {
  stressScore: number;
  primaryEmotion: string;
  coachingText: string;
  meta?: Record<string, any>;
};

export type ChatTurn = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export type ChatPayload = {
  ml?: Record<string, any>;
  dl?: Record<string, any>;
  coaching?: string;
  history?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  question: string;
};

export type ChatResult = { reply: string };

// ===== Utils =====
// 문자열/JSON 응답을 안전하게 파싱
const parseRes = <T = any>(data: any): T => {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as T;
    } catch {
      // FastAPI가 문자열 그대로를 반환하는 경우 대비
      return { raw: data } as unknown as T;
    }
  }
  return data as T;
};

{/* // 공통 에러 메시지 추출 */}
const extractErrMsg = (err: any): string =>
  err?.response?.data?.detail ||
  err?.response?.data?.message ||
  (typeof err?.response?.data === "string" ? err.response.data : "") ||
  err?.message ||
  "요청 처리 중 오류가 발생했습니다.";

{/* // ===== API ===== */}

{/* // 1) 통합 리포트 생성 (React -> Spring /api/stress/report) */}
export const postStressReport = async (
  payload: ReportPayload
): Promise<ReportResult> => {
  try {
    const { data } = await axios.post("/api/stress/report", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return parseRes<ReportResult>(data);
  } catch (err: any) {
    throw new Error(extractErrMsg(err));
  }
};

{/* // 2) 오디오 업로드 후 감정 분석 (선택 기능) */}
export const postStressAudio = async (
  file: File
): Promise<{ emotion?: string; confidence?: number; [k: string]: any }> => {
  const form = new FormData();
  form.append("file", file);
  try {
    const { data } = await axios.post("/api/stress/audio", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return parseRes(data);
  } catch (err: any) {
    throw new Error(extractErrMsg(err));
  }
};

{/* // 3) LLM 챗 (후속 질문) */}
export const postStressChat = async (
  payload: ChatPayload
): Promise<ChatResult> => {
  try {
    const { data } = await axios.post("/api/stress/chat", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return parseRes<ChatResult>(data);
  } catch (err: any) {
    throw new Error(extractErrMsg(err));
  }
};