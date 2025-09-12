import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

// Helper: check Free plan limit
const checkNoteLimit = async (tenantId: number) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { notes: true },
  });
  if (!tenant) throw new Error("Tenant not found");
  if (tenant.plan === "free" && tenant.notes.length >= 3) {
    return false;
  }
  return true;
};

// POST /notes
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const tenantId = req.user!.tenantId;
    const userId = req.user!.userId;

    if (!(await checkNoteLimit(tenantId))) {
      return res.status(403).json({ error: "Free plan limit reached. Upgrade to Pro." });
    }

    const note = await prisma.note.create({
      data: { title, content, tenantId, userId },
    });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /notes
export const getNotes = async (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;
  const notes = await prisma.note.findMany({ where: { tenantId } });
  res.json(notes);
};

// GET /notes/:id
export const getNoteById = async (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;
  const id = parseInt(req.params.id);
  const note = await prisma.note.findFirst({ where: { id, tenantId } });
  if (!note) return res.status(404).json({ error: "Note not found" });
  res.json(note);
};

// PUT /notes/:id
export const updateNote = async (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;
  const id = parseInt(req.params.id);
  const { title, content } = req.body;

  const note = await prisma.note.findFirst({ where: { id, tenantId } });
  if (!note) return res.status(404).json({ error: "Note not found" });

  const updated = await prisma.note.update({
    where: { id: note.id },
    data: { title, content },
  });
  res.json(updated);
};

// DELETE /notes/:id
export const deleteNote = async (req: Request, res: Response) => {
  const tenantId = req.user!.tenantId;
  const id = parseInt(req.params.id);

  const note = await prisma.note.findFirst({ where: { id, tenantId } });
  if (!note) return res.status(404).json({ error: "Note not found" });

  await prisma.note.delete({ where: { id: note.id } });
  res.json({ message: "Note deleted successfully" });
};
