"use client";

import { useState } from "react";
import SleepChart from "../../components/Sleep/SleepChart";
import SleepInsights from "../../components/Sleep/SleepInsights";
import FormModal from "../../components/Sleep/FormModal";

export default function SleepPredict() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FFFDF8] text-[#2c2c2c]">
      {/* 메인 콘텐츠 */}
      <div
        className="
          flex-1 flex flex-col 
          px-6 md:px-12 lg:px-16 
          py-10 
          overflow-y-auto
        "
      >
        {/* 제목 */}
        <h1 className="text-2xl font-bold text-[#B38252] mb-8">
          수면 분석 및 예측
        </h1>

        {/* 그래프 */}
        <SleepChart />

        {/* 활동량 입력 버튼 */}
        <button
          onClick={() => setOpen(true)}
          className="
            self-start
            mt-6 mb-6 px-5 py-2 
            rounded-full 
            bg-[#D2B48C] text-black font-semibold
            hover:bg-[#c6a179]
            transition
          "
        >
          활동량 입력
        </button>

        {/* 예측 결과 */}
        <SleepInsights />
      </div>

      {/* 활동량 입력 모달 */}
      <FormModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
