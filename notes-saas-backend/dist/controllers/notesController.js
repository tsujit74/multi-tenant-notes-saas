"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.getNoteById = exports.getNotes = exports.createNote = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
// Helper: check Free plan limit
const checkNoteLimit = async (tenantId) => {
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: { notes: true },
    });
    if (!tenant)
        throw new Error("Tenant not found");
    if (tenant.plan === "free" && tenant.notes.length >= 3) {
        return false;
    }
    return true;
};
// POST /notes
const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const tenantId = req.user.tenantId;
        const userId = req.user.userId;
        if (!(await checkNoteLimit(tenantId))) {
            return res.status(403).json({ error: "Free plan limit reached. Upgrade to Pro." });
        }
        const note = await prisma.note.create({
            data: { title, content, tenantId, userId },
        });
        res.json(note);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.createNote = createNote;
// GET /notes
const getNotes = async (req, res) => {
    const tenantId = req.user.tenantId;
    const notes = await prisma.note.findMany({ where: { tenantId } });
    res.json(notes);
};
exports.getNotes = getNotes;
// GET /notes/:id
const getNoteById = async (req, res) => {
    const tenantId = req.user.tenantId;
    const id = parseInt(req.params.id);
    const note = await prisma.note.findFirst({ where: { id, tenantId } });
    if (!note)
        return res.status(404).json({ error: "Note not found" });
    res.json(note);
};
exports.getNoteById = getNoteById;
// PUT /notes/:id
const updateNote = async (req, res) => {
    const tenantId = req.user.tenantId;
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    const note = await prisma.note.findFirst({ where: { id, tenantId } });
    if (!note)
        return res.status(404).json({ error: "Note not found" });
    const updated = await prisma.note.update({
        where: { id: note.id },
        data: { title, content },
    });
    res.json(updated);
};
exports.updateNote = updateNote;
// DELETE /notes/:id
const deleteNote = async (req, res) => {
    const tenantId = req.user.tenantId;
    const id = parseInt(req.params.id);
    const note = await prisma.note.findFirst({ where: { id, tenantId } });
    if (!note)
        return res.status(404).json({ error: "Note not found" });
    await prisma.note.delete({ where: { id: note.id } });
    res.json({ message: "Note deleted successfully" });
};
exports.deleteNote = deleteNote;
