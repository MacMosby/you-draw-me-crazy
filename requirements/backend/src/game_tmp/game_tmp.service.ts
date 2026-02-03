import { Injectable } from "@nestjs/common";

//copy paste for testing
@Injectable()
export class GameService {
  /**
   * gameId → userIds
   */
  private games = new Map<string, number[]>();

  createGame(gameId: string, userIds: number[]) {
    this.games.set(gameId, userIds);
    console.log(`Game ${gameId} created with users:`, userIds);
  }

  getUsersInGame(gameId: string): number[] {
    return this.games.get(gameId) ?? [];
  }

  removeGame(gameId: string) {
    this.games.delete(gameId);
  }

  getAllGames() {
    return Array.from(this.games.entries());
  }
}