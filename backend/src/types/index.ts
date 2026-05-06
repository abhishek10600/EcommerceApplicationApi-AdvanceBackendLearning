import { Prisma } from "@prisma/client";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;
