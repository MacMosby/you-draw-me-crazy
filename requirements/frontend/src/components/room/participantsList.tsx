import { useEffect, useState } from "react";
import Clock from "./clock";
import type { PlayerDto } from "../../../shared/player.dto";

interface ParticipantsListProps {
  highlightedPlayerId?: number | null;
  players: PlayerDto[];
  drawerId?: number;
  clockRemainingMs?: number;
  clockRunning?: boolean;
}

export default function ParticipantsList({ highlightedPlayerId, players, drawerId, clockRemainingMs = 0, clockRunning = false }: ParticipantsListProps) {

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
        Players ({players.length})
      </h2>
      <div className="space-y-2 flex-1 overflow-y-auto">
        {players.map((participant) => (
          <div
            key={participant.userId}
            className={`px-2 py-1.5 rounded-md transition-colors duration-300 ${
              activeHighlight === participant.userId
                ? "bg-amber-200/60"
                : "bg-transparent"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div
                  className={`text-xl font-semibold transition-colors ${
                    activeHighlight === participant.userId
                      ? "text-amber-900"
                      : "text-textPrimary"
                  }`}
                >
                  {participant.nickname}
                </div>
                <div className="text-xs text-textMuted">
                  {drawerId === participant.userId ? "Drawer" : "Guesser"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-semibold text-textPrimary">
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
        <Clock remainingMs={clockRemainingMs} isRunning={clockRunning} />
      </div>
    </div>
  );
}