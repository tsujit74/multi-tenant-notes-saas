"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new prisma_1.PrismaClient();
async function main() {
    // Tenants
    const acme = await prisma.tenant.upsert({
        where: { slug: 'acme' },
        update: {},
        create: { name: 'Acme Corporation', slug: 'acme', plan: 'free' },
    });
    const globex = await prisma.tenant.upsert({
        where: { slug: 'globex' },
        update: {},
        create: { name: 'Globex Corporation', slug: 'globex', plan: 'free' },
    });
    const passwordHash = await bcryptjs_1.default.hash('password', 10);
    // Users
    const users = [
        { email: 'admin@acme.test', role: 'Admin', tenantId: acme.id },
        { email: 'user@acme.test', role: 'Member', tenantId: acme.id },
        { email: 'admin@globex.test', role: 'Admin', tenantId: globex.id },
        { email: 'user@globex.test', role: 'Member', tenantId: globex.id },
    ];
    for (const u of users) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: { role: u.role, tenantId: u.tenantId, passwordHash },
            create: { ...u, passwordHash },
        });
    }
    console.log('Seed finished');
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
