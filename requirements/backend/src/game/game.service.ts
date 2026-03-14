import { Injectable, Logger } from '@nestjs/common';
import { Room } from 'src/rooms/room.class';
//import { RoomsService } from 'src/rooms/rooms.service';
import { GuessPayload, GuessUpdatePayload, ResultsPayload, TurnInfoPayload } from 'src/websocket/dtos/ws.payloads';
import { Server } from 'socket.io'//server allows emiting from anyhwere
import { WS_EVENTS } from 'src/websocket/dtos/ws.events';
import { WordsService } from 'src/words/words.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { TurnEmitService } from 'src/websocket/turnemit.service';
import { TURN_DURATION, RESULTS_DURATION } from './game.constants';

@Injectable()
export class GameService {
	private readonly logger = new Logger(GameService.name);//for writing backend logs that are this green formated thingy
	constructor(
	private readonly wordsService: WordsService,
	private readonly roomsService: RoomsService,
	private readonly turnEmitService: TurnEmitService
	) {}
	

	async startTurn(room: Room, server: Server) {
		//clear drawing board for new turn
		this.roomsService.clearStrokes(room.id);
		server.to(`room-${room.id}`).emit(WS_EVENTS.INIT_DRAWING, {
			room_id: room.id,
			strokes: [],
    	});

		// admit spectators if there are any
		this.roomsService.admitSpectators(room.id);

		// check if there are enough players to continue
		if (room.players.length === 0) {
    		this.logger.log(`Room ${room.id} has no players, aborting startTurn`);
			room.state = 'lobby';
        	return;
		}

		if (room.round === 0) this.increaseRound(room);
		else this.increaseTurn(room);

		console.log("USING WORD SERVICE NOW");
		const wordEntity = await this.wordsService.getRandomWord(room.usedWordIds);
		
		room.word = wordEntity.text;
		room.word_length = room.word!.length;
		room.usedWordIds.push(wordEntity.id);
		console.log("usedWordIds:", room.usedWordIds);
		room.drawer = room.players[room.turn-1].userId;

		const payload = this.turnEmitService.emitTurnInfo(room, server);

		this.logger.log(`Room ${room.id} round.turn ${room.round}.${room.turn}, drawerId: ${room.drawer} draws ${room.word}`);
		room.timeout = setTimeout(() => {
			room.timeout = undefined;
			this.endOfTurn(room, server);
		}, TURN_DURATION);
	}	

	increaseTurn(room: Room): void {
		if (room.turn === room.players.length) {
			this.increaseRound(room);
			return;
		}
		room.turn += 1;
	}

	increaseRound(room: Room): void {
		room.round+= 1;
		if (room.round > room.maxRounds) {
			console.log('send final results');
			return;
		}
		room.turn = 1;
		room.state = "playing";
		this.logger.log(`Room ${room.id} started round ${room.round}`);
		return;
	}

	guessValidation(payload: GuessPayload, room: Room): GuessUpdatePayload | null {
		if (!room) return null;
		const player = room.players.find(p => p.userId === payload.guesser_id);
		if (!player) return null;//guesser not in room
		if (room.correctGuesses.has(player.userId)) return null;//already guessed correctly
		if (player.userId == room.drawer) return null;//drawers do not guess

		const typedGuess = payload.guess.trim();
		const normalizedGuess = typedGuess.toLowerCase();
		const normalizedWord = (room.word ?? "").toLowerCase();
		const iscorrect = normalizedGuess === normalizedWord;

		if (iscorrect === true) {
			player.score += 1;//dummy for point gaining logic
			room.correctGuesses.add(player.userId);
		}
		
		const response: GuessUpdatePayload = {
			guesser_id: payload.guesser_id,
			guess: iscorrect ? null : payload.guess,//only send wrong guesses
			room_id: room.id,
			score: player.score,
			correct: iscorrect,
		};
		return response;
	}

	endOfTurn(room: Room, server: Server) {
		//update drawer score
		const drawer = room.players.find(p => p.userId === room.drawer);
		if (drawer) drawer.score += room.correctGuesses.size;//dummy for points logic for drawer
		room.correctGuesses.clear();//prep for next turn
		let isFinal = false;
		if (room.round === room.maxRounds && room.turn === room.players.length) isFinal = true;
		const response: ResultsPayload = {
			final: isFinal,
			solution: room.word!,
			time_to_display: RESULTS_DURATION,
			players: room.players,
		};
		const socketRoom = `room-${room.id}`;
		server.to(socketRoom).emit(WS_EVENTS.RESULTS, response);
		if (!isFinal) {
			room.timeout = setTimeout(() => {
				room.timeout = undefined;
				this.startTurn(room, server);
			}, response.time_to_display);
		} 
		else {
			this.roomsService.removeAllPlayers(room.id);
			room.usedWordIds.length = 0;
			room.round = 0;
			room.turn = 0;
			room.state = 'lobby';
		}
	}

	checkEndOfTurn(room: Room, server: Server) {
		if (room.correctGuesses.size < room.players.length -1) return;
		console.log('All guessed correctly');
		if (room.timeout) {
			clearTimeout(room.timeout);
			room.timeout = undefined;
		}
		this.endOfTurn(room, server);
	}
}