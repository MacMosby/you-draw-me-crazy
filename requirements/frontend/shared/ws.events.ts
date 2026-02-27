<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
//copy from Server

>>>>>>> 31389cf (add: sockets for drawing)
=======
//copy from Server

>>>>>>> ca60847 (add: sockets for drawing)
=======
>>>>>>> 0950475 (fix: errors after merge)
export const WS_EVENTS = {
	JOIN_ROOM: "joinRoom",
	ROOM_STATE: "roomState",
	GUESS: "guess",
	GUESS_UPDATE: "guessUpdate",
	RESULTS: "results",
	TURN_INFO: "turnInfo",
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
	DRAWING: "drawing",
	INIT_DRAWING: "init_drawing",
	STROKE_START: "stroke:start",
	STROKE_APPEND: "stroke:append",
	CANVAS_CLEAR: "canvas:clear",
	CANVAS_UNDO: "canvas:undo",
=======
=======
>>>>>>> ca60847 (add: sockets for drawing)
	INIT_DRAWING: "init_drawing",
	STROKE_START: "stroke:start",
	STROKE_APPEND: "stroke:append",
  	CANVAS_CLEAR: "canvas:clear",
  	CANVAS_UNDO: "canvas:undo",
<<<<<<< HEAD
>>>>>>> 31389cf (add: sockets for drawing)
=======
>>>>>>> ca60847 (add: sockets for drawing)
=======
	DRAWING: "drawing",
	INIT_DRAWING: "init_drawing",
	STROKE_START: "stroke:start",
	STROKE_APPEND: "stroke:append",
	CANVAS_CLEAR: "canvas:clear",
	CANVAS_UNDO: "canvas:undo",
>>>>>>> 0950475 (fix: errors after merge)
	ROOM_FULL: "roomFull"
} as const;

export type WSEvent = typeof WS_EVENTS[keyof typeof WS_EVENTS]

/*USAGE
socker.emit(WS_EVENTS.MACRO_NAME, payload);
*/