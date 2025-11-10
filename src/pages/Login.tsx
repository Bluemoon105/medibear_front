import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", { email, password });
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
      {/* 로고 */}
      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "40px" }}>
        MediBear
      </h1>

      {/* 로그인 폼 */}
      <form
        onSubmit={handleLogin}
        style={{
          background: "#FAF3E0",
          borderRadius: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          padding: "40px 48px",
          width: "360px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#B38252" }}>
          로그인
        </h2>
        <p style={{ fontSize: "13px", color: "#444", marginBottom: "10px" }}>
          Enter your email and password to sign in for this app
        </p>

        <input
          type="email"
          placeholder="email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "1px solid #D2B48C",
            background: "#FFF",
            fontSize: "14px",
            color: "#000",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#B38252")}
          onBlur={(e) => (e.target.style.borderColor = "#D2B48C")}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "1px solid #D2B48C",
            background: "#FFF",
            fontSize: "14px",
            color: "#000",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#B38252")}
          onBlur={(e) => (e.target.style.borderColor = "#D2B48C")}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "999px",
            background: "#D2B48C",
            color: "#000",
            fontWeight: 600,
            fontSize: "15px",
            border: "none",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          이메일로 로그인
        </button>

        <div
          style={{
            width: "100%",
            borderTop: "1px solid #D2B48C",
            margin: "18px 0",
          }}
        ></div>

        {/* Google 로그인 */}
        <button
          type="button"
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: "999px",
            border: "1px solid #D2B48C",
            background: "#FFF",
            color: "#000",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Google로 계속하기
        </button>
      </form>

      {/* 약관 */}
      <p
        style={{
          marginTop: "20px",
          fontSize: "12px",
          color: "#555",
          textAlign: "center",
          width: "360px",
        }}
      >
        로그인 시, <span style={{ color: "#B38252" }}>이용약관</span> 및{" "}
        <span style={{ color: "#B38252" }}>개인정보 처리방침</span>에
        동의하는 것으로 간주됩니다.
      </p>
    </div>
  );
}
