import Sidebar from "../components/Sidebar";
import SleepChart from "../components/Sleep/SleepChart";
import SleepInsights from "../components/Sleep/SleepInsights";
import FormModal from "../components/Sleep/FormModal";
import { useState } from "react";

export default function SleepPredict() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#FFFDF8",
        color: "#2c2c2c",
      }}
    >
      {/* 사이드바 */}
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

      {/* 메인 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "40px 64px",
          overflowY: "auto",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#B38252",
            marginBottom: "32px",
          }}
        >
          수면 분석 및 예측
        </h1>

        {/* 그래프 */}
        <SleepChart />

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
            outline: "none",
            cursor: "pointer",
            margin: "24px 0",
            alignSelf: "flex-start",
          }}
        >
          활동량 입력
        </button>

        {/* 예측 결과 */}
        <SleepInsights />
      </div>

      <FormModal isOpen={open} onClose={() => setOpen(false)} onSubmit={() => {}} />
    </div>
  );
}
