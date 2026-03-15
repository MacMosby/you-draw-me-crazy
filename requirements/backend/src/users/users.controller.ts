import { Controller, Get, Post, Body, Param, ParseIntPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { DatabaseService } from "../database/database.service";
import { User } from "@prisma/client"
import { ProfilePagePayload } from "src/websocket/dtos/ws.payloads";

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly databaseService: DatabaseService,
	) {}

	@Post('create')
	createUser(
		@Body('nickname') nickname: string,
		@Body('email') email: string,
		@Body('password') password: string,
	) {
		return this.usersService.createUser(nickname, email, password);
	}

	@Get('email/:email')
	getUser(@Param('email') email: string) {
		return this.usersService.getUser(email);
	}

	@Get('id/:id')
	getUserById(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.getUserById(id);
	}

	@Get('nickname/:nickname')
	getUserByNickname(@Param('nickname') nickname: string) {
		return this.usersService.getUserByNickname(nickname);
	}

	@Post('me')
	async getUserProfile(@Body("userId", ParseIntPipe) userId: number) {
		console.log(`Received request for user profile with userId: ${userId}`);
		console.log(`User profile data:`, this.usersService.getUserById(userId));
		const user: User | null = await this.usersService.getUserById(userId);
		if (!user) {
			throw new Error("User not found");
		}
		const friendsNicknames: string[] = await this.usersService.getFriendsNicknames(user.friends);
		console.log(`[getUserProfile] User with ID ${userId} has friends with nicknames: ${friendsNicknames}`);
		const profile: ProfilePagePayload = {
			id: user.id,
			nickname: user.nickname,
			email: user.email,
			friends: friendsNicknames,
		}
		return profile;
	}

	@Post("me/friends/remove")
	async removeFriendFromProfile(
		@Body("userId", ParseIntPipe) userId: number,
		@Body("friendNickname") friendNickname: string,
		) {
		console.log(
			`[removeFriendFromProfile] userId=${userId}, friendNickname=${friendNickname}`,
		);
		const friendId: number = await this.usersService.getUserByNickname(friendNickname).then(friend => friend?.id ?? -1);
		if (friendId === -1) {
			console.log(`[removeFriendFromProfile] Friend with nickname ${friendNickname} not found`);
			return { success: false, message: "Friend not found" };
		}

		await this.usersService.removeFriend(userId, friendId);

		return { success: true };
}
}
