import e, { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import "express-async-errors";
import { z } from "zod";
import { prisma } from "../../prisma/db.setup";
import { authMiddleware } from "../auth-utils";
import { intParseableString as intParseableString } from "../zod/parseableString.schema";

const rentalController = Router();

rentalController.get("/rentals/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  const rented = await prisma.equipment.findMany({
    where: {
      userEmail,
    },
  });
  res.json(rented);
});

rentalController.post(
  "/rentals",
  validateRequest({
    body: z.object({
      name: z.string(),
      description: z.string(),
      image: z.string(),
      isRented: z.boolean(),
    }),
  }),
  authMiddleware,
  async (req, res) => {
    const { name, description, image, isRented } = req.body;
    const rented = await prisma.equipment
      .create({
        data: {
          name,
          description,
          image,
          isRented,
          userEmail: req.user!.email,
        },
      })
      .catch(() => null);

    if (!rented) {
      return res
        .status(500)
        .json({ message: "equipment not created" });
    }
    return res.json(rented);
  }
);

rentalController.delete(
  "/rentals/:equipmentId",
  validateRequest({
    params: z.object({
      equipmentId: intParseableString,
    }),
  }),
  authMiddleware,
  async (req, res) => {
    await prisma.equipment
      .delete({
        where: {
          id: parseInt(req.params.equipmentId),
        },
      })
      .then(() =>
        res.status(201).json({ message: "rental completed" })
      )
      .catch(() =>
        res.status(500).json({ message: "rental not deleted" })
      );
  }
);

export { rentalController };
