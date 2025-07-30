"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNote = exports.deleteNote = exports.getNotes = exports.createNote = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Note_1 = require("../models/Note");
// ✅ Create Note
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    if (!(title === null || title === void 0 ? void 0 : title.trim())) {
        res.status(400).json({ error: "Title is required" });
        return;
    }
    try {
        const note = yield Note_1.Note.create({
            title,
            content: content || "",
            userId: req.userId,
        });
        res.status(201).json(note);
    }
    catch (err) {
        console.error("Error creating note:", err);
        res.status(500).json({ error: "Failed to create note" });
    }
});
exports.createNote = createNote;
// ✅ Get Notes
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield Note_1.Note.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    }
    catch (err) {
        console.error("Error fetching notes:", err);
        res.status(500).json({ error: "Failed to fetch notes" });
    }
});
exports.getNotes = getNotes;
// ✅ Delete Note
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(noteId)) {
        res.status(400).json({ error: "Invalid note ID" });
        return;
    }
    try {
        const deleted = yield Note_1.Note.findOneAndDelete({
            _id: noteId,
            userId: req.userId,
        });
        if (!deleted) {
            res.status(404).json({ error: "Note not found or unauthorized" });
            return;
        }
        res.json({ success: true });
    }
    catch (err) {
        console.error("Error deleting note:", err);
        res.status(500).json({ error: "Failed to delete note" });
    }
});
exports.deleteNote = deleteNote;
// ✅ Update Note
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const noteId = req.params.id;
    const { title, content } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(noteId)) {
        res.status(400).json({ error: "Invalid note ID" });
        return;
    }
    if (!(title === null || title === void 0 ? void 0 : title.trim())) {
        res.status(400).json({ error: "Title is required" });
        return;
    }
    try {
        const updatedNote = yield Note_1.Note.findOneAndUpdate({ _id: noteId, userId: req.userId }, { title, content: content || "" }, { new: true });
        if (!updatedNote) {
            res.status(404).json({ error: "Note not found or unauthorized" });
            return;
        }
        res.json(updatedNote);
    }
    catch (err) {
        console.error("Error updating note:", err);
        res.status(500).json({ error: "Failed to update note" });
    }
});
exports.updateNote = updateNote;
