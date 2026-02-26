interface PromptBoxProps {
  prompt: string | null;
}

export default function PromptBox({ prompt }: PromptBoxProps) {
  return (
    <div className="bg-surface rounded-lg p-4 border border-surface">
      <div>
        <div className="text-xs text-textMuted mb-2">Your prompt</div>
        <div className="text-lg font-semibold text-textPrimary">{prompt ?? "..."}</div>
      </div>
    </div>
  );
}