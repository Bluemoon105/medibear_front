import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import FormModal from "../../components/Sleep/FormModal";
import axios from "../../config/setAxios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SleepAnalysis() {
  const [open, setOpen] = useState(false);
  const [sleepData, setSleepData] = useState<{ date: string; sleepHours: number }[]>([]);

  const fetchSleepData = async () => {
    try {
      const res = await axios.get(`/sleep/recent`, { params: { userId: 1 } });
      const formatted = res.data
        .map((d: any) => ({
          date: d.date?.slice(5),
          sleepHours: d.sleepHours ?? 0,
        }))
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setSleepData(formatted);
    } catch (err) {
      console.error("수면 데이터 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchSleepData();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#FFFDF8", color: "#2c2c2c" }}>
      <div style={{ width: "180px", minWidth: "180px", borderRight: "1px solid #E5E5E5", background: "#FFFFFF" }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 64px", overflowY: "auto" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#B38252", marginBottom: "32px" }}>수면 분석</h1>

        {/* 수면 그래프 */}
        <div
          style={{
            background: "#FAF3E0",
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "280px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
            padding: "16px 32px",
          }}
        >
          {sleepData.length > 0 ? (
            <ResponsiveContainer key={sleepData.length} width="100%" height="100%">
              <BarChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5D4B1" />
                <XAxis dataKey="date" stroke="#B38252" />
                <YAxis stroke="#B38252" domain={[0, 10]} />
                <Tooltip contentStyle={{ backgroundColor: "#FFFDF8", border: "1px solid #D2B48C" }} labelStyle={{ color: "#B38252" }} />
                <Bar dataKey="sleepHours" fill="#D2B48C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <span style={{ color: "#B38252", fontSize: "16px" }}>수면 데이터가 없습니다</span>
          )}
        </div>

        {/* 활동 입력 버튼 */}
        <div
          style={{
            background: "#FAF3E0",
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "32px",
            minHeight: "260px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => setOpen(true)}
              style={{
                padding: "10px 18px",
                borderRadius: "999px",
                background: "#D2B48C",
                color: "#000",
                fontSize: "14px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              활동량 입력
            </button>

            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#B38252", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>개인 최적 수면 시간</p>
              <p style={{ fontSize: "20px", fontWeight: 700 }}>7시간</p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "48px", color: "#B38252", fontWeight: 500, fontSize: "18px" }}>
            종합 정리
          </div>
        </div>
      </div>

      {/* 모달 닫히면 전체 새로고침 */}
      <FormModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
