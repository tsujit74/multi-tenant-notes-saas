"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downgradeTenant = exports.upgradeTenant = void 0;
exports.getTenantDetails = getTenantDetails;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// POST /tenants/:slug/upgrade
const upgradeTenant = async (req, res) => {
    try {
        const { slug } = req.params;
        const user = req.user;
        // Only Admin can upgrade
        if (user.role !== "Admin") {
            return res.status(403).json({ error: "Only Admin can upgrade subscription" });
        }
        const tenant = await prisma.tenant.findUnique({ where: { slug } });
        if (!tenant)
            return res.status(404).json({ error: "Tenant not found" });
        // Upgrade plan
        const updated = await prisma.tenant.update({
            where: { id: tenant.id },
            data: { plan: "pro" },
        });
        res.json({ message: `${tenant.name} upgraded to Pro`, tenant: updated });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.upgradeTenant = upgradeTenant;
const downgradeTenant = async (req, res) => {
    try {
        const { slug } = req.params;
        const user = req.user;
        // Only Admin can downgrade
        if (user.role !== "Admin") {
            return res.status(403).json({ error: "Only Admin can downgrade subscription" });
        }
        const tenant = await prisma.tenant.findUnique({ where: { slug } });
        if (!tenant)
            return res.status(404).json({ error: "Tenant not found" });
        // Downgrade plan
        const updated = await prisma.tenant.update({
            where: { id: tenant.id },
            data: { plan: "free" },
        });
        res.json({ message: `${tenant.name} downgraded to Free`, tenant: updated });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.downgradeTenant = downgradeTenant;
async function getTenantDetails(req, res) {
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
    }
    catch (err) {
        console.error("getTenantDetails error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
