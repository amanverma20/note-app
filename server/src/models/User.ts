import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: String,
        dob: String,
        email: { type: String, unique: true },
        googleId: String,
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
