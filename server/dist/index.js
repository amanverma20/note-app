"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Allow multiple origins for dev and production
const allowedOrigins = [
    'http://localhost:5173',
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // if you're using cookies/auth headers
}));
// app.use(cors({
//     origin: "https://highway-delite-sepia.vercel.app",
//     credentials: true,
// }));
app.use(express_1.default.json());
const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes_1.default);
app.use("/api/notes", noteRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})
    .catch((err) => console.error("DB Error", err));
