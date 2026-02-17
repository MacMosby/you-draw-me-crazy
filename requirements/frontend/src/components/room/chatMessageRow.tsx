export type ChatMessage = {
  id: string;
  userId: number;
  username: string;
  text: string;
  timestamp: number;
  isCorrectGuess?: boolean;
  type: "guess" | "system" | "chat" | "presence";
  presenceAction?: "join" | "leave";
};

type ChatMessageProps = {
  message: ChatMessage;
  isOwn?: boolean;
};

function formatTimestamp(ts: number) {
  const minutes = Math.max(0, Math.floor((Date.now() - ts) / 60000));
  if (minutes === 0) return "now";
  if (minutes === 1) return "1m";
  return `${minutes}m`;
}

export function ChatMessageRow({ message, isOwn }: ChatMessageProps) {
  if (message.type === "system" || message.type === "presence") {
    const fallback = message.presenceAction
      ? `${message.username} ${message.presenceAction}ed the room`
      : message.text;
    return (
      <div className="text-center text-xs text-gray-500 italic">
        {message.text || fallback}
      </div>
    );
  }

  const isCorrect = Boolean(message.isCorrectGuess);
  
  // Hide correct guesses from other players
  if (isCorrect && !isOwn) {
    return null;
  }

  return (
    <div
      className={`flex items-start gap-2 rounded-md px-2 py-1.5 ${
        isCorrect ? "bg-emerald-50" : "bg-transparent"
      } ${isOwn ? "justify-end" : "justify-start"}`}
    >
      {!isOwn && (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700">
          {message.username.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className={`max-w-[75%] ${isOwn ? "text-right" : "text-left"}`}>
        <div className="flex items-center gap-2">
          {!isOwn && (
            <span className="text-xs font-semibold text-gray-700">
              {message.username}
            </span>
          )}
          <span className="text-[10px] text-gray-400">
            {formatTimestamp(message.timestamp)}
          </span>
          {isCorrect && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Correct
            </span>
          )}
        </div>
        <div
          className={`mt-0.5 rounded-lg px-2.5 py-1.5 text-sm ${
            isOwn
              ? "bg-amber-200/60 text-amber-900 border border-amber-200"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          {message.text}
        </div>
      </div>
      {isOwn && (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-200/60 text-[10px] font-semibold text-amber-900 border border-amber-200">
          {message.username.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
}
