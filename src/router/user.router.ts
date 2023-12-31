import e, { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import "express-async-errors";
import { z } from "zod";
import { prisma } from "../../prisma/db.setup";
import {
  authMiddleware,
  checkPassword,
  encryptPassword,
} from "../auth-utils";

const userController = Router();

userController.post(
  "/users",
  validateRequest({
    body: z.object({
      email: z.string().email(),
      name: z.string(),
      password: z.string(),
    }),
  }),
  async (req, res, next) => {
    encryptPassword(req.body.password).then(async (hash) => {
      return await prisma.users
        .create({
          data: {
            email: req.body.email,
            name: req.body.name,
            passwordHash: hash,
          },
        })
        .then((user) => res.status(201).json(user))
        .catch((e) => {
          console.error(e);
          res.status(500).json({ message: "Username is taken" });
        })
        .finally(next);
    });
  }
);

userController.patch(
  "/users",
  authMiddleware,
  validateRequest({
    body: z.object({ email: z.string().email() }),
  }),
  async (req, res, next) => {
    if (req.user!.email === req.body.email) {
      return res.status(400).json({
        message:
          "Please change your email address to something different than your current email",
      });
    }

    return await prisma.users
      .update({
        where: {
          email: req.user?.email,
        },
        data: {
          email: req.body.email,
        },
      })
      .then((user) => res.status(201).json(user))
      .catch((e) => {
        console.error(e);
        res.status(500).json({ message: "Username is taken" });
      })
      .finally(next);
  }
);

export { userController };
