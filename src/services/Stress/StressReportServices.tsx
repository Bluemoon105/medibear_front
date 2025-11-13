import { autoRefreshCheck } from "../../utils/TokenUtils";

/* ===================== Types ===================== */
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
};

export type ChatPayload = {
  ml?: Record<string, any>;
  dl?: Record<string, any>;
  coaching?: string;
  history?: Array<ChatTurn>;
  question: string;
};

export type ChatResult = { reply: string };

/* ===================== Utils ===================== */
const parseRes = <T = any>(data: any): T => {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as T;
    } catch {
      return { raw: data } as unknown as T;
    }
  }
  return data as T;
};

const extractErrMsg = (err: any): string =>
  err?.response?.data?.detail ||
  err?.response?.data?.message ||
  (typeof err?.response?.data === "string" ? err.response.data : "") ||
  err?.message ||
  "요청 처리 중 오류가 발생했습니다.";

{/* /* ===================== Core requester ===================== */ }
type ReqCfg = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, any>;
  withCredentials?: boolean;
};

{/* /**
 * autoRefreshCheck가 내부에서 토큰 만료 시 refresh 후 재시도까지 처리
 */ }
const requestWithRefresh = async <T = any>(cfg: ReqCfg): Promise<T> => {
  try {
    const res: any = await autoRefreshCheck({
      ...cfg,
      withCredentials: true,
    });
    return parseRes<T>(res?.data);
  } catch (err: any) {
    throw new Error(extractErrMsg(err));
  }
};

{/* /* ===================== API ===================== */ }

{/* /** 1) 통합 리포트 생성 (React → Spring /api/stress/report) */ }
export const postStressReport = (
  payload: ReportPayload
): Promise<ReportResult> =>
  requestWithRefresh<ReportResult>({
    url: "/api/stress/report",
    method: "POST",
    data: payload,
    headers: { "Content-Type": "application/json" },
  });

{/* /** 2) 오디오 업로드 후 감정 분석 (선택 기능) */ }
export const postStressAudio = (
  file: File
): Promise<{ emotion?: string; confidence?: number; [k: string]: any }> => {
  const form = new FormData();
  form.append("file", file);

  return requestWithRefresh({
    url: "/api/stress/audio",
    method: "POST",
    data: form,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

{/* /** 3) LLM 챗 (후속 질문) */ }
export const postStressChat = (payload: ChatPayload): Promise<ChatResult> =>
  requestWithRefresh<ChatResult>({
    url: "/api/stress/chat",
    method: "POST",
    data: payload,
    headers: { "Content-Type": "application/json" },
  });
