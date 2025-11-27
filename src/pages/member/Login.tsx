import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusPw, setFocusPw] = useState(false);

  /* ------------------------------
      ⭐ 기존 로그인 로직 그대로 적용
  --------------------------------*/
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("https://medibearback-production.up.railway.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          email: email, 
          password: password 
        }),
      });

      if (!response.ok) {
        toast.warning("메일 또는 비밀번호를 다시 확인해주세요.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      const accessToken = response.headers.get("Authorization");

      if (!accessToken) {
        toast.error("로그인 실패: 토큰을 받지 못했습니다.", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        return;
      }

      localStorage.setItem("accessToken", accessToken);

      toast.success("로그인 성공! 환영합니다", {
        position: "top-center",
        autoClose: 1500,
        theme: "colored",
      });

      setTimeout(() => {
        window.location.href = "/exercise";
      }, 1200);
    } catch (err) {
      console.error("❌ 로그인 실패:", err);
      toast.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  /* ------------------------------ */

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
      }}
    >
      <ToastContainer />

      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "40px" }}>
        MediBear
      </h1>

      <form
        onSubmit={handleLogin}
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
          로그인
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={baseInputStyle}
          required
        />

        {/* Password + Eye Toggle */}
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusPw(true)}
            onBlur={() => setFocusPw(false)}
            style={{ ...baseInputStyle, paddingRight: "42px" }}
            required
          />

          {/* ⭐ focus일 때만 보이는 toggle */}
          {focusPw && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()} // blur 방지
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#B38252",
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>

        {/* 로그인 버튼 */}
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
          로그인
        </button>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "8px 0",
          }}
        >
          <span style={{ flex: 1, height: "1px", background: "#D2B48C" }} />
          <span style={{ fontSize: "12px", color: "#555" }}>OR</span>
          <span style={{ flex: 1, height: "1px", background: "#D2B48C" }} />
        </div>

        {/* SNS 로그인 */}
        <button
          type="button"
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "999px",
            background: "#FEE502",
            border: "1px solid #f1d800",
            color: "#181600",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          카카오 로그인
        </button>

        <button
          type="button"
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "999px",
            background: "#FFF",
            border: "1px solid #e5e5e5",
            color: "#000",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Google 로그인
        </button>

        <button
          type="button"
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "999px",
            background: "#1A77F2",
            border: "1px solid #005fd8",
            color: "#FFF",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Facebook 로그인
        </button>

        <p style={{ fontSize: "13px", marginTop: "10px" }}>
          계정이 없으신가요?{" "}
          <a href="/register" style={{ color: "#B38252", textDecoration: "underline" }}>
            회원가입
          </a>
        </p>
      </form>
    </div>
  );
}
