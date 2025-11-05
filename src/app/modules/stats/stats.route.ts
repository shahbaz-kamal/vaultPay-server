import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = express.Router();


//For Admin
router.get("/user", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatsController.getUserStatsForAdmin);
router.get("/transaction", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatsController.getTransactionStatsForAdmin);

// FOr User


export const StatsRoutes=router