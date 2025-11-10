import Sidebar from "../components/Sidebar";

export default function MyPage() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#FFFDF8",
        color: "#000",
      }}
    >
      {/* 🧭 왼쪽 사이드바 */}
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

      {/* 📊 메인 콘텐츠 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "40px 64px",
          overflowY: "auto",
        }}
      >
        {/* 제목 */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#B38252",
            marginBottom: "40px",
          }}
        >
          마이 페이지
        </h1>

        {/* ✅ 상단 3개 카드: 체중 / 체지방 / 근골격량 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {/* 각 카드 공통 스타일 */}
          {[
            { title: "몸무게", value: "?KG" },
            { title: "체지방", value: "?%" },
            { title: "근골격량", value: "?%" },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                background: "#FAF3E0",
                borderRadius: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                padding: "24px 32px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "12px",
                }}
              >
                {item.title}
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* ✅ 기록 변화 그래프 영역 */}
        <div
          style={{
            background: "#FAF3E0",
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              color: "#000",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            기록 변화 그래프
          </span>
        </div>

        {/* ✅ 회원 정보 수정 버튼 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              padding: "10px 24px",
              borderRadius: "999px",
              background: "#D2B48C",
              color: "#000",
              fontWeight: 600,
              fontSize: "14px",
              border: "none",
              outline:"none",
              cursor: "pointer",
            }}
          >
            회원 정보 수정
          </button>
        </div>
      </div>
    </div>
  );
}
