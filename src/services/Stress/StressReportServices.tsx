// src/services/Stress/StressReportServices.ts
import { autoRefreshCheck } from "../../utils/TokenUtils";

/* ===================== Types ===================== */

// 리포트 요청 페이로드 (React → Spring /api/stress/report)
export type ReportPayload = {
  sleepHours: number;
  activityLevel: number;
  caffeineCups: number;
  primaryEmotion: string;
  comment?: string;
};

// 리포트 응답 결과 (Spring → React)
export type ReportResult = {
  stressScore: number;
  primaryEmotion: string;
  coachingText: string;
  report?: string;
  meta?: Record<string, any>;
};

// LLM 대화 턴
export type ChatTurn = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
};

// LLM 챗봇 요청 페이로드
export type ChatPayload = {
  ml?: Record<string, any>;
  dl?: Record<string, any>;
  coaching?: string;
  history?: ChatTurn[];
  question: string;
};

export type ChatResult = { reply: string };

// ===== LangGraph 에이전트 상태 =====
export type AgentState = {
  sleepHours?: number | null;
  activityLevel?: number | null;
  caffeineCups?: number | null;
  primaryEmotion?: string | null;
  comment?: string | null;

  // ✅ 여기! : 숫자 카운트로 사용
  interviewTurns?: number;
};

export type AgentStepRequest = {
  state: AgentState;
  message: string;
  history: ChatTurn[];
};

export type AgentStepResponse = {
  mode: "ask" | "final";
  reply: string;
  state: AgentState;
  report?: ReportResult;
};

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
 * autoRefreshCheck:
 *  - access 토큰 만료 확인
 *  - refresh 요청
 *  - 원래 요청 재시도
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

{/* /* ===================== API ===================== */

/** 1) 통합 리포트 생성 (React → Spring /api/stress/report) */ }
export const postStressReport = (
  payload: ReportPayload
): Promise<ReportResult> =>
  requestWithRefresh<ReportResult>({
    url: "/api/stress/report",
    method: "POST",
    data: payload,
    headers: { "Content-Type": "application/json" },
  });

{/* /** 2) 오디오 업로드 후 감정 분석 */ }
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

{/* /** 3) LLM 코칭 챗봇 (/api/stress/chat) */ }
export const postStressChat = (payload: ChatPayload): Promise<ChatResult> =>
  requestWithRefresh<ChatResult>({
    url: "/api/stress/chat",
    method: "POST",
    data: payload,
    headers: { "Content-Type": "application/json" },
  });

{/* /** 4) LangGraph 에이전트 한 스텝 (/api/stress/agent/step) */ }
export const postStressAgentStep = (
  payload: AgentStepRequest
): Promise<AgentStepResponse> =>
  requestWithRefresh<AgentStepResponse>({
    url: "/api/stress/agent/step",
    method: "POST",
    data: payload,
    headers: { "Content-Type": "application/json" },
  });
