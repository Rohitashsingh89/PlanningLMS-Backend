import { validationResult } from 'express-validator';
import Group from '../models/Group.js';
import Expense from '../models/Expense.js';

export const createExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { groupId } = req.params;
    const { title, amount, paidBy, participants } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const memberIds = new Set((group.members || []).map((m) => String(m._id)));
    if (!memberIds.has(String(paidBy))) return res.status(400).json({ message: 'paidBy not in group' });
    for (const pid of participants || []) {
      if (!memberIds.has(String(pid))) return res.status(400).json({ message: `participant ${pid} not in group` });
    }

    const expense = await Expense.create({
      group: group._id,
      title: String(title || '').trim(),
      amount: Number(amount),
      paidBy: String(paidBy),
      participants: (participants || []).map(String),
    });

    return res.status(201).json({ expense });
  } catch (e) { next(e); }
};

export const listExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId }).sort({ createdAt: -1 });
    return res.json({ expenses });
  } catch (e) { next(e); }
};

export const updateExpense = async (req, res, next) => {
  try {
    const { expenseId, groupId } = req.params;
    const patch = {};
    if (req.body.title !== undefined) patch.title = String(req.body.title).trim();
    if (req.body.amount !== undefined) patch.amount = Number(req.body.amount);
    if (req.body.paidBy !== undefined) patch.paidBy = String(req.body.paidBy);
    if (req.body.participants !== undefined) patch.participants = (req.body.participants || []).map(String);

    // Optional: revalidate members
    if (patch.paidBy || patch.participants) {
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: 'Group not found' });
      const memberIds = new Set(group.members.map((m) => String(m._id)));
      if (patch.paidBy && !memberIds.has(patch.paidBy)) return res.status(400).json({ message: 'paidBy not in group' });
      if (patch.participants) {
        for (const pid of patch.participants) {
          if (!memberIds.has(pid)) return res.status(400).json({ message: `participant ${pid} not in group` });
        }
      }
    }

    const exp = await Expense.findOneAndUpdate(
      { _id: expenseId, group: groupId },
      { $set: patch },
      { new: true }
    );
    if (!exp) return res.status(404).json({ message: 'Expense not found' });
    return res.json({ expense: exp });
  } catch (e) { next(e); }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const { expenseId, groupId } = req.params;
    const del = await Expense.findOneAndDelete({ _id: expenseId, group: groupId });
    if (!del) return res.status(404).json({ message: 'Expense not found' });
    return res.json({ ok: true });
  } catch (e) { next(e); }
};
