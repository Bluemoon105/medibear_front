// src/pages/stress/StressReportPage.tsx
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";

import {
  postStressReport,
  postStressAudio,
  postStressChat,
  postStressAgentStep,
} from "../../services/Stress/StressReportServices";

import type {
  ReportResult,
  ChatTurn,
  AgentState,
} from "../../services/Stress/StressReportServices";

type FormState = {
  sleepHours: number | string;
  activityLevel: number | string;
  caffeineCups: number | string;
  comment: string;
};

export default function StressReportPage() {
  // ===== 입력 폼 상태 =====
  const [form, setForm] = useState<FormState>({
    sleepHours: 7,
    activityLevel: 5,
    caffeineCups: 1,
    comment: "",
  });
  const [audio, setAudio] = useState<File | null>(null);
  const [audioDetect, setAudioDetect] = useState<{
    emotion?: string;
    confidence?: number;
  }>({});

  // ===== 리포트/로딩 =====
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);

  // ===== LangGraph 에이전트 상태 (/stress/agent/step) =====
  const [agentState, setAgentState] = useState<AgentState>({
    sleepHours: null,
    activityLevel: null,
    caffeineCups: null,
    primaryEmotion: null,
    comment: "",
    interviewTurns: 0,
  });
  const [agentFinished, setAgentFinished] = useState(false); // true면 자유 코칭 모드

  // ===== 코칭 챗봇 =====
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // ===== 스크롤 보조 =====
  useEffect(() => {
    if (result && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // ===== 현재 단계(에이전트 진행 상태용) =====
  const currentStep = !result
    ? audio
      ? 3
      : 1
    : agentFinished
    ? 6
    : 5;

  // ===== 폼 입력 =====
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ===== 오디오 감정 분석 =====
  const analyzeAudioInternal = async (): Promise<{
    emotion: string;
    confidence?: number;
  }> => {
    if (!audio) throw new Error("오디오 파일이 필요합니다.");
    const data = await postStressAudio(audio);
    const emo = data.emotion || "unknown";
    const conf = typeof data.confidence === "number" ? data.confidence : undefined;
    setAudioDetect({ emotion: emo, confidence: conf });
    return { emotion: emo, confidence: conf };
  };

  // ===== 리포트 생성 (/stress/report → Spring → FastAPI /stress/report/agent) =====
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setAgentFinished(false);

    try {
      // 1) 오디오 감정
      let emotion = audioDetect.emotion;
      if (!emotion) {
        if (!audio) {
          setToast("오디오 파일을 업로드해 주세요.");
          setLoading(false);
          return;
        }
        const det = await analyzeAudioInternal();
        emotion = det.emotion;
      }

      // 2) LangGraph 리포트 요청
      const payload = {
        sleepHours: Number(form.sleepHours),
        activityLevel: Number(form.activityLevel),
        caffeineCups: Number(form.caffeineCups),
        primaryEmotion: emotion!,
        comment: form.comment,
      };

      const data = await postStressReport(payload);
      setResult(data);

      // 3) 에이전트 상태 초기화
      setAgentState({
        sleepHours: Number(form.sleepHours) || null,
        activityLevel: Number(form.activityLevel) || null,
        caffeineCups: Number(form.caffeineCups) || null,
        primaryEmotion: emotion ?? null,
        comment: form.comment,
        interviewTurns: 0,
      });

      // 4) 첫 안내 + 상태에 맞춘 첫 질문 (친구 말투)
      const score = data.stressScore;
      const emo = (data.primaryEmotion || "").toLowerCase();

      let level: "low" | "mid" | "high";
      if (score < 30) level = "low";
      else if (score < 60) level = "mid";
      else level = "high";

      const positiveEmos = ["happy", "calm", "relaxed", "neutral"];
      const anxietyEmos = ["anxiety", "anxious", "fear"];
      const sadEmos = ["sad", "sadness", "depressed"];
      const angryEmos = ["angry", "anger"];

      let firstQuestion = "";

      if (level === "low" && positiveEmos.includes(emo)) {
        firstQuestion =
          '리포트 상으론 전체적으로 꽤 안정적인 상태로 보여. 😊\n' +
          '요즘 마음이나 생활에서 "이건 나름 잘 하고 있다"라고 느끼는 부분이 있다면 뭐가 떠올라?';
      } else if (level === "mid") {
        firstQuestion =
          "요즘 전반적인 스트레스가 살짝 올라가 있는 느낌이야.\n" +
          "최근 일상에서 제일 자주 신경 쓰이거나 부담되는 상황이 있다면 어떤 거야?";
      } else if (
        level === "high" ||
        anxietyEmos.includes(emo) ||
        sadEmos.includes(emo) ||
        angryEmos.includes(emo)
      ) {
        firstQuestion =
          "요즘 스트레스가 꽤 높은 편이고, 감정도 예민해져 있는 날이 많은 것 같아.\n" +
          "최근 며칠을 떠올렸을 때, 특히 가장 힘들었다고 느꼈던 순간이 있다면 언제였어?";
      } else {
        firstQuestion =
          "요즘 일상하고 마음 상태를 조금 더 자세히 알고 싶어.\n" +
          "최근에 가장 많이 떠오르거나 신경 쓰였던 고민이 있다면 어떤 거야?";
      }

      setHistory([
        {
          role: "assistant",
          content: `리포트 한 번 뽑아봤어. 😊

• Agent 1 (ML) 스트레스 지수: ${score.toFixed(2)} / 100
• Agent 2 (DL) 감정 상태: ${data.primaryEmotion}

이제 Agent 3가 지금 상황을 조금 더 정확하게 이해하려고
짧은 질문 몇 가지를 물어볼 거야. 편하게 친구한테 얘기하듯 적어줘.

${firstQuestion}`,
        },
      ]);
    } catch (err: any) {
      setHistory([
        {
          role: "assistant",
          content: `⚠️ 오류 발생: ${err?.message ?? "알 수 없는 오류입니다."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ===== 코칭 챗봇 전송 (인터뷰 모드 + 자유 코칭 모드) =====
  const sendChat = async (text?: string) => {
    const q = (text ?? chatInput).trim();
    if (!q) return;

    setChatInput("");
    setChatLoading(true);

    const userMsg: ChatTurn = { role: "user", content: q };
    const baseHistory: ChatTurn[] = [...history, userMsg];

    // UI 먼저 반영
    setHistory(baseHistory);

    try {
      // --- 1) 인터뷰 단계 ---
      if (!agentFinished) {
        const stateForAgent: AgentState = {
          sleepHours:
            form.sleepHours !== "" && !Number.isNaN(Number(form.sleepHours))
              ? Number(form.sleepHours)
              : agentState.sleepHours ?? null,
          activityLevel:
            form.activityLevel !== "" && !Number.isNaN(Number(form.activityLevel))
              ? Number(form.activityLevel)
              : agentState.activityLevel ?? null,
          caffeineCups:
            form.caffeineCups !== "" && !Number.isNaN(Number(form.caffeineCups))
              ? Number(form.caffeineCups)
              : agentState.caffeineCups ?? null,
          primaryEmotion: audioDetect.emotion ?? agentState.primaryEmotion ?? null,
          comment: form.comment || agentState.comment || "",
          interviewTurns: agentState.interviewTurns ?? 0,
        };

        const res = await postStressAgentStep({
          state: stateForAgent,
          message: q,
          history: baseHistory.map((m) => ({ role: m.role, content: m.content })),
        });

        if (res.state) setAgentState(res.state);
        if (res.report) setResult(res.report);

        let replyText = res.reply;

        if (res.mode === "final") {
          setAgentFinished(true);
          replyText =
            replyText +
            "\n\n지금까지 얘기해 준 내용들 한 번 싹 정리해서, " +
            "위쪽에 네 감정 상태랑 스트레스 관리 팁을 모은 리포트를 다시 만들어놨어. " +
            "운동·식이·수면 쪽에서 바로 해볼 수 있는 것들도 같이 적어뒀으니까, " +
            "시간 날 때 천천히 읽어봐 줘. 😊";
        }

        const assistantMsg: ChatTurn = { role: "assistant", content: replyText };
        setHistory([...baseHistory, assistantMsg]);
      }
      // --- 2) 자유 코칭 단계 ---
      else {
        if (!result) {
          const fallbackMsg: ChatTurn = {
            role: "assistant",
            content:
              "위쪽에서 코칭 리포트를 한 번 더 만들어 주면, 그걸 참고해서 코칭 대화를 이어갈게.",
          };
          setHistory([...baseHistory, fallbackMsg]);
          return;
        }

        const ml = { stressScore: result.stressScore };
        const dl =
          result.primaryEmotion != null
            ? { primaryEmotion: result.primaryEmotion }
            : undefined;
        const coaching = result.coachingText ?? undefined;

        const data = await postStressChat({
          ml,
          dl,
          coaching,
          history: baseHistory,
          question: q,
        });

        const assistantMsg: ChatTurn = { role: "assistant", content: data.reply };
        setHistory([...baseHistory, assistantMsg]);
      }
    } catch (err: any) {
      const assistantMsg: ChatTurn = {
        role: "assistant",
        content: `⚠️ 챗봇 오류: ${err?.message ?? "알 수 없는 오류입니다."}`,
      };
      setHistory([...baseHistory, assistantMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // ===== UI 보조 =====
  const emotionBadge = (emo?: string) => {
    if (!emo) return <span className="badge badge-ghost">감정: 분석 전</span>;
    const color: Record<string, string> = {
      happy: "badge-warning",
      sad: "badge-info",
      angry: "badge-error",
      neutral: "badge-neutral",
      fear: "badge-secondary",
      disgust: "badge-success",
    };
    return <span className={`badge ${color[emo] ?? "badge-ghost"} gap-2`}>감정: {emo}</span>;
  };

  const stressLevelText = () => {
    if (!result) return "대기 중";
    const s = result.stressScore;
    if (s < 30) return "낮음";
    if (s < 60) return "보통";
    return "높음";
  };

  const llmStatusText = () => {
    if (!history.length) return "대화 준비됨";
    if (!agentFinished) return "인터뷰 진행 중";
    return "자유 코칭 중";
  };

  const reportStatusText = () => {
    if (!result) return "아직 생성 전";
    if (!agentFinished) return "초기 리포트 생성됨";
    return "인터뷰 반영 리포트";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 via-base-200 to-base-100">
      {/* ===== 헤더 ===== */}
      <header className="border-b bg-base-100/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🧠</div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">StressCare AI</h1>
                <p className="text-xs md:text-sm opacity-70">
                  Multi-Agent Diagnosis · ML Score · DL Emotion · LLM Coaching
                </p>
              </div>
            </div>
            <div className="hidden md:block">{emotionBadge(audioDetect.emotion)}</div>
          </div>

          {/* 상단 Step 표시 (텍스트 버전) */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] md:text-xs opacity-80">
            <div className="flex items-center gap-1">
              <span className={`font-semibold ${currentStep >= 1 ? "text-primary" : ""}`}>
                1. Input
              </span>
              <span className="hidden md:inline"> (수면·활동·카페인·음성)</span>
            </div>
            <span>›</span>
            <div className="flex items-center gap-1">
              <span className={`font-semibold ${currentStep >= 5 ? "text-primary" : ""}`}>
                2. Analysis & Interview
              </span>
            </div>
            <span>›</span>
            <div className="flex items-center gap-1">
              <span className={`font-semibold ${currentStep >= 6 ? "text-primary" : ""}`}>
                3. Solution
              </span>
              <span className="hidden md:inline">&nbsp;(코칭 & 일상 팁)</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="badge badge-outline gap-1">
                😶 감정:
                <span className="font-semibold">
                  {audioDetect.emotion ?? result?.primaryEmotion ?? "분석 전"}
                </span>
              </span>
            </div>
          </div>

          {/* 에이전트 상태 배지 */}
          <div className="flex flex-wrap gap-2 text-[11px] md:text-xs">
            <div className="badge badge-outline gap-2">
              📊 Score Agent
              <span className="font-semibold">
                {result ? `${result.stressScore.toFixed(1)}점 (${stressLevelText()})` : "대기 중"}
              </span>
            </div>
            <div className="badge badge-outline gap-2">
              🎧 Emotion Agent
              <span className="font-semibold">
                {audioDetect.emotion ?? result?.primaryEmotion ?? "대기 중"}
              </span>
            </div>
            <div className="badge badge-outline gap-2">
              💬 LLM Agent
              <span className="font-semibold">{llmStatusText()}</span>
            </div>
            <div className="badge badge-outline gap-2">
              📄 Report Agent
              <span className="font-semibold">{reportStatusText()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ===== 본문 ===== */}
      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Hero / 현재 상태 요약 */}
        <section ref={reportRef} className="card bg-base-100 shadow-xl border border-base-300/60">
          <div className="card-body items-center text-center space-y-3">
            <div className="text-5xl mb-1">🧠</div>
            {!result ? (
              <>
                <h2 className="card-title text-lg md:text-xl">
                  오늘 하루, 너 마음 상태 한 번 같이 볼까?
                </h2>
                <p className="text-sm md:text-base opacity-80 max-w-xl">
                  아래에서 <b>수면 시간 · 활동량 · 카페인 · 간단한 메모</b>를 적어주고,
                  <b> 음성 파일</b>까지 올려주면
                  <br />
                  ML / DL / LLM 에이전트들이 같이 보고 오늘의 컨디션을 정리해 줄게.
                </p>
              </>
            ) : (
              <>
                <h2 className="card-title text-lg md:text-xl">오늘 상태를 이렇게 정리해 봤어 👇</h2>
                <p className="text-sm md:text-base opacity-80 max-w-xl whitespace-pre-wrap">
                  · ML 기반 스트레스 지수:{" "}
                  <b>
                    {result.stressScore.toFixed(2)} / 100 ({stressLevelText()})
                  </b>
                  {"\n"}
                  · DL 기반 대표 감정: <b>{result.primaryEmotion ?? "unknown"}</b>
                  {"\n"}
                  아래 리포트에는 운동·식이·수면 쪽에서 바로 해볼 수 있는 제안도 같이 담아놨어.
                </p>
              </>
            )}
          </div>
        </section>

        {/* ===== 상태 입력 폼 ===== */}
        <section className="card bg-base-100 shadow-lg border border-base-300/60">
          <div className="card-body">
            <div className="flex items-center justify-between mb-2">
              <h2 className="card-title text-base md:text-lg">
                상태 입력 · Score / Emotion Agent에 전달할 정보
              </h2>
              <span className="badge badge-sm badge-outline">Input</span>
            </div>

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-3">
                <input
                  name="sleepHours"
                  type="number"
                  value={form.sleepHours}
                  onChange={onChange}
                  placeholder="수면 시간(시간)"
                  className="input input-bordered w-full"
                />
                <input
                  name="activityLevel"
                  type="number"
                  value={form.activityLevel}
                  onChange={onChange}
                  placeholder="활동 레벨(1~10)"
                  className="input input-bordered w-full"
                />
                <input
                  name="caffeineCups"
                  type="number"
                  value={form.caffeineCups}
                  onChange={onChange}
                  placeholder="카페인 섭취(잔)"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="space-y-3">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudio(e.target.files?.[0] || null)}
                  className="file-input file-input-bordered w-full"
                />
                {typeof audioDetect.confidence === "number" && (
                  <div className="mt-1 flex items-center gap-3">
                    {emotionBadge(audioDetect.emotion)}
                    <div
                      className="radial-progress"
                      style={
                        {
                          ["--value" as any]: Math.round(audioDetect.confidence * 100),
                        } as any
                      }
                      role="progressbar"
                    >
                      {Math.round(audioDetect.confidence * 100)}%
                    </div>
                  </div>
                )}
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={onChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="메모 (예: 오늘 피곤함 / 두통 있음 / 기분 메모 등)"
                />
              </div>

              <button
                className={`btn btn-primary md:col-span-2 ${loading ? "btn-disabled" : ""}`}
              >
                {loading ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "🔍 에이전트들한테 분석 맡기기"
                )}
              </button>
              {!audio && (
                <div className="md:col-span-2 text-xs text-warning">
                  ※ 음성 파일을 함께 업로드하면 Emotion Agent가 Anxiety / Sadness / Calm 등
                  감정을 분석해 줍니다.
                </div>
              )}
            </form>
          </div>
        </section>

        {/* ===== Report Agent : 오늘의 리포트 (전체 너비) ===== */}
        <section className="card bg-base-100 shadow-lg border border-base-300/60">
          <div className="card-body space-y-2">
            <h2 className="card-title text-sm md:text-base">📄 Report Agent · 오늘의 리포트</h2>
            {!result ? (
              <p className="text-xs md:text-sm opacity-70">
                아직 리포트가 없어요. 위에서 상태를 입력하고 에이전트 분석을 한 번 돌리면,
                여기에서 운동·식이·수면 쪽 제안이 정리돼서 보여요.
              </p>
            ) : (
              <div className="chat chat-start mt-1">
                <div className="chat-bubble whitespace-pre-wrap text-xs md:text-sm">
                  {result.report ?? result.coachingText}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===== LLM Agent : 인터뷰 & 코칭 챗봇 (리포트 아래에 세로 배치) ===== */}
        <section className="card bg-base-100 shadow-lg border border-base-300/60">
          <div className="card-body pb-2 flex flex-col h-[520px]">
            <div className="flex justify-between items-center mb-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h2 className="card-title text-sm md:text-base">
                    💬 LLM Agent · 인터뷰 & 코칭 챗봇
                  </h2>
                  <span
                    className={`badge badge-sm ${
                      agentFinished ? "badge-primary" : "badge-accent"
                    }`}
                  >
                    {agentFinished ? "✅ 진단 완료 · 자유 코칭 모드" : "🟢 인터뷰 진행 중"}
                  </span>
                </div>
                <p className="text-[11px] md:text-xs opacity-70">
                  처음엔 Agent 3가 2~3번 정도 질문을 던지면서 요즘 상황을 파악하고,
                  그다음엔 친구처럼 자유롭게 고민을 들어줄 거야.
                </p>
              </div>

              <div className="join hidden md:inline-flex">
                <button
                  className="btn btn-xs join-item"
                  type="button"
                  onClick={() => sendChat("5분 안에 할 수 있는 빠른 진정법 알려줘")}
                >
                  🫁 호흡법
                </button>
                <button
                  className="btn btn-xs join-item"
                  type="button"
                  onClick={() => sendChat("실내에서 바로 가능한 스트레스 완화 루틴 알려줘")}
                >
                  🏠 수면 루틴
                </button>
                <button
                  className="btn btn-xs join-item"
                  type="button"
                  onClick={() => sendChat("오늘 밤 수면의 질을 높이는 방법 알려줘")}
                >
                  🌙 수면 팁
                </button>
              </div>
            </div>

            {/* 대화 영역 */}
            <div className="bg-base-200/50 p-3 rounded-lg space-y-3 flex-1 overflow-y-auto">
              {history.map((msg, i) => (
                <div
                  key={i}
                  className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-bubble whitespace-pre-wrap text-xs md:text-sm">
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="chat chat-start">
                  <div className="chat-bubble">
                    <span className="loading loading-dots" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* 입력 바 */}
            <div className="pt-3">
              <div className="join w-full">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                    e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendChat())
                  }
                  placeholder={
                    agentFinished
                      ? "지금 마음 상태나 궁금한 점을 편하게 적어줘…"
                      : "AI가 던지는 질문에 답하거나, 그냥 요즘 힘든 얘기를 먼저 적어줘도 좋아."
                  }
                  className="input input-bordered join-item w-full text-sm"
                />
                <button
                  type="button"
                  onClick={() => sendChat()}
                  className={`btn btn-primary join-item ${
                    chatLoading ? "btn-disabled" : ""
                  }`}
                >
                  {chatLoading ? <span className="loading loading-spinner" /> : "보내기"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 토스트 */}
      {toast && (
        <div className="toast toast-end z-50">
          <div className="alert alert-info">
            <span>{toast}</span>
            <button className="btn btn-ghost btn-xs" onClick={() => setToast(null)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
