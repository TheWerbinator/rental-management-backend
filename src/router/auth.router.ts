import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import "express-async-errors";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import bcrypt from "bcrypt";
import {
  createTokenForUser,
  createUnsecuredUserInfo,
} from "../auth-utils";

const authController = Router();

authController.post(
  "/auth/login",
  validateRequest({
    body: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  }),
  async (
    { body: { email: bodyEmail, password: bodyPassword } },
    res
  ) => {
    const user = await prisma.users.findFirst({
      where: {
        email: bodyEmail,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const isPasswordCorrect = bcrypt.compare(
      bodyPassword,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const userInfo = createUnsecuredUserInfo(user);
    const token = createTokenForUser(user);

    return res.status(200).json({ token, userInfo });
  }
);

export { authController };
