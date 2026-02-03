// src/game/game.module.ts
import { Module } from '@nestjs/common';
import { GameService } from './game_tmp.service';
import { GameController } from './game_tmp.controller';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebsocketModule],  // to inject ConnectionRegistry
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
//copy and paste for testing