import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
// router.post("/get-all-users",A)

export const AuthRoutes = router;
