import { DailyLog } from '../models/DailyLog.js';
import { Task } from '../models/Task.js';
import { Transaction } from '../models/Transaction.js';
import { Quote } from '../models/Quote.js';
import { Note } from '../models/Note.js';
import { VaultItem } from '../models/VaultItem.js';

export const exportAll = async (_req, res) => {
  const [logs, tasks, transactions, quotes, notes, vault] = await Promise.all([
    DailyLog.find().lean(),
    Task.find().lean(),
    Transaction.find().lean(),
    Quote.find().lean(),
    Note.find().lean(),
    VaultItem.find().lean()
  ]);
  res.json({ logs, tasks, transactions, quotes, notes, vault });
};

export const importAll = async (req, res) => {
  const { logs = [], tasks = [], transactions = [], quotes = [], notes = [], vault = [] } = req.body || {};
  await Promise.all([
    logs.length ? DailyLog.insertMany(logs) : null,
    tasks.length ? Task.insertMany(tasks) : null,
    transactions.length ? Transaction.insertMany(transactions) : null,
    quotes.length ? Quote.insertMany(quotes) : null,
    notes.length ? Note.insertMany(notes) : null,
    vault.length ? VaultItem.insertMany(vault) : null
  ]);
  res.json({ ok: true });
};
