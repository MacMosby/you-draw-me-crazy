<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 31389cf (add: sockets for drawing)
import { WS_EVENTS } from "../../shared/ws.events"; //change to shared folder
import { socket } from "./socket";
import type { DrawPayload, Stroke, Point } from "../../shared/ws.payloads"

// src/api/socket/drawingSocket.ts
<<<<<<< HEAD


// --------- Client -> Server emits ----------
export function emitStrokeStart(payload: DrawPayload) {
  socket.emit(WS_EVENTS.STROKE_START, payload);
}

//server expects full drawepayload, but if it will be slow we can exchange only Strokes[]
export function emitStrokeAppend(payload: DrawPayload) {
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
  socket.on(WS_EVENTS.STROKE_START, cb);
  return () => socket.off(WS_EVENTS.STROKE_START, cb);
}

export function onStrokeAppend(cb: (payload: DrawPayload) => void) {
  socket.on(WS_EVENTS.STROKE_APPEND, cb);
  return () => socket.off(WS_EVENTS.STROKE_APPEND, cb);
}
=======
=======
>>>>>>> aca3e26 (add: set up for svg dravwing)
// drawing:strokeStart
// drawing:strokePoints
// drawing:strokeEnd
// drawing:clear
<<<<<<< HEAD
=======
>>>>>>> 31389cf (add: sockets for drawing)


// --------- Client -> Server emits ----------
export function emitStrokeStart(payload: DrawPayload) {
  socket.emit(WS_EVENTS.STROKE_START, payload);
}

//server expects full drawepayload, but if it will be slow we can exchange only Strokes[]
export function emitStrokeAppend(payload: DrawPayload) {
  socket.emit(WS_EVENTS.STROKE_APPEND, payload);
}

export function emitCanvasClear() {
  socket.emit(WS_EVENTS.CANVAS_CLEAR);
}

export function emitCanvasUndo() {
  socket.emit(WS_EVENTS.CANVAS_UNDO);
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> db0f2be (add: set up for svg dravwing)
=======


// emitStrokeStart(roomId, payload)
// emitStrokePoints(roomId, payload)
// onStrokeStart(cb), onStrokePoints(cb), …




<<<<<<< HEAD
>>>>>>> aca3e26 (add: set up for svg dravwing)
// src/api/socket/drawingSocket.ts
import type { Socket } from "socket.io-client";
import {
  DRAWING_EVENTS,
  type StrokeStartPayload,
  type StrokePointsPayload,
  type StrokeEndPayload,
  type ClearPayload,
} from "../features/drawing/protocol";

export function emitStrokeStart(socket: Socket, payload: StrokeStartPayload) {
  socket.emit(DRAWING_EVENTS.STROKE_START, payload);
}

export function emitStrokePoints(socket: Socket, payload: StrokePointsPayload) {
  socket.emit(DRAWING_EVENTS.STROKE_POINTS, payload);
}

export function emitStrokeEnd(socket: Socket, payload: StrokeEndPayload) {
  socket.emit(DRAWING_EVENTS.STROKE_END, payload);
}

export function emitClear(socket: Socket, payload: ClearPayload) {
  socket.emit(DRAWING_EVENTS.CLEAR, payload);
}

export function onStrokeStart(socket: Socket, cb: (p: StrokeStartPayload) => void) {
  socket.on(DRAWING_EVENTS.STROKE_START, cb);
  return () => socket.off(DRAWING_EVENTS.STROKE_START, cb);
}

export function onStrokePoints(socket: Socket, cb: (p: StrokePointsPayload) => void) {
  socket.on(DRAWING_EVENTS.STROKE_POINTS, cb);
  return () => socket.off(DRAWING_EVENTS.STROKE_POINTS, cb);
}

export function onStrokeEnd(socket: Socket, cb: (p: StrokeEndPayload) => void) {
  socket.on(DRAWING_EVENTS.STROKE_END, cb);
  return () => socket.off(DRAWING_EVENTS.STROKE_END, cb);
}

export function onClear(socket: Socket, cb: (p: ClearPayload) => void) {
  socket.on(DRAWING_EVENTS.CLEAR, cb);
  return () => socket.off(DRAWING_EVENTS.CLEAR, cb);
}
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 26ed7ed (add: set up for svg dravwing)
=======
// src/api/socket/drawingSocket.ts
>>>>>>> aedfc79 (sync: WIP local storage and drawing wip)
=======
>>>>>>> db0f2be (add: set up for svg dravwing)
=======
// src/api/socket/drawingSocket.ts
>>>>>>> af527ff (sync: WIP local storage and drawing wip)
=======
// --------- Server -> Client subscriptions ----------
export function onInitDrawing(cb: (payload: { room_id: number; strokes: Stroke[] }) => void) {
  socket.on(WS_EVENTS.INIT_DRAWING, cb);
  return () => socket.off(WS_EVENTS.INIT_DRAWING, cb);
}

export function onStrokeStart(cb: (payload: DrawPayload) => void) {
  socket.on(WS_EVENTS.STROKE_START, cb);
  return () => socket.off(WS_EVENTS.STROKE_START, cb);
}

export function onStrokeAppend(cb: (payload: DrawPayload) => void) {
  socket.on(WS_EVENTS.STROKE_APPEND, cb);
  return () => socket.off(WS_EVENTS.STROKE_APPEND, cb);
}
>>>>>>> 31389cf (add: sockets for drawing)
=======
>>>>>>> aca3e26 (add: set up for svg dravwing)
=======
// src/api/socket/drawingSocket.ts
>>>>>>> c20143a (sync: WIP local storage and drawing wip)
