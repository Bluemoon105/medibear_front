"use client";

import { useState } from "react";
import { getDailyReport, getWeeklyReport } from "../../services/SleepServices/ReportServices";

type ReportButtonGroupProps = {
  memberNo: number;
  onReport: (type: "daily" | "weekly", content: string) => void;
};

export default function ReportButtonGroup({ memberNo, onReport }: ReportButtonGroupProps) {
  const [loading, setLoading] = useState<"daily" | "weekly" | null>(null);

  const handleReport = async (type: "daily" | "weekly") => {
    try {
      setLoading(type);

      const response =
        type === "daily"
          ? await getDailyReport(memberNo)
          : await getWeeklyReport(memberNo);

      const content =
        response?.report ||
        `${type === "daily" ? "일간" : "주간"} 리포트를 가져왔습니다.`;

      onReport(type, content);
    } catch (error) {
      console.error("리포트 요청 실패:", error);
      onReport(type, "리포트를 가져오지 못했습니다.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-3 mb-3">
      {/* 일간 버튼 */}
      <button
        onClick={() => handleReport("daily")}
        disabled={loading === "daily"}
        className={`
          px-5 py-2 rounded-full font-semibold text-black
          transition-all duration-200
          ${loading === "daily"
            ? "bg-[#C4A484] cursor-not-allowed opacity-70"
            : "bg-[#D2B48C] hover:bg-[#c2a077] active:scale-[0.97]"
          }
        `}
      >
        {loading === "daily" ? "불러오는 중..." : "일간 리포트"}
      </button>

      {/* 주간 버튼 */}
      <button
        onClick={() => handleReport("weekly")}
        disabled={loading === "weekly"}
        className={`
          px-5 py-2 rounded-full font-semibold text-black
          transition-all duration-200
          ${loading === "weekly"
            ? "bg-[#9B7040] cursor-not-allowed opacity-70"
            : "bg-[#B38252] hover:bg-[#9e6f3f] active:scale-[0.97]"
          }
        `}
      >
        {loading === "weekly" ? "불러오는 중..." : "주간 리포트"}
      </button>
    </div>
  );
}
