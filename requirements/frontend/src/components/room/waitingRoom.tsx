import clockImage from "../../assets/clock.png";

interface WaitingRoomProps {
  title: string;
  message: string;
  icon?: string;
  showLoadingDots?: boolean;
  actions?: React.ReactNode;
}

export default function WaitingRoom({ 
  title, 
  message, 
  icon = clockImage,
  showLoadingDots = true,
  actions 
}: WaitingRoomProps) {
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
        
        {showLoadingDots && (
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
        
        {actions && (
          <div className="mt-8 flex gap-4 justify-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
