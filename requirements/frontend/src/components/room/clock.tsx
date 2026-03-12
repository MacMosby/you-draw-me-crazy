interface ClockProps {
  remainingMs: number;
  isRunning: boolean;
}

function formatRemaining(remainingMs: number) {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function Clock({ remainingMs, isRunning }: ClockProps) {
  const display = formatRemaining(remainingMs);

  return (
    <div className="flex items-center gap-3 justify-center">
      <div className="text-center">
        <div className="text-3xl font-clock font-bold text-textPrimary">{display}</div>
        <div className="text-xs text-textMuted">{isRunning ? "Time left" : "Waiting"}</div>
      </div>
    </div>
  );
}