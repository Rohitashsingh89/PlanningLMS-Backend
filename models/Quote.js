import { Schema, model } from 'mongoose';

const QuoteSchema = new Schema(
  {
    text: { type: String, required: true },
    author: { type: String },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

QuoteSchema.index({ text: 'text', author: 1 });

export const Quote = model('Quote', QuoteSchema);
