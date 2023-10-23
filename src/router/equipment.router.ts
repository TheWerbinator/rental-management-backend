import { Router } from "express";
import { prisma } from "../../prisma/db.setup";
import "express-async-errors";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { intParseableString as intParseableString } from "../zod/parseableString.schema";
import { authMiddleware } from "../auth-utils";

const equipmentController = Router();

equipmentController.get("/equipment", async (req, res) => {
  const equipment = await prisma.equipment.findMany();
  return res.json(equipment);
});

equipmentController.post(
  "/equipment",
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
    const equipment = await prisma.equipment
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

    if (!equipment) {
      return res
        .status(500)
        .json({ message: "equipment not created" });
    }
    return res.json(equipment);
  }
);

equipmentController.patch(
  "/equipment/:equipmentId",
  validateRequest({
    body: z
      .object({
        name: z.string(),
        userEmail: z.string().email(),
      })
      .partial(),
    params: z.object({
      equipmentId: intParseableString,
    }),
  }),
  authMiddleware,
  async (req, res, next) => {
    const equipmentId = parseInt(req.params.equipmentId);

    const doesequipmentExist = await prisma.equipment
      .findFirstOrThrow({
        where: {
          id: equipmentId,
        },
      })
      .then(() => true)
      .catch(() => false);

    if (!doesequipmentExist) {
      return res.status(404).json({ message: "equipment not found" });
    }

    return await prisma.equipment
      .update({
        where: {
          id: equipmentId,
        },
        data: {
          ...req.body,
        },
      })
      .then((equipment) => res.status(201).json({ ...equipment }))
      .catch(() =>
        res.status(500).json({ message: "equipment not updated" })
      );
  }
);

equipmentController.delete(
  "/equipment/:equipmentId",
  validateRequest({
    params: z.object({
      equipmentId: intParseableString,
    }),
  }),
  async (req, res) => {
    await prisma.equipment
      .delete({
        where: {
          id: parseInt(req.params.equipmentId),
        },
      })
      .then(() =>
        res.status(201).json({ message: "equipment deleted" })
      )
      .catch(() =>
        res.status(500).json({ message: "equipment not deleted" })
      );
  }
);

export { equipmentController };
