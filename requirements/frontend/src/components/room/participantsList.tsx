import Clock from "./clock";

export default function ParticipantsList() {
  // Mock participants data
  const participants = [
    { id: "1", name: "Natalya", score: 250, role: "drawer", status: "connected" },
    { id: "2", name: "Steph", score: 180, role: "guesser", status: "connected" },
    { id: "3", name: "Marc", score: 150, role: "guesser", status: "disconnected" },
    { id: "4", name: "Nick", score: 200, role: "guesser", status: "connected" },
  ];

  return (
    <div className="bg-surface rounded-lg p-4 border border-gray-200 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-textPrimary">Players ({participants.length})</h2>
      <div className="space-y-2 flex-1 overflow-y-auto">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className={`p-3 border rounded-lg ${
              participant.status === "disconnected" ? "opacity-50" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-textPrimary">{participant.name}</div>
                <div className="text-xs text-textMuted">
                  {participant.role === "drawer" ? "Drawing" : "Guessing"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-textPrimary">{participant.score}</div>
                <div className="text-xs text-textMuted">pts</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Clock below participants */}
      <div className="mt-auto pt-4 flex justify-center">
        <Clock />
      </div>
    </div>
  );
}