import { useParams } from "react-router-dom";
import { RoomProvider } from "../features/room/roomProvider";
import { RoomLayout } from "../layouts/roomLayout";
import DrawingBoard from "../components/room/drawingBoard";
import PromptBox from "../components/room/promptBox";

export default function GamePage() {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Room ID is required</p>
      </div>
    );
  }

  return (
    <RoomProvider roomId={roomId}>
      <RoomLayout>
        {/* Prompt overlaid on top */}
        <div className="absolute top-8 left-8 z-10 max-w-sm">
          <PromptBox />
        </div>
        
        <DrawingBoard />
      </RoomLayout>
    </RoomProvider>
  );
}
