import express from "express";
const superAdminRoute = express.Router();

import { logSuperAdmin } from "../controllers/superAdmin.js";
import { sendAnAdminToken } from "../controllers/superAdmin.js";
import { authUser } from "../middlewares/authuser.js";

superAdminRoute.post("/login", logSuperAdmin);
superAdminRoute.post("/send-token", authUser, sendAnAdminToken);

export default superAdminRoute;
