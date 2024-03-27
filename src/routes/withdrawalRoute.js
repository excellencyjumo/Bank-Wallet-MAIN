import express from "express";
const withdrawalsRoute = express.Router();

import { withdrawCash } from "../controllers/withdrawals.js";
import { getAWithdrawal } from "../controllers/withdrawals.js";
import { getWithdrawalOnAnAccount } from "../controllers/withdrawals.js";
import { authUser } from "../middlewares/authuser.js";

withdrawalsRoute.post("/withdraw-cash", authUser, withdrawCash);
withdrawalsRoute.get("/get-withdrawal", authUser, getAWithdrawal);
withdrawalsRoute.get(
  "/get-all-withdrawals",
  authUser,
  getWithdrawalOnAnAccount
);

export default withdrawalsRoute;
