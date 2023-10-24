import e, { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import "express-async-errors";
import { z } from "zod";
import { prisma } from "../../prisma/db.setup";
import { authMiddleware } from "../auth-utils";
import { intParseableString as intParseableString } from "../zod/parseableString.schema";

const savedController = Router();

savedController.get(
  "/saved/:userEmail",
  authMiddleware,
  async (req, res) => {
    const { userEmail } = req.params;
    const saved = await prisma.savedForLater.findMany({
      where: {
        userEmail,
      },
    });
    res.json(saved);
  }
);

savedController.post(
  "/saved/:userEmail",
  validateRequest({
    body: z.object({
      userEmail: z.string(),
      savedId: z.number(),
    }),
  }),
  authMiddleware,
  async (req, res) => {
    const { userEmail, savedId } = req.body;
    const saved = await prisma.savedForLater
      .create({
        data: {
          userEmail: userEmail,
          savedId: savedId,
        },
      })
      .catch(() => null);

    if (!saved) {
      return res.status(500).json({ message: "equipment not saved" });
    }
    return res.json(saved);
  }
);

savedController.delete(
  "/saved/:savedId",
  authMiddleware,
  async (req, res) => {
    const savedItem = await prisma.savedForLater.findFirstOrThrow({
      where: {
        savedId: parseInt(req.params.savedId),
      },
    });
    await prisma.savedForLater
      .delete({
        where: {
          id: savedItem.id,
        },
      })
      .then(() =>
        res
          .status(201)
          .json({ message: "Equipment removed from Saved for Later" })
      )
      .catch(() =>
        res.status(500).json({ message: "Equipment not removed" })
      );
  }
);

export { savedController };
