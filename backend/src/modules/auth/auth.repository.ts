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
}
