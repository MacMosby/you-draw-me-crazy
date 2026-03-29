import { WS_EVENTS } from "../../shared/ws.events"; //change to shared folder
import { socket } from "./socket";
import type { DrawPayload, StrokeAppendPayload, Stroke } from "../../shared/ws.payloads";

// src/api/socket/drawingSocket.ts


// --------- Client -> Server emits ----------
export function emitStrokeStart(payload: DrawPayload) {
  socket.emit(WS_EVENTS.STROKE_START, payload);
}

//server expects full drawepayload, but if it will be slow we can exchange only Strokes[]
export function emitStrokeAppend(payload: StrokeAppendPayload) {
  socket.emit(WS_EVENTS.STROKE_APPEND, payload);
}

export function emitCanvasClear() {
  socket.emit(WS_EVENTS.CANVAS_CLEAR);
}

export function emitCanvasUndo() {
  socket.emit(WS_EVENTS.CANVAS_UNDO);
}

// --------- Server -> Client subscriptions ----------
export function onInitDrawing(cb: (payload: { room_id: number; strokes: Stroke[] }) => void) {
  socket.on(WS_EVENTS.INIT_DRAWING, cb);
  return () => socket.off(WS_EVENTS.INIT_DRAWING, cb);
}

export function onStrokeStart(cb: (payload: DrawPayload) => void) {
	//console.log("[wss] Subscribing to stroke start events");
  socket.on(WS_EVENTS.STROKE_START, cb);
  return () => socket.off(WS_EVENTS.STROKE_START, cb);
}

export function onStrokeAppend(cb: (payload: StrokeAppendPayload) => void) {
  socket.on(WS_EVENTS.STROKE_APPEND, cb);
  return () => socket.off(WS_EVENTS.STROKE_APPEND, cb);
}