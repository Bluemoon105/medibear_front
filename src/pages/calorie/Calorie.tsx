import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useState } from "react";
import axios from "../../config/setAxios";

type CalorieForm = {
	duration_minutes: number;
	weight_kg: number;
	activity_type: string;
	bmi: number;
};

const DEFAULT_FORM_DATA: CalorieForm = {
	duration_minutes: 60,
	weight_kg: 60,
	activity_type: "Tennis",
	bmi: 34,
};

const Calorie = () => {
	const [formData, setFormData] = useState<CalorieForm>(DEFAULT_FORM_DATA);
	const [isLoading, setIsLoading] = useState(false);
	const [prediction, setPrediction] = useState<number | null>(null);
	const [analysis, setAnalysis] = useState<{ prompt: string; advice: string } | null>(null);
	
	const requestPrediction = async (payload: CalorieForm) => {
		try {
			setIsLoading(true);
			const response = await axios.post("api/ai/calorie/predict", payload);
			const predicted = setPrediction(response.data?.predicted_calories ?? null);
			console.log("칼로리 예측 결과:", response.data);

			if(predicted !== null) {
				await requestAnalyze();
			}

		} catch (error) {
			console.error("칼로리 예측 API 호출 실패:", error);
			setPrediction(null);
		} finally {
			setIsLoading(false);
		}
	};

	const requestAnalyze = async () => {
		try {
			const response = await axios.post("api/ai/calorie/analyze");
			setAnalysis(response.data);
			console.log("LLM 분석 결과:", response.data);
		}catch (error){
			console.error("LLM 분석 API호출 실패", error);
			setAnalysis(null);
		}
	}
	
	const activityOptions = useMemo(
		() => [
			"Basketball",
			"Cycling",
			"Dancing",
			"HIIT",
			"Running",
			"Swimming",
			"Tennis",
			"Walking",
			"Weight Training",
			"Yoga",
		],
		[],
	);

	const handleInputChange = (
		event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
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
	// 리셋
	const handleReset = () => {
		setPrediction(null);
		setFormData(DEFAULT_FORM_DATA);
	};

	return (
		<div className="min-h-screen bg-base-100 px-4 py-10 flex flex-col items-center overflow-y-auto">
			<div className="card w-full max-w-3xl bg-base-100 shadow-xl mb-3">
				<div className="card-body space-y-6">
					<header className="space-y-2 text-center">
						<h1 className="text-3xl font-bold">칼로리 소모량 예측</h1>
						<p className="text-base-content/70">
							운동 시간과 체중, 활동 종류, BMI를 입력해 칼로리 소모량을 계산해보세요.
						</p>
					</header>

					<form onSubmit={handleSubmit} onReset={handleReset} className="space-y-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<label className="form-control">
								<span className="label-text">운동 시간 (분)</span>
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
							<label className="form-control">
								<span className="label-text">체중 (kg)</span>
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
							<label className="form-control">
								<span className="label-text">활동 종류</span>
								<select
									name="activity_type"
									className="select select-bordered"
									value={formData.activity_type}
									onChange={handleInputChange}
								>
									{activityOptions.map((activity) => (
										<option key={activity} value={activity}>
											{activity}
										</option>
									))}
								</select>
							</label>
							<label className="form-control flex flex-col">
								<span className="label-text">BMI</span>
								<input
									type="number"
									name="bmi"
									min={1}
									step={0.1}
									value={formData.bmi}
									onChange={handleInputChange}
									className="input input-bordered"
									required
								/>
							</label>
						</div>

						<div className="rounded-xl bg-base-200 px-6 py-4 space-y-3">
							<h3 className="text-lg font-semibold">요약</h3>
							<ul className="space-y-1 text-sm">
								<li>운동 시간: {formData.duration_minutes}분</li>
								<li>체중: {formData.weight_kg}kg</li>
								<li>활동: {formData.activity_type}</li>
								<li>BMI: {formData.bmi}</li>
							</ul>
							
						</div>

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
			
			{prediction !== null && (
				<div className="card w-full max-w-3xl bg-base-100 shadow-xl">
					<div className="rounded-lg bg-base-300 p-4 m-3 whitespace-pre-line text-sm leading-relaxed">
						<strong className="block text-blue-700">예측 결과</strong>
						<span className="text-base-content/80">예상 소모 칼로리: {prediction} kcal</span>
					</div>
					{analysis && (
						<div className="rounded-lg bg-base-200 p-4 m-3 whitespace-pre-line text-sm leading-relaxed">
							<h3 className="font-semibold text-gray-800 mb-2">🧠 LLM 운동 분석 결과</h3>
							<p className="text-gray-700 mb-4">{analysis.advice}</p>
						</div>
					)}
				</div>
			)}
				{/* <div className="w-full bg-blue-100 h-[2000px]">
				sdfsdfs
				</div> */}
		</div>
	);
};

export default Calorie;
