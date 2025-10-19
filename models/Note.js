import { Schema, model } from 'mongoose';

const NoteSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // markdown
    category: { type: String }
  },
  { timestamps: true }
);

NoteSchema.index({ title: 'text', content: 'text', category: 1 });

export const Note = model('Note', NoteSchema);
