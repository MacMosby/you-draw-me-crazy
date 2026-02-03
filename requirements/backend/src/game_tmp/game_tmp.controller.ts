import { Controller, Post } from '@nestjs/common';
import { GameService } from './game_tmp.service';
import { ConnectionRegistry } from '../websocket/websocket.service';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly registry: ConnectionRegistry,
  ) {}

  @Post('start')
  startGame() {
    // Get all connected users
    const userIds = Array.from(this.registry.getAllSockets()).map(
      (s) => s.data.userId,
    );

    // Create a simple gameId (for demo, timestamp)
    const gameId = `game-${Date.now()}`;

    this.gameService.createGame(gameId, userIds);

    return { gameId, userIds };
  }
}
