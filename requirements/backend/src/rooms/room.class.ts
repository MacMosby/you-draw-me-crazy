//import { RoomPhase, Participant, Prompt, RoomTimer } from "../../../shared/room.types"
import type { PlayerDto } from "src/websocket/dtos/player.dto"
import type { Stroke } from "src/websocket/dtos/ws.payloads"

/*Where all room related variables are stored.*/
export class Room {
	public state: 'lobby' | 'playing' | 'finished';
	public id: number
    public round: number//0 before start
	public maxRounds: number
	public turn: number//0 before start
    public maxPlayers: number
	public word: string | null//null outside of turn
	public drawer: number//userid
	public word_length: number//-1 outsie of turn
	public players: PlayerDto[] = [];
	public spectators: PlayerDto[] = [];
	public strokes: Stroke[] = [];
	correctGuesses: Set<number> = new Set();//user ids that guessed correctly
	timeout?: NodeJS.Timeout;
	turnStartTime: number;
	public usedWordIds: number[] = [];
	//public active: boolean;
}
