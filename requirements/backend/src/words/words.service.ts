import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class WordsService {
	constructor(private prisma: PrismaService) {}

	async addWord(text: string) {
		return this.prisma.word.create({
			data: { text },
		});
	}

	async removeWord(id: number) {
		return this.prisma.word.delete({
			where: { id },
		});
	}

	async getAllWords() {
		return this.prisma.word.findMany({
			orderBy: { id: 'asc' },
		});
	}

	/*to be used in game service with sth like this:
	const word = await this.wordsService.getRandomWord(room.usedWordIds);
	room.currentWord = word.text;
	room.usedWordIds.push(word.id);*/
	async getRandomWord(excludeIds: number[] = []) {
		const availableWords = await this.prisma.word.findMany({
			where: {
				id: {
					notIn: excludeIds,
				},
			},
		});
		//if no words in base or all have been used
		if (availableWords.length === 0) { throw new Error('No words available');}
		const randomIndex = Math.floor(Math.random() * availableWords.length);
		return availableWords[randomIndex];
	}
}