import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

// POST /tenants/:slug/upgrade
export const upgradeTenant = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const user = req.user!;

    // Only Admin can upgrade
    if (user.role !== "Admin") {
      return res.status(403).json({ error: "Only Admin can upgrade subscription" });
    }

    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    // Upgrade plan
    const updated = await prisma.tenant.update({
      where: { id: tenant.id },
      data: { plan: "pro" },
    });

    res.json({ message: `${tenant.name} upgraded to Pro`, tenant: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
