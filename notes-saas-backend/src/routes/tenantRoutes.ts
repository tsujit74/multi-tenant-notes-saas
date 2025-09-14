import { Router } from "express";
import { downgradeTenant, getTenantDetails, upgradeTenant } from "../controllers/tenantController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/me",getTenantDetails)
router.post("/:slug/upgrade", upgradeTenant);
router.post("/:slug/downgrade",downgradeTenant);

export default router;
