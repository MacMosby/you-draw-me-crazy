import { Button } from "../button";

interface ConfirmLeaveDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmLeaveDialog({ onConfirm, onCancel }: ConfirmLeaveDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-background/80">
      <div className="bg-surface border border-gray-700 rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
        <h2 className="text-2xl font-bold text-textPrimary mb-4">
          Leave Game?
        </h2>
        
        <p className="text-base text-textMuted mb-8">
          Are you sure you want to leave the game room? Your score and session will be lost.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="px-6"
          >
            Leave
          </Button>
        </div>
      </div>
    </div>
  );
}
