import { useState } from "react";
import axios from "../../config/setAxios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordCheck: "",
    gender: "male",
    birth: "",
    agree: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 약관 동의 체크
    if (!form.agree) {
      toast.warning("개인정보 수집에 동의해주세요.", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }

    // 비밀번호 확인
    if (form.password !== form.passwordCheck) {
      toast.error("비밀번호가 일치하지 않습니다.", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      gender: form.gender === "male" ? "M" : "F",
      birthDate: form.birth,
    };

    try {
      await axios.post("/api/signUp", payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("회원가입이 완료되었습니다!", {
        position: "top-center",
        autoClose: 1500,
        theme: "colored",
        onClose: () => {
          window.location.href = "/login";
        },
      });
    } catch (err: any) {
      console.error("회원가입 오류:", err);

      let message = "회원가입 중 오류가 발생했습니다.";

      // 백엔드 응답 파싱
      if (err.response?.data) {
        const data = err.response.data;

        if (typeof data === "string") {
          // 서버가 단순 문자열 반환
          message = data;
        } else if (typeof data === "object") {
          // 서버가 JSON 반환
          if (data.error) message = data.error;        // ⭐ AuthController 형태
          else if (data.message) message = data.message;
        }
      }

      toast.error(message, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const baseInputStyle: React.CSSProperties = {
    width: "100%",
    height: "48px",
    padding: "0 16px",
    borderRadius: 10,
    border: "1px solid #D2B48C",
    background: "#FFF",
    fontSize: "14px",
    outline: "none",
    color: "#000",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#FFFDF8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        fontFamily: "sans-serif",
      }}
    >
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />

      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "40px" }}>
        MediBear
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#FAF3E0",
          borderRadius: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          padding: "40px 48px",
          width: "380px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#B38252" }}>
          회원 가입
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={baseInputStyle}
        />

        {/* Gender */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, gender: "male" }))}
            style={{
              flex: 1,
              height: "48px",
              borderRadius: "999px",
              border: "1px solid #D2B48C",
              background: form.gender === "male" ? "#D2B48C" : "#FFF",
              color: "#000",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            남성
          </button>
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, gender: "female" }))}
            style={{
              flex: 1,
              height: "48px",
              borderRadius: "999px",
              border: "1px solid #D2B48C",
              background: form.gender === "female" ? "#D2B48C" : "#FFF",
              color: "#000",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            여성
          </button>
        </div>

        {/* Birthdate */}
        <input
          type="date"
          name="birth"
          value={form.birth}
          onChange={handleChange}
          style={baseInputStyle}
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="email@domain.com"
          value={form.email}
          onChange={handleChange}
          style={baseInputStyle}
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          style={baseInputStyle}
        />

        <input
          type="password"
          name="passwordCheck"
          placeholder="비밀번호 확인"
          value={form.passwordCheck}
          onChange={handleChange}
          style={baseInputStyle}
        />

        {/* Agree */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
          }}
        >
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            style={{ width: "16px", height: "16px", accentColor: "#B38252" }}
          />
          <label>개인정보 수집 및 이용에 동의합니다.</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "999px",
            background: "#D2B48C",
            color: "#000",
            fontWeight: 600,
            fontSize: "15px",
            border: "none",
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
