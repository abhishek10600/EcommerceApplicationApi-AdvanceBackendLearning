import { AppError } from "../../utils/AppError.js";
import { hashPassword } from "../../utils/auth.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { toUserResponse } from "./auth.mapper.js";
import { registerUserDTO } from "./auth.schema.js";

export class AuthService {
  constructor(private userRepo: IAuthRepository) {}

  async registerUserService(data: registerUserDTO) {
    const { firstName, lastName, email, password, phoneNumber, role } = data;

    const existingUser = await this.userRepo.getUserByEmail(email);

    if (existingUser) {
      throw new AppError("User with this email already exists", 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.userRepo.createUser({
      firstName,
      lastName: lastName ?? null,
      email,
      password: hashedPassword,
      phoneNumber,
      role: role ?? "USER",
    });

    return {
      user: toUserResponse(newUser),
    };
  }
}
