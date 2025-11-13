"use client";

import { useEffect, useRef, useState } from "react";
import axios from "../../config/setAxios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FormModal({ isOpen, onClose }: FormModalProps) {
  const [formData, setFormData] = useState({
    sleepHours: "",
    caffeineMg: "",
    alcoholConsumption: "",
    activityHours: "",
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        memberNo: 2,
        sleepHours: parseFloat(formData.sleepHours) || 0,
        caffeineMg: parseFloat(formData.caffeineMg) || 0,
        alcoholConsumption: parseFloat(formData.alcoholConsumption) || 0,
        physicalActivityHours: parseFloat(formData.activityHours) || 0,
      };

      console.log("📤 활동 데이터 전송:", payload);

      await axios.post("/sleep/activities", payload);

      const fatigueRes = await axios.get("/sleep/predict-fatigue", {
        params: { memberNo: 2 },
      });

      const sleepRes = await axios.get("/sleep/predict-sleephours", {
        params: { memberNo: 2 },
      });

      toast.success("오늘의 활동 데이터 저장 & 예측 완료!", {
        position: "top-center",
        autoClose: 2200,
        theme: "colored",
      });

      setFormData({
        sleepHours: "",
        caffeineMg: "",
        alcoholConsumption: "",
        activityHours: "",
      });

      onClose();
      setTimeout(() => window.location.reload(), 500);
    } catch (err: any) {
      console.error("에러 발생:", err);

      if (err.response?.status === 400) {
        toast.warning("오늘 활동 데이터가 이미 등록되었습니다.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      } else {
        toast.error("서버 오류가 발생했습니다.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    }
  };

  return (
    <>
      <ToastContainer />

      <div
        onClick={handleOutsideClick}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      >
        <div
          ref={modalRef}
          className="bg-[#FAF3E0] rounded-2xl shadow-2xl w-[420px] max-w-[90%] p-8 relative flex flex-col items-center"
        >
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-3xl font-bold text-[#B38252] hover:text-[#8d643b] transition"
          >
            ×
          </button>

          {/* 제목 */}
          <h2 className="text-center text-xl font-semibold text-[#B38252] mb-6">
            수면 및 활동 데이터 입력
          </h2>

          {/* 입력 필드 */}
          <div className="flex flex-col gap-5 w-full max-w-xs">
            <InputField label="수면시간 (시간)" name="sleepHours" value={formData.sleepHours} onChange={handleChange} />
            <InputField label="카페인 섭취량 (mg)" name="caffeineMg" value={formData.caffeineMg} onChange={handleChange} />
            <InputField label="알코올 섭취량 (잔)" name="alcoholConsumption" value={formData.alcoholConsumption} onChange={handleChange} />
            <InputField label="활동량 (시간)" name="activityHours" value={formData.activityHours} onChange={handleChange} />
          </div>

          {/* 버튼 */}
          <div className="flex justify-center gap-4 w-full mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-300 text-gray-800 hover:bg-gray-400 transition font-medium"
            >
              취소
            </button>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-xl bg-[#D2B48C] text-black hover:bg-[#c3a179] transition font-semibold"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="w-full flex flex-col">
      <label className="text-sm text-[#B38252] font-medium mb-1 text-center">{label}</label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="값을 입력하세요"
        className="
          w-full px-3 py-2 rounded-xl text-center
          bg-white border border-[#D2B48C]
          text-gray-700 text-sm
          focus:outline-none focus:ring-2 focus:ring-[#D2B48C]
          shadow-sm
        "
      />
    </div>
  );
}
