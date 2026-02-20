export const WS_EVENTS = {
	JOIN_ROOM: "joinRoom",
	ROOM_STATE: "roomState",
	GUESS: "guess",
	GUESS_UPDATE: "guessUpdate",
	RESULTS: "results",
	ROOM_FULL: "roomFull",
	TURN_INFO: "turnInfo",
	DRAWING: "drawing"
} as const;

export type WSEvent = typeof WS_EVENTS[keyof typeof WS_EVENTS]

/*USAGE
socker.emit(WS_EVENTS.MACRO_NAME, payload);
*/