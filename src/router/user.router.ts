import e, { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import "express-async-errors";
import { z } from "zod";
import { prisma } from "../../prisma/db.setup";
import { authMiddleware, checkPassword } from "../auth-utils";

const userController = Router();

// userController.get("/users/:userEmail", async (req, res) => {
//   let pass = req.query.pass;
  
//   const { userEmail } = req.params;
//   const user = await prisma.users.findFirst({
//     where: {
//       email: userEmail,
//     },
//   })
  
//   if (typeof pass == 'string' && user){
//     await checkPassword(pass, user.passwordHash).then((check) => {
//       if (check === true){
//         res.json(user);
//       } else res.status(404).json({ message: "Password didn't check out" })
//     })
//   } else res.status(404).json({ message: "Pass param or fetched user didn't work" })
// });

// userController.get("/users", async (req, res) => {
//   const users = await prisma.users.findMany({});
//   res.json(users);
// });

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
