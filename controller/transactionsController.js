import { Transaction } from '../models/Transaction.js';
import { normTags, like } from './utils.js';

export const list = async (req, res) => {
  const { from, to, tag, q } = req.query;
  const where = {};
  if (from || to) {
    where.date = {};
    if (from) where.date.$gte = new Date(String(from));
    if (to) where.date.$lte = new Date(String(to));
  }
  if (tag) where.tags = { $in: [String(tag)] };
  if (q) where.description = like(q);

  const txs = await Transaction.find(where).sort({ date: -1 }).lean();
  res.json(txs);
};

export const create = async (req, res) => {
  const { amount, date, description, tags } = req.body;
  const tx = await Transaction.create({
    amount: Number(amount),
    date,
    description,
    tags: normTags(tags)
  });
  res.json(tx);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  await Transaction.findByIdAndDelete(id);
  res.json({ ok: true });
};
