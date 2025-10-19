import { Task } from '../models/Task.js';
import { normTags, like } from './utils.js';

export const list = async (req, res) => {
  const { status, q, tag } = req.query;
  const where = {};
  if (status) where.status = status;
  if (q) where.title = like(q);
  if (tag) where.tags = { $in: [String(tag)] };
  const tasks = await Task.find(where).sort({ status: 1, createdAt: -1 }).lean();
  res.json(tasks);
};

export const create = async (req, res) => {
  const { title, dueDate, status, tags } = req.body;
  const task = await Task.create({
    title,
    dueDate,
    status: status || 'pending',
    tags: normTags(tags)
  });
  res.json(task);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { title, dueDate, status, tags } = req.body;
  const task = await Task.findByIdAndUpdate(
    id,
    { title, dueDate, status, tags: tags !== undefined ? normTags(tags) : undefined },
    { new: true }
  ).lean();
  res.json(task);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ ok: true });
};
