import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { useSessionStore } from "../state/sessionStore";
import starImage from "../assets/star.png";

type PostGameSummary = {
  solution: string;
  winnerText: string;
  winnerScore: number;
};

type LocationState = {
  summary?: PostGameSummary;
};

export default function PostGamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const clearRoom = useSessionStore((s) => s.clearRoom);
  const summary = (location.state as LocationState | null)?.summary;

  const joinRoom = () => {
    navigate("/room");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    clearRoom();
  }, [clearRoom]);

  return (
    <div className="flex items-center justify-center px-6 py-16">
      <Card className="max-w-2xl text-center">
        <div className="flex flex-col items-center gap-6">
          <img
            src={starImage}
            alt="Game finished"
            className="w-auto h-auto max-w-32 max-h-32 object-contain"
          />

          <h1 className="text-3xl font-bold text-textPrimary mb-6">Game Finished!</h1>

          {summary ? (
            <div className="text-lg text-textMuted space-y-1">
              <p>
                The last correct answer was: <strong>{summary.solution}</strong>
              </p>
              <p>
                <strong>{summary.winnerText}</strong> won the game with <strong>{summary.winnerScore}</strong> points!
              </p>
            </div>
          ) : (
            <p className="text-lg text-textMuted">Game finished.</p>
          )}

          <div className="w-full max-w-sm mt-4 space-y-4">
            <Button className="w-full" onClick={joinRoom}>
              Play again
            </Button>
            <Button className="w-full" variant="secondary" onClick={goToProfile}>
              Go to profile
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
