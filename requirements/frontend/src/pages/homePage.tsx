import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { Button } from "../components/button";
import { Card } from "../components/card";
import PageOrnaments from "../components/pageOrnaments";

export default function HomePage() {
  const navigate = useNavigate();
  const { auth } = useAuth();

// For now: auto-generate a mock room ID
// const handleStartGame = () => {
//     const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
//     navigate(`/room/${roomId}`);
//   };

// Commented out: handler that communicates with backend

  const handlePlay = () => {
    // Very simple for MVP. We just navigate to the single room we have
    navigate("/room");
  };

  return (
    <PageOrnaments>
      <div className="flex items-center justify-center px-6 py-16">
        <Card>
          <div className="flex flex-col items-center gap-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-2 text-textPrimary">
                Welcome{auth ? `, ${auth.user.email}` : ""}
              </h1>
              <p className="text-sm text-textMuted">You are all set</p>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <Button
                onClick={handlePlay}
                variant="primary"
              >
                Play!
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageOrnaments>
  );
}