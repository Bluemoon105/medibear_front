"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserEmail } from "../../utils/getUserEmail";
import { autoRefreshCheck } from "../../utils/TokenUtils";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FormModal({ isOpen, onClose }: FormModalProps) {
  const [formData, setFormData] = useState({
    sleepHours: "",
    caffeineMg: "",
    alcoholConsumption: "", // "0" 또는 "1"
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

  // ⭐ 활동 데이터 저장 + 피로도 예측 호출
  const handleSubmit = async () => {
    const email = getUserEmail();
    if (!email) {
      toast.error("로그인 정보가 없습니다.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const alcoholValue = formData.alcoholConsumption === "1" ? 1 : 0;

    try {
      const payload = {
        email,
        sleepHours: parseFloat(formData.sleepHours) || 0,
        caffeineMg: parseFloat(formData.caffeineMg) || 0,
        alcoholConsumption: alcoholValue,
        physicalActivityHours: parseFloat(formData.activityHours) || 0,
      };

      // 활동량 저장 요청
      const saveRes = await autoRefreshCheck({
        url: "/sleep/activities",
        method: "POST",
        data: payload,
      });

      // message 해석 (autoRefreshCheck 구조 대응)
      const message = saveRes?.data?.message;


      // 이미 존재하는 경우
      if (typeof message === "string" && message.includes("이미")) {
        toast.warning("오늘은 이미 활동량이 등록되었습니다.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      // 정상 저장
      toast.success("오늘의 활동 데이터가 저장되었습니다!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });

      // 입력값 초기화
      setFormData({
        sleepHours: "",
        caffeineMg: "",
        alcoholConsumption: "",
        activityHours: "",
      });

      // ⭐ 저장 성공 후 모달 닫기
      onClose();

      // ⭐ 피로도 예측 요청(GET)
      try {
        await autoRefreshCheck({
          url: "/sleep/predict-fatigue",
          method: "GET",
          params: { email },
        });
      } catch (err) {
        console.warn("피로도 예측 실패 (저장은 성공):", err);
      }

      // UI 새로고침
      setTimeout(() => window.location.reload(), 500);

    } catch (err: any) {
      const msg = err.response?.data?.message;

      if (msg && msg.includes("이미")) {
        toast.warning("오늘은 이미 활동량이 등록되었습니다.", {
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

            <AlcoholToggle
              value={formData.alcoholConsumption}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, alcoholConsumption: v }))
              }
            />

            <InputField label="활동량 (시간)" name="activityHours" value={formData.activityHours} onChange={handleChange} />
          </div>

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

// ----------------------
// 입력 필드
// ----------------------
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
        }}
      >
        {label}
      </label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="예: 2.5"
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

// ----------------------
// Boolean 토글
// ----------------------
function AlcoholToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: "0" | "1") => void;
}) {
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <label
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "#B38252",
          marginBottom: "8px",
          display: "block",
        }}
      >
        알코올 섭취 여부
      </label>

      <div
        style={{
          width: "240px",
          display: "flex",
          justifyContent: "space-between",
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={() => onChange("0")}
          style={{
            width: "115px",
            padding: "12px 0",
            borderRadius: 10,
            border: "1px solid #D2B48C",
            background: value === "0" ? "#D2B48C" : "#FFF",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          No
        </button>

        <button
          type="button"
          onClick={() => onChange("1")}
          style={{
            width: "115px",
            padding: "12px 0",
            borderRadius: 10,
            border: "1px solid #D2B48C",
            background: value === "1" ? "#D2B48C" : "#FFF",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Yes
        </button>
      </div>
    </div>
  );
}
