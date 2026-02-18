// import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import { useAuth } from "../features/auth/AuthContext";
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
  const [round, setRound] = useState<number>(-1);
  const [turn, setTurn] = useState<number>(-1);
  // const [room_id, setRoomId] = useState<number>(-1);
  const [recentlyCorrectGuesser, setRecentlyCorrectGuesser] = useState<number | null>(null);

  useEffect(() => {
    let unsubTurnInfo = () => {};
    let unsubRoomFull = () => {};

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

          // setRoomId(payload.room_id);
          setMembers(payload.players);
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
      socket.disconnect();
    };
  }, [userId]);

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

    {wsState === 'connecting' && (
      <Lobby 
        title="Connecting..."
        message="Connecting to the game room..."
      />
    )}

    {wsState === 'waiting' && (
      <Lobby 
        title="Waiting for Players"
        message="Not enough players in room. For now, practice your drawing!" // this could be a temporary pop-up?
      />
    )}

    {wsState === 'full' && (
      <Lobby 
        title="Room Full"
        message="Room 2 is under construction. Please wait for a spot in Room 1 to become available."
      />
    )}

    {wsState === 'finished' && (
      <Lobby 
        title="Game Finished!"
        message="Thanks for playing!" // change to rematch
      />
    )}

    {wsState === 'error' && (
      <Lobby 
        title="Connection Error"
        message="Unable to connect to the game. Please refresh the page."
      />
    )}

    {wsState === 'playing' && (
      // lobby with countdown?
      <>
        {/* Prompt overlaid on top */}
        <div className="absolute top-8 left-8 z-10 max-w-sm">
          <PromptBox />
        </div>
        <DrawingBoard onGuessCorrect={setRecentlyCorrectGuesser} />
      </>
    )}
    </RoomLayout>
  );
}
