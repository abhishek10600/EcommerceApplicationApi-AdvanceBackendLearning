import { Role } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { IAuthRepository } from "./auth.interface.js";

export class AuthRepository implements IAuthRepository {
  async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
  async createUser(data: {
    firstName: string;
    lastName?: string | null;
    email: string;
    password: string;
    phoneNumber: string;
    role: Role;
  }) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async createRefreshToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }) {
    const token = await prisma.refreshToken.create({
      data,
    });

    return token;
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  }

  async findRefreshToken(hashedRefreshToken: string) {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        token: hashedRefreshToken,
      },
    });

    return refreshToken;
  }

  async deleteRefreshTokenById(refreshTokenId: string) {
    await prisma.refreshToken.delete({
      where: {
        id: refreshTokenId,
      },
    });
  }

  async deleteAllRefreshTokenByUserId(userId: string) {
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}
