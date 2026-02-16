export default function Clock() {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-3xl font-clock font-bold text-textPrimary">0:45</div>
        <div className="text-xs text-textMuted">Time left</div>
      </div>
    </div>
  );
}