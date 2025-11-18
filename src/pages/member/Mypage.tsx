import { useState, useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../../components/EditProfileModal";
import { getUserEmail } from "../../utils/getUserEmail";
import { toast } from "react-toastify";
import { autoRefreshCheck } from "../../utils/TokenUtils";

type ProfileDto = {
  heightCm: number;
  weightKg: number;
  bmi: number;
};

type CalorieChartItem = {
  date: string;
  calories: number;
};

type FitnessLogItem = {
  date: string;
  activityType: string;
  durationMinutes: number;
  caloriesBurned: number;
};

type MyLogCalorieResponse = {
  profile: ProfileDto;
  calorieChart: CalorieChartItem[];
  fitnessLogs: FitnessLogItem[];
  summary: string;
};

const MyPage = () => {
  const navigate = useNavigate();
  const userEmail = getUserEmail() ?? "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<MyLogCalorieResponse | null>(null);

  // =============================================
  // 🔥 autoRefreshCheck 를 이용한 마이로그 데이터 호출
  // =============================================
  const fetchMyLog = async () => {
    try {
      const res = await autoRefreshCheck({
        url: "/api/mylog/calorie",
        method: "GET",
        withCredentials: true,
      });

      setData(res.data);
      console.log("🔥 MyLog API 응답:", res.data);
    } catch (err) {
      console.error("❌ MyLog 조회 실패:", err);
      toast.error("사용자 기록을 불러오지 못했습니다");
    }
  };

  // 🔥 로그인 체크 + API 호출
  useEffect(() => {
    if (!userEmail) {
      toast.error("로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }
    fetchMyLog();
  }, []);

  // 🔥 로딩 화면
  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-lg">
        로딩 중...
      </div>
    );
  }

  // =============================================
  // 🔥 데이터 구조 분해
  // =============================================
  const { profile, calorieChart, fitnessLogs, summary } = data;

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center px-6 py-10">
      
      <h1 className="text-3xl font-bold text-neutral-800 mb-4 text-center">
        마이로그
      </h1>
      <p className="text-center text-neutral-500 mb-10">
        신체 정보, 운동 통계, 스트레스 및 수면 분석을 한눈에 확인하세요.
      </p>

      {/* ===== 반응형 레이아웃 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-7xl">
        
        {/* ===== 왼쪽 섹션 ===== */}
        <div className="space-y-8">

          {/* 🔥 신체 정보 */}
          <section className="flex flex-wrap justify-center gap-6">
            {[ 
              { title: "키", value: `${profile.heightCm} cm` },
              { title: "몸무게", value: `${profile.weightKg} kg` },
              { title: "BMI", value: `${profile.bmi.toFixed(1)}` },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-base-200 rounded-2xl shadow-md px-8 py-6 w-[180px] text-center border border-base-300 hover:shadow-lg transition"
              >
                <p className="text-sm mb-1 text-neutral-500">{item.title}</p>
                <h2 className="text-3xl font-bold text-black">{item.value}</h2>
              </div>
            ))}
          </section>

          {/* 🔥 최근 7일 칼로리 그래프 */}
          <section className="bg-base-200 shadow-md rounded-3xl p-6 border border-base-300">
            <h2 className="text-lg font-semibold text-neutral-700 mb-4 text-center">
              📈 최근 7일간 칼로리 소모량
            </h2>

            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={calorieChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5ddd5" />
                  <XAxis dataKey="date" stroke="#7a6f66" />
                  <YAxis stroke="#7a6f66" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      borderRadius: "12px",
                      border: "1px solid #e5ddd5",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#d2b48c"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#b89b76" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 🔥 운동 기록 테이블 */}
          <section className="bg-base-100 shadow-md rounded-3xl p-6 border border-base-300">
            <h2 className="text-lg font-semibold text-neutral-700 mb-4 text-center">
              🏋️ 운동 기록 & 분석 요약
            </h2>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="text-neutral-600">
                    <th>날짜</th>
                    <th>운동 종류</th>
                    <th>운동 시간</th>
                    <th>칼로리 소모</th>
                  </tr>
                </thead>
                <tbody>
                  {fitnessLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-base-100 transition">
                      <td>{log.date}</td>
                      <td>{log.activityType}</td>
                      <td>{log.durationMinutes}분</td>
                      <td>{log.caloriesBurned} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 🔥 요약문 */}
            <div className="mt-6 p-4 bg-base-200 rounded-xl text-neutral-700 leading-relaxed text-sm">
              <h3 className="font-semibold mb-2">📝 최근 7일 분석 요약</h3>
              {summary}
            </div>
          </section>
        </div>

        {/* ===== 오른쪽 섹션 ===== */}
        <div className="space-y-8">

          {/* 스트레스 분석 (임시) */}
          <section className="bg-info/10 rounded-3xl shadow-md p-6 border border-info/30">
            <h2 className="text-lg font-semibold text-neutral-700 mb-4 text-center">
              💭 스트레스 분석 리포트
            </h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              스트레스 분석 기능은 곧 업데이트 예정입니다.
            </p>
          </section>

          {/* 챗 기록 이동 버튼 */}
          <section className="bg-base-200 rounded-3xl shadow-md p-6 border border-base-300">
            <h2 className="text-lg font-semibold text-neutral-700 mb-4 text-center">
              💬 챗 기록 보기
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <button className="btn btn-secondary w-full rounded-full" onClick={() => navigate("/chat/exercise")}>
                🏋️ 운동 챗 기록 보기
              </button>
              <button className="btn btn-accent w-full rounded-full" onClick={() => navigate("/chat/sleep")}>
                🌙 수면 챗 기록 보기
              </button>
              <button className="btn btn-info w-full rounded-full" onClick={() => navigate("/chat/stress")}>
                💭 스트레스 챗 기록 보기
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* ===== 하단 ===== */}
      <div className="mt-12 flex flex-col items-center space-y-2">
        <button
          className="btn btn-primary px-8 rounded-full shadow-md hover:shadow-lg transition"
          onClick={() => setIsModalOpen(true)}
        >
          회원 정보 수정
        </button>
        <p className="text-sm text-neutral-400">
          최근 업데이트: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* 🔥 모달 */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userEmail}
      />
    </div>
  );
};

export default MyPage;
