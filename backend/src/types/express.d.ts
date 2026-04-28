import { IJwtPayload } from "./index.ts";

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload;
    }
  }
}

export {};
