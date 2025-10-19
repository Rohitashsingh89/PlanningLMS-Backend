import { Schema, model } from 'mongoose';

const VaultItemSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // markdown/snippets
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

VaultItemSchema.index({ title: 'text' });
VaultItemSchema.index({ content: 'text' });  
VaultItemSchema.index({ tags: 1 });  

export const VaultItem = model('VaultItem', VaultItemSchema);
