import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { RoomsModule } from 'src/rooms/rooms.module';
import { WordsModule } from 'src/words/words.module';
import { UsersModule } from 'src/users/users.module';

@Module({
	providers: [GameService],
	exports: [GameService],
	imports: [RoomsModule, WordsModule, UsersModule],
})
export class GameModule {}