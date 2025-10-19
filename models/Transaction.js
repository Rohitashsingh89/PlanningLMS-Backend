import { Schema, model } from 'mongoose';

const TransactionSchema = new Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

TransactionSchema.index({ date: -1 });
TransactionSchema.index({ description: 'text' });
TransactionSchema.index({ tags: 1 });  

export const Transaction = model('Transaction', TransactionSchema);
