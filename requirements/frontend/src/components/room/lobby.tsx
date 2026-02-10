import clockImage from "../../assets/clock.png";

interface LobbyProps {
  title: string;
  message: string;
  icon?: string;
  actions?: React.ReactNode;
}

export default function Lobby({ 
  title, 
  message, 
  icon = clockImage,
  actions 
}: LobbyProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-background/80">
      <div className="bg-surface border border-gray-700 rounded-xl p-12 max-w-2xl w-full text-center shadow-2xl">
        <div className="mb-8">
          <img src={icon} alt={title} className="w-32 h-32 mx-auto mb-6" />
        </div>
        
        <h2 className="text-3xl font-bold text-textPrimary mb-6">
          {title}
        </h2>
        
        <p className="text-lg text-textMuted mb-8">
          {message}
        </p>
        
        {actions && (
          <div className="mt-8 flex gap-4 justify-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
