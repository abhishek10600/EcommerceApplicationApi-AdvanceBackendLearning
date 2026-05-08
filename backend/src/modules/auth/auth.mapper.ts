import { User } from "@prisma/client";
import { UserResponseDTO } from "./auth.response.js";
import { IJwtPayload } from "../../types/index.js";

export const toUserResponse = (user: User): UserResponseDTO => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const toJwtPayload = (user: User): IJwtPayload => {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
