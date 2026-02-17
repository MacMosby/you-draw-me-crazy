import { useEffect, useState } from "react";
import Clock from "./clock";

interface ParticipantsListProps {
  highlightedPlayerId?: number | null;
}

export default function ParticipantsList({ highlightedPlayerId }: ParticipantsListProps) {
  // Mock participants data
  const participants = [
    { id: "1", name: "Natalya", score: 250, role: "drawer", status: "disconnected" },
    { id: "2", name: "Steph", score: 180, role: "guesser", status: "connected" },
    { id: "3", name: "Marc", score: 150, role: "guesser", status: "connected" },
    { id: "4", name: "Nick", score: 200, role: "guesser", status: "connected" },
  ];

  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);

  useEffect(() => {
    if (highlightedPlayerId !== null && highlightedPlayerId !== undefined) {
      setActiveHighlight(highlightedPlayerId);
      const timer = setTimeout(() => setActiveHighlight(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedPlayerId]);

  return (
    <div className="bg-surface rounded-lg p-3 border border-gray-200 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3 text-textPrimary">
        Players ({participants.length})
      </h2>
      <div className="space-y-2 flex-1 overflow-y-auto">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className={`px-2 py-1.5 rounded-md transition-colors duration-300 ${
              participant.status === "disconnected" ? "opacity-50" : ""
            } ${
              activeHighlight === parseInt(participant.id)
                ? "bg-emerald-50"
                : "bg-transparent"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div
                  className={`text-sm font-semibold transition-colors ${
                    activeHighlight === parseInt(participant.id)
                      ? "text-emerald-700"
                      : "text-textPrimary"
                  }`}
                >
                  {participant.name}
                </div>
                <div className="text-[11px] text-textMuted">
                  {participant.role === "drawer" ? "Drawing" : "Guessing"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-textPrimary">
                  {participant.score}
                </div>
                <div className="text-[11px] text-textMuted">pts</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Clock below participants */}
      <div className="mt-auto pt-3 flex justify-center">
        <Clock />
      </div>
    </div>
  );
}