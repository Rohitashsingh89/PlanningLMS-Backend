import { Note } from '../models/Note.js';
import { like } from './utils.js';

export const list = async (req, res) => {
  const { q, category } = req.query;
  const where = {};
  if (category) where.category = String(category);
  if (q) where.$or = [{ title: like(q) }, { content: like(q) }];
  const notes = await Note.find(where).sort({ updatedAt: -1 }).lean();
  res.json(notes);
};

export const create = async (req, res) => {
  const { title, content, category } = req.body;
  const note = await Note.create({ title, content, category });
  res.json(note);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;
  const note = await Note.findByIdAndUpdate(id, { title, content, category }, { new: true }).lean();
  res.json(note);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  await Note.findByIdAndDelete(id);
  res.json({ ok: true });
};
