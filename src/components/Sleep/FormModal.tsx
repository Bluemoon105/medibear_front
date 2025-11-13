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

  // ESC 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // 배경 클릭 닫기
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

  // 활동 데이터 저장 + 예측까지 수행
  const handleSubmit = async () => {
    try {
      const payload = {
        memberNo: 2, // 로그인 후 동적 변경 예정
        sleepHours: parseFloat(formData.sleepHours) || 0,
        caffeineMg: parseFloat(formData.caffeineMg) || 0,
        alcoholConsumption: parseFloat(formData.alcoholConsumption) || 0,
        physicalActivityHours: parseFloat(formData.activityHours) || 0,
      };

      console.log("📤 활동 데이터 전송:", payload);

      // 1) 활동 데이터 저장 요청
      const res = await axios.post("/sleep/activities", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("활동 데이터 저장 완료:", res.data);

      // 2) 피로도 예측 호출 (GET)
      console.log("🚀 피로도 예측 요청...");
      const fatigueRes = await axios.get("/sleep/predict-fatigue", {
        params: { memberNo: 2 },
      });
      console.log("피로도 예측 결과:", fatigueRes.data);

      // 3) 최적 수면시간 예측 호출 (GET)
      console.log("🚀 최적 수면시간 예측 요청...");
      const sleepRes = await axios.get("/sleep/predict-sleephours", {
        params: { memberNo: 2 },
      });
      console.log("최적 수면시간 예측 결과:", sleepRes.data);

      // 성공 메시지
      toast.success("오늘의 활동 데이터 저장 & 예측 완료!", {
        position: "top-center",
        autoClose: 2200,
        theme: "colored",
      });

      // 입력 초기화
      setFormData({
        sleepHours: "",
        caffeineMg: "",
        alcoholConsumption: "",
        activityHours: "",
      });

      onClose();

      // 분석 페이지 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err: any) {
      console.error("에러 발생:", err);

      if (err.response?.status === 400) {
        toast.warning(err.response.data || "오늘 활동 데이터가 이미 등록되었습니다.", {
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
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        }}
      >
        <div
          ref={modalRef}
          style={{
            background: "#FAF3E0",
            borderRadius: 20,
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            width: "420px",
            padding: "32px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "16px",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#B38252",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            ×
          </button>

          <h2
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: 600,
              color: "#B38252",
              marginBottom: "24px",
            }}
          >
            수면 및 활동 데이터 입력
          </h2>

          {/* 입력 필드들 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              alignItems: "center",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            <InputField label="수면시간 (시간)" name="sleepHours" value={formData.sleepHours} onChange={handleChange} />
            <InputField label="카페인 섭취량 (mg)" name="caffeineMg" value={formData.caffeineMg} onChange={handleChange} />
            <InputField label="알코올 섭취량 (잔)" name="alcoholConsumption" value={formData.alcoholConsumption} onChange={handleChange} />
            <InputField label="활동량 (시간)" name="activityHours" value={formData.activityHours} onChange={handleChange} />
          </div>

          {/* 버튼 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "32px",
              gap: "12px",
              width: "100%",
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                background: "#ccc",
                color: "#333",
                border: "none",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                background: "#D2B48C",
                color: "#000",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// 입력 필드 컴포넌트
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
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <label
        style={{
          display: "block",
          fontSize: "14px",
          fontWeight: 500,
          color: "#B38252",
          marginBottom: "6px",
          textAlign: "center",
          width: "100%",
        }}
      >
        {label}
      </label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="값을 입력하세요"
        style={{
          width: "100%",
          maxWidth: "240px",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #D2B48C",
          outline: "none",
          background: "#FFF",
          fontSize: "14px",
          color: "#333",
          textAlign: "center",
        }}
      />
    </div>
  );
}
