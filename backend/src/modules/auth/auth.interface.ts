import { RefreshToken, Role, User } from "@prisma/client";
import { registerUserDTO } from "./auth.schema.js";

export interface IAuthRepository {
  getUserById(userId: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(data: {
    firstName: string;
    lastName?: string | null;
    email: string;
    password: string;
    phoneNumber: string;
    role: Role;
  }): Promise<User>;
  createRefreshToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken>;
  findRefreshToken(hashedRefreshToken: string): Promise<RefreshToken | null>;
  deleteRefreshTokenById(refreshTokenId: string): Promise<any>;
  deleteAllRefreshTokenByUserId(userId: string): Promise<any>;
}
