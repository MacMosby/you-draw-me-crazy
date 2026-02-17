// import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
// import { RoomProvider } from "../features/room/RoomProvider";
import { RoomLayout } from "../layouts/roomLayout";
import DrawingBoard from "../components/room/drawingBoard";
import PromptBox from "../components/room/promptBox";
import Lobby from "../components/room/lobby";
import { socket, initSocketWithIdentify, play, onRoomState, onStartGame, type RoomStatePayload } from "../api/socket";

export default function GamePage() {
  // const { auth } = useAuth();
  // const [players, setPlayers] = useState<Player[]>([]);

  // IMPORTANT: replace with real user id
  const userId = 42;

  const [wsState, setWsState] = useState<"connecting" | "waiting" | "playing" | "full" | "finished" | "error">("connecting");  
  const [members, setMembers] = useState<RoomStatePayload["members"]>([]);
  const [round, setRound] = useState<number>(-1);
  const [turn, setTurn] = useState<number>(-1);
  const [recentlyCorrectGuesser, setRecentlyCorrectGuesser] = useState<number | null>(null);

  // suggestion. should we maybe use separate states for WebSocket connection (wsState) and updates about the room state (just roomState all in one component)
  // i think it would be better if the UI depends on the second one only
  
  // const [wsState, setWsState] = useState<"connecting" | "connected" | "error">("connecting");
  // const [roomState, setRoomState] = useState<RoomStatePayload | null>(null);


  useEffect(() => {
    let unsubRoomState = () => {};
    let unsubStartGame = () => {};

    (async () => {
      try {
        setWsState("connecting");

        // 1) identify + 2) send play(userId)
        await play(userId);

        // 3) subscribe to BE pushes
        unsubRoomState = onRoomState((payload) => {
          console.log("[ws] room_state:", payload);

          setMembers(payload.members); // !!! change name to align with BE !!! 
          setRound(payload.round); // !!! change name to align with BE !!! 
          setTurn(payload.turn); // !!! change name to align with BE !!! 

          //round/turn -1 means waiting
          setWsState(payload.round === -1 ? "waiting" : "playing");
        });

        unsubStartGame = onStartGame((payload) => {
          console.log("[ws] start_game:", payload);
          setMembers(payload.members);
          setRound(payload.round);
          setTurn(payload.turn);
          setWsState("playing");
        });
      } catch (e) {
        console.error(e);
        setWsState("error");
      }
    })();

    return () => {
      unsubRoomState();
      unsubStartGame();
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
              className="block w-full px-2 py-1 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded text-xs"
            >
              Highlight Steph (ID: 2)
            </button>
            <button
              onClick={() => setRecentlyCorrectGuesser(3)}
              className="block w-full px-2 py-1 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded text-xs"
            >
              Highlight Marc (ID: 3)
            </button>
            <button
              onClick={() => setRecentlyCorrectGuesser(4)}
              className="block w-full px-2 py-1 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded text-xs"
            >
              Highlight Nick (ID: 4)
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
