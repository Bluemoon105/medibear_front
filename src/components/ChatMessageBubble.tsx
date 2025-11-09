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
        justifyContent: isUser ? "flex-start" : "flex-end",
      }}
    >
      <div
        style={{
          width: 420,
          padding: "26px 28px",
          borderRadius: 22,
          background: isUser ? "#D9D9D9" : "#000000",
          color: isUser ? "#000" : "#FFF",
          fontSize: 14,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </div>
    </div>
  );
}
