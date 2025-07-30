import express from "express";
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/noteController";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router.post("/", requireAuth, createNote);
router.get("/", requireAuth, getNotes);
router.put("/:id", requireAuth, updateNote);
router.delete("/:id", requireAuth, deleteNote);

export default router;
