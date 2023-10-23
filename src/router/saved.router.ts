import e, { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import "express-async-errors";
import { z } from "zod";
import { prisma } from "../../prisma/db.setup";
import { authMiddleware } from "../auth-utils";
import { intParseableString as intParseableString } from "../zod/parseableString.schema";

const savedController = Router();

savedController.get("/saved/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  const saved = await prisma.savedForLater.findMany({
    where: {
      userEmail,
    },
  });
  res.json(saved);
});

savedController.post(
  "/saved",
  validateRequest({
    body: z.object({
      userEmail: z.string(),
      rentalId: z.number(),
    }),
  }),
  authMiddleware,
  async (req, res) => {
    const { userEmail, rentalId } = req.body;
    const saved = await prisma.savedForLater
      .create({
        data: {
          userEmail: userEmail,
          rentalId: rentalId,
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
  "/saved/:equipmentId",
  validateRequest({
    params: z.object({
      equipmentId: intParseableString,
    }),
  }),
  authMiddleware,
  async (req, res) => {
    await prisma.savedForLater
      .delete({
        where: {
          id: parseInt(req.params.equipmentId),
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
