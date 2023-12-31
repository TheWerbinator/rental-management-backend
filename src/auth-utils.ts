import { Users } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../prisma/db.setup";

export const encryptPassword = (password: string) => {
  return bcrypt.hash(password, 12);
};

export const checkPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
};

export const createUnsecuredUserInfo = (user: Users) => ({
  email: user.email,
  name: user.name,
  password: user.passwordHash,
});

export const createTokenForUser = (user: Users) => {
  return jwt.sign(
    createUnsecuredUserInfo(user),
    process.env.JWT_SECRET as Secret
  );
};

const jwtInfoSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  iat: z.number(),
});

const getDataFromAuthToken = (token?: string) => {
  if (!token) return null;
  try {
    return jwtInfoSchema.parse(
      jwt.verify(token, process.env.JWT_SECRET as Secret)
    );
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [, token] = req.headers.authorization?.split?.(" ") || [];
  token == undefined && console.log("token is undefined");
  const myJwtData = getDataFromAuthToken(token);
  myJwtData == null && console.log("myJwtData is null");
  if (!myJwtData) {
    console.log("Invalid token");
    return res.status(401).json({ message: "Invalid token", token });
  }
  const userFromJwt = await prisma.users.findFirst({
    where: {
      email: myJwtData.email,
    },
  });
  if (!userFromJwt) {
    return res.status(401).json({ message: "User Not found" });
  }

  (req as any).user = userFromJwt;
  next();
};
