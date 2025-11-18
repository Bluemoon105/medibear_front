import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import TypeIt from "typeit";
import { autoRefreshCheck } from "../../utils/TokenUtils";

type CalorieForm = {
  duration_minutes: number;
  weight_kg: number;
  activity_type: string;
  bmi: number;
  height_cm: number;
};

const DEFAULT_FORM_DATA: CalorieForm = {
  duration_minutes: 60,
  weight_kg: 60,
  activity_type: "Tennis",
  bmi: 0,
  height_cm: 170,
};

const Calorie = () => {
  const [formData, setFormData] = useState<CalorieForm>(DEFAULT_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<{ prompt: string; advice: string } | null>(null);

  const typeRef = useRef<HTMLDivElement>(null);

  // 🔹 BMI 자동 계산
  useEffect(() => {
    const heightM = formData.height_cm / 100;
    if (heightM > 0) {
      const newBmi = formData.weight_kg / (heightM * heightM);
      setFormData((prev) => ({
        ...prev,
        bmi: Number(newBmi.toFixed(1)),
      }));
    }
  }, [formData.height_cm, formData.weight_kg]);

  // 🔹 TypeIt 애니메이션
  useEffect(() => {
    if (!analysis?.advice || !typeRef.current) return;

    typeRef.current.innerHTML = "";

    new TypeIt(typeRef.current, {
      speed: 25,
      cursorChar: "|",
      waitUntilVisible: true,
    })
      .type(analysis.advice)
      .go();
  }, [analysis]);

  // 🔹 칼로리 예측 요청
  const requestPrediction = async (payload: CalorieForm) => {
    try {
      setIsLoading(true);

      const response = await autoRefreshCheck({
        url: "/api/calorie/predict",
        method: "POST",
        data: payload,
        withCredentials: true,
      });

      if (!response) throw new Error("API 응답이 없습니다.");

      const predicted = response.data?.predicted_calories ?? null;
      setPrediction(predicted);

      if (predicted !== null) {
        await requestAnalyze();
      }
    } catch (error) {
      console.error("칼로리 예측 API 호출 실패:", error);
      setPrediction(null);
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 LLM 분석 요청
  const requestAnalyze = async () => {
    try {
      const response = await autoRefreshCheck({
        url: "/api/calorie/analyze",
        method: "POST",
        data: {},
        withCredentials: true,
      });

      if (!response) throw new Error("API 응답이 없습니다.");

      setAnalysis(response.data);
    } catch (error) {
      console.error("LLM 분석 API 호출 실패:", error);
      setAnalysis(null);
    }
  };

  // 🔹 운동 종류 옵션 (영어 값, 한글 라벨)
  const activityOptions = useMemo(
    () => [
      { value: "Basketball", label: "농구" },
      { value: "Cycling", label: "자전거" },
      { value: "Dancing", label: "댄스" },
      { value: "HIIT", label: "HIIT 고강도" },
      { value: "Running", label: "달리기" },
      { value: "Swimming", label: "수영" },
      { value: "Tennis", label: "테니스" },
      { value: "Walking", label: "걷기" },
      { value: "Weight Training", label: "웨이트 트레이닝" },
      { value: "Yoga", label: "요가" },
    ],
    []
  );

  // 🔹 입력 핸들링
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: event.target.type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await requestPrediction(formData);
  };

  const handleReset = () => {
    setPrediction(null);
    setAnalysis(null);
    setFormData(DEFAULT_FORM_DATA);
  };

  return (
    <div className="min-h-screen bg-base-100 px-4 py-10 flex flex-col items-center overflow-y-auto">
      {/* 🔹 입력 카드 */}
      <div className="card w-full max-w-3xl bg-base-100 shadow-xl mb-3">
        <div className="card-body space-y-6">
          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">칼로리 소모량 예측</h1>
            <p className="text-base-content/70">
              운동 시간, 체중, 활동 종류를 입력하면 BMI가 자동으로 계산됩니다.
            </p>
          </header>

          {/* 🔹 전체 Form */}
          <form onSubmit={handleSubmit} onReset={handleReset} className="space-y-8">

            {/* 🔸 운동 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="form-control w-full">
                <span className="label-text font-medium">운동 시간 (분)</span>
                <input
                  type="number"
                  name="duration_minutes"
                  min={1}
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text font-medium">활동 종류</span>
                <select
                  name="activity_type"
                  className="select select-bordered"
                  value={formData.activity_type}
                  onChange={handleInputChange}
                >
                  {activityOptions.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* 🔸 신체 정보 입력 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-xl bg-base-100">
              <label className="form-control w-full">
                <span className="label-text font-medium">체중 (kg)</span>
                <input
                  type="number"
                  name="weight_kg"
                  min={1}
                  value={formData.weight_kg}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text font-medium">키 (cm)</span>
                <input
                  type="number"
                  name="height_cm"
                  min={50}
                  value={formData.height_cm}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text font-medium">BMI (자동 계산)</span>
                <input
                  type="number"
                  name="bmi"
                  step={0.1}
                  value={formData.bmi}
                  className="input input-bordered bg-base-200"
                  disabled
                />
              </label>
            </div>

            {/* 🔸 요약 */}
            <div className="rounded-xl bg-base-200 px-6 py-4 space-y-2">
              <h3 className="text-lg font-semibold">요약 정보</h3>
              <ul className="text-sm space-y-1 text-base-content/80">
                <li>운동 시간: {formData.duration_minutes}분</li>
                <li>활동: {formData.activity_type}</li>
                <li>체중: {formData.weight_kg}kg</li>
                <li>키: {formData.height_cm}cm</li>
                <li>BMI: {formData.bmi}</li>
              </ul>
            </div>

            {/* 🔸 버튼 */}
            <div className="card-actions justify-end gap-3">
              <button type="reset" className="btn btn-ghost" disabled={isLoading}>
                초기화
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? "예측 중..." : "예측하기"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 🔹 예측 결과 & 분석 */}
      {prediction !== null && (
        <div className="card w-full max-w-3xl bg-base-100 shadow-xl">
          <div className="rounded-lg bg-base-300 p-4 m-3 whitespace-pre-line text-sm leading-relaxed">
            <strong className="block text-blue-700">예측 결과</strong>
            <span className="text-base-content/80">예상 소모 칼로리: {prediction} kcal</span>
          </div>

          {analysis && (
            <div className="rounded-lg bg-base-200 p-4 m-3 whitespace-pre-line text-sm leading-relaxed">
              <h3 className="font-semibold text-gray-800 mb-2">🧠 LLM 운동 분석 결과</h3>
              <div ref={typeRef} className="text-gray-700 mb-4"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calorie;
