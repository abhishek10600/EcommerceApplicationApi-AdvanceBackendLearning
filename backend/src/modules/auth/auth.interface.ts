import { Role, User } from "@prisma/client";
import { registerUserDTO } from "./auth.schema.js";

export interface IAuthRepository {
  getUserByEmail(email: string): Promise<User | null>;
  createUser(data: {
    firstName: string;
    lastName?: string | null;
    email: string;
    password: string;
    phoneNumber: string;
    role: Role;
  }): Promise<User>;
}
