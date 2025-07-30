"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const noteController_1 = require("../controllers/noteController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/", auth_1.requireAuth, noteController_1.createNote);
router.get("/", auth_1.requireAuth, noteController_1.getNotes);
router.put("/:id", auth_1.requireAuth, noteController_1.updateNote);
router.delete("/:id", auth_1.requireAuth, noteController_1.deleteNote);
exports.default = router;
