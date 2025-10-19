import { DailyLog } from '../models/DailyLog.js';
import { like } from './utils.js';

export const list = async (req, res) => {
  const { q } = req.query;
  const where = q ? { content: like(q) } : {};
  const logs = await DailyLog.find(where).sort({ date: -1 }).lean();
  res.json(logs);
};

export const create = async (req, res) => {
  const { date, content, mood } = req.body;
  const log = await DailyLog.create({ date, content, mood });
  res.json(log);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { date, content, mood } = req.body;
  const log = await DailyLog.findByIdAndUpdate(id, { date, content, mood }, { new: true }).lean();
  res.json(log);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  await DailyLog.findByIdAndDelete(id);
  res.json({ ok: true });
};
