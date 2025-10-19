import { Quote } from '../models/Quote.js';

export const list = async (_req, res) => {
  const quotes = await Quote.find().sort({ date: -1 }).lean();
  res.json(quotes);
};

export const create = async (req, res) => {
  const { text, author, date } = req.body;
  const q = await Quote.create({ text, author, date });
  res.json(q);
};

export const random = async (_req, res) => {
  const count = await Quote.countDocuments();
  if (count === 0) return res.json(null);
  const rand = Math.floor(Math.random() * count);
  const q = await Quote.findOne().skip(rand).lean();
  res.json(q);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  await Quote.findByIdAndDelete(id);
  res.json({ ok: true });
};
