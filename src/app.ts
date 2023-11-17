import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import { Users } from "@prisma/client";
import { authController } from "./router/auth.router";
import { userController } from "./router/user.router";
import { equipmentController } from "./router/equipment.router";
import { rentalController } from "./router/rental.router";
import { savedController } from "./router/saved.router";

const app = express();
dotenv.config();

// Disable CORS for testing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PATCH, POST, PUT, DELETE"
  );
  res.header("Access-Control-Allow-Headers", [
    "Content-Type",
    "Authorization",
  ]);
  next();
});

app.options("/*", (_, res) => {
  res.sendStatus(200);
});

declare global {
  namespace Express {
    interface Request {
      user?: Users;
    }
  }

  namespace NodeJS {
    export interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
    }
  }
}

["DATABASE_URL", "JWT_SECRET"].forEach((key) => {
  if (process.env[key] === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(authController);
app.use(userController);
app.use(equipmentController);
app.use(rentalController);
app.use(savedController);

app.listen(3000, ()=>{
      console.log('server is running at port 3000')
    });