
import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = express.Router();


//For Admin
router.get("/admin", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatsController.getStatsForAdmin);
router.get("/transaction", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatsController.getTransactionStatsForAdmin);

// FOr User
router.get("/user", checkAuth(Role.USER), StatsController.getStatsForUser);

export const StatsRoutes=router