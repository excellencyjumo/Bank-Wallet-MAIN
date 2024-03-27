import express from "express";
const transferRoute = express.Router();

import { transferToAnAccount } from "../controllers/transfers.js";
import { getATransfer } from "../controllers/transfers.js";
import { getTransfersOnAnAccount } from "../controllers/transfers.js";
import { authUser } from "../middlewares/authuser.js";

transferRoute.post("/transfer-to-account", authUser, transferToAnAccount);
transferRoute.get("/transfer-on-specific-id", authUser, getATransfer);
transferRoute.get("/transfers-on-account", authUser, getTransfersOnAnAccount);

export default transferRoute;
