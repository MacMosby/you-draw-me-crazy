<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import type { PlayerDto } from "./player.dto";
=======
import { PlayerDto } from "./player.dto";
>>>>>>> 31389cf (add: sockets for drawing)
=======
import { PlayerDto } from "./player.dto";
>>>>>>> ca60847 (add: sockets for drawing)
=======
import type { PlayerDto } from "./player.dto";
>>>>>>> 0950475 (fix: errors after merge)

export interface JoinRoomPayload {
	user_id: number;
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> ca60847 (add: sockets for drawing)
/*
room_id = -1 -> no room. You have been send a dummy to fulfill the payload type.
example: if you receive this after joinRoom, there was no availbale room. 
*/
<<<<<<< HEAD
>>>>>>> 31389cf (add: sockets for drawing)
=======
>>>>>>> ca60847 (add: sockets for drawing)
=======
>>>>>>> 0950475 (fix: errors after merge)
export interface TurnInfoPayload {
	room_id: number;
	drawer: number;
	word: string | null;
	word_length: number;
	round: number;
	turn: number;
	players: PlayerDto[];
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
	time_to_display: number;
>>>>>>> 31389cf (add: sockets for drawing)
=======
	time_to_display: number;
>>>>>>> ca60847 (add: sockets for drawing)
=======
>>>>>>> 0950475 (fix: errors after merge)
}

export interface GuessPayload {
	guesser_id: number;
	guess: string;
	room_id: number;
}

export interface GuessUpdatePayload {
	guesser_id: number;
	guess: string | null;
	room_id: number;
	score: number;
	correct: boolean;
}

export interface ResultsPayload {
	final: boolean;
	solution: string;
	time_to_display: number;
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 0950475 (fix: errors after merge)
export interface DrawingPayload {
	room_id: number;
	drawer: Number;
	coordinate_x: number;
	coordinate_y: number;
<<<<<<< HEAD
=======
=======
>>>>>>> ca60847 (add: sockets for drawing)
export type Point = { x: number; y: number };
export type Stroke = { id: string; color: string; width: number; points: Point[] };

export interface DrawPayload {
	room_id: number;
	drawer: Number;
	width: number;
	strokes: Stroke[];
<<<<<<< HEAD
>>>>>>> 31389cf (add: sockets for drawing)
=======
>>>>>>> ca60847 (add: sockets for drawing)
=======
>>>>>>> 0950475 (fix: errors after merge)
	color: `#${string}`// e.g. "#ff00ff"
}