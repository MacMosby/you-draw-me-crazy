import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { RoomsModule } from 'src/rooms/rooms.module';
import { WordsModule } from 'src/words/words.module';

@Module({
	providers: [GameService],
	exports: [GameService],
	imports: [RoomsModule, WordsModule],
})
export class GameModule {}