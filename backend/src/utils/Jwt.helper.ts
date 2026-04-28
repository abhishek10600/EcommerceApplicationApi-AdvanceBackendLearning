import jwt, { SignOptions } from "jsonwebtoken";
import { IJwtPayload } from "../types/index.js";
import {
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_SECRET,
} from "../config/env.config.js";

const accessTokenSecret = JWT_ACCESS_TOKEN_SECRET!;
const accessTokenExpiry = JWT_ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"];
const refreshTokenSecret = JWT_REFRESH_TOKEN_SECRET!;
const refreshTokenExpiry = JWT_REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"];

export const generateAccessToken = (user: IJwtPayload) => {
  return jwt.sign({ user }, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  });
};

export const generateRefreshToken = (user: IJwtPayload) => {
  return jwt.sign({ user }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessTokenSecret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshTokenSecret);
};
