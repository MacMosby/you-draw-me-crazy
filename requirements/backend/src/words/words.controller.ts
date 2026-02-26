//for testing only
import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { WordsService } from './words.service';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  add(@Body('text') text: string) {
    return this.wordsService.addWord(text);
  }

  @Get()
  getAll() {
    return this.wordsService.getAllWords();
  }

  @Get('random')
  getRandom() {
    return this.wordsService.getRandomWord();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wordsService.removeWord(Number(id));
  }
}