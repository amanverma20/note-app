import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import userRoutes from "./routes/userRoutes";
dotenv.config();

const app = express();

// Allow multiple origins for dev and production
const allowedOrigins = [
  'https://client-beryl-ten.vercel.app',
  'http://localhost:5173',
  'https://highway-delite-sepia.vercel.app',
  'https://client-mtqlhligo-aman-vermas-projects-b75b7628.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches Vercel pattern
    if (allowedOrigins.includes(origin) || 
        origin.match(/^https:\/\/.*-aman-vermas-projects-b75b7628\.vercel\.app$/)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // if you're using cookies/auth headers
}));


// app.use(cors({
//     origin: "https://highway-delite-sepia.vercel.app",
//     credentials: true,
// }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/user", userRoutes)

mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => console.error("DB Error", err));
