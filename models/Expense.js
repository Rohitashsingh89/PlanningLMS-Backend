import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paidBy: { type: String, required: true },      // member subdoc _id as string
    participants: { type: [String], default: [] },  // array of member subdoc _id strings
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', ExpenseSchema);
export default Expense;
