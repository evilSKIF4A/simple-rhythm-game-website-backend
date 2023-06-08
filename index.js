import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { registerValidation, loginValidation } from "./validations/auth.js";

import * as UserController from "./controllers/UserController.js";
import * as CoinController from "./controllers/CoinController.js";

import checkAuth from "./utils/checkAuth.js";

mongoose
  .connect(process.env.URL_DB)
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => {
    console.log("DB Error", err);
  });

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/user/coins/:recordId", checkAuth, CoinController.getCoins);
app.post("/user/coins/:recordId/:total", checkAuth, CoinController.setCoins);

app.get("/users", UserController.getUsers);

app.listen(process.env.PORT || 7777, (err) => {
  if (err) return console.log(err);
  console.log("Server OK");
});
