import { Router } from "express";
import { NewsLetterController } from "./newsLetter.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { storeNewsLetterZodSchema } from "./newsLetter.validation";

const router = Router();

router.post("/store", validateRequest(storeNewsLetterZodSchema), NewsLetterController.storeNewsLetterSubscription);

export const NewsLetterRoute = router;
