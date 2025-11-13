// src/pages/stress/StressReportPage.tsx
import { useEffect, useRef, useState } from "react";
import {
  postStressReport,
  postStressAudio,
  postStressChat,
  type ReportResult,
  type ChatTurn,
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
  const [audioDetect, setAudioDetect] = useState<{ emotion?: string; confidence?: number }>({});

  // ===== 리포트/로딩 =====
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);

  // ===== 챗봇 =====
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (result && reportRef.current) reportRef.current.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [history]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // ===== 내부: 오디오 감정 분석 =====
  const analyzeAudioInternal = async (): Promise<{ emotion: string; confidence?: number }> => {
    if (!audio) throw new Error("오디오 파일이 필요합니다.");
    const data = await postStressAudio(audio);
    const emo = data.emotion || "unknown";
    const conf = typeof data.confidence === "number" ? data.confidence : undefined;
    setAudioDetect({ emotion: emo, confidence: conf });
    return { emotion: emo, confidence: conf };
  };

  // ===== 리포트 생성(한 번에) =====
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
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

      const payload = {
        sleepHours: Number(form.sleepHours),
        activityLevel: Number(form.activityLevel),
        caffeineCups: Number(form.caffeineCups),
        primaryEmotion: emotion!,
        comment: form.comment,
      };

      const data = await postStressReport(payload);
      setResult(data);
      setHistory([
        {
          role: "assistant",
          content:
            `리포트가 생성되었어요! 😊\n\n` +
            `• 스트레스 점수: ${data.stressScore.toFixed(2)}\n` +
            `• 감정: ${data.primaryEmotion}\n\n` +
            `궁금한 점을 아래에 입력해보세요.`,
        },
      ]);
    } catch (err: any) {
      setHistory([{ role: "assistant", content: `⚠️ 오류 발생: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  // ===== 챗 전송 =====
  const sendChat = async (text?: string) => {
    const q = (text ?? chatInput).trim();
    if (!q) return;
    setChatInput("");
    setHistory((h) => [...h, { role: "user", content: q }]);
    setChatLoading(true);
    try {
      const payload = {
        ml: result ? { stress_score: result.stressScore } : undefined,
        dl: audioDetect.emotion ? { primary_emotion: audioDetect.emotion } : undefined,
        coaching: result?.coachingText,
        history: history,
        question: q,
      };
      const data = await postStressChat(payload);
      setHistory((h) => [...h, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      setHistory((h) => [...h, { role: "assistant", content: `⚠️ 오류: ${err.message}` }]);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 via-base-200 to-base-100">
      {/* 헤더 */}
      <header className="sticky top-0 z-20 border-b bg-base-100/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🧠</div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">AI 멘탈케어 코치</h1>
              <p className="text-sm opacity-70">스트레스 · 감정 분석 · 코칭 챗봇</p>
            </div>
          </div>
          {emotionBadge(audioDetect.emotion)}
        </div>
      </header>

      {/* 본문 — 세로 흐름 */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 1) 상태 입력 */}
        <section className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">1) 상태 입력</h2>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudio(e.target.files?.[0] || null)}
                  className="file-input file-input-bordered w-full"
                />
                {typeof audioDetect.confidence === "number" && (
                  <div className="mt-2 flex items-center gap-3">
                    {emotionBadge(audioDetect.emotion)}
                    <div
                      className="radial-progress"
                      style={{ ["--value" as any]: Math.round(audioDetect.confidence * 100) }}
                      role="progressbar"
                    >
                      {Math.round(audioDetect.confidence * 100)}%
                    </div>
                  </div>
                )}
              </div>

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
              <textarea
                name="comment"
                value={form.comment}
                onChange={onChange}
                className="textarea textarea-bordered md:col-span-2"
                placeholder="메모 (예: 오늘 피곤함 / 두통 있음)"
              />
              <button className={`btn btn-primary md:col-span-2 ${loading ? "btn-disabled" : ""}`}>
                {loading ? <span className="loading loading-spinner" /> : "💬 코칭 받기 (한 번에)"}
              </button>
              {!audio && (
                <div className="md:col-span-2 text-sm text-warning">
                  ※ 오디오 파일을 업로드하면 감정이 자동으로 반영됩니다.
                </div>
              )}
            </form>
          </div>
        </section>

        {/* 2) 결과 리포트 */}
        <section ref={reportRef} className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">2) 결과 리포트</h2>
            {!result ? (
              <p className="text-sm opacity-70">
                상단의 정보를 입력하고 <b>코칭 받기</b>를 누르면 결과가 표시됩니다.
              </p>
            ) : (
              <>
                <div className="stats shadow w-full">
                  <div className="stat">
                    <div className="stat-title">스트레스 점수</div>
                    <div className="stat-value">{result.stressScore?.toFixed(2)}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">감정 상태</div>
                    <div className="stat-value text-primary">{result.primaryEmotion}</div>
                  </div>
                </div>
                <div className="chat chat-start mt-4">
                  <div className="chat-bubble whitespace-pre-wrap">{result.coachingText}</div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* 3) 코칭 챗봇 */}
        <section className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">3) 🗣️ 코칭 챗봇</h2>
              <div className="join">
                <button
                  className="btn btn-sm join-item"
                  onClick={() => sendChat("5분 안에 할 수 있는 빠른 진정법 알려줘")}
                >
                  🫁 호흡법
                </button>
                <button
                  className="btn btn-sm join-item"
                  onClick={() => sendChat("실내에서 바로 가능한 스트레스 완화 루틴")}
                >
                  🏠 실내 루틴
                </button>
                <button
                  className="btn btn-sm join-item"
                  onClick={() => sendChat("오늘 밤 수면의 질을 높이는 방법")}
                >
                  🌙 수면 팁
                </button>
              </div>
            </div>

            {/* 대화 영역 */}
            <div className="bg-base-200/50 p-3 rounded-lg space-y-3 h-[420px] overflow-y-auto mt-2">
              {history.map((msg, i) => (
                <div key={i} className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}>
                  <div className="chat-bubble whitespace-pre-wrap">{msg.content}</div>
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

            {/* 입력 */}
            <div className="join w-full mt-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="질문을 입력하세요…"
                className="input input-bordered join-item w-full"
              />
              <button
                onClick={() => sendChat()}
                className={`btn btn-primary join-item ${chatLoading ? "btn-disabled" : ""}`}
              >
                {chatLoading ? <span className="loading loading-spinner" /> : "보내기"}
              </button>
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
