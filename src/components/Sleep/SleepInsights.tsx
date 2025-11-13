import { useEffect, useState } from "react";
import axios from "../../config/setAxios";

export default function SleepInsights() {
  const [fatigueScore, setFatigueScore] = useState<number | null>(null);
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [conditionLevel, setConditionLevel] = useState<string>("");
  const [recommendedSleep, setRecommendedSleep] = useState<string>("예측 중...");
  const memberNo = 2;

  const conditionEmoji: Record<string, string> = {
    좋음: "😆",
    보통: "🤨",
    나쁨: "🤧",
    최악: "💀",
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        // ✔ 피로도 예측 GET 요청
        const fatigueRes = await axios.get(`/sleep/predict-fatigue`, {
          params: { memberNo },
        });
  
        const fatigueData = fatigueRes.data?.data;
  
        setFatigueScore(fatigueData?.predictedFatigueScore ?? null);
        setConditionLevel(fatigueData?.conditionLevel ?? "");
        setSleepQuality(fatigueData?.predictedSleepQuality ?? null);
  
        // ✔ 최적 수면시간 예측 GET 요청
        const sleepRes = await axios.get(`/sleep/predict-sleephours`, {
          params: { memberNo },
        });
  
        const sleepData = sleepRes.data?.data;
        setRecommendedSleep(sleepData?.recommendedSleepRange ?? "데이터 없음");
        
      } catch (err) {
        console.error("예측 불러오기 실패:", err);
      }
    };
  
    fetchPredictions();
  }, []);
  

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
        padding: "36px 28px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "17px",
          fontWeight: 700,
          color: "#B38252",
          marginBottom: "22px",
        }}
      >
        오늘의 예측 결과
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-start",
          textAlign: "center",
          fontSize: "16px",
          color: "#4A3B2E",
          fontWeight: 500,
        }}
      >
        {/* 💤 수면 점수 */}
        <div>
          <p style={{ fontWeight: 600, marginBottom: "8px", fontSize: "15px" }}>수면 점수</p>
          <p
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: sleepQuality !== null ? "#B38252" : "#999",
              marginBottom: "6px",
            }}
          >
            {sleepQuality !== null ? sleepQuality.toFixed(1) : "-"} / 5
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#7A5A38",
              opacity: 0.8,
            }}
          >
          </p>
        </div>

        {/* 🔋 피로도 점수 */}
        <div>
          <p style={{ fontWeight: 600, marginBottom: "8px", fontSize: "15px" }}>피로도 점수</p>
          <p
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: fatigueScore !== null ? "#B38252" : "#999",
              marginBottom: "6px",
            }}
          >
            {fatigueScore !== null ? fatigueScore.toFixed(1) : "-"}
          </p>
        </div>

        {/* 🧠 컨디션 */}
        <div>
          <p style={{ fontWeight: 600, marginBottom: "8px", fontSize: "15px" }}>컨디션 레벨</p>
          <p
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: conditionLevel ? "#B38252" : "#999",
            }}
          >
            {renderCondition()}
          </p>
        </div>

        {/* 🌙 추천 수면시간 */}
        <div>
          <p style={{ fontWeight: 600, marginBottom: "8px", fontSize: "15px" }}>추천 수면시간</p>
          <p
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: recommendedSleep !== "예측 중..." ? "#B38252" : "#999",
            }}
          >
            {recommendedSleep}
          </p>
        </div>
      </div>
    </div>
  );
}
