import { Button } from "../button";
import { Input } from "../input";
import { useEffect, useMemo, useRef, useState } from "react";
import { onGuessUpdate, socket } from "../../api/socket";
import { ChatMessageRow, type ChatMessage } from "./chatMessageRow";
import { DrawingCanvas } from "./DrawingCanvas";
import { DrawerPanel } from "./DrawerPanel";
import { useSessionStore } from "../../state/sessionStore";
import { emitCanvasClear, emitCanvasUndo } from "../../api/drawingSocket";
import { WS_EVENTS } from "../../../shared/ws.events";
import type { GuessUpdatePayload } from "../../../shared/ws.payloads";

type Props = {
  onGuessCorrect?: (userId: number) => void;
  systemMessages?: ChatMessage[];
};


export default function DrawingBoard({ onGuessCorrect, systemMessages = [] }: Props) {
	const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const pendingOwnGuessesRef = useRef<string[]>([]);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useSessionStore((s) => s.user?.id ?? -1);
  const roomId = useSessionStore((s) => s.roomId);
  const currentUsername = useSessionStore((s) => s.user?.username ?? "You");
  const [color, setColor] = useState<`#${string}`>("#111111");
  const role = useSessionStore((s) => s.role);
  const isDrawer = role === "drawer";

  const handleColorChange = (next: string) => {
    setColor(next as `#${string}`);
  };

  const sortedMessages = useMemo(
    () => [...systemMessages, ...messages].sort((a, b) => a.timestamp - b.timestamp),
    [messages, systemMessages]
  );

function send() {
const trimmed = text.trim();
if (!trimmed || isDrawer || roomId === null || currentUserId === -1) return;

  pendingOwnGuessesRef.current.push(trimmed);
  socket.emit(WS_EVENTS.GUESS, {
    guesser_id: currentUserId,
    guess: trimmed,
    room_id: roomId,
  });

	setText("");
	}

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages.length]);

  useEffect(() => {
    const handleGuessUpdate = (data: GuessUpdatePayload) => {
      let resolvedText = data.guess ?? "";

      if (data.guesser_id === currentUserId) {
        const firstPending = pendingOwnGuessesRef.current.shift();
        if (data.correct && firstPending) {
          resolvedText = firstPending;
        }
      }

      const messageText = data.correct
        ? (resolvedText || "correct guess")
        : (resolvedText || "");

      if (messageText) {
        setMessages((prev) => [
          ...prev,
          {
            id: `guess-${data.guesser_id}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            userId: data.guesser_id,
            username: data.guesser_id === currentUserId ? currentUsername : `Player ${data.guesser_id}`,
            text: messageText,
            timestamp: Date.now(),
            type: "guess",
            isCorrectGuess: data.correct,
          },
        ]);
      }

      if (data.correct) {
        if (onGuessCorrect) {
          onGuessCorrect(data.guesser_id);
        }
      }
    };

    const unsubscribe = onGuessUpdate(handleGuessUpdate);
    return () => {
      unsubscribe();
    };
  }, [currentUserId, currentUsername, onGuessCorrect]);

// const session = useSessionStore();

return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      {/* Canvas area */}
  <div className="relative bg-surface border border-gray-400 rounded-lg flex-1 min-h-[280px] lg:min-h-0">
  <DrawingCanvas isDrawer={isDrawer} roomId={roomId ?? -1} drawerId={currentUserId} color={color} />

{isDrawer && (
  <DrawerPanel
  color={color}
  onColorChange={handleColorChange}
  onUndo={emitCanvasUndo}
    onClear={emitCanvasClear}
  />
)}
  </div>


      {/* Chat/Guesses section */}
      <div className="w-full lg:w-64 xl:w-72 flex flex-col min-h-0 bg-surface border border-gray-200 rounded-lg p-3">
        <div className="mb-3 flex-1 min-h-0 overflow-y-auto space-y-2">
          {sortedMessages.map((message) => (
            <ChatMessageRow
              key={message.id}
              message={message}
              isOwn={message.userId === currentUserId}
            />
          ))}
          <div ref={scrollAnchorRef} />
        </div>
        <div className="flex gap-2 border-t border-gray-200 pt-3">
          <Input
            placeholder="Type your guess..."
            className="flex-1"
            value={text}
            disabled={isDrawer}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />
          <Button variant="primary" onClick={send}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}