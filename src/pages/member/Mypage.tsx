import { useEffect, useState } from "react";
import axios from "../../config/setAxios";
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
import { getUserEmail } from "../../utils/getUserEmail";  // 🔥 추가
import { toast } from "react-toastify";                  // 🔥 추가

type UserProfile = {
  name: string;
  height_cm: number;
  weight_kg: number;
  bmi: number;
};

type CalorieLog = {
  name: string;
  calories: number;
  activity_type: string;
  analysis: string;
};

const MyPage = () => {
  const navigate = useNavigate();

  // 🔥 로그인한 사용자 이메일을 토큰에서 가져옴
  const userEmail = getUserEmail() ?? "";

  // 🔥 로그인 정보 체크 (토큰이 없거나 만료 시 토스트 표시)
  useEffect(() => {
    if (!userEmail) {
      toast.error("로그인 정보가 없습니다. 다시 로그인해주세요.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  }, [userEmail]);

  const [profile, setProfile] = useState<UserProfile>({
    name: "홍길동",
    height_cm: 170,
    weight_kg: 70,
    bmi: 23,
  });

  const [logs, setLogs] = useState<CalorieLog[]>([
    { name: "11/07", activity_type: "Running", calories: 420, analysis: "지속적인 유산소로 체력 향상" },
    { name: "11/08", activity_type: "Cycling", calories: 510, analysis: "하체 강화에 효과적" },
    { name: "11/09", activity_type: "Yoga", calories: 480, analysis: "유연성과 안정성 향상" },
    { name: "11/10", activity_type: "Tennis", calories: 560, analysis: "전신 근육 사용" },
    { name: "11/11", activity_type: "HIIT", calories: 600, analysis: "체지방 감소 효과" },
    { name: "11/12", activity_type: "Walking", calories: 530, analysis: "꾸준한 활동으로 컨디션 유지" },
    { name: "11/13", activity_type: "Swimming", calories: 580, analysis: "심폐 기능 강화" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center px-6 py-10">
      
      <h1 className="text-3xl font-bold text-neutral-800 mb-4 text-center">
        내 건강 리포트 대시보드
      </h1>
      <p className="text-center text-neutral-500 mb-10">
        신체 정보, 운동 통계, 스트레스 및 수면 분석을 한눈에 확인하세요.
      </p>

      {/* ===== 반응형 레이아웃 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-7xl">
        
        {/* ===== 왼쪽 섹션 ===== */}
        <div className="space-y-8">

          {/* 신체 정보 */}
          <section className="flex flex-wrap justify-center gap-6">
            {[ 
              { title: "키", value: `${profile.height_cm} cm` },
              { title: "몸무게", value: `${profile.weight_kg} kg` },
              { title: "BMI", value: `${profile.bmi}` },
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

          {/* 칼로리 차트 */}
          <section className="bg-base-200 shadow-md rounded-3xl p-6 border border-base-300">
            <h2 className="text-lg font-semibold text-neutral-700 mb-4 text-center">
              📈 최근 7일간 칼로리 소모량
            </h2>
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={logs}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5ddd5" />
                  <XAxis dataKey="name" stroke="#7a6f66" />
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

          {/* 운동 기록 테이블 */}
          <section className="bg-base-200 shadow-md rounded-3xl p-6 border border-base-300">
            <h2 className="text-lg font-semibold text-neutral-700 mb-4 text-center">
              🏋️ 운동 기록 & 분석 요약
            </h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="text-neutral-600">
                    <th>날짜</th>
                    <th>운동 종류</th>
                    <th>칼로리</th>
                    <th>분석</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={i} className="hover:bg-base-100 transition">
                      <td>{log.name}</td>
                      <td>{log.activity_type}</td>
                      <td>{log.calories} kcal</td>
                      <td className="text-sm text-neutral-600">{log.analysis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ===== 오른쪽 섹션 ===== */}
        <div className="space-y-8">
          
          {/* 스트레스 리포트 */}
          <section className="bg-info/10 rounded-3xl shadow-md p-6 border border-info/30">
            <h2 className="text-lg font-semibold text-neutral-700 mb-4 text-center">
              💭 스트레스 분석 리포트
            </h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              지난 일주일 동안의 스트레스 상태를 분석했습니다.
              <br /><br />
              😌 <strong>평균 스트레스 지수: 36%</strong>
              <br />
              🔵 가장 안정된 날: 11/09 (Yoga 세션)
              <br />
              🔴 가장 피로한 날: 11/11 (HIIT 운동)
              <br /><br />
              꾸준한 수면 관리와 규칙적인 유산소 운동이 스트레스 완화에 도움이 됩니다.
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
        <p className="text-sm text-neutral-400">최근 업데이트: 2025-11-13</p>
      </div>

      {/* 🔥 모달 렌더 */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userEmail}
      />
    </div>
  );
};

export default MyPage;
