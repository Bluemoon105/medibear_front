"use client";
import { useState } from "react";
import { getDailyReport, getWeeklyReport } from "../../services/SleepServices/ReportServices";

type ReportButtonGroupProps = {
  userId: string;
  onReport: (type: "daily" | "weekly", content: string) => void;
};

export default function ReportButtonGroup({ userId, onReport }: ReportButtonGroupProps) {
  const [loading, setLoading] = useState<"daily" | "weekly" | null>(null);

  // 버튼 클릭 시 API 호출
  const handleReport = async (type: "daily" | "weekly") => {
    try {
      setLoading(type);

      const response =
        type === "daily"
          ? await getDailyReport(userId)
          : await getWeeklyReport(userId);

      const content =
        response?.report ||
        `${type === "daily" ? "일간" : "주간"} 리포트 데이터를 불러왔습니다.`;

      onReport(type, content);
    } catch (error) {
      console.error("리포트 요청 실패:", error);
      onReport(type, "리포트를 가져오지 못했습니다.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        gap: "10px",
        marginBottom: "10px",
      }}
    >
      <button
        onClick={() => handleReport("daily")}
        disabled={loading === "daily"}
        style={{
          backgroundColor: loading === "daily" ? "#C4A484" : "#D2B48C",
          border: "none",
          outline:"none",
          borderRadius: "20px",
          padding: "8px 18px",
          fontWeight: 600,
          color: "#000",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        일간 리포트
      </button>
      <button
        onClick={() => handleReport("weekly")}
        disabled={loading === "weekly"}
        style={{
          backgroundColor: loading === "weekly" ? "#9B7040" : "#B38252",
          border: "none",
          outline:"none",
          borderRadius: "20px",
          padding: "8px 18px",
          fontWeight: 600,
          color: "#000",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        주간 리포트
      </button>
    </div>
  );
}
