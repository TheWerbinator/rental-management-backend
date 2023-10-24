import e, { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import "express-async-errors";
import { z } from "zod";
import { prisma } from "../../prisma/db.setup";
import { authMiddleware } from "../auth-utils";
import { intParseableString as intParseableString } from "../zod/parseableString.schema";

const rentalController = Router();

rentalController.get(
  "/rentals/:userEmail",
  authMiddleware,
  async (req, res) => {
    const { userEmail } = req.params;
    const rented = await prisma.activeRentals.findMany({
      where: {
        userEmail,
      },
    });
    res.json(rented);
  }
);

rentalController.post(
  "/rentals",
  validateRequest({
    body: z.object({
      userEmail: z.string(),
      rentalId: z.number(),
    }),
  }),
  authMiddleware,
  async (req, res) => {
    const { userEmail, rentalId } = req.body;
    const rented = await prisma.activeRentals
      .create({
        data: {
          userEmail: userEmail,
          rentalId: rentalId,
        },
      })
      .catch((err) => console.error(err));

    if (!rented) {
      return res
        .status(500)
        .json({ message: "equipment not rented" });
    }
    return res.json(rented);
  }
);

rentalController.delete(
  "/rentals/:rentalId",
  validateRequest({
    params: z.object({
      rentalId: intParseableString,
    }),
  }),
  authMiddleware,
  async (req, res) => {
    const rentedItem = await prisma.activeRentals.findFirstOrThrow({
      where: {
        rentalId: parseInt(req.params.rentalId),
      },
    });
    await prisma.activeRentals
      .delete({
        where: {
          id: rentedItem.id,
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
