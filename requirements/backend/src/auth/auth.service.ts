import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import type { LoginResponse, SignupResponse } from '../../shared/auth.types';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;

  constructor(private readonly usersService: UsersService) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  // --------------------------------------------------
  // Signup
  // --------------------------------------------------
  async signup(email: string, password: string, username: string): Promise<SignupResponse> {
    const user = await this.usersService.getUser(email);

    if (user) {
      throw new ConflictException(`Email ${user.email} is already used.`);
    }

    const passwordHash = await this.hashPassword(password);

    const newUser = await this.usersService.createUser(username, email, passwordHash);
    return {
      message: `Account for ${newUser.nickname} successfully created.`,
      id: newUser.id,
      username: newUser.nickname,
      email:  newUser.email,
    };
  }

  // --------------------------------------------------
  // Login
  // --------------------------------------------------
  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.usersService.getUser(email);

    if (!user) {
      throw new UnauthorizedException('No user available');
    }

    const isValid = await this.verifyPassword(
      password,
      user.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Wrong pw');
    }

    // later: return JWT here
    return {
      message: `${user.nickname} has successfully logged in.`,
      id: user.id,
      username: user.nickname,
      email:  user.email,
    };
  }
}
