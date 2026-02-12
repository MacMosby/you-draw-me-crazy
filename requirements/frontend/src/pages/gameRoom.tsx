import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { RoomProvider } from "../features/room/RoomProvider";
import { RoomLayout } from "../layouts/roomLayout";
import DrawingBoard from "../components/room/drawingBoard";
import PromptBox from "../components/room/promptBox";
import { socket, initSocketWithIdentify, play, onRoomState, onStartGame, type RoomStatePayload } from "../api/socket";

type RoomState = 
  | 'connecting'      // Initial connection
  | 'waiting'         // In room, waiting for other players
  | 'full'            // Room is full, can't join
  | 'playing'         // Game in progress
  | 'error'           // Error (with editable error message)
  | 'finished';       // Game ended

interface Player {
	Nickname: String
	User_ID: Number
	Score:  Number
}



export default function GamePage() {
  const { roomId } = useParams<{ roomId: string }>();




  // IMPORTANT: replace with real user id
  const userId = 42;

  const [wsState, setWsState] = useState<"connecting" | "waiting" | "playing" | "error">("connecting");
  const [members, setMembers] = useState<RoomStatePayload["members"]>([]);
  const [round, setRound] = useState<number>(-1);
  const [turn, setTurn] = useState<number>(-1);

    // maybe this check after attemoting connection??? no idea
  if (!roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Room ID is required</p>
      </div>
    );
  }

//   useEffect(() => {
// 	initSocketWithIdentify(userId);
// 	return () => {
// 		 // disconnect when leaving room page
//       socket.disconnect();
//     };
//   }, [userId, roomId]);

    

    // // connect once when entering the room page
    // socket.connect();

    // // join room after connection is established

	// // do i need to check smth else?? tbd
    // const onConnect = () => {
    //   socket.emit("room:join", { roomId });
    //   console.log("[ws] connected:", socket.id, "joined:", roomId); //delete
    // };

    // const onDisconnect = () => {
    //   console.log("[ws] disconnected"); //delete
    // };

    // socket.on("connect", onConnect);
    // socket.on("disconnect", onDisconnect);

    // // debug any server ack/eventm
    // socket.on("room:joined", (payload) => {
    //   console.log("[ws] room:joined", payload);  //delete the whole function 
    // });

//     return () => {
//       // leave listeners clean
//     //   socket.off("connect", onConnect);
//     //   socket.off("disconnect", onDisconnect);
//     //   socket.off("room:joined");

//       // disconnect when leaving room page ????
//       socket.disconnect();
//     };
//   }, [roomId]);


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

          setMembers(payload.members); // !!! change name to allign with BE !!! 
          setRound(payload.round); // !!! change name to allign with BE !!! 
          setTurn(payload.turn); // !!! change name to allign with BE !!! 

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
  }, [userId, roomId]);

  return (
    <RoomProvider roomId={roomId}>
      <RoomLayout>

		{/* feel free to delete or change */}
		<div className="absolute top-50 left-50 z-10 max-w-sm bg-white/90 rounded p-2 text-xs">
          <div>wsState: {wsState}</div>
          <div>round: {round} turn: {turn}</div>
          <div>players: {members.length}</div>
        </div>

        {/* Prompt overlaid on top */}
        <div className="absolute top-8 left-8 z-10 max-w-sm">
          <PromptBox />
        </div>
        
        <DrawingBoard />
      </RoomLayout>
    </RoomProvider>
  );
}
