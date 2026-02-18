import { Button } from "../button";
import { Input } from "../input";
import { useEffect, useMemo, useRef, useState } from "react";
import { socket } from "../../api/socket";
import { ChatMessageRow, type ChatMessage } from "./chatMessageRow";
import { mockMessages } from "./chat.mock";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
// import SvgBoard from "../../features/drawing/SvgBoard";
import { DrawingCanvas } from "./DrawingCanvas";
import {DrawerPanel} from "./DrawerPanel";

<<<<<<< HEAD
<<<<<<< HEAD
=======
import SvgBoard from "../../features/drawing/SvgBoard";
=======
// import SvgBoard from "../../features/drawing/SvgBoard";
>>>>>>> aedfc79 (sync: WIP local storage and drawing wip)
import DrawerPanel from "./DrawerPanel";
import GuesserPanel from "./GuesserPanel";
>>>>>>> 26ed7ed (add: set up for svg dravwing)
=======
>>>>>>> b1fcdd0 (add: Canvas component and Drawer tools)
import { useSessionStore } from "../../state/sessionStore";
import { emitCanvasClear, emitCanvasUndo } from "../../api/drawingSocket";

=======
import SvgBoard from "../../features/drawing/SvgBoard";
=======
// import SvgBoard from "../../features/drawing/SvgBoard";
>>>>>>> c20143a (sync: WIP local storage and drawing wip)
import DrawerPanel from "./DrawerPanel";
import GuesserPanel from "./GuesserPanel";
=======
>>>>>>> 553d042 (add: Canvas component and Drawer tools)
import { useSessionStore } from "../../state/sessionStore";
>>>>>>> aca3e26 (add: set up for svg dravwing)
=======
import SvgBoard from "../../features/drawing/SvgBoard";
=======
// import SvgBoard from "../../features/drawing/SvgBoard";
>>>>>>> 0d34e02 (sync: WIP local storage and drawing wip)
import DrawerPanel from "./DrawerPanel";
import GuesserPanel from "./GuesserPanel";
import { useSessionStore } from "../../state/sessionStore";
>>>>>>> 8677b65 (add: set up for svg dravwing)

type Props = {
  onGuessCorrect?: (userId: number) => void;
};


