import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/auth";
import { Note } from "../models/Note";

// ✅ Create Note
export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
    const { title, content } = req.body;

    if (!title?.trim()) {
        res.status(400).json({ error: "Title is required" });
        return;
    }

    try {
        const note = await Note.create({
            title,
            content: content || "",
            userId: req.userId,
        });

        res.status(201).json(note);
    } catch (err) {
        console.error("Error creating note:", err);
        res.status(500).json({ error: "Failed to create note" });
    }
};

// ✅ Get Notes
export const getNotes = async (req: AuthRequest, res: Response) => {
    try {
        const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (err) {
        console.error("Error fetching notes:", err);
        res.status(500).json({ error: "Failed to fetch notes" });
    }
};

// ✅ Delete Note
export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
    const noteId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        res.status(400).json({ error: "Invalid note ID" });
        return;
    }

    try {
        const deleted = await Note.findOneAndDelete({
            _id: noteId,
            userId: req.userId,
        });

        if (!deleted) {
            res.status(404).json({ error: "Note not found or unauthorized" });
            return;
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Error deleting note:", err);
        res.status(500).json({ error: "Failed to delete note" });
    }
};

// ✅ Update Note
export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
    const noteId = req.params.id;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        res.status(400).json({ error: "Invalid note ID" });
        return;
    }

    if (!title?.trim()) {
        res.status(400).json({ error: "Title is required" });
        return;
    }

    try {
        const updatedNote = await Note.findOneAndUpdate(
            { _id: noteId, userId: req.userId },
            { title, content: content || "" },
            { new: true }
        );

        if (!updatedNote) {
            res.status(404).json({ error: "Note not found or unauthorized" });
            return;
        }

        res.json(updatedNote);
    } catch (err) {
        console.error("Error updating note:", err);
        res.status(500).json({ error: "Failed to update note" });
    }
};
