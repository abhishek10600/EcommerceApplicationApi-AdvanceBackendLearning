import { User } from "@prisma/client";
import { UserResponseDTO } from "./auth.response.js";

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
