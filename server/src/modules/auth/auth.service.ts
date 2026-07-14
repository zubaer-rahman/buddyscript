import bcrypt from "bcryptjs";
import jwt, { JwtPayload, type SignOptions } from "jsonwebtoken";
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import config from "../../config/index.js";
import httpStatus from "http-status";
import { IUserLoginPayload, IUserRegisterPayload } from "./auth.interface.js";
import { jwtUtils } from "../../utils/jwt.js";

const jwtAccessSecret = config.jwt_access_secret as string;
const jwtRefreshSecret = config.jwt_refresh_secret as string;
const jwtAccessExpiresIn = config.jwt_access_expires_in;
const jwtRefreshExpiresIn = config.jwt_refresh_expires_in;

const register = async (payload: IUserRegisterPayload) => {
  const { email, password, firstName, lastName } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A user with this email already exists",
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds) || 12,
  );

  const createdUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: createdUser.id, email: createdUser.email },
    omit: {
      password: true,
    },
  });
  const jwtPayload = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    jwtAccessSecret,
    jwtAccessExpiresIn as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    jwtRefreshSecret,
    jwtRefreshExpiresIn as SignOptions,
  );

  return { accessToken, refreshToken, user };
};

const login = async (payload: IUserLoginPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user || !(await bcrypt.compare(payload.password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const jwtPayload = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    jwtAccessSecret,
    jwtAccessExpiresIn as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    jwtRefreshSecret,
    jwtRefreshExpiresIn as SignOptions,
  );

  const { password, ...userWithoutPassword } = user;

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};

const refreshToken = async (refreshToken: string) => {
  try {
    const decoded = jwtUtils.verifyToken(refreshToken, jwtRefreshSecret);
    if (!decoded.success || !decoded.data) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Invalid or expired refresh token",
      );
    }
    const { id, email } = decoded.data as JwtPayload;
    const user = await prisma.user.findUniqueOrThrow({
      where: { id, email },
    });

    const jwtPayload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const newAccessToken = jwtUtils.createToken(
      jwtPayload,
      jwtAccessSecret,
      jwtAccessExpiresIn as SignOptions,
    );

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired refresh token",
    );
  }
};

export const AuthService = {
  register,
  login,
  refreshToken,
};
