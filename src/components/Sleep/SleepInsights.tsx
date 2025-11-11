import { useEffect, useState } from "react";
import axios from "../../config/setAxios";

export default function SleepInsights() {
  const [fatigueScore, setFatigueScore] = useState<number | null>(null);
  const [conditionLevel, setConditionLevel] = useState<string>("");
  const [recommendedSleep, setRecommendedSleep] = useState<string>("예측 중...");
  const userId ="user001";

  // 컨디션별 이모티콘 매핑
  const conditionEmoji: Record<string, string> = {
    좋음: "😆",
    보통: "🤨",
    나쁨: "🤧",
    최악: "💀",
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        // 피로도 + 컨디션 예측
        const fatigueRes = await axios.post(`/sleep/activities/predict-fatigue`, null, {
          params: { userId },
        });
        setFatigueScore(fatigueRes.data?.predictedFatigueScore ?? null);
        setConditionLevel(fatigueRes.data?.conditionLevel ?? "");

        // 최적 수면시간 예측
        const sleepRes = await axios.post(`/sleep/activities/predict-sleephours`, null, {
          params: { userId },
        });
        setRecommendedSleep(sleepRes.data?.recommendedSleepRange || "데이터 없음");
      } catch (err) {
        console.error("예측 불러오기 실패:", err);
        setRecommendedSleep("예측 실패");
      }
    };
    fetchPredictions();
  }, []);

  // 이모티콘 + 컨디션 텍스트 병합 함수
  const renderCondition = () => {
    if (!conditionLevel) return "-";
    const emoji = conditionEmoji[conditionLevel] || "";
    return `${conditionLevel} ${emoji}`;
  };

  return (
    <div
      style={{
        background: "#FAF3E0",
        borderRadius: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "32px",
      }}
    >
      <p
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "#B38252",
          marginBottom: "16px",
        }}
      >
        오늘의 예측 결과
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          fontSize: "15px",
          color: "#4A3B2E",
        }}
      >
        <div>
          <p style={{ fontWeight: 600, marginBottom: "6px" }}>피로도 점수</p>
          <p>{fatigueScore !== null ? fatigueScore.toFixed(1) : "-"}</p>
        </div>
        <div>
          <p style={{ fontWeight: 600, marginBottom: "6px" }}>컨디션 레벨</p>
          <p>{renderCondition()}</p>
        </div>
        <div>
          <p style={{ fontWeight: 600, marginBottom: "6px" }}>추천 수면시간</p>
          <p>{recommendedSleep}</p>
        </div>
      </div>
    </div>
  );
}
