import { VaultItem } from '../models/VaultItem.js';
import { normTags, like } from './utils.js';

export const list = async (req, res) => {
  const { q, tag } = req.query;
  const where = {};
  if (tag) where.tags = { $in: [String(tag)] };
  if (q) where.$or = [{ title: like(q) }, { content: like(q) }];
  const items = await VaultItem.find(where).sort({ updatedAt: -1 }).lean();
  res.json(items);
};

export const create = async (req, res) => {
  const { title, content, tags } = req.body;
  const item = await VaultItem.create({ title, content, tags: normTags(tags) });
  res.json(item);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;
  const item = await VaultItem.findByIdAndUpdate(
    id,
    { title, content, tags: normTags(tags) },
    { new: true }
  ).lean();
  res.json(item);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  await VaultItem.findByIdAndDelete(id);
  res.json({ ok: true });
};
