import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
    title: string;
    content?: string;
    userId: mongoose.Types.ObjectId;
}

const noteSchema = new Schema<INote>(
    {
        title: { type: String, required: true },
        content: { type: String, default: "" },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const Note = mongoose.model<INote>("Note", noteSchema);
