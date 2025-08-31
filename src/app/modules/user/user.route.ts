import { validateRequest } from "./../../utils/validateRequest";
import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get("/all-users", UserControllers.getAllUser);

export const UserRoutes = router;
