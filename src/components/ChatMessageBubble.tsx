interface Props {
  from: "user" | "ai";
  text: string;
}

export default function ChatMessageBubble({ from, text }: Props) {
  const isUser = from === "user";

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start", //사용자 오른쪽
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          padding: "14px 18px",
          borderRadius: 20,
          background: isUser ? "#D2B48C" : "#FAF3E0", //색상 변경
          color: "#000",
          fontSize: 15,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {text}
      </div>
    </div>
  );
}
