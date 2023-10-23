import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import "express-async-errors";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import bcrypt from "bcrypt";
import {
  authMiddleware,
  createTokenForUser,
  createUnsecuredUserInfo,
} from "../auth-utils";

const authController = Router();

authController.post(
  "/auth/local",
  authMiddleware,
  async (req, res) => {
    res.status(200).json([req.user, true]);
  }
);

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

    bcrypt.compare(bodyPassword, user.passwordHash).then((check) => {
      if (!check) {
        return res
          .status(401)
          .json({ message: "invalid credentials" });
      } else {
        const userInfo = createUnsecuredUserInfo(user);
        const token = createTokenForUser(user);

        return res.status(200).json({ userInfo, token });
      }
    });
  }
);

export { authController };
