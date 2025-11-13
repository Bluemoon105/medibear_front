interface Props {
  from: "user" | "ai";
  text?: string;
  base64Image?: string;
  base64Video?: string;
}

export default function ChatMessageBubble_exercise({ from, text, base64Image, base64Video }: Props) {
  const isUser = from === "user";

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start", // 사용자 오른쪽
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          padding: "14px 18px",
          borderRadius: 20,
          background: isUser ? "#D2B48C" : "#FAF3E0", // 색상 변경
          color: "#000",
          fontSize: 15,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {/* 텍스트가 있으면 먼저 보여주기 */}
        {text && <div>{text}</div>}

        {/* 이미지가 있으면 이미지 미리보기 추가 */}
        {base64Image && (
          <img
            src={base64Image}
            alt="uploaded"
            style={{
              maxWidth: 320,
              borderRadius: 12,
              marginTop: text ? 10 : 0,
              display: "block",
            }}
          />
        )}

        {/* 동영상이 있으면 비디오 미리보기 추가 */}
        {base64Video && (
          <video
            src={base64Video}
            controls
            style={{
              maxWidth: 360,
              borderRadius: 12,
              marginTop: text ? 10 : 0,
              display: "block",
            }}
          />
        )}
      </div>
    </div>
  );
}
