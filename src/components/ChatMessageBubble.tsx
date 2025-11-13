interface Props {
  from: "user" | "ai";
  text: string;
}

export default function ChatMessageBubble({ from, text }: Props) {
  const isUser = from === "user";

  return (
    <div
      className={`w-full flex mb-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-[480px] px-4 py-3 rounded-2xl shadow-sm text-black text-[15px] leading-snug whitespace-pre-wrap
          ${isUser ? "bg-[#D2B48C]" : "bg-[#FAF3E0]"}
        `}
      >
        {text}
      </div>
    </div>
  );
}
