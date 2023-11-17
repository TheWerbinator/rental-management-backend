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

export { equipmentController };
