import mongoose, { Document } from "mongoose";

export interface INote extends Document {
  title: string;
  description: string;
  date: Date;
  author:
    | mongoose.SchemaDefinitionProperty<
        | mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, INote>
        | undefined,
        INote
      >
    | undefined;
  time: string;
  status: "active" | "in-active";
  is_expire: boolean;
}

const NoteSchema = new mongoose.Schema<INote>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date },
    time: { type: String },
    status: {
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
    is_expire: { type: Boolean, default: false },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Note = mongoose.model<INote>("Note", NoteSchema);
