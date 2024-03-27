import express from "express";
const transactionRoute = express.Router();

import { getAllTheTransactions } from "../controllers/transactions.js";
import { authUser } from "../middlewares/authuser.js";

transactionRoute.get("/get-all-transactions", authUser, getAllTheTransactions);

export default transactionRoute;
