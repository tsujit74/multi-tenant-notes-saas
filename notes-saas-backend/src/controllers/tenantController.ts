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

// POST /tenants/:slug/downgrade
export const downgradeTenant = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const user = req.user!;

    // Only Admin can downgrade
    if (user.role !== "Admin") {
      return res.status(403).json({ error: "Only Admin can downgrade subscription" });
    }

    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    // Downgrade plan
    const updated = await prisma.tenant.update({
      where: { id: tenant.id },
      data: { plan: "free" },
    });

    res.json({ message: `${tenant.name} downgraded to Free`, tenant: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export async function getTenantDetails(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Only admin can access tenant details
    if (user.role !== "Admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId },
      include: { users: true },
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    return res.json({
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
      },
      users: tenant.users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
      })),
    });
  } catch (err) {
    console.error("getTenantDetails error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}