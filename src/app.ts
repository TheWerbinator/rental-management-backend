import express from "express";
import "express-async-errors";
import https from 'https';
import fs from 'fs';
import helmet from "helmet";
import session from 'express-session';
import dotenv from "dotenv";
import { Users } from "@prisma/client";
import { error } from "console";
import { authController } from "./router/auth.router";
import { userController } from "./router/user.router";
import { equipmentController } from "./router/equipment.router";
import { rentalController } from "./router/rental.router";
import { savedController } from "./router/saved.router";

const app = express();
dotenv.config();
app.disable('x-powered-by');
// const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour 
// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   name: 'session',
//   secret: 's3Cur3',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: true,
//     httpOnly: true,
//     domain: 'example.com',
//     path: 'foo/bar',
//     expires: expiryDate
//   }
// }))
// app.use(helmet({
//   crossOriginResourcePolicy: false,
//   crossOriginOpenerPolicy: false
// }))
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

// app.options("/*", (_, res) => {
//   res.sendStatus(200);
// });

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

// https
//   .createServer(app)
//   .listen(3000, ()=>{
//     console.log('server is running at port 3000')
//   });

app.listen(3000, ()=>{
      console.log('server is running at port 3000')
    });