import { Router } from "express";
import { upgradeTenant } from "../controllers/tenantController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.post("/:slug/upgrade", upgradeTenant);

export default router;
