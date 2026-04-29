import { IJwtPayload } from "../../types/index.js";
import { AppError } from "../../utils/AppError.js";
import {
  comparePassword,
  hashPassword,
  hashRefreshToken,
} from "../../utils/auth.helper.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/Jwt.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { toJwtPayload, toUserResponse } from "./auth.mapper.js";
import {
  loginUserDTO,
  logoutUserDTO,
  refreshTokenDTO,
  registerUserDTO,
} from "./auth.schema.js";

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

    const jwtPayload = toJwtPayload(newUser);

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await this.userRepo.createRefreshToken({
      token: hashedRefreshToken,
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      user: toUserResponse(newUser),
      accessToken,
      refreshToken,
    };
  }

  async loginUser(data: loginUserDTO) {
    const { email, password } = data;

    const existingUser = await this.userRepo.getUserByEmail(email);

    if (!existingUser) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordCorrect = await comparePassword(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      throw new AppError("Invalid credentials", 401);
    }

    const jwtPayload = toJwtPayload(existingUser);

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await this.userRepo.createRefreshToken({
      token: hashedRefreshToken,
      userId: existingUser.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      user: toUserResponse(existingUser),
      accessToken,
      refreshToken,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepo.getUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return toUserResponse(user);
  }

  async logout(data: logoutUserDTO) {
    const { refreshToken } = data;
    const hashedRefreshToken = hashRefreshToken(refreshToken);

    const existingRefreshToken =
      await this.userRepo.findRefreshToken(hashedRefreshToken);

    if (!existingRefreshToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    await this.userRepo.deleteRefreshTokenById(existingRefreshToken.id);

    return true;
  }

  async logoutAllDevices(userId: string) {
    await this.userRepo.deleteAllRefreshTokenByUserId(userId);

    return true;
  }

  async refreshToken(data: refreshTokenDTO) {
    const { refreshToken } = data;

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken) as IJwtPayload;
    } catch (error) {
      throw new AppError("Invalid or expired refresh token", 403);
    }

    const user = await this.userRepo.getUserById(decoded.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const hashedOldRefreshToken = hashRefreshToken(refreshToken);

    const existingRefreshToken = await this.userRepo.findRefreshToken(
      hashedOldRefreshToken,
    );

    if (!existingRefreshToken) {
      throw new AppError("Refresh token not found", 404);
    }

    await this.userRepo.deleteRefreshTokenById(existingRefreshToken.id);

    const newJwtPayload = toJwtPayload(user);

    const newAccessToken = generateAccessToken(newJwtPayload);
    const newRefreshToken = generateRefreshToken(newJwtPayload);

    const hashedNewRefreshToken = hashRefreshToken(newRefreshToken);

    await this.userRepo.createRefreshToken({
      token: hashedNewRefreshToken,
      userId: decoded.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
