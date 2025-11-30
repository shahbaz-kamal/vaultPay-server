import { Router } from "express";
import { ClientMessageController } from "./clientMessage.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { clientMessageZodSchema } from "./clientMessage.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/store", validateRequest(clientMessageZodSchema), ClientMessageController.storeClientMessage);
router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ClientMessageController.getClientMessage);
router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ClientMessageController.updateClientMessage);
export const ClientMessageRoute = router;