//we nned to rename it or bring chat into an separate component
export default function DrawingBoard({ onGuessCorrect }: Props) {
	const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useSessionStore((s: any) => s.userId)
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const roomId = useSessionStore((s:any) => s.roomId)

  const [color, setColor] = useState("#111111");
<<<<<<< HEAD
  const role = useSessionStore((s:any) => s.role);

<<<<<<< HEAD
  const isDrawer = role === "drawer";

=======
  const isDrawer = role === "drawer"; //get role from storage, update storage from socket

  //const isDrawer = true; 
>>>>>>> 637ee7a (refactor: remove duplicated code)
=======
  const roomId = useSessionStore((s: any) => s.roomId)
=======
  const roomId = useSessionStore((s:any) => s.roomId)
>>>>>>> c20143a (sync: WIP local storage and drawing wip)

  const role = useSessionStore((s:any) => s.role);

  const isDrawer = role === "drawer";
>>>>>>> aca3e26 (add: set up for svg dravwing)
=======
  const role = useSessionStore((s:any) => s.role);

//   const isDrawer = role === "drawer"; //get role from storage, update storage from socket

  const isDrawer = true; 
>>>>>>> 553d042 (add: Canvas component and Drawer tools)
=======
  const roomId = useSessionStore((s: any) => s.roomId)
=======
  const roomId = useSessionStore((s:any) => s.roomId)
>>>>>>> 0d34e02 (sync: WIP local storage and drawing wip)

  const role = useSessionStore((s:any) => s.role);

  const isDrawer = role === "drawer";
>>>>>>> 8677b65 (add: set up for svg dravwing)

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.timestamp - b.timestamp),
    [messages]
  );

  function send() {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
		const trimmed = text.trim();
		if (!trimmed) return;
		if (trimmed.length > 100) return;

		// input-only: just emit, no chat rendering yet
		// socket.emit("chat:send", { roomId, text: trimmed });
		// console.log("[ws] chat:send", { roomId, text: trimmed });


		// Input-only test: server logs it and replies with "youAre"
=======
	const trimmed = text.trim();
	if (!trimmed) return;
>>>>>>> 26ed7ed (add: set up for svg dravwing)
=======
	const trimmed = text.trim();
	if (!trimmed) return;
>>>>>>> aca3e26 (add: set up for svg dravwing)
=======
	const trimmed = text.trim();
	if (!trimmed) return;
>>>>>>> 8677b65 (add: set up for svg dravwing)
    socket.emit("whoAmI", { text: trimmed });

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        userId: currentUserId,
        username: "You",
        text: trimmed,
        timestamp: Date.now(),
        type: "chat",
      },
    ]);
		setText("");
	}

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages.length]);

  useEffect(() => {
    const handleGuessUpdate = (data: { guesser: { Nickname: string; User_ID: number }; correct: boolean; Score: number; guess: string | null }) => {
      if (data.correct) {
        // Notify parent component to highlight the player
        if (onGuessCorrect) {
          onGuessCorrect(data.guesser.User_ID);
        }
      }
    };

    socket.on("guess_update", handleGuessUpdate);
    return () => {
      socket.off("guess_update", handleGuessUpdate);
    };
  }, [onGuessCorrect]);

  const session = useSessionStore();
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
	console.log("useSessionStore():", session);
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const updateSize = () => {
      const { clientWidth, clientHeight } = container;
      setCanvasSize({
        width: Math.max(1, clientWidth),
        height: Math.max(1, clientHeight),
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

=======
	console.log(session);
>>>>>>> aedfc79 (sync: WIP local storage and drawing wip)
=======
	console.log("useSessionStore():", session);
>>>>>>> b1fcdd0 (add: Canvas component and Drawer tools)
=======
	console.log(session);
>>>>>>> c20143a (sync: WIP local storage and drawing wip)
=======
	console.log("useSessionStore():", session);
>>>>>>> 553d042 (add: Canvas component and Drawer tools)
=======
	console.log(session);
>>>>>>> 0d34e02 (sync: WIP local storage and drawing wip)
  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      {/* Canvas area */}
      <div className="relative bg-surface border border-gray-400 rounded-lg flex-1 min-h-[280px] lg:min-h-0">
        <canvas
          className="w-full h-full rounded cursor-crosshair"
          width={1600}
          height={1200}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        />
		{/* <SvgBoard roomId={roomId} socket={socket} mode={isDrawer ? "draw" : "view"} /> */}
		{/* tools panel */}
<<<<<<< HEAD
        {isDrawer ? <DrawerPanel /> : <GuesserPanel />}
>>>>>>> 26ed7ed (add: set up for svg dravwing)
=======
        {/* {isDrawer ? <DrawerPanel /> : <GuesserPanel />} */}
>>>>>>> aedfc79 (sync: WIP local storage and drawing wip)
=======
        {/* <canvas
=======
        <canvas
>>>>>>> af527ff (sync: WIP local storage and drawing wip)
          className="w-full h-full rounded cursor-crosshair"
          width={1600}
          height={1200}
        /> */}
		{/* drawing tools panel */}
        {/* {isDrawer ? <DrawerPanel />} */}
		<DrawingCanvas isDrawer={isDrawer} roomId={roomId} drawerId={currentUserId} color={color} />
=======
        /> */}
		{/* drawing tools panel */}
        {/* {isDrawer ? <DrawerPanel />} */}
		<DrawingCanvas isDrawer={isDrawer} color={color} />
>>>>>>> 553d042 (add: Canvas component and Drawer tools)

		{isDrawer && (
			<DrawerPanel
			color={color}
			onColorChange={setColor}
<<<<<<< HEAD
			onUndo={emitCanvasUndo}
  			onClear={emitCanvasClear}
			/>
		)}
>>>>>>> b1fcdd0 (add: Canvas component and Drawer tools)
=======
=======
>>>>>>> 8677b65 (add: set up for svg dravwing)
        /> */}
		<SvgBoard roomId={roomId} socket={socket} mode={isDrawer ? "draw" : "view"} />
		{/* tools panel */}
        {isDrawer ? <DrawerPanel /> : <GuesserPanel />}
<<<<<<< HEAD
>>>>>>> aca3e26 (add: set up for svg dravwing)
=======
        />
		{/* <SvgBoard roomId={roomId} socket={socket} mode={isDrawer ? "draw" : "view"} /> */}
		{/* tools panel */}
        {/* {isDrawer ? <DrawerPanel /> : <GuesserPanel />} */}
>>>>>>> c20143a (sync: WIP local storage and drawing wip)
=======
			onUndo={() => socket.emit("canvas:undo")}
			onClear={() => socket.emit("canvas:clear")}
			/>
		)}
>>>>>>> 553d042 (add: Canvas component and Drawer tools)
=======
>>>>>>> 8677b65 (add: set up for svg dravwing)
=======
        />
		{/* <SvgBoard roomId={roomId} socket={socket} mode={isDrawer ? "draw" : "view"} /> */}
		{/* tools panel */}
        {/* {isDrawer ? <DrawerPanel /> : <GuesserPanel />} */}
>>>>>>> 0d34e02 (sync: WIP local storage and drawing wip)
      </div>


      {/* Chat/Guesses section */}
      <div className="w-full lg:w-64 xl:w-72 flex flex-col min-h-0 bg-surface border border-gray-200 rounded-lg p-3">
        <div className="mb-3 flex-1 min-h-0 overflow-y-auto space-y-2">
          {sortedMessages.map((message) => (
            <ChatMessageRow
              key={message.id}
              message={message}
              isOwn={message.userId === currentUserId}
            />
          ))}
          <div ref={scrollAnchorRef} />
        </div>
        <div className="flex gap-2 border-t border-gray-200 pt-3">
          <Input
            placeholder="Type your guess..."
            className="flex-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />
          <Button variant="primary" onClick={send}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}