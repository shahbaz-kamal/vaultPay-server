import { Router } from "express";
import { NewsLetterController } from "./newsLetter.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { storeNewsLetterZodSchema } from "./newsLetter.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/store", validateRequest(storeNewsLetterZodSchema), NewsLetterController.storeNewsLetterSubscription);
router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), NewsLetterController.getNewsLetter);

export const NewsLetterRoute = router;
