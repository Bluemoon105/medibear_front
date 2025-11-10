import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import FormModal from "../../components/Sleep/FormModal";
import axios from "../../config/setAxios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SleepAnalysis() {
  const [open, setOpen] = useState(false);
  const [sleepData, setSleepData] = useState<{ date: string; sleepHours: number }[]>([]);

   useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const res = await axios.get(`/sleep/recent`, { params: { userId: 1 } });
        const formatted = res.data
          .map((d: any) => ({
            date: d.date?.slice(5), // 2025-11-06 → 11-06
            sleepHours: d.sleepHours ?? 0,
          }))
          .sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        setSleepData(formatted);
      } catch (err) {
        console.error("수면 데이터 불러오기 실패:", err);
      }
    };

    fetchSleepData();
  }, []);

  //활동 데이터 입력 (POST)
  const handleSubmit = async (data: any) => {
    try {
      const res = await axios.post(`/sleep/activities`, {
        userId: 1,
        physicalActivityHours: parseFloat(data.activityHours) || 0,
        sleepHours: parseFloat(data.sleepHours) || 0,
        caffeineMg: parseFloat(data.caffeineMg) || 0,
        alcoholConsumption: parseFloat(data.alcoholConsumption) || 0,
      });

      alert("오늘의 활동 데이터가 저장되었습니다");
      console.log("저장 완료:", res.data);

      //저장 후 그래프 새로고침
      const updated = await axios.get(`/sleep/recent`, { params: { userId: 1 } });
      const formatted = updated.data
        .map((d: any) => ({
          date: d.date?.slice(5),
          sleepHours: d.sleepHours ?? 0,
        }))
        .sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      setSleepData(formatted);

      setOpen(false);
    } catch (err: any) {
      if (err.response) {
        alert(err.response.data || "오늘은 이미 활동량이 등록되었습니다.");
      } else {
        alert("서버 연결 중 오류가 발생했습니다.");
      }
      console.error("에러 발생:", err);
    }
  };


  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#FFFDF8",
        color: "#2c2c2c",
      }}
    >
      {/* 왼쪽 사이드바 */}
      <div
        style={{
          width: "180px",
          minWidth: "180px",
          borderRight: "1px solid #E5E5E5",
          background: "#FFFFFF",
        }}
      >
        <Sidebar />
      </div>

      {/* 메인 콘텐츠 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "40px 64px",
          overflowY: "auto",
        }}
      >
        {/* 제목 */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#B38252",
            marginBottom: "32px",
          }}
        >
          수면 분석
        </h1>

        {/* 수면 그래프 영역 */}
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sleepData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5D4B1" />
                <XAxis dataKey="date" stroke="#B38252" />
                <YAxis stroke="#B38252" domain={[0, 10]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFDF8", border: "1px solid #D2B48C" }}
                  labelStyle={{ color: "#B38252" }}
                />
                <Bar dataKey="sleepHours" fill="#D2B48C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <span style={{ color: "#B38252", fontSize: "16px" }}>수면 데이터가 없습니다</span>
          )}
        </div>

        {/* 활동량 입력 + 수면 요약 */}
        <div
          style={{
            background: "#FAF3E0",
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "260px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {/* 활동량 입력 버튼 */}
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
                outline:"none",
                cursor: "pointer",
              }}
            >
              활동량 입력
            </button>

            {/* 개인 최적 수면시간 */}
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  color: "#B38252",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "8px",
                }}
              >
                개인 최적 수면 시간
              </p>
              <p style={{ fontSize: "20px", fontWeight: 700 }}>7시간</p>
            </div>
          </div>

          {/* 종합 정리 */}
          <div
            style={{
              textAlign: "center",
              marginTop: "48px",
              color: "#B38252",
              fontWeight: 500,
              fontSize: "18px",
            }}
          >
            종합 정리
          </div>
        </div>
      </div>

      {/* 입력 모달 */}
      <FormModal isOpen={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}
