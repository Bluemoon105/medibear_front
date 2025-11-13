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
        const fatigueRes = await axios.get(`/sleep/predict-fatigue`, {
          params: { memberNo },
        });

        const fatigueData = fatigueRes.data?.data;
        setFatigueScore(fatigueData?.predictedFatigueScore ?? null);
        setConditionLevel(fatigueData?.conditionLevel ?? "");
        setSleepQuality(fatigueData?.predictedSleepQuality ?? null);

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
    <div className="bg-[#FAF3E0] rounded-2xl shadow-md px-7 py-9 text-center">
      {/* 제목 */}
      <p className="text-[17px] font-bold text-[#B38252] mb-6">오늘의 예측 결과</p>

      {/* 4개 항목 컨테이너 */}
      <div className="flex justify-around items-start text-center text-[16px] text-[#4A3B2E] font-medium">
        {/* 수면 점수 */}
        <div>
          <p className="font-semibold mb-2 text-[15px]">수면 점수</p>
          <p
            className={`text-[26px] font-bold mb-1 ${
              sleepQuality !== null ? "text-[#B38252]" : "text-gray-400"
            }`}
          >
            {sleepQuality !== null ? sleepQuality.toFixed(1) : "-"} / 5
          </p>
        </div>

        {/* 피로도 점수 */}
        <div>
          <p className="font-semibold mb-2 text-[15px]">피로도 점수</p>
          <p
            className={`text-[26px] font-bold mb-1 ${
              fatigueScore !== null ? "text-[#B38252]" : "text-gray-400"
            }`}
          >
            {fatigueScore !== null ? fatigueScore.toFixed(1) : "-"}
          </p>
        </div>

        {/*  컨디션 */}
        <div>
          <p className="font-semibold mb-2 text-[15px]">컨디션 레벨</p>
          <p
            className={`text-[22px] font-bold ${
              conditionLevel ? "text-[#B38252]" : "text-gray-400"
            }`}
          >
            {renderCondition()}
          </p>
        </div>

        {/* 🌙 추천 수면시간 */}
        <div>
          <p className="font-semibold mb-2 text-[15px]">추천 수면시간</p>
          <p
            className={`text-[20px] font-bold ${
              recommendedSleep !== "예측 중..."
                ? "text-[#B38252]"
                : "text-gray-400"
            }`}
          >
            {recommendedSleep}
          </p>
        </div>
      </div>
    </div>
  );
}
