// import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// import { RoomProvider } from "../features/room/RoomProvider";
import { RoomLayout } from "../layouts/roomLayout";
import DrawingBoard from "../components/room/drawingBoard";
import PromptBox from "../components/room/promptBox";
import Lobby from "../components/room/lobby";
import { socket, joinRoom, onTurnInfo, onRoomFull } from "../api/socket";
import type { TurnInfoPayload } from "../../shared/ws.payloads";


export default function GamePage() {
  // const { auth } = useAuth();
  // const [players, setPlayers] = useState<Player[]>([]);

  // IMPORTANT: replace with real user id
  const userId = 42;

  const [wsState, setWsState] = useState<"connecting" | "waiting" | "playing" | "full" | "finished" | "error">("connecting");  
  const [members, setMembers] = useState<TurnInfoPayload["players"]>([]);
  const [round, setRound] = useState<number>(0);
  const [turn, setTurn] = useState<number>(0);
  // const [room_id, setRoomId] = useState<number>(-1);
  const [recentlyCorrectGuesser, setRecentlyCorrectGuesser] = useState<number | null>(null);
  const [showWaitingLobby, setShowWaitingLobby] = useState(false);
  const [startCountdown, setStartCountdown] = useState<number | null>(null);
  const prevWsStateRef = useRef<typeof wsState>("connecting");

  useEffect(() => {
    let unsubTurnInfo = () => {};
    let unsubRoomFull = () => {};
    let unsubStartGame = () => {};

    (async () => {
      try {
        setWsState("connecting");

        // 1) identify + 2) send joinRoom(userId)
        await joinRoom(userId);
        console.log("[gameRoom] joinRoom successful");

        // 3) subscribe to BE pushes
        unsubTurnInfo = onTurnInfo((payload) => {
          console.log("[ws] turnInfo:", payload);

          if (payload.room_id === -1) {
            setWsState("full");
            return;
          }

          //round/turn 0 means waiting
          setWsState(payload.round === 0 ? "waiting" : "playing");
        });

        unsubStartGame = onStartGame((payload) => {
          console.log("[ws] start_game:", payload);
          setMembers(payload.members);
          setRound(payload.round);
          setTurn(payload.turn);

          // round > 0 means game is active
          setWsState(payload.round > 0 ? "playing" : "waiting");
        });

        unsubRoomFull = onRoomFull(() => {
          console.log("[ws] room full");
          setWsState("full");
        });
      } catch (e) {
        console.error(e);
        setWsState("error");
      }
    })();

    return () => {
      unsubTurnInfo();
      unsubRoomFull();
      unsubStartGame();
      socket.disconnect();
    };
  }, [userId]);

  // timer which makes sure the waiting panel disappears after three seconds
  useEffect(() => {
    let waitingTimer: number | undefined;

    if (wsState === "waiting") {
      setShowWaitingLobby(true);
      waitingTimer = window.setTimeout(() => {
        setShowWaitingLobby(false);
      }, 3000);
    }

    return () => {
      if (waitingTimer) {
        window.clearTimeout(waitingTimer);
      }
    };
  }, [wsState]);

  // countdown before play 
  useEffect(() => {
    let countdownInterval: number | undefined;
    const prevState = prevWsStateRef.current;

    if (wsState === "playing" && prevState !== "playing") {
      setStartCountdown(3);
      countdownInterval = window.setInterval(() => {
        setStartCountdown((value) => {
          if (value === null) return null;
          if (value <= 1) {
            if (countdownInterval) {
              window.clearInterval(countdownInterval);
            }
            return null;
          }
          return value - 1;
        });
      }, 1000);
    }

    if (wsState !== "playing") {
      setStartCountdown(null);
    }

    prevWsStateRef.current = wsState;

    return () => {
      if (countdownInterval) {
        window.clearInterval(countdownInterval);
      }
    };
  }, [wsState]);

  return (
    <RoomLayout highlightedPlayerId={recentlyCorrectGuesser}>

		{/* Debugging stuff: feel free to delete or change */}
		<div className="absolute top-50 left-50 z-10 max-w-sm bg-white/90 rounded p-3 text-xs space-y-2">
          <div className="font-semibold">Debugging information:</div>
          <div>wsState: {wsState}</div>
          <div>round: {round} turn: {turn}</div>
          <div>players: {members.length}</div>
          <div className="border-t pt-2 space-y-1">
            <div className="font-semibold">Test Highlight:</div>
            <button
              onClick={() => setRecentlyCorrectGuesser(2)}
              className="block w-full px-2 py-1 bg-cyan-100 hover:bg-cyan-200 border border-cyan-300 rounded text-xs"
            >
              Highlight Steph (ID: 2)
            </button>
          </div>
        </div>

    {wsState === "connecting" && (
      <Lobby 
        title="Connecting..."
        message="Connecting to the game room..."
      />
    )}

    {wsState === "waiting" && showWaitingLobby && (
      <Lobby 
        title="Waiting for Players"
        message="Not enough players in room. For now, practice your drawing!" // this could be a temporary pop-up?
      />
    )}

    {wsState === "full" && (
      <Lobby 
        title="Room Full"
        message="Room 2 is under construction. Please wait for a spot in Room 1 to become available."
      />
    )}

    {wsState === "finished" && (
      <Lobby 
        title="Game Finished!"
        message="Thanks for playing!" // change to rematch
      />
    )}

    {wsState === "error" && (
      <Lobby 
        title="Connection Error"
        message="Unable to connect to the game. Please refresh the page."
      />
    )}

      {wsState === "waiting" && (
        <DrawingBoard />
      )}

      {wsState === "playing" && (
        <>
          <div className="absolute top-8 left-8 z-10 max-w-sm">
            <PromptBox />
          </div>
          <DrawingBoard onGuessCorrect={setRecentlyCorrectGuesser} />
        </>
      )}

      {wsState === "playing" && startCountdown !== null && (
        <Lobby title="Get Ready" message={`Game will start in: ${startCountdown}`} />
      )}
    </RoomLayout>
  );
}
function onStartGame(arg0: (payload: any) => void): () => void {
  throw new Error("Function not implemented.");
}

