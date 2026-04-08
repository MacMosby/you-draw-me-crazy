import type { ReactNode } from "react";
import ParticipantsList from "../components/room/participantsList";
import type { PlayerDto } from "../../shared/player.dto";

interface RoomLayoutProps {
  children: ReactNode;
  highlightedPlayerId?: number | null;
  players: PlayerDto[];
  spectators?: PlayerDto[];
  drawerId?: number;
  clockRemainingMs?: number;
  clockRunning?: boolean;
}

export function RoomLayout({ children, highlightedPlayerId, players, spectators = [], drawerId, clockRemainingMs = 0, clockRunning = false }: RoomLayoutProps) {
  return (
    <div className="bg-background p-4 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left sidebar - Participants */}
          <div className="lg:col-span-1 flex flex-col max-h-[calc(100vh-200px)]">
            <ParticipantsList
              highlightedPlayerId={highlightedPlayerId}
              players={players}
              spectators={spectators}
              drawerId={drawerId}
              clockRemainingMs={clockRemainingMs}
              clockRunning={clockRunning}
            />
          </div>

          {/* Center - Main content area */}
          <div className="lg:col-span-4 relative flex flex-col max-h-[calc(100vh-200px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
